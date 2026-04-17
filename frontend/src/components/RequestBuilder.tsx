import { useState } from 'react'
import type { HttpMethod, RequestResult } from '../types'
import { MethodBadge } from './MethodBadge'
import { ResponsePanel } from './ResponsePanel'

interface Props {
  defaultMethod?: HttpMethod
  defaultUrl?: string
  defaultBody?: string
  lockedMethod?: boolean
  lockedUrl?: boolean
  onResult?: (result: RequestResult, body: string) => void
  showBodyHint?: boolean
}

const METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE']

const METHOD_BG: Record<HttpMethod, string> = {
  GET:    'bg-blue-600 hover:bg-blue-700',
  POST:   'bg-green-600 hover:bg-green-700',
  PUT:    'bg-amber-600 hover:bg-amber-700',
  DELETE: 'bg-red-600 hover:bg-red-700',
}

async function sendRequest(method: HttpMethod, url: string, body: string): Promise<RequestResult> {
  const start = performance.now()
  const hasBody = ['POST', 'PUT', 'PATCH'].includes(method)

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: hasBody && body.trim() ? body : undefined,
  })

  const duration = Math.round(performance.now() - start)
  let data: unknown
  try { data = await res.json() } catch { data = null }

  return { status: res.status, statusText: res.statusText, data, duration, ok: res.ok }
}

export function RequestBuilder({
  defaultMethod = 'GET',
  defaultUrl = '/api/produkty',
  defaultBody = '',
  lockedMethod = false,
  lockedUrl = false,
  onResult,
  showBodyHint = false,
}: Props) {
  const [method, setMethod] = useState<HttpMethod>(defaultMethod)
  const [url, setUrl] = useState(defaultUrl)
  const [body, setBody] = useState(defaultBody)
  const [bodyError, setBodyError] = useState('')
  const [result, setResult] = useState<RequestResult | null>(null)
  const [loading, setLoading] = useState(false)

  const hasBody = ['POST', 'PUT', 'PATCH'].includes(method)

  const validateBody = (val: string) => {
    if (!val.trim()) { setBodyError(''); return true }
    try { JSON.parse(val); setBodyError(''); return true }
    catch { setBodyError('Niepoprawny JSON — sprawdź cudzysłowy i przecinki'); return false }
  }

  const handleSend = async () => {
    if (hasBody && !validateBody(body)) return
    setLoading(true)
    setResult(null)
    try {
      const r = await sendRequest(method, url, body)
      setResult(r)
      onResult?.(r, body)
    } catch (e: any) {
      setResult({ status: 0, statusText: 'Network Error', data: { error: e.message }, duration: 0, ok: false })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Method + URL row */}
      <div className="flex gap-2">
        {lockedMethod ? (
          <div className="flex items-center px-3 py-2 rounded-lg bg-slate-100 border border-slate-200">
            <MethodBadge method={method} />
          </div>
        ) : (
          <select
            value={method}
            onChange={e => setMethod(e.target.value as HttpMethod)}
            className="font-mono font-semibold text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
          >
            {METHODS.map(m => <option key={m}>{m}</option>)}
          </select>
        )}
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          readOnly={lockedUrl}
          placeholder="/api/produkty"
          className={`flex-1 font-mono text-sm px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 ${lockedUrl ? 'bg-slate-50 text-slate-500' : 'bg-white'}`}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className={`px-5 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50 ${METHOD_BG[method]}`}
        >
          {loading ? '…' : 'Wyślij'}
        </button>
      </div>

      {/* Body editor */}
      {hasBody && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Body (JSON)</label>
            {showBodyHint && (
              <span className="text-xs text-slate-400">string = cudzysłowy, number = bez</span>
            )}
          </div>
          <textarea
            value={body}
            onChange={e => { setBody(e.target.value); if (bodyError) validateBody(e.target.value) }}
            onBlur={() => validateBody(body)}
            rows={8}
            spellCheck={false}
            placeholder={'{\n  "name": "Produkt",\n  "price": 99.99,\n  "category": "elektronika"\n}'}
            className={`w-full font-mono text-sm p-3 rounded-lg border bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y ${bodyError ? 'border-red-400' : 'border-slate-700'}`}
          />
          {bodyError && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {bodyError}
            </p>
          )}
        </div>
      )}

      {/* Response */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 min-h-[80px]">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Odpowiedź serwera</p>
        <ResponsePanel result={result} loading={loading} />
      </div>
    </div>
  )
}
