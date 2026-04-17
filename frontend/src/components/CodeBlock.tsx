import { useState } from 'react'

interface Props {
  code: string
  language?: string
  copyable?: boolean
}

export function CodeBlock({ code, language = 'json', copyable = true }: Props) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const highlighted = highlight(code, language)

  return (
    <div className="relative group rounded-lg overflow-hidden bg-slate-900 border border-slate-700">
      {copyable && (
        <button
          onClick={copy}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded"
        >
          {copied ? 'Skopiowano!' : 'Kopiuj'}
        </button>
      )}
      <pre className="p-4 text-sm font-mono leading-relaxed overflow-x-auto text-slate-100">
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  )
}

function highlight(code: string, language: string): string {
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  if (language === 'http') {
    return code
      .split('\n')
      .map((line, i) => {
        if (i === 0) {
          return line.replace(
            /^(GET|POST|PUT|DELETE|PATCH)/,
            (m) => `<span class="text-emerald-400 font-semibold">${m}</span>`
          )
        }
        const colonIdx = line.indexOf(':')
        if (colonIdx > 0 && !line.startsWith('{') && !line.startsWith(' ')) {
          const key = esc(line.slice(0, colonIdx))
          const val = esc(line.slice(colonIdx + 1))
          return `<span class="text-sky-300">${key}</span>:<span class="text-slate-300">${val}</span>`
        }
        return esc(line)
      })
      .join('\n')
  }

  // JSON highlighting
  return esc(code)
    .replace(/"([^"]+)"(\s*:)/g, '<span class="text-sky-300">"$1"</span>$2')
    .replace(/:\s*"([^"]*)"/g, ': <span class="text-amber-300">"$1"</span>')
    .replace(/:\s*(\d+\.?\d*)/g, ': <span class="text-purple-300">$1</span>')
    .replace(/:\s*(true|false|null)/g, ': <span class="text-emerald-400">$1</span>')
}
