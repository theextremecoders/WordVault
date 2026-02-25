import { useEffect, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { getWordOfTheDay, formatDate, truncate } from '../utils/helpers';
import { fetchWord } from '../utils/api';

export function WordOfTheDay({ onSearch }) {
  const word = getWordOfTheDay();
  const [entry, setEntry]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchWord(word)
      .then((data) => {
        if (!cancelled && data?.length) setEntry(data[0]);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [word]);

  const shortDef = entry?.meanings?.[0]?.definitions?.[0]?.definition;
  const pos      = entry?.meanings?.[0]?.partOfSpeech;
  const phonetic = entry?.phonetic || entry?.phonetics?.find((p) => p.text)?.text;

  return (
    <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 shadow-lg">
      <div className="card-body py-5 px-6 gap-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Word of the Day
          </span>
          <span className="text-xs text-base-content/40 ml-auto">{formatDate()}</span>
        </div>

        {loading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-8 w-36 bg-base-300 rounded-lg" />
            <div className="h-4 w-full bg-base-300 rounded" />
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="text-3xl font-black">{word}</h2>
              {phonetic && (
                <span className="text-base-content/60 font-mono">{phonetic}</span>
              )}
              {pos && (
                <span className="badge badge-primary badge-sm">{pos}</span>
              )}
            </div>

            {shortDef && (
              <p className="text-base-content/80 text-sm leading-relaxed">
                {truncate(shortDef, 150)}
              </p>
            )}

            <button
              onClick={() => onSearch(word)}
              className="btn btn-primary btn-sm self-start gap-2 mt-1"
            >
              Explore word
              <ArrowRight size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
