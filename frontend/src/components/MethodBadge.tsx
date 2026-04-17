import type { HttpMethod } from "../types";

const STYLES: Record<HttpMethod, string> = {
  GET: "bg-blue-500/10 text-blue-400 border border-blue-500/25",
  POST: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25",
  PUT: "bg-amber-500/10 text-amber-400 border border-amber-500/25",
  DELETE: "bg-red-500/10 text-red-400 border border-red-500/25",
};

export function MethodBadge({
  method,
  size = "md",
}: {
  method: HttpMethod;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={`font-mono font-semibold rounded ${STYLES[method]} ${size === "sm" ? "text-xs px-1.5 py-0.5" : "text-sm px-2.5 py-1"}`}
    >
      {method}
    </span>
  );
}
