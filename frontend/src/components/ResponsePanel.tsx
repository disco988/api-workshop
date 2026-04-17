import type { RequestResult } from '../types'
import { CodeBlock } from './CodeBlock'

interface Props {
  result: RequestResult | null
  loading?: boolean
}

const STATUS_COLOR: Record<number, string> = {}
const getStatusColor = (status: number) => {
  if (status >= 200 && status < 300) return 'text-green-600 bg-green-50 border-green-200'
  if (status >= 400 && status < 500) return 'text-amber-700 bg-amber-50 border-amber-200'
  if (status >= 500) return 'text-red-700 bg-red-50 border-red-200'
  return 'text-slate-600 bg-slate-50 border-slate-200'
}

const STATUS_LABEL: Record<number, string> = {
  200: 'OK',
  201: 'Created',
  400: 'Bad Request',
  404: 'Not Found',
  405: 'Method Not Allowed',
  422: 'Unprocessable Entity',
  500: 'Internal Server Error',
}

export function ResponsePanel({ result, loading }: Props) {
  if (loading) {
    return (
      <div className="flex items-center gap-3 p-6 text-slate-500 text-sm">
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Wysyłam request…
      </div>
    )
  }

  if (!result) {
    return (
      <div className="p-6 text-slate-400 text-sm text-center">
        Odpowiedź pojawi się tutaj po wysłaniu requestu
      </div>
    )
  }

  const statusColor = getStatusColor(result.status)
  const label = STATUS_LABEL[result.status] || result.statusText

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <span className={`font-mono font-bold text-sm px-3 py-1 rounded-full border ${statusColor}`}>
          {result.status} {label}
        </span>
        <span className="text-xs text-slate-400">{result.duration} ms</span>
        {result.ok ? (
          <span className="flex items-center gap-1 text-xs text-green-600">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Sukces
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-red-600">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Błąd
          </span>
        )}
      </div>
      <CodeBlock
        code={JSON.stringify(result.data, null, 2)}
        language="json"
      />
    </div>
  )
}
