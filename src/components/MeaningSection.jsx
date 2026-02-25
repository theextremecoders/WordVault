import { badgeColor } from '../utils/helpers';

function WordChip({ word, onSearch, variant = 'outline' }) {
  return (
    <button
      onClick={() => onSearch(word)}
      className={`badge badge-${variant} badge-sm cursor-pointer hover:opacity-80 transition-opacity`}
    >
      {word}
    </button>
  );
}

export function MeaningSection({ meanings = [], onSearch }) {
  if (!meanings.length) return null;

  return (
    <div className="space-y-6">
      {meanings.map((meaning, idx) => (
        <div key={idx} className="space-y-3 animate-in" style={{ animationDelay: `${idx * 60}ms` }}>
          {/* Part of speech header */}
          <div className="flex items-center gap-3">
            <span className={`badge ${badgeColor(meaning.partOfSpeech)} badge-md font-semibold`}>
              {meaning.partOfSpeech}
            </span>
            <div className="flex-1 h-px bg-base-300" />
          </div>

          {/* Definitions */}
          <ol className="space-y-3 pl-2">
            {meaning.definitions.slice(0, 8).map((def, defIdx) => (
              <li key={defIdx} className="flex gap-3">
                <span className="text-primary font-bold text-sm mt-0.5 shrink-0 w-5 text-right">
                  {defIdx + 1}.
                </span>
                <div className="space-y-1">
                  <p className="text-base-content leading-relaxed">{def.definition}</p>
                  {def.example && (
                    <p className="text-sm text-base-content/60 italic border-l-2 border-primary/30 pl-3">
                      "{def.example}"
                    </p>
                  )}
                  {/* Inline synonyms */}
                  {def.synonyms?.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="text-xs text-base-content/50 self-center">syn:</span>
                      {def.synonyms.slice(0, 5).map((s) => (
                        <WordChip key={s} word={s} onSearch={onSearch} variant="success" />
                      ))}
                    </div>
                  )}
                  {/* Inline antonyms */}
                  {def.antonyms?.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="text-xs text-base-content/50 self-center">ant:</span>
                      {def.antonyms.slice(0, 5).map((a) => (
                        <WordChip key={a} word={a} onSearch={onSearch} variant="error" />
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>

          {/* Meaning-level synonyms */}
          {meaning.synonyms?.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1 pl-2">
              <span className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                Synonyms
              </span>
              {meaning.synonyms.slice(0, 10).map((s) => (
                <WordChip key={s} word={s} onSearch={onSearch} variant="success" />
              ))}
            </div>
          )}

          {/* Meaning-level antonyms */}
          {meaning.antonyms?.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1 pl-2">
              <span className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                Antonyms
              </span>
              {meaning.antonyms.slice(0, 10).map((a) => (
                <WordChip key={a} word={a} onSearch={onSearch} variant="error" />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
