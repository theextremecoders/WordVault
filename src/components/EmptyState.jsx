import { useState, useEffect, useRef } from 'react';
import { Sparkles, Shuffle, BookMarked, Volume2, Clock, Palette, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

const TIPS = [
  {
    text: 'Search for any English word to see its full definition, phonetics, and etymology.',
    Icon: Sparkles,
  },
  { text: 'Click on synonyms or antonyms to instantly look them up.', Icon: BookMarked },
  {
    text: (
      <>
        Press the{' '}
        <Shuffle size={14} className="inline-block align-middle text-primary" />
        {' '}button to discover a random word.
      </>
    ),
    Icon: Shuffle,
  },
  { text: 'Save words to your Favorites for quick access later.', Icon: BookMarked },
  { text: 'Use the speaker icon to hear the correct pronunciation.', Icon: Volume2 },
  { text: 'Your search history is saved locally — find recent searches in the History panel.', Icon: Clock },
  { text: 'Switch between beautiful themes using the Palette button in the header.', Icon: Palette },
];

export function EmptyState({ onSearch }) {
  const { history, favorites } = useApp();

  const [tipIndex, setTipIndex] = useState(0);
  const intervalRef = useRef(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    // rotate every 6 seconds
    intervalRef.current = setInterval(() => {
      if (!paused) setTipIndex((i) => (i + 1) % TIPS.length);
    }, 6000);
    return () => clearInterval(intervalRef.current);
  }, [paused]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in">
      {/* Hero */}
      <div className="text-center space-y-4 py-4">
        <div className="flex justify-center">
          <Sparkles size={56} className="text-primary drop-shadow mb-2" />
        </div>
        <div>
          <h2 className="text-3xl font-black">
            Welcome to <span className="text-primary">WordVault</span>
          </h2>
          <p className="text-base-content/60 mt-2 text-lg">
            Your professional English dictionary &amp; word explorer
          </p>
        </div>

        <div
          className="max-w-2xl mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="bg-base-200 border border-base-300 rounded-2xl p-3 shadow-sm flex items-center gap-3">
            <div className="flex-shrink-0">
              <motion.div
                key={tipIndex + '-icon'}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.28 }}
                className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"
              >
                {(() => {
                  const CurrIcon = TIPS[tipIndex].Icon;
                  return <CurrIcon size={18} className="text-primary" />;
                })()}
              </motion.div>
            </div>

            <div className="flex-1">
              <div className="text-left">
                <div className="text-sm text-base-content/80 font-medium">Tip</div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={tipIndex}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35 }}
                    className="text-sm text-base-content/70 mt-1"
                  >
                    {TIPS[tipIndex].text}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {TIPS.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setTipIndex(i)}
                        aria-label={`Show tip ${i + 1}`}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === tipIndex
                            ? 'bg-primary border-primary'
                            : 'bg-transparent border border-base-content/20 hover:bg-base-content/10'
                        }`}
                      />
                    ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTipIndex((t) => (t - 1 + TIPS.length) % TIPS.length)}
                    aria-label="Previous tip"
                    className="btn btn-ghost btn-xs btn-circle"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={() => setTipIndex((t) => (t + 1) % TIPS.length)}
                    aria-label="Next tip"
                    className="btn btn-ghost btn-xs btn-circle"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick searches */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-base-content/50 text-center">
          Try searching for…
        </h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {['serendipity', 'ephemeral', 'eloquent', 'resilience', 'luminous', 'paradox', 'zenith', 'whimsical'].map((w) => (
            <button
              key={w}
              onClick={() => onSearch(w)}
              className="badge badge-lg badge-outline cursor-pointer hover:badge-primary transition-all duration-200 hover:shadow"
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Recent history if any */}
      {history.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-base-content/50 text-center">
            Recent Searches
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {history.slice(0, 8).map((w) => (
              <button
                key={w}
                onClick={() => onSearch(w)}
                className="badge badge-lg badge-ghost cursor-pointer hover:badge-secondary transition-all"
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Favorites if any */}
      {favorites.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-base-content/50 text-center">
            Saved Words
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {favorites.slice(0, 6).map((f) => (
              <button
                key={f.word}
                onClick={() => onSearch(f.word)}
                className="badge badge-lg badge-secondary badge-outline cursor-pointer hover:opacity-80 transition-opacity"
              >
                {f.word}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
