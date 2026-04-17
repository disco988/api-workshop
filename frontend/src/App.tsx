import { useState } from 'react'
import { DocsPage } from './pages/DocsPage'
import { ExercisesPage } from './pages/ExercisesPage'
import { PlaygroundPage } from './pages/PlaygroundPage'
import { useAppSelector } from './hooks/redux'
import type { TabId } from './types'

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'docs',       label: 'Dokumentacja', icon: '📖' },
  { id: 'exercises',  label: 'Ćwiczenia',    icon: '✏️' },
  { id: 'playground', label: 'Plac zabaw',   icon: '🧪' },
]

export default function App() {
  const [tab, setTab] = useState<TabId>('docs')
  const completed = useAppSelector(s => s.progress.completed)
  const completedCount = Object.values(completed).filter(Boolean).length
  const total = 4

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌐</span>
              <span className="font-bold text-slate-800 text-sm sm:text-base">REST API Workshop</span>
            </div>

            {/* Progress chip */}
            {completedCount > 0 && (
              <div className="hidden sm:flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs px-3 py-1.5 rounded-full">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {completedCount}/{total} zaliczonych
              </div>
            )}
          </div>

          {/* Tab nav */}
          <nav className="flex gap-1 -mb-px">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  tab === t.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <span className="text-base leading-none">{t.icon}</span>
                {t.label}
                {t.id === 'exercises' && completedCount > 0 && (
                  <span className="ml-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none">
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
      <footer className="border-t border-slate-200 bg-white py-3 text-center text-xs text-slate-400">
        REST API Workshop — fikcyjne API sklepu do celów edukacyjnych
      </footer>
    </div>
  )
}
