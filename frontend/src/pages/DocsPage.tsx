import { useState } from 'react'
import { MethodBadge } from '../components/MethodBadge'
import { CodeBlock } from '../components/CodeBlock'
import type { HttpMethod } from '../types'

interface EndpointDoc {
  method: HttpMethod
  path: string
  summary: string
  description: string
  params?: { name: string; type: string; required: boolean; desc: string; where: 'path' | 'query' }[]
  bodyFields?: { name: string; type: string; required: boolean; desc: string; example: string }[]
  exampleRequest: string
  exampleResponse: string
  responseCodes: { code: number; desc: string }[]
}

const ENDPOINTS: EndpointDoc[] = [
  {
    method: 'GET',
    path: '/api/produkty',
    summary: 'Pobierz listę produktów',
    description: 'Zwraca wszystkie produkty. Możesz przefiltrować wyniki podając kategorię jako parametr w URL.',
    params: [
      { name: 'category', type: 'string', required: false, where: 'query', desc: 'Filtruj po kategorii. Dostępne: elektronika, kuchnia, sport, ksiazki' },
      { name: 'limit', type: 'number', required: false, where: 'query', desc: 'Ile wyników zwrócić (domyślnie 20, max 50)' },
      { name: 'page', type: 'number', required: false, where: 'query', desc: 'Numer strony (domyślnie 1)' },
    ],
    exampleRequest: 'GET /api/produkty?category=elektronika',
    exampleResponse: `{
  "total": 3,
  "page": 1,
  "limit": 20,
  "items": [
    {
      "id": "p_9x2k",
      "name": "Słuchawki",
      "price": 199.99,
      "category": "elektronika",
      "stock": 48,
      "created_at": "2025-01-10T09:00:00Z"
    }
  ]
}`,
    responseCodes: [
      { code: 200, desc: 'OK — lista produktów' },
      { code: 405, desc: 'Method Not Allowed — użyj GET' },
    ],
  },
  {
    method: 'GET',
    path: '/api/produkty/{id}',
    summary: 'Pobierz jeden produkt',
    description: 'Zwraca szczegóły jednego produktu po jego ID. ID wstawiasz bezpośrednio w URL zamiast {id}.',
    params: [
      { name: 'id', type: 'string', required: true, where: 'path', desc: 'ID produktu, np. p_9x2k' },
    ],
    exampleRequest: 'GET /api/produkty/p_9x2k',
    exampleResponse: `{
  "id": "p_9x2k",
  "name": "Słuchawki",
  "price": 199.99,
  "category": "elektronika",
  "stock": 48,
  "created_at": "2025-01-10T09:00:00Z"
}`,
    responseCodes: [
      { code: 200, desc: 'OK — dane produktu' },
      { code: 404, desc: 'Not Found — brak produktu o podanym ID' },
    ],
  },
  {
    method: 'POST',
    path: '/api/produkty',
    summary: 'Dodaj nowy produkt',
    description: 'Tworzy nowy produkt. Dane wysyłasz w body jako JSON. Serwer sam nadaje ID i datę utworzenia.',
    bodyFields: [
      { name: 'name', type: 'string', required: true, desc: 'Nazwa produktu', example: '"Słuchawki"' },
      { name: 'price', type: 'number', required: true, desc: 'Cena — liczba bez cudzysłowów', example: '199.99' },
      { name: 'category', type: 'string', required: true, desc: 'Kategoria: elektronika, kuchnia, sport, ksiazki', example: '"elektronika"' },
      { name: 'stock', type: 'number', required: false, desc: 'Ilość w magazynie (domyślnie 0)', example: '50' },
    ],
    exampleRequest: `POST /api/produkty
Content-Type: application/json

{
  "name": "Kubek termiczny",
  "price": 49.99,
  "category": "kuchnia",
  "stock": 100
}`,
    exampleResponse: `{
  "id": "p_ab3k",
  "name": "Kubek termiczny",
  "price": 49.99,
  "category": "kuchnia",
  "stock": 100,
  "created_at": "2025-04-17T12:00:00Z"
}`,
    responseCodes: [
      { code: 201, desc: 'Created — produkt dodany, serwer zwraca go z nadanym ID' },
      { code: 400, desc: 'Bad Request — brakuje wymaganego pola (name, price lub category)' },
      { code: 422, desc: 'Unprocessable — błędny typ danych, np. price jako "199.99" zamiast 199.99' },
    ],
  },
  {
    method: 'PUT',
    path: '/api/produkty/{id}',
    summary: 'Zaktualizuj produkt',
    description: 'Zastępuje dane produktu nowymi. Musisz podać WSZYSTKIE pola — nie tylko te zmieniane. ID produktu wstawiasz w URL.',
    params: [
      { name: 'id', type: 'string', required: true, where: 'path', desc: 'ID produktu do aktualizacji' },
    ],
    bodyFields: [
      { name: 'name', type: 'string', required: true, desc: 'Nazwa produktu', example: '"Słuchawki Pro"' },
      { name: 'price', type: 'number', required: true, desc: 'Cena', example: '179.99' },
      { name: 'category', type: 'string', required: true, desc: 'Kategoria', example: '"elektronika"' },
      { name: 'stock', type: 'number', required: true, desc: 'Ilość w magazynie', example: '45' },
    ],
    exampleRequest: `PUT /api/produkty/p_9x2k
Content-Type: application/json

{
  "name": "Słuchawki Pro",
  "price": 179.99,
  "category": "elektronika",
  "stock": 45
}`,
    exampleResponse: `{
  "id": "p_9x2k",
  "name": "Słuchawki Pro",
  "price": 179.99,
  "category": "elektronika",
  "stock": 45,
  "created_at": "2025-01-10T09:00:00Z",
  "updated_at": "2025-04-17T13:22:00Z"
}`,
    responseCodes: [
      { code: 200, desc: 'OK — zaktualizowany produkt' },
      { code: 400, desc: 'Bad Request — brakuje pola w body' },
      { code: 404, desc: 'Not Found — brak produktu o podanym ID' },
      { code: 422, desc: 'Unprocessable — błędny typ danych' },
    ],
  },
]

const TYPE_STYLE: Record<string, string> = {
  string: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
  number: 'text-purple-400 bg-purple-500/10 border-purple-500/25',
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${TYPE_STYLE[type] || 'text-slate-400 bg-slate-800 border-slate-700'}`}>
      {type}
    </span>
  )
}

function EndpointCard({ ep }: { ep: EndpointDoc }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-800/50 transition-colors"
      >
        <MethodBadge method={ep.method} />
        <code className="text-sm font-mono text-slate-300 flex-1">{ep.path}</code>
        <span className="text-sm text-slate-500 hidden sm:block">{ep.summary}</span>
        <svg className={`w-4 h-4 text-slate-600 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-slate-800 p-5 space-y-5 bg-slate-950/40">
          <p className="text-sm text-slate-400 leading-relaxed">{ep.description}</p>

          {ep.params && ep.params.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Parametry</h4>
              <div className="overflow-x-auto rounded-lg border border-slate-800">
                <table className="w-full text-sm bg-slate-900">
                  <thead>
                    <tr className="bg-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                      <th className="text-left px-3 py-2">Nazwa</th>
                      <th className="text-left px-3 py-2">Typ</th>
                      <th className="text-left px-3 py-2">Gdzie</th>
                      <th className="text-left px-3 py-2">Wymagany</th>
                      <th className="text-left px-3 py-2">Opis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ep.params.map(p => (
                      <tr key={p.name} className="border-t border-slate-800">
                        <td className="px-3 py-2 font-mono text-sky-400">{p.name}</td>
                        <td className="px-3 py-2"><TypeBadge type={p.type} /></td>
                        <td className="px-3 py-2 text-slate-500 text-xs font-mono">{p.where}</td>
                        <td className="px-3 py-2">{p.required ? <span className="text-red-400 text-xs font-medium">tak</span> : <span className="text-slate-600 text-xs">nie</span>}</td>
                        <td className="px-3 py-2 text-slate-400">{p.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {ep.bodyFields && ep.bodyFields.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Pola body (JSON)</h4>
              <div className="overflow-x-auto rounded-lg border border-slate-800">
                <table className="w-full text-sm bg-slate-900">
                  <thead>
                    <tr className="bg-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                      <th className="text-left px-3 py-2">Pole</th>
                      <th className="text-left px-3 py-2">Typ</th>
                      <th className="text-left px-3 py-2">Wymagane</th>
                      <th className="text-left px-3 py-2">Przykład</th>
                      <th className="text-left px-3 py-2">Opis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ep.bodyFields.map(f => (
                      <tr key={f.name} className="border-t border-slate-800">
                        <td className="px-3 py-2 font-mono text-sky-400">{f.name}</td>
                        <td className="px-3 py-2"><TypeBadge type={f.type} /></td>
                        <td className="px-3 py-2">{f.required ? <span className="text-red-400 text-xs font-medium">tak</span> : <span className="text-slate-600 text-xs">nie</span>}</td>
                        <td className="px-3 py-2 font-mono text-xs text-slate-400 bg-slate-800/50">{f.example}</td>
                        <td className="px-3 py-2 text-slate-400">{f.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Przykład requestu</h4>
              <CodeBlock code={ep.exampleRequest} language="http" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Przykład odpowiedzi</h4>
              <CodeBlock code={ep.exampleResponse} language="json" />
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Kody odpowiedzi</h4>
            <div className="flex flex-wrap gap-2">
              {ep.responseCodes.map(r => (
                <div key={r.code} className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border ${r.code < 300 ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' : r.code < 500 ? 'bg-amber-500/10 border-amber-500/25 text-amber-400' : 'bg-red-500/10 border-red-500/25 text-red-400'}`}>
                  <span className="font-mono font-bold">{r.code}</span>
                  <span className="text-slate-400">{r.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-100">Dokumentacja API</h1>
        <p className="text-slate-500 mt-1 text-sm">Fikcyjne API sklepu internetowego — do nauki REST API</p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 font-mono">Base URL: /api</span>
          <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-slate-400">Format: JSON</span>
        </div>
      </div>

      {/* Concepts */}
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { title: 'string — tekst', desc: 'Zawsze w cudzysłowach', ex: '"elektronika"', accent: 'amber' },
          { title: 'number — liczba', desc: 'Bez cudzysłowów', ex: '199.99', accent: 'purple' },
        ].map(c => (
          <div key={c.title} className={`p-4 rounded-xl border bg-slate-900 flex gap-3 items-start ${c.accent === 'amber' ? 'border-amber-500/20' : 'border-purple-500/20'}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold ${c.accent === 'amber' ? 'bg-amber-500/10 text-amber-400' : 'bg-purple-500/10 text-purple-400'}`}>
              {c.accent === 'amber' ? 'str' : '123'}
            </div>
            <div>
              <p className="font-semibold text-slate-200 text-sm">{c.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{c.desc}</p>
              <code className="mt-1.5 block text-xs bg-slate-950 text-slate-300 px-2 py-1 rounded border border-slate-800">{c.ex}</code>
            </div>
          </div>
        ))}
      </div>

      {/* Dostępne dane */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-900">
        <h2 className="text-sm font-semibold text-slate-300 mb-3">Dostępne dane w API</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Kategorie</p>
            <div className="flex flex-wrap gap-1.5">
              {['elektronika', 'kuchnia', 'sport', 'ksiazki'].map(c => (
                <code key={c} className="bg-slate-950 border border-slate-800 text-slate-300 px-2 py-0.5 rounded text-xs">{c}</code>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Przykładowe ID produktów</p>
            <div className="space-y-1">
              {[
                ['p_9x2k', 'Słuchawki, 199.99, elektronika'],
                ['p_3m7j', 'Klawiatura, 349.00, elektronika'],
                ['p_1a4r', 'Kubek, 29.99, kuchnia'],
                ['p_7z9w', 'Bidon, 49.00, sport'],
              ].map(([id, desc]) => (
                <div key={id} className="flex items-center gap-2">
                  <code className="bg-slate-950 border border-slate-800 text-sky-400 px-2 py-0.5 rounded text-xs">{id}</code>
                  <span className="text-xs text-slate-500">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Endpoints */}
      <div>
        <h2 className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">Endpointy — kliknij żeby rozwinąć</h2>
        <div className="space-y-2">
          {ENDPOINTS.map(ep => <EndpointCard key={ep.method + ep.path} ep={ep} />)}
        </div>
      </div>
    </div>
  )
}
