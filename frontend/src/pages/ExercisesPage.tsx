import { useState } from "react";
import { EXERCISES } from "../lib/exercises";
import { MethodBadge } from "../components/MethodBadge";
import { RequestBuilder } from "../components/RequestBuilder";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  markCompleted,
  recordAttempt,
  resetProgress,
} from "../store/progressSlice";
import type { RequestResult } from "../types";

function ProgressBar({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-slate-400">
        <span>Postęp</span>
        <span>
          {completed}/{total} ćwiczeń
        </span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {pct === 100 && (
        <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Wszystkie ćwiczenia zaliczone!
        </p>
      )}
    </div>
  );
}

interface ExerciseCardProps {
  ex: (typeof EXERCISES)[number];
  index: number;
  completed: boolean;
  attempts: number;
}

function ExerciseCard({ ex, index, completed, attempts }: ExerciseCardProps) {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState<{
    passed: boolean;
    message: string;
  } | null>(null);

  const getDefaultUrl = () => {
    if (ex.id === "ex1") return "/api/produkty";
    if (ex.id === "ex2") return "/api/produkty/{id}";
    if (ex.id === "ex3") return "/api/produkty";
    if (ex.id === "ex4") return "/api/produkty/{id}";
    return "/api/produkty";
  };

  const getDefaultBody = () => {
    // if (ex.id === 'ex3') return `{\n  "name": "",\n  "price": ,\n  "category": "",\n  "stock": 0\n}`
    // if (ex.id === 'ex4') return `{\n  "name": "",\n  "price": ,\n  "category": "",\n  "stock": 0\n}`
    if (ex.id === "ex3") return `wpisz body requestu`;
    if (ex.id === "ex4") return `wpisz body requestu`;
    return "";
  };

  const handleResult = (result: RequestResult, body: string) => {
    dispatch(recordAttempt(ex.id));
    const validation = ex.validate(result, body);
    setFeedback(validation);
    if (validation.passed) dispatch(markCompleted(ex.id));
  };

  return (
    <div
      className={`rounded-xl border transition-colors overflow-hidden ${completed ? "border-emerald-500/30 bg-slate-900" : "border-slate-700 bg-slate-900"}`}
    >
      {/* Header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-800/50 transition-colors"
      >
        {/* Status icon */}
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold border ${completed ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" : "bg-slate-800 border-slate-700 text-slate-500"}`}
        >
          {completed ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            index + 1
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <MethodBadge method={ex.method} size="sm" />
            <span className="font-medium text-slate-200 text-sm">
              {ex.title}
            </span>
          </div>
          {attempts > 0 && !completed && (
            <p className="text-xs text-amber-500 mt-0.5">
              {attempts} {attempts === 1 ? "próba" : "próby"} — spróbuj jeszcze
              raz
            </p>
          )}
          {completed && (
            <p className="text-xs text-emerald-500 mt-0.5">Zaliczone</p>
          )}
        </div>

        <svg
          className={`w-4 h-4 text-slate-600 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Body */}
      {open && (
        <div className="border-t border-slate-800 p-5 space-y-4 bg-slate-950/50">
          {/* Description */}
          <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 text-sm text-slate-300 leading-relaxed">
            {ex.description}
          </div>

          {/* Hint */}
          <details className="group">
            <summary className="cursor-pointer text-sm text-blue-400 hover:text-blue-300 list-none flex items-center gap-1.5 select-none">
              <svg
                className="w-4 h-4 transition-transform group-open:rotate-90"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              Pokaż wskazówkę
            </summary>
            <div className="mt-2 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg text-sm text-blue-300">
              {ex.hint}
            </div>
          </details>

          {/* Request builder */}
          <RequestBuilder
            defaultMethod={ex.method}
            defaultUrl={getDefaultUrl()}
            defaultBody={getDefaultBody()}
            lockedMethod={true}
            onResult={handleResult}
            showBodyHint={true}
          />

          {/* Feedback */}
          {feedback && (
            <div
              className={`p-4 rounded-lg border text-sm font-medium flex items-start gap-2.5 ${feedback.passed ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300" : "bg-red-500/5 border-red-500/20 text-red-300"}`}
            >
              {feedback.passed ? (
                <svg
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span>{feedback.message}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ExercisesPage() {
  const dispatch = useAppDispatch();
  const completed = useAppSelector((s) => s.progress.completed);
  const attempts = useAppSelector((s) => s.progress.attempts);
  const completedCount = Object.values(completed).filter(Boolean).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Ćwiczenia</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Wyślij prawdziwe requesty do API — walidator sprawdzi czy są
            poprawne
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm("Zresetować cały postęp?")) dispatch(resetProgress());
          }}
          className="text-xs text-slate-600 hover:text-slate-400 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
        >
          Resetuj postęp
        </button>
      </div>

      <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
        <ProgressBar completed={completedCount} total={EXERCISES.length} />
      </div>

      <div className="space-y-3">
        {EXERCISES.map((ex, i) => (
          <ExerciseCard
            key={ex.id}
            ex={ex}
            index={i}
            completed={!!completed[ex.id]}
            attempts={attempts[ex.id] || 0}
          />
        ))}
      </div>
    </div>
  );
}
