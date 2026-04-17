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
  string: 'text-amber-600 bg-amber-50 border-amber-200',
  number: 'text-purple-600 bg-purple-50 border-purple-200',
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${TYPE_STYLE[type] || 'text-slate-600 bg-slate-50 border-slate-200'}`}>
      {type}
    </span>
  )
}

function EndpointCard({ ep }: { ep: EndpointDoc }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors"
      >
        <MethodBadge method={ep.method} />
        <code className="text-sm font-mono text-slate-700 flex-1">{ep.path}</code>
        <span className="text-sm text-slate-500 hidden sm:block">{ep.summary}</span>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-slate-200 p-5 space-y-5 bg-slate-50">
          <p className="text-sm text-slate-600 leading-relaxed">{ep.description}</p>

          {ep.params && ep.params.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Parametry</h4>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-sm bg-white">
                  <thead>
                    <tr className="bg-slate-100 text-xs text-slate-500 uppercase tracking-wider">
                      <th className="text-left px-3 py-2">Nazwa</th>
                      <th className="text-left px-3 py-2">Typ</th>
                      <th className="text-left px-3 py-2">Gdzie</th>
                      <th className="text-left px-3 py-2">Wymagany</th>
                      <th className="text-left px-3 py-2">Opis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ep.params.map(p => (
                      <tr key={p.name} className="border-t border-slate-100">
                        <td className="px-3 py-2 font-mono text-sky-700">{p.name}</td>
                        <td className="px-3 py-2"><TypeBadge type={p.type} /></td>
                        <td className="px-3 py-2 text-slate-500 text-xs">{p.where === 'path' ? '🔗 URL' : '❓ query'}</td>
                        <td className="px-3 py-2">{p.required ? <span className="text-red-500 text-xs font-medium">tak ●</span> : <span className="text-slate-400 text-xs">nie</span>}</td>
                        <td className="px-3 py-2 text-slate-600">{p.desc}</td>
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
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-sm bg-white">
                  <thead>
                    <tr className="bg-slate-100 text-xs text-slate-500 uppercase tracking-wider">
                      <th className="text-left px-3 py-2">Pole</th>
                      <th className="text-left px-3 py-2">Typ</th>
                      <th className="text-left px-3 py-2">Wymagane</th>
                      <th className="text-left px-3 py-2">Przykład</th>
                      <th className="text-left px-3 py-2">Opis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ep.bodyFields.map(f => (
                      <tr key={f.name} className="border-t border-slate-100">
                        <td className="px-3 py-2 font-mono text-sky-700">{f.name}</td>
                        <td className="px-3 py-2"><TypeBadge type={f.type} /></td>
                        <td className="px-3 py-2">{f.required ? <span className="text-red-500 text-xs font-medium">tak ●</span> : <span className="text-slate-400 text-xs">nie</span>}</td>
                        <td className="px-3 py-2 font-mono text-xs text-slate-600 bg-slate-50">{f.example}</td>
                        <td className="px-3 py-2 text-slate-600">{f.desc}</td>
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
                <div key={r.code} className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border ${r.code < 300 ? 'bg-green-50 border-green-200 text-green-800' : r.code < 500 ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                  <span className="font-mono font-bold">{r.code}</span>
                  <span>{r.desc}</span>
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
        <h1 className="text-2xl font-bold text-slate-800">Dokumentacja API</h1>
        <p className="text-slate-500 mt-1">Fikcyjne API sklepu internetowego — do nauki REST API</p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-600 font-mono">Base URL: /api</span>
          <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-600">Format: JSON</span>
        </div>
      </div>

      {/* Concepts */}
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { icon: '🔤', title: 'string — tekst', desc: 'Zawsze w cudzysłowach', ex: '"elektronika"', color: 'amber' },
          { icon: '🔢', title: 'number — liczba', desc: 'Bez cudzysłowów', ex: '199.99', color: 'purple' },
        ].map(c => (
          <div key={c.title} className="p-4 rounded-xl border border-slate-200 bg-white flex gap-3 items-start">
            <span className="text-2xl">{c.icon}</span>
            <div>
              <p className="font-semibold text-slate-700 text-sm">{c.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{c.desc}</p>
              <code className="mt-1 block text-xs bg-slate-900 text-slate-100 px-2 py-1 rounded">{c.ex}</code>
            </div>
          </div>
        ))}
      </div>

      {/* Dostępne dane */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">📦 Dostępne dane w API</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Kategorie</p>
            <div className="flex flex-wrap gap-1.5">
              {['elektronika', 'kuchnia', 'sport', 'ksiazki'].map(c => (
                <code key={c} className="bg-slate-900 text-slate-100 px-2 py-0.5 rounded text-xs">{c}</code>
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
                  <code className="bg-slate-900 text-sky-300 px-2 py-0.5 rounded text-xs">{id}</code>
                  <span className="text-xs text-slate-500">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Endpoints */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">Endpointy — kliknij żeby rozwinąć</h2>
        <div className="space-y-2">
          {ENDPOINTS.map(ep => <EndpointCard key={ep.method + ep.path} ep={ep} />)}
        </div>
      </div>
    </div>
  )
}
