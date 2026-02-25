import { X, Trash2, Clock, BookMarked, Heart } from 'lucide-react';
import { fetchWord } from '../utils/api';
import { useApp } from '../context/AppContext';

function HistoryPanel({ onWordSelect }) {
  const { history, removeFromHistory, clearHistory, addFavorite, isFavorite, removeFavorite } = useApp();

  if (!history.length) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-base-content/40">
        <Clock size={36} strokeWidth={1.5} />
        <p className="text-sm">No search history yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-end pb-2">
        <button
          onClick={clearHistory}
          className="btn btn-ghost btn-xs text-error gap-1"
        >
          <Trash2 size={12} />
          Clear all
        </button>
      </div>
      {history.map((word) => (
        <div
          key={word}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-base-300 group cursor-pointer transition-colors"
          onClick={() => onWordSelect(word)}
        >
          <Clock size={13} className="text-base-content/40 shrink-0" />
          <span className="flex-1 text-sm truncate">{word}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={async (e) => {
                e.stopPropagation();
                if (isFavorite(word)) {
                  // toggle off
                  removeFavorite(word);
                  return;
                }

                // optimistic add (minimal data)
                const savedAt = new Date().toISOString();
                addFavorite({ word, savedAt });

                // fetch a brief meaning & phonetic in background and update the favorite
                try {
                  const data = await fetchWord(word);
                  const phonetic = data && data.length ? data[0].phonetic || null : null;
                  let shortDef = null;
                  if (Array.isArray(data) && data[0].meanings && data[0].meanings.length) {
                    const m = data[0].meanings[0];
                    const d = m.definitions && m.definitions[0];
                    if (d && d.definition) shortDef = d.definition;
                  }
                  // replace the optimistic entry with richer data
                  removeFavorite(word);
                  addFavorite({ word, phonetic, shortDef, savedAt });
                } catch (err) {
                  // ignore fetch errors — keep optimistic entry
                }
              }}
              className={`btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 transition-opacity ${isFavorite(word) ? 'text-secondary' : ''}`}
              title={isFavorite(word) ? 'Saved' : 'Save'}
            >
              <BookMarked size={12} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); removeFromHistory(word); }}
              className="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={11} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function FavoritesPanel({ onWordSelect }) {
  const { favorites, removeFavorite } = useApp();

  if (!favorites.length) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-base-content/40">
        <Heart size={36} strokeWidth={1.5} />
        <p className="text-sm">No saved words yet.</p>
        <p className="text-xs text-center">Search a word and press Save to bookmark it.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {favorites.map((f) => (
        <div
          key={f.word}
          className="flex items-start gap-2 px-3 py-2 rounded-lg hover:bg-base-300 group cursor-pointer transition-colors"
          onClick={() => onWordSelect(f.word)}
        >
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{f.word}</p>
            {f.phonetic && (
              <p className="text-xs text-base-content/50 font-mono">{f.phonetic}</p>
            )}
            {f.shortDef && (
              <p className="text-xs text-base-content/60 truncate leading-snug mt-0.5">
                {f.shortDef}
              </p>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); removeFavorite(f.word); }}
            className="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 transition-opacity mt-0.5"
            title="Remove"
          >
            <X size={11} />
          </button>
        </div>
      ))}
    </div>
  );
}



export function Sidebar({ onWordSelect }) {
  const { sidebarOpen, setSidebarOpen, sidebarTab, setSidebarTab, history, favorites } = useApp();

  const handleSelect = (word) => {
    onWordSelect(word);
    setSidebarOpen(false);
  };

  if (!sidebarOpen) return null;

  return (
    <>
      {/* Backdrop (click outside to close) */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={() => setSidebarOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-96 bg-base-200 border-l border-base-300 z-50 flex flex-col shadow-2xl animate-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <div className="tabs tabs-boxed tabs-sm bg-base-300">
            <button
              className={`tab gap-1 ${sidebarTab === 'history' ? 'tab-active' : ''}`}
              onClick={() => setSidebarTab('history')}
            >
              <Clock size={13} />
              History
              {history.length > 0 && (
                <span className="badge badge-xs badge-primary ml-1">{history.length}</span>
              )}
            </button>

            <button
              className={`tab gap-1 ${sidebarTab === 'favorites' ? 'tab-active' : ''}`}
              onClick={() => setSidebarTab('favorites')}
            >
              <BookMarked size={13} />
              Favorites
              {favorites.length > 0 && (
                <span className="badge badge-xs badge-secondary ml-1">{favorites.length}</span>
              )}
            </button>


          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3">
          {sidebarTab === 'history' ? (
            <HistoryPanel onWordSelect={handleSelect} />
          ) : (
            <FavoritesPanel onWordSelect={handleSelect} />
          )}
        </div>
      </div>
    </>
  );
}
