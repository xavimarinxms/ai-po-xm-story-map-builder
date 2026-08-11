'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import StoryMapBoard from '@/components/StoryMapBoard';
import { SAMPLE_MAP, EMPTY_MAP } from '@/lib/sampleData';
import { StoryMap } from '@/types';

export default function DemoPage() {
  return (
    <Suspense fallback={null}>
      <DemoPageInner />
    </Suspense>
  );
}

function DemoPageInner() {
  const embed = useSearchParams().get('embed') === '1';
  const [map, setMap] = useState<StoryMap>(SAMPLE_MAP);
  const [loaded, setLoaded] = useState<'sample' | 'empty'>('sample');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!embed && <nav className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-brand-500 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="2" width="4" height="12" rx="1" fill="white" opacity="0.9"/>
                <rect x="6" y="2" width="4" height="8" rx="1" fill="white" opacity="0.7"/>
                <rect x="11" y="2" width="4" height="10" rx="1" fill="white" opacity="0.5"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-900">Story Map Builder</span>
            <span className="hidden sm:inline text-xs text-gray-500">by <a href="https://xavimarin.net" target="_blank" rel="noopener noreferrer" className="hover:text-brand-600 transition-colors">Xavi Marín</a></span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setMap(SAMPLE_MAP); setLoaded('sample'); }}
              className={`text-xs font-medium rounded-lg px-3 py-1.5 border transition-colors ${loaded === 'sample' ? 'bg-brand-50 text-brand-700 border-brand-300' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
              ✨ Sample map
            </button>
            <button onClick={() => { setMap(EMPTY_MAP); setLoaded('empty'); }}
              className={`text-xs font-medium rounded-lg px-3 py-1.5 border transition-colors ${loaded === 'empty' ? 'bg-brand-50 text-brand-700 border-brand-300' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
              Start blank
            </button>
            <Link href="/" className="text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors">← Home</Link>
          </div>
        </div>
      </nav>}

      <div className="bg-blue-50 border-b border-blue-100 px-4 py-2.5 text-center text-xs text-blue-700 font-medium">
        Demo mode — drag & drop to reorder · Double-click any card to edit · No account required
      </div>

      <main className="flex-1 px-6 py-8">
        <StoryMapBoard initial={map} />
      </main>

      <footer className="border-t border-gray-200 bg-white mt-8">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <span>Built by <a href="https://xavimarin.net" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">Xavi Marín</a> · No data stored on our servers</span>
          <span>PO Toolkit #16</span>
        </div>
      </footer>
    </div>
  );
}
