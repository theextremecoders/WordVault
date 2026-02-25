import { useApp } from '../context/AppContext';
import { BookMarked, Clock, Menu, X, Palette } from 'lucide-react';

export function Header({ onWordSelect }) {
  const {
    theme, setTheme, themes,
    sidebarOpen, setSidebarOpen,
    sidebarTab, setSidebarTab,
    themePanelOpen, setThemePanelOpen,
    favorites, history,
  } = useApp();

  const openSidebar = (tab) => {
    setSidebarTab(tab);
    setSidebarOpen(true);
  };


  return (
    <header className="navbar bg-base-200/80 backdrop-blur-md border-b border-base-300 sticky top-0 z-50 px-4 gap-2">
      {/* Logo */}
      <div className="navbar-start">
        <a
          onClick={() => onWordSelect?.('')}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow">
            <span className="text-primary-content font-black text-sm">W</span>
          </div>
          <span className="font-extrabold text-xl tracking-tight hidden sm:inline">
            Word<span className="text-primary">Vault</span>
          </span>
        </a>
      </div>

      {/* Nav actions */}
      <div className="navbar-end gap-1">
        {/* History button */}
        <button
          className="btn btn-ghost btn-sm gap-1 hidden sm:flex"
          onClick={() => openSidebar('history')}
          title="Search History"
        >
          <Clock size={16} />
          <span className="hidden md:inline">History</span>
          {history.length > 0 && (
            <span className="badge badge-sm badge-primary">{history.length}</span>
          )}
        </button>

        {/* Favorites button */}
        <button
          className="btn btn-ghost btn-sm gap-1 hidden sm:flex"
          onClick={() => openSidebar('favorites')}
          title="Favorites"
        >
          <BookMarked size={16} />
          <span className="hidden md:inline">Favorites</span>
          {favorites.length > 0 && (
            <span className="badge badge-sm badge-secondary">{favorites.length}</span>
          )}
        </button>

        {/* Theme panel (separate) */}
        <button
          className="btn btn-ghost btn-sm gap-1"
          title="Change Theme"
          onClick={() => setThemePanelOpen(true)}
        >
          <Palette size={16} />
          <span className="hidden md:inline">Theme</span>
        </button>

        {/* Mobile menu */}
        <div className="dropdown dropdown-end sm:hidden" popover>
          <button tabIndex={0} className="btn btn-ghost btn-sm">
            <Menu size={18} />
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow-xl bg-base-200 border border-base-300 rounded-box w-48 mt-2"
          >
            <li>
              <button onClick={() => openSidebar('history')}>
                <Clock size={14} /> History {history.length > 0 && `(${history.length})`}
              </button>
            </li>
            <li>
              <button onClick={() => openSidebar('favorites')}>
                <BookMarked size={14} /> Favorites {favorites.length > 0 && `(${favorites.length})`}
              </button>
            </li>
            <li>
              <button onClick={() => setThemePanelOpen(true)}>
                <Palette size={14} /> Themes
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
