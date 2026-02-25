import { useState } from 'react';
import { Heart, HeartOff, Copy, Share2, CheckCheck, BookOpen, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import { PhoneticCard } from './PhoneticCard';
import { MeaningSection } from './MeaningSection';
import { getAllSynonyms, getAllAntonyms, getPrimaryPhonetic } from '../utils/api';

function SynAntPanel({ words, label, color, onSearch }) {
  if (!words.length) return null;
  return (
    <div className={`rounded-xl border border-${color}/20 bg-${color}/5 p-4 space-y-2`}>
      <h4 className={`font-semibold text-sm uppercase tracking-wider text-${color}`}>{label}</h4>
      <div className="flex flex-wrap gap-2">
        {words.map((w) => (
          <button
            key={w}
            onClick={() => onSearch(w)}
            className={`badge badge-outline badge-${color} cursor-pointer hover:opacity-80 transition-opacity`}
          >
            {w}
          </button>
        ))}
      </div>
    </div>
  );
}

export function WordDisplay({ data, onSearch }) {
  const { toggleFavorite, isFavorite } = useApp();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  if (!data?.length) return null;

  // If multiple entries (e.g., different etymologies), pick the first but allow switching
  const entry   = data[activeTab] ?? data[0];
  const allSyn  = getAllSynonyms(entry.meanings);
  const allAnt  = getAllAntonyms(entry.meanings);
  const primary = getPrimaryPhonetic(data);
  const favEntry = {
    word:     entry.word,
    phonetic: primary,
    shortDef: entry.meanings?.[0]?.definitions?.[0]?.definition,
    savedAt:  new Date().toISOString(),
  };

  const totalDefs = entry.meanings?.reduce(
    (acc, m) => acc + m.definitions.length,
    0
  ) ?? 0;

  const handleCopy = async () => {
    const text = [
      entry.word,
      primary ? `[${primary}]` : '',
      entry.origin ? `Origin: ${entry.origin}` : '',
      '',
      ...entry.meanings.flatMap((m) => [
        m.partOfSpeech.toUpperCase(),
        ...m.definitions.slice(0, 3).map((d, i) => `${i + 1}. ${d.definition}`),
        '',
      ]),
    ]
      .filter((l) => l !== undefined)
      .join('\n')
      .trim();

    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}?q=${encodeURIComponent(entry.word)}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${entry.word} – WordVault`, url });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied!');
    }
  };

  const favorited = isFavorite(entry.word);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-in">
      {/* Main card */}
      <div className="card bg-base-200 shadow-xl border border-base-300">
        <div className="card-body gap-4">
          {/* Header row */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight break-words">
                {entry.word}
              </h1>
              <PhoneticCard
                phonetics={entry.phonetics}
                primaryPhonetic={primary}
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 flex-shrink-0 flex-wrap">
              <button
                onClick={() => toggleFavorite(favEntry)}
                className={`btn btn-sm gap-1 ${favorited ? 'btn-secondary' : 'btn-outline btn-secondary'}`}
                title={favorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                {favorited ? <HeartOff size={15} /> : <Heart size={15} />}
                <span className="hidden sm:inline">{favorited ? 'Saved' : 'Save'}</span>
              </button>
              <button onClick={handleCopy} className="btn btn-sm btn-outline gap-1" title="Copy">
                {copied ? <CheckCheck size={15} /> : <Copy size={15} />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button onClick={handleShare} className="btn btn-sm btn-outline gap-1" title="Share">
                <Share2 size={15} />
                <span className="hidden sm:inline">Share</span>
              </button>
              <a
                href={`https://en.wiktionary.org/wiki/${encodeURIComponent(entry.word)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-ghost gap-1"
                title="View on Wiktionary"
              >
                <ExternalLink size={15} />
              </a>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-2">
            <div className="stat-badge badge badge-neutral gap-1">
              <BookOpen size={12} />
              {totalDefs} definition{totalDefs !== 1 ? 's' : ''}
            </div>
            <div className="badge badge-neutral gap-1">
              {entry.meanings?.length} part{entry.meanings?.length !== 1 ? 's' : ''} of speech
            </div>
            {allSyn.length > 0 && (
              <div className="badge badge-success gap-1">{allSyn.length} synonyms</div>
            )}
            {allAnt.length > 0 && (
              <div className="badge badge-error gap-1">{allAnt.length} antonyms</div>
            )}
          </div>

          {/* Multiple entry tabs */}
          {data.length > 1 && (
            <div className="tabs tabs-lifted tabs-sm">
              {data.map((_, i) => (
                <button
                  key={i}
                  className={`tab ${activeTab === i ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab(i)}
                >
                  Entry {i + 1}
                </button>
              ))}
            </div>
          )}

          {/* Etymology / Origin */}
          {entry.origin && (
            <div className="alert alert-soft bg-base-300 text-sm border-0">
              <span className="font-semibold text-base-content/70">Origin: </span>
              <span className="italic text-base-content/80">{entry.origin}</span>
            </div>
          )}

          {/* Divider */}
          <div className="divider my-0" />

          {/* Meanings */}
          <MeaningSection meanings={entry.meanings} onSearch={onSearch} />
        </div>
      </div>

      {/* Synonyms & Antonyms summary */}
      {(allSyn.length > 0 || allAnt.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SynAntPanel
            words={allSyn}
            label="All Synonyms"
            color="success"
            onSearch={onSearch}
          />
          <SynAntPanel
            words={allAnt}
            label="All Antonyms"
            color="error"
            onSearch={onSearch}
          />
        </div>
      )}
    </div>
  );
}
