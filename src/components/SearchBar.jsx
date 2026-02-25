import { useState, useRef, useCallback, useEffect } from 'react';
import { Search, X, Shuffle } from 'lucide-react';
import { getRandomWord } from '../utils/helpers';
import { fetchSuggestions } from '../utils/api';

export function SearchBar({ onSearch, loading, initialValue = '' }) {
  const [value, setValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlight, setHighlight] = useState(-1);

  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const skipSuggestRef = useRef(false);
  const cacheRef = useRef(new Map());
  const abortRef = useRef(null);
  const reqIdRef = useRef(0);

  const handleSubmit = useCallback(
    (e) => {
      e?.preventDefault();
      const trimmed = value.trim();
      if (trimmed) {
        setShowSuggestions(false);
        onSearch(trimmed);
      }
    },
    [value, onSearch]
  );

  const handleClear = () => {
    setValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleRandom = () => {
    const word = getRandomWord();
    // prevent the suggestion dropdown from opening for this programmatic change
    skipSuggestRef.current = true;
    setValue(word);
    setSuggestions([]);
    setShowSuggestions(false);
    // also blur input to avoid focus opening suggestions
    inputRef.current?.blur();
    onSearch(word);
  };

  // select a suggestion (by click or keyboard)
  const selectSuggestion = (word) => {
    setValue(word);
    setShowSuggestions(false);
    setHighlight(-1);
    onSearch(word);
  };

  // keyboard handling for suggestions
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      if (showSuggestions) {
        setShowSuggestions(false);
        e.preventDefault();
        return;
      }
      handleClear();
      return;
    }

    if (!suggestions.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setShowSuggestions(true);
      setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
      return;
    }

    if (e.key === 'Enter') {
      if (showSuggestions && highlight >= 0) {
        e.preventDefault();
        selectSuggestion(suggestions[highlight]);
      }
    }
  };

  // fetch suggestions (debounced + cached + cancellable)
  useEffect(() => {
    const q = value.trim();
    // if changes were triggered programmatically (e.g. Random button), skip fetching
    if (skipSuggestRef.current) {
      skipSuggestRef.current = false;
      return;
    }
    if (q.length < 2) {
      // input too short — invalidate pending requests and bail out
      reqIdRef.current += 1;
      abortRef.current?.abort();
      return;
    }

    const cached = cacheRef.current.get(q);
    if (cached) {
      // ensure cached results are presented shortest → longest (stable)
      const cachedSorted = Array.isArray(cached)
        ? cached.slice().sort((a, b) => a.length - b.length || a.localeCompare(b))
        : [];
      setSuggestions(cachedSorted);
      setShowSuggestions(Boolean(cachedSorted.length));
      return;
    }

    const id = ++reqIdRef.current;
    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;

    const handle = setTimeout(() => {
      fetchSuggestions(q, 8, controller.signal).then((res) => {
        if (id !== reqIdRef.current) return; // stale
        const sorted = (res || []).slice().sort((a, b) => a.length - b.length || a.localeCompare(b));
        cacheRef.current.set(q, sorted);
        setSuggestions(sorted);
        setShowSuggestions(Boolean(sorted.length));
      });
    }, 220);

    return () => {
      clearTimeout(handle);
      controller.abort();
    };
  }, [value]);

  // click-outside to close suggestions
  useEffect(() => {
    function onDocClick(e) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setHighlight(-1);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // Sync with external selection/search: when parent changes `initialValue`
  // (e.g. user selects a word elsewhere) update the input and hide dropdown
  useEffect(() => {
    // avoid triggering suggestion fetch or showing dropdown when the
    // initial value is set from outside (page reload or external selection)
    skipSuggestRef.current = true;
    setValue(initialValue || '');
    setSuggestions([]);
    setShowSuggestions(false);
    setHighlight(-1);
  }, [initialValue]);

  // Helper: safely escape user input for use in RegExp
  const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Render a suggestion with the matched substring highlighted (case-insensitive).
  // Highlights all occurrences of the query inside the suggestion.
  const renderHighlighted = (word) => {
    const q = value.trim();
    if (!q) return word;
    const qEsc = escapeRegExp(q);
    const parts = word.split(new RegExp(`(${qEsc})`, 'gi'));
    const qLower = q.toLowerCase();
    return parts.map((part, i) =>
      part.toLowerCase() === qLower ? (
        <span key={i} className="font-semibold text-primary">
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <div ref={wrapperRef} className="relative flex-1">
          <label className="input input-bordered input-lg flex items-center gap-2 w-full focus-within:input-primary transition-all duration-200 shadow-sm">
            <Search size={20} className="text-base-content/50 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => {
                const v = e.target.value;
                setValue(v);
                setHighlight(-1);
                // clear suggestions immediately for very short input to avoid
                // triggering the fetch effect and to keep UI snappy
                if (v.trim().length < 2) {
                  setSuggestions([]);
                  setShowSuggestions(false);
                  abortRef.current?.abort();
                }
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(Boolean(suggestions.length))}
              placeholder="Search for a word…"
              className="grow text-base bg-transparent"
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              aria-autocomplete="list"
              aria-controls="search-suggestions"
              aria-expanded={showSuggestions}
            />
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="btn btn-ghost btn-xs btn-circle"
                tabIndex={-1}
              >
                <X size={14} />
              </button>
            )}
          </label>

          {showSuggestions && suggestions.length > 0 && (
            <ul
              id="search-suggestions"
              role="listbox"
              className="absolute z-50 mt-2 w-full bg-base-100 border border-base-200 rounded-md shadow-lg overflow-hidden max-h-60 overscroll-contain scrollbar-thin scrollbar-thumb-base-300"
            >
              {suggestions.map((s, idx) => {
                const active = idx === highlight;
                return (
                  <li
                    key={s}
                    role="option"
                    aria-selected={active}
                    className={`px-4 py-2 cursor-pointer text-sm hover:bg-base-200 ${
                      active ? 'bg-primary/10' : ''
                    }`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectSuggestion(s)}
                  >
                    {renderHighlighted(s)}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={!value.trim() || loading}
          className="btn btn-primary btn-lg shadow"
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <>
              <Search size={18} />
              <span className="hidden sm:inline ml-1">Search</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleRandom}
          className="btn btn-outline btn-lg"
          title="Random word"
          disabled={loading}
        >
          <Shuffle size={18} />
        </button>
      </div>
    </form>
  );
}
