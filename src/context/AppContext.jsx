import { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { THEMES } from '../utils/helpers';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Theme (default to Bumblebee until the user chooses another)
  // Stored in localStorage key 'wv-theme'. The hook falls back to 'bumblebee'
  const [theme, setTheme] = useLocalStorage('wv-theme', 'bumblebee');

  // Favorites: { word, phonetic, shortDef, savedAt }
  const [favorites, setFavorites] = useLocalStorage('wv-favorites', []);

  // Search history: array of strings
  const [history, setHistory] = useLocalStorage('wv-history', []);

  // Sidebar visibility (history + favorites)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab]   = useState('history'); // 'history' | 'favorites'

  // Theme panel (separate drawer)
  const [themePanelOpen, setThemePanelOpen] = useState(false);

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // --- Favorites helpers ---
  const isFavorite = (word) =>
    favorites.some((f) => f.word.toLowerCase() === word?.toLowerCase());

  const addFavorite = (entry) => {
    if (isFavorite(entry.word)) return;
    setFavorites((prev) => [entry, ...prev].slice(0, 100));
  };

  const removeFavorite = (word) => {
    setFavorites((prev) =>
      prev.filter((f) => f.word.toLowerCase() !== word.toLowerCase())
    );
  };

  const toggleFavorite = (entry) => {
    if (isFavorite(entry.word)) removeFavorite(entry.word);
    else addFavorite(entry);
  };

  // --- History helpers ---
  const addToHistory = (word) => {
    if (!word?.trim()) return;
    const lower = word.trim().toLowerCase();
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.toLowerCase() !== lower);
      // Keep a larger history (200 entries) so the History tab reflects more searches
      return [word.trim(), ...filtered].slice(0, 200);
    });
  };

  const removeFromHistory = (word) => {
    setHistory((prev) =>
      prev.filter((h) => h.toLowerCase() !== word.toLowerCase())
    );
  };

  const clearHistory = () => setHistory([]);

  const value = {
    theme, setTheme, themes: THEMES,
    favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite,
    history, addToHistory, removeFromHistory, clearHistory,
    sidebarOpen, setSidebarOpen,
    sidebarTab, setSidebarTab,
    themePanelOpen, setThemePanelOpen,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
