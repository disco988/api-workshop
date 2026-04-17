import type { HttpMethod } from '../types'

const STYLES: Record<HttpMethod, string> = {
  GET:    'bg-blue-100 text-blue-800 border border-blue-200',
  POST:   'bg-green-100 text-green-800 border border-green-200',
  PUT:    'bg-amber-100 text-amber-800 border border-amber-200',
  DELETE: 'bg-red-100 text-red-800 border border-red-200',
}

export function MethodBadge({ method, size = 'md' }: { method: HttpMethod; size?: 'sm' | 'md' }) {
  return (
    <span className={`font-mono font-semibold rounded ${STYLES[method]} ${size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2.5 py-1'}`}>
      {method}
    </span>
  )
}
