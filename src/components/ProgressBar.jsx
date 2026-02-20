/**
 * Top progress bar showing completion percentage
 */
export default function ProgressBar({ percentage, lastSaved }) {
  return (
    <div className="bg-white border-b border-slate-100 px-6 py-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-700">
            Portfolio Completion
          </span>
          <span className="text-sm font-bold text-primary-600">{percentage}%</span>
        </div>
        {lastSaved && (
          <span className="text-xs text-slate-400">
            Auto-saved {lastSaved.toLocaleTimeString()}
          </span>
        )}
      </div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
