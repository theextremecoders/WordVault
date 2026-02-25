import { useState, useCallback, useRef } from 'react';
import { fetchWord } from '../utils/api';

export function useDictionary() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [query, setQuery]     = useState('');
  const abortRef              = useRef(null);

  const search = useCallback(async (word) => {
    if (!word?.trim()) return;
    // Cancel any in-flight request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setData(null);
    setQuery(word.trim());

    try {
      const result = await fetchWord(word.trim());
      setData(result);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setData(null);
    setError(null);
    setQuery('');
  }, []);

  return { data, loading, error, query, search, clear };
}
