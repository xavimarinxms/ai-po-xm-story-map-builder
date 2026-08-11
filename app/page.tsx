import Link from 'next/link';

const HOW_IT_WORKS = [
  { step: '01', title: 'Define your user journey', desc: 'Add Activities (the high-level user goals) across the top. These become the backbone of your map.' },
  { step: '02', title: 'Break down into tasks and stories', desc: 'Under each Activity, add User Tasks. Under each task, add the User Stories that implement it. Drag to reorder anything.' },
  { step: '03', title: 'Assign to releases', desc: 'Tag each story to MVP, v1.1, or Backlog. See your release scope at a glance. Export to CSV for Jira import.' },
];

const ROADMAP: { category: string; items: { label: string; desc: string; status: 'planned' | 'considering' }[] }[] = [
  {
    category: 'Map management',
    items: [
      { label: 'Save & load maps', desc: 'Save multiple story maps locally and switch between them — without losing work.', status: 'planned' },
      { label: 'Map templates', desc: 'Start from pre-built templates for common product flows: onboarding, checkout, settings.', status: 'planned' },
      { label: 'Version history', desc: 'Roll back to any previous state of your map without losing the current version.', status: 'considering' },
    ],
  },
  {
    category: 'Collaboration',
    items: [
      { label: 'Real-time multiplayer', desc: 'Edit the story map simultaneously with your team — every change syncs instantly.', status: 'considering' },
      { label: 'Comments on cards', desc: 'Add inline comments to any activity, task, or story for async team feedback.', status: 'planned' },
    ],
  },
  {
    category: 'Export & integrations',
    items: [
      { label: 'Jira bulk import', desc: 'Export stories as a structured CSV that Jira can import with epics and labels pre-filled.', status: 'planned' },
      { label: 'Export to image', desc: 'Download the full map as a high-res PNG for presentations and Confluence pages.', status: 'planned' },
      { label: 'Linear import', desc: 'Push stories directly to Linear as issues grouped by cycle (release).', status: 'considering' },
    ],
  },
  {
    category: 'AI assist',
    items: [
      { label: 'Story generator', desc: 'Describe a user journey and let AI draft the activities, tasks and stories as a starting point.', status: 'planned' },
      { label: 'Acceptance criteria', desc: 'Click any story and generate acceptance criteria with Gherkin format (Given/When/Then).', status: 'considering' },
    ],
  },
];

const STATUS_BADGE: Record<string, string> = { planned: 'bg-blue-50 text-blue-700 border-blue-200', considering: 'bg-gray-100 text-gray-600 border-gray-200' };
const STATUS_LABEL: Record<string, string> = { planned: 'Planned', considering: 'Considering' };

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-brand-500 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="2" width="4" height="12" rx="1" fill="white" opacity="0.9"/>
                <rect x="6" y="2" width="4" height="8" rx="1" fill="white" opacity="0.7"/>
                <rect x="11" y="2" width="4" height="10" rx="1" fill="white" opacity="0.5"/>
              </svg>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-900">Story Map Builder</span>
              <span className="hidden sm:inline text-xs text-gray-500 ml-2">by <a href="https://xavimarin.net" target="_blank" rel="noopener noreferrer" className="hover:text-brand-600 transition-colors">Xavi Marín</a></span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="#roadmap" className="text-xs text-gray-500 hover:text-gray-700 transition-colors hidden sm:block">Roadmap</a>
            <a href="https://xavimarin.net" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-gray-700 transition-colors hidden sm:block">xavimarin.net</a>
            <Link href="/demo" className="text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg px-3.5 py-1.5 transition-colors">Try Demo</Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <section className="max-w-3xl mx-auto px-6 pt-24 pb-24 text-center">
          <p className="text-xs font-semibold text-brand-600 mb-5 tracking-widest uppercase">PO Toolkit · Tool #13 of 13</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-5 tracking-tight leading-tight">
            Story mapping,<br />finally digital
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-6 leading-relaxed">
            Map your full user journey — Activities, Tasks, Stories — and slice them into releases. Drag & drop, inline edit, export to CSV for Jira. No post-its required.
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
              📤 Jira CSV export
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
              3-level structure: Activities → Tasks → Stories
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
              Drag & drop reorder
            </span>
          </div>

          {/* Story map preview — filled example */}
          <div className="max-w-3xl mx-auto mb-10 text-left overflow-x-auto">
            <div className="min-w-[560px]">
              {/* Activities row */}
              <div className="grid grid-cols-3 gap-2 mb-2">
                {[
                  { label: '🏠 Onboarding', color: 'bg-brand-500 text-white' },
                  { label: '💳 Payments', color: 'bg-brand-500 text-white' },
                  { label: '📊 Reporting', color: 'bg-brand-500 text-white' },
                ].map(a => (
                  <div key={a.label} className={`${a.color} rounded-lg px-3 py-2 text-xs font-bold text-center`}>{a.label}</div>
                ))}
              </div>
              {/* Tasks row */}
              <div className="grid grid-cols-3 gap-2 mb-2">
                {[
                  { label: 'Sign up', sub: 'Verify email' },
                  { label: 'Add card', sub: 'Set limits' },
                  { label: 'View history', sub: 'Export CSV' },
                ].map(t => (
                  <div key={t.label} className="space-y-1.5">
                    <div className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold text-gray-700">{t.label}</div>
                    <div className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold text-gray-700">{t.sub}</div>
                  </div>
                ))}
              </div>
              {/* MVP swimlane */}
              <div className="border-t-2 border-dashed border-emerald-400 pt-2 mb-1">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">MVP</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {[
                  ['Email + password login', 'Resend verification'],
                  ['Add debit card', '—'],
                  ['Last 30 days view', '—'],
                ].map((col, ci) => (
                  <div key={ci} className="space-y-1.5">
                    {col.map(s => s !== '—' ? (
                      <div key={s} className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-xs text-emerald-800">{s}</div>
                    ) : (
                      <div key={s} className="h-[30px]" />
                    ))}
                  </div>
                ))}
              </div>
              {/* v1.1 swimlane */}
              <div className="border-t-2 border-dashed border-blue-300 pt-2 mb-1">
                <span className="text-xs font-bold text-blue-500 uppercase tracking-wide">v1.1</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ['Google SSO'],
                  ['Spending limits', 'Virtual card'],
                  ['Custom date range', 'Export to PDF'],
                ].map((col, ci) => (
                  <div key={ci} className="space-y-1.5">
                    {col.map(s => (
                      <div key={s} className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-800">{s}</div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 -mt-6 mb-8">↑ NovaPay story map — drag stories between releases, export directly to Jira</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/demo" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-colors shadow-sm">
              ✨ Open NovaPay map
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M1 8a.75.75 0 01.75-.75h10.69L8.22 3.03a.75.75 0 111.06-1.06l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 11-1.06-1.06l4.22-4.22H1.75A.75.75 0 011 8z"/></svg>
            </Link>
            <Link href="/demo?blank=1" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors">Start blank</Link>
          </div>
          <p className="text-xs text-gray-400 mt-6">No login · No backend · Runs entirely in your browser</p>
        </section>

        <section className="border-t border-gray-100 bg-gray-50">
          <div className="max-w-5xl mx-auto px-6 py-20">
            <div className="text-center mb-12"><h2 className="text-2xl font-bold text-gray-900 mb-2">How it works</h2><p className="text-sm text-gray-500">Three levels, one visual</p></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {HOW_IT_WORKS.map(item => (
                <div key={item.step} className="bg-white rounded-xl border border-gray-200 p-6">
                  <span className="text-xs font-bold text-brand-500 font-mono">{item.step}</span>
                  <h3 className="text-sm font-semibold text-gray-900 mt-3 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="roadmap" className="border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-6 py-20">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Roadmap</h2>
              <p className="text-sm text-gray-500">What's coming next</p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_BADGE.planned}`}><span className="w-1.5 h-1.5 rounded-full bg-blue-500"/>Planned</span>
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_BADGE.considering}`}><span className="w-1.5 h-1.5 rounded-full bg-gray-400"/>Considering</span>
              </div>
            </div>
            <div className="space-y-10">
              {ROADMAP.map(group => (
                <div key={group.category}>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{group.category}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {group.items.map(item => (
                      <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-gray-900 leading-snug">{item.label}</p>
                          <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_BADGE[item.status]}`}>{STATUS_LABEL[item.status]}</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-gray-100 bg-gray-50">
          <div className="max-w-3xl mx-auto px-6 py-16">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 text-center">Why I built this</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Problem', text: 'Story mapping is one of the most powerful discovery techniques, but teams do it on physical post-its or messy spreadsheets — both impossible to share or maintain.' },
                { label: 'Solution', text: 'A purpose-built visual tool with the exact 3-level structure (Activities → Tasks → Stories) plus release swimlanes, all drag & drop and editable inline.' },
                { label: 'Impact', text: 'Teams that story map ship more coherent MVPs because they see the full journey before writing a single ticket — and everyone is aligned on the release cuts.' },
              ].map(item => (
                <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-5">
                  <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-2">{item.label}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <span>Built by <a href="https://xavimarin.net" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">Xavi Marín</a> · No data stored on our servers</span>
          <span>PO Toolkit #13 of 13</span>
        </div>
      </footer>
    </div>
  );
}
