import { useState } from 'react'
import { DocsPage } from './pages/DocsPage'
import { ExercisesPage } from './pages/ExercisesPage'
import { PlaygroundPage } from './pages/PlaygroundPage'
import { useAppSelector } from './hooks/redux'
import type { TabId } from './types'

const TABS: { id: TabId; label: string }[] = [
  { id: 'docs',       label: 'Dokumentacja' },
  { id: 'exercises',  label: 'Ćwiczenia'    },
  { id: 'playground', label: 'Plac zabaw'   },
]

function DocIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

function ExerciseIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  )
}

function TerminalIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

const TAB_ICONS = {
  docs: <DocIcon />,
  exercises: <ExerciseIcon />,
  playground: <TerminalIcon />,
}

export default function App() {
  const [tab, setTab] = useState<TabId>('docs')
  const completed = useAppSelector(s => s.progress.completed)
  const completedCount = Object.values(completed).filter(Boolean).length
  const total = 4

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top bar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                </svg>
              </div>
              <span className="font-semibold text-slate-100 text-sm tracking-tight">REST API Workshop</span>
            </div>

            {completedCount > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs px-3 py-1.5 rounded-full">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {completedCount}/{total} zaliczonych
              </div>
            )}
          </div>

          {/* Tab nav */}
          <nav className="flex gap-0.5 -mb-px">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  tab === t.id
                    ? 'border-blue-400 text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-600'
                }`}
              >
                {TAB_ICONS[t.id]}
                {t.label}
                {t.id === 'exercises' && completedCount > 0 && (
                  <span className="ml-0.5 bg-emerald-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none font-bold">
                    {completedCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 pb-16">
        {tab === 'docs'       && <DocsPage />}
        {tab === 'exercises'  && <ExercisesPage />}
        {tab === 'playground' && <PlaygroundPage />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 py-3 text-center text-xs text-slate-600">
        REST API Workshop — fikcyjne API sklepu do celów edukacyjnych
      </footer>
    </div>
  )
}
