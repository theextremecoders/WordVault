import { AlertCircle, RefreshCw } from 'lucide-react';

export function ErrorDisplay({ message, word, onRetry }) {
  const isNotFound = message?.includes('No definitions found');

  return (
    <div className="w-full max-w-xl mx-auto animate-bounce-in">
      <div className="card bg-base-200 border border-error/30 shadow-xl">
        <div className="card-body items-center text-center gap-4 py-10">
          <div className="text-5xl">
            {isNotFound ? '🔍' : '⚠️'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-error">
              {isNotFound ? 'Word Not Found' : 'Something Went Wrong'}
            </h2>
            <p className="text-base-content/70 mt-2 text-sm leading-relaxed max-w-sm">
              {message}
            </p>
          </div>

          {isNotFound && word && (
            <div className="space-y-2 w-full max-w-xs">
              <p className="text-xs text-base-content/50 uppercase tracking-wider">Suggestions</p>
              <ul className="text-sm space-y-1 text-base-content/70">
                <li>• Check the spelling of <strong>"{word}"</strong></li>
                <li>• Try searching for the base form of the word</li>
                <li>• Use a simpler variant or synonym</li>
              </ul>
            </div>
          )}

          {onRetry && (
            <button onClick={onRetry} className="btn btn-error btn-outline btn-sm gap-2">
              <RefreshCw size={14} />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
