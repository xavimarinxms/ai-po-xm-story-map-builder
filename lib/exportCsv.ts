import { StoryMap } from '@/types';

export function exportToCsv(map: StoryMap) {
  const releaseMap = Object.fromEntries(map.releases.map(r => [r.id, r.name]));
  const rows: string[][] = [['Activity', 'User Task', 'Story', 'Size', 'Release']];

  map.activities.forEach(act => {
    act.tasks.forEach(task => {
      task.stories.forEach(story => {
        rows.push([
          act.title,
          task.title,
          story.title,
          story.size ?? '',
          releaseMap[map.storyReleases[story.id]] ?? 'Unassigned',
        ]);
      });
      if (!task.stories.length) {
        rows.push([act.title, task.title, '', '', '']);
      }
    });
    if (!act.tasks.length) {
      rows.push([act.title, '', '', '', '']);
    }
  });

  const csv = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${map.title.replace(/\s+/g, '-').toLowerCase()}-story-map.csv`;
  a.click();
}
