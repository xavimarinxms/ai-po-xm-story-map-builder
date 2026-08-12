'use client';

import { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { StoryMap, Activity, UserTask, Story, Release } from '@/types';
import { exportToCsv } from '@/lib/exportCsv';

const SIZE_COLORS: Record<string, string> = {
  S: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  M: 'bg-amber-50 text-amber-700 border-amber-200',
  L: 'bg-orange-50 text-orange-700 border-orange-200',
  XL: 'bg-red-50 text-red-700 border-red-200',
};

function uid() { return Math.random().toString(36).slice(2, 9); }

interface Props { initial: StoryMap }

export default function StoryMapBoard({ initial }: Props) {
  const [map, setMap] = useState<StoryMap>(initial);
  const [editingTitle, setEditingTitle] = useState(false);

  // ── Mutations ──────────────────────────────────────────────────────────────

  const addActivity = () => {
    const id = `a-${uid()}`;
    setMap(m => ({ ...m, activities: [...m.activities, { id, title: 'New Activity', tasks: [] }] }));
  };

  const addTask = (actId: string) => {
    const id = `t-${uid()}`;
    setMap(m => ({ ...m, activities: m.activities.map(a => a.id === actId ? { ...a, tasks: [...a.tasks, { id, title: 'New Task', stories: [] }] } : a) }));
  };

  const addStory = (actId: string, taskId: string) => {
    const id = `s-${uid()}`;
    setMap(m => ({
      ...m,
      activities: m.activities.map(a => a.id === actId ? {
        ...a, tasks: a.tasks.map(t => t.id === taskId ? { ...t, stories: [...t.stories, { id, title: 'New story', size: 'M' }] } : t)
      } : a),
      storyReleases: { ...m.storyReleases, [id]: m.releases[0]?.id ?? '' },
    }));
  };

  const updateText = (path: ('activity' | 'task' | 'story'), ids: string[], value: string) => {
    setMap(m => {
      if (path === 'activity') return { ...m, activities: m.activities.map(a => a.id === ids[0] ? { ...a, title: value } : a) };
      if (path === 'task') return { ...m, activities: m.activities.map(a => a.id === ids[0] ? { ...a, tasks: a.tasks.map(t => t.id === ids[1] ? { ...t, title: value } : t) } : a) };
      return { ...m, activities: m.activities.map(a => a.id === ids[0] ? { ...a, tasks: a.tasks.map(t => t.id === ids[1] ? { ...t, stories: t.stories.map(s => s.id === ids[2] ? { ...s, title: value } : s) } : t) } : a) };
    });
  };

  const cycleSize = (actId: string, taskId: string, storyId: string) => {
    const sizes: Story['size'][] = ['S', 'M', 'L', 'XL'];
    setMap(m => ({
      ...m,
      activities: m.activities.map(a => a.id === actId ? {
        ...a, tasks: a.tasks.map(t => t.id === taskId ? {
          ...t, stories: t.stories.map(s => {
            if (s.id !== storyId) return s;
            const cur = sizes.indexOf(s.size ?? 'M');
            return { ...s, size: sizes[(cur + 1) % sizes.length] };
          })
        } : t)
      } : a)
    }));
  };

  const setStoryRelease = (storyId: string, releaseId: string) => {
    setMap(m => ({ ...m, storyReleases: { ...m.storyReleases, [storyId]: releaseId } }));
  };

  const deleteActivity = (actId: string) => setMap(m => ({ ...m, activities: m.activities.filter(a => a.id !== actId) }));
  const deleteTask = (actId: string, taskId: string) => setMap(m => ({ ...m, activities: m.activities.map(a => a.id === actId ? { ...a, tasks: a.tasks.filter(t => t.id !== taskId) } : a) }));
  const deleteStory = (actId: string, taskId: string, storyId: string) => setMap(m => ({ ...m, activities: m.activities.map(a => a.id === actId ? { ...a, tasks: a.tasks.map(t => t.id === taskId ? { ...t, stories: t.stories.filter(s => s.id !== storyId) } : t) } : a) }));

  // ── DnD ───────────────────────────────────────────────────────────────────

  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    setMap(m => {
      const next = JSON.parse(JSON.stringify(m)) as StoryMap;

      if (type === 'ACTIVITY') {
        const [removed] = next.activities.splice(source.index, 1);
        next.activities.splice(destination.index, 0, removed);
        return next;
      }

      if (type === 'TASK') {
        const srcAct = next.activities.find(a => a.id === source.droppableId)!;
        const dstAct = next.activities.find(a => a.id === destination.droppableId)!;
        const [removed] = srcAct.tasks.splice(source.index, 1);
        dstAct.tasks.splice(destination.index, 0, removed);
        return next;
      }

      if (type === 'STORY') {
        // droppableId format: "taskId__actId"
        const [srcTaskId, srcActId] = source.droppableId.split('__');
        const [dstTaskId, dstActId] = destination.droppableId.split('__');
        const srcAct = next.activities.find(a => a.id === srcActId)!;
        const dstAct = next.activities.find(a => a.id === dstActId)!;
        const srcTask = srcAct.tasks.find(t => t.id === srcTaskId)!;
        const dstTask = dstAct.tasks.find(t => t.id === dstTaskId)!;
        const [removed] = srcTask.stories.splice(source.index, 1);
        dstTask.stories.splice(destination.index, 0, removed);
        return next;
      }

      return next;
    });
  }, []);

  // ── Inline edit ───────────────────────────────────────────────────────────

  function EditableText({ value, onChange, className }: { value: string; onChange: (v: string) => void; className?: string }) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);
    if (!editing) return (
      <span className={className} onDoubleClick={() => { setDraft(value); setEditing(true); }}>{value}</span>
    );
    return (
      <input autoFocus value={draft} onChange={e => setDraft(e.target.value)}
        onBlur={() => { onChange(draft); setEditing(false); }}
        onKeyDown={e => { if (e.key === 'Enter') { onChange(draft); setEditing(false); } if (e.key === 'Escape') setEditing(false); }}
        className={`${className} bg-white border border-brand-400 rounded px-1 outline-none`} />
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const totalStories = map.activities.flatMap(a => a.tasks.flatMap(t => t.stories)).length;

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          {editingTitle ? (
            <input autoFocus value={map.title}
              onChange={e => setMap(m => ({ ...m, title: e.target.value }))}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={e => e.key === 'Enter' && setEditingTitle(false)}
              className="text-lg font-bold text-gray-900 border-b border-brand-400 outline-none bg-transparent" />
          ) : (
            <h2 className="text-lg font-bold text-gray-900 cursor-pointer hover:text-brand-600 transition-colors" onDoubleClick={() => setEditingTitle(true)}>{map.title}</h2>
          )}
          <span className="text-xs text-gray-400">{map.activities.length} activities · {totalStories} stories</span>
        </div>
        <div className="flex gap-2" data-tour="export">
          <button onClick={() => exportToCsv(map)} className="text-xs font-medium text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 transition-colors">
            ↓ Export CSV
          </button>
          <button onClick={addActivity} data-tour="input" className="text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg px-3.5 py-1.5 transition-colors">
            + Activity
          </button>
        </div>
      </div>

      {/* Release legend */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-medium text-gray-500">Releases:</span>
        {map.releases.map(r => (
          <span key={r.id} className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border border-gray-200 bg-white">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
            {r.name}
          </span>
        ))}
        <span className="text-xs text-gray-400">· Double-click any card to edit</span>
      </div>

      {/* Board */}
      <div className="overflow-x-auto pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="activities" type="ACTIVITY" direction="horizontal">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}
                className="flex gap-4 min-h-[400px]" style={{ minWidth: 'max-content' }}>

                {map.activities.map((act, ai) => (
                  <Draggable key={act.id} draggableId={act.id} index={ai}>
                    {(dragProvided, snapshot) => (
                      <div ref={dragProvided.innerRef} {...dragProvided.draggableProps}
                        className={`flex flex-col gap-2 w-64 shrink-0 ${snapshot.isDragging ? 'opacity-80' : ''}`}>

                        {/* Activity header */}
                        <div className="flex items-center justify-between bg-brand-500 text-white rounded-xl px-3 py-2.5" {...dragProvided.dragHandleProps}>
                          <EditableText value={act.title}
                            onChange={v => updateText('activity', [act.id], v)}
                            className="text-xs font-bold text-white flex-1 min-w-0 truncate cursor-text" />
                          <div className="flex gap-1 ml-2">
                            <button onClick={() => addTask(act.id)} className="text-white/70 hover:text-white text-xs" title="Add task">+</button>
                            <button onClick={() => deleteActivity(act.id)} className="text-white/70 hover:text-white text-xs" title="Delete">×</button>
                          </div>
                        </div>

                        {/* Tasks */}
                        <Droppable droppableId={act.id} type="TASK">
                          {(tp) => (
                            <div ref={tp.innerRef} {...tp.droppableProps} className="flex flex-col gap-2 flex-1">
                              {act.tasks.map((task, ti) => (
                                <Draggable key={task.id} draggableId={task.id} index={ti}>
                                  {(tdp, ts) => (
                                    <div ref={tdp.innerRef} {...tdp.draggableProps}
                                      className={`flex flex-col gap-2 ${ts.isDragging ? 'opacity-80' : ''}`}>

                                      {/* Task header */}
                                      <div className="flex items-center justify-between bg-gray-200 rounded-lg px-3 py-2" {...tdp.dragHandleProps}>
                                        <EditableText value={task.title}
                                          onChange={v => updateText('task', [act.id, task.id], v)}
                                          className="text-xs font-semibold text-gray-700 flex-1 min-w-0 truncate cursor-text" />
                                        <div className="flex gap-1 ml-2">
                                          <button onClick={() => addStory(act.id, task.id)} className="text-gray-500 hover:text-gray-900 text-xs" title="Add story">+</button>
                                          <button onClick={() => deleteTask(act.id, task.id)} className="text-gray-500 hover:text-gray-900 text-xs" title="Delete">×</button>
                                        </div>
                                      </div>

                                      {/* Stories */}
                                      <Droppable droppableId={`${task.id}__${act.id}`} type="STORY">
                                        {(sp, ss) => (
                                          <div ref={sp.innerRef} {...sp.droppableProps}
                                            className={`flex flex-col gap-1.5 min-h-[40px] rounded-lg p-1 transition-colors ${ss.isDraggingOver ? 'bg-brand-50' : ''}`}>
                                            {task.stories.map((story, si) => {
                                              const releaseId = map.storyReleases[story.id];
                                              const release = map.releases.find(r => r.id === releaseId);
                                              return (
                                                <Draggable key={story.id} draggableId={story.id} index={si}>
                                                  {(sdp, sds) => (
                                                    <div ref={sdp.innerRef} {...sdp.draggableProps} {...sdp.dragHandleProps}
                                                      className={`bg-white border rounded-lg px-2.5 py-2 flex flex-col gap-1.5 cursor-grab active:cursor-grabbing ${sds.isDragging ? 'shadow-md opacity-90' : 'hover:shadow-sm'}`}
                                                      style={{ borderLeftColor: release?.color ?? '#e5e7eb', borderLeftWidth: 3, ...sdp.draggableProps.style }}>
                                                      <EditableText value={story.title}
                                                        onChange={v => updateText('story', [act.id, task.id, story.id], v)}
                                                        className="text-xs text-gray-800 leading-snug cursor-text w-full" />
                                                      <div className="flex items-center justify-between gap-1">
                                                        <button onClick={() => cycleSize(act.id, task.id, story.id)}
                                                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${SIZE_COLORS[story.size ?? 'M']}`}>
                                                          {story.size ?? 'M'}
                                                        </button>
                                                        <select value={releaseId ?? ''} onChange={e => setStoryRelease(story.id, e.target.value)}
                                                          className="text-[10px] text-gray-500 bg-transparent border-0 outline-none cursor-pointer flex-1 min-w-0 text-right">
                                                          {map.releases.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                                        </select>
                                                        <button onClick={() => deleteStory(act.id, task.id, story.id)} className="text-gray-300 hover:text-red-400 text-xs leading-none">×</button>
                                                      </div>
                                                    </div>
                                                  )}
                                                </Draggable>
                                              );
                                            })}
                                            {sp.placeholder}
                                            <button onClick={() => addStory(act.id, task.id)}
                                              className="text-xs text-gray-400 hover:text-brand-600 text-center py-1 rounded hover:bg-brand-50 transition-colors">
                                              + story
                                            </button>
                                          </div>
                                        )}
                                      </Droppable>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {tp.placeholder}
                              {act.tasks.length === 0 && (
                                <button onClick={() => addTask(act.id)}
                                  className="text-xs text-gray-400 hover:text-brand-600 text-center py-2 rounded border border-dashed border-gray-300 hover:border-brand-300 transition-colors">
                                  + Add task
                                </button>
                              )}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}

                {/* Add activity CTA */}
                <button onClick={addActivity}
                  className="flex flex-col items-center justify-center w-52 shrink-0 rounded-xl border-2 border-dashed border-gray-300 hover:border-brand-400 text-gray-400 hover:text-brand-600 transition-colors text-sm gap-2 min-h-[120px]">
                  <span className="text-2xl font-light">+</span>
                  <span className="text-xs font-medium">Add Activity</span>
                </button>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
