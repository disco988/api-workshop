import { useState } from 'react'
import { RequestBuilder } from '../components/RequestBuilder'
import { MethodBadge } from '../components/MethodBadge'
import type { HttpMethod } from '../types'

const QUICK_PRESETS: { label: string; method: HttpMethod; url: string; body?: string }[] = [
  { label: 'Lista produktów', method: 'GET', url: '/api/produkty' },
  { label: 'Filtruj: elektronika', method: 'GET', url: '/api/produkty?category=elektronika' },
  { label: 'Filtruj: sport', method: 'GET', url: '/api/produkty?category=sport' },
  { label: 'Jeden produkt', method: 'GET', url: '/api/produkty/p_9x2k' },
  { label: 'Nieistniejący produkt', method: 'GET', url: '/api/produkty/p_nieistnieje' },
  {
    label: 'Dodaj produkt',
    method: 'POST',
    url: '/api/produkty',
    body: `{\n  "name": "Nowy produkt",\n  "price": 59.99,\n  "category": "sport",\n  "stock": 20\n}`,
  },
  {
    label: 'Zaktualizuj Słuchawki',
    method: 'PUT',
    url: '/api/produkty/p_9x2k',
    body: `{\n  "name": "Słuchawki Premium",\n  "price": 249.99,\n  "category": "elektronika",\n  "stock": 30\n}`,
  },
  {
    label: 'POST bez wymaganych pól',
    method: 'POST',
    url: '/api/produkty',
    body: `{\n  "name": "Tylko nazwa"\n}`,
  },
]

export function PlaygroundPage() {
  const [selected, setSelected] = useState(QUICK_PRESETS[0])
  const [key, setKey] = useState(0) // forces RequestBuilder remount on preset change

  const applyPreset = (preset: typeof selected) => {
    setSelected(preset)
    setKey(k => k + 1)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Plac zabaw</h1>
        <p className="text-slate-500 mt-1">Eksperymentuj swobodnie — wysyłaj dowolne requesty do API</p>
      </div>

      <div className="grid md:grid-cols-[220px_1fr] gap-5">
        {/* Presets sidebar */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Gotowe przykłady</p>
          {QUICK_PRESETS.map(p => (
            <button
              key={p.label}
              onClick={() => applyPreset(p)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${selected.label === p.label ? 'bg-blue-50 border border-blue-200 text-blue-800' : 'hover:bg-slate-100 text-slate-700 border border-transparent'}`}
            >
              <MethodBadge method={p.method} size="sm" />
              <span className="truncate text-xs">{p.label}</span>
            </button>
          ))}

          <div className="pt-3 border-t border-slate-200">
            <p className="text-xs text-slate-400 leading-relaxed">
              Możesz też wpisać własny URL i body — API zwróci prawdziwą odpowiedź.
            </p>
          </div>
        </div>

        {/* Request builder */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <RequestBuilder
            key={key}
            defaultMethod={selected.method}
            defaultUrl={selected.url}
            defaultBody={selected.body || ''}
            showBodyHint={true}
          />
        </div>
      </div>
    </div>
  )
}
