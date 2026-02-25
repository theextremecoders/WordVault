import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function ThemeDrawer() {
  const { themePanelOpen, setThemePanelOpen, themes, theme, setTheme } = useApp();
  const [previewTheme, setPreviewTheme] = useState(null);

  const lightThemes = themes.filter((t) => t.mode === 'light');
  const darkThemes = themes.filter((t) => t.mode === 'dark');

  const drawerRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', previewTheme || theme);
    return () => {
      document.documentElement.setAttribute('data-theme', theme);
    };
  }, [previewTheme, theme]);

  // close when clicking outside the drawer (no visible backdrop)
  useEffect(() => {
    if (!themePanelOpen) return;
    const onDocMouseDown = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setThemePanelOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [themePanelOpen, setThemePanelOpen]);

  if (!themePanelOpen) return null;

  return (
    <>
      <div ref={drawerRef} className="fixed right-0 top-0 h-full w-96 bg-base-200 border-l border-base-300 z-50 flex flex-col shadow-2xl animate-in">
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <div>
            <p className="font-semibold">Themes</p>
            <p className="text-xs opacity-60">Preview on hover — click to apply</p>
          </div>
          <button
            onClick={() => setThemePanelOpen(false)}
            className="btn btn-ghost btn-sm btn-circle"
            aria-label="Close themes"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4" onMouseLeave={() => setPreviewTheme(null)}>
          {lightThemes.length > 0 && (
            <div>
              <div className="text-xs opacity-60 mb-2">Light</div>
              <div className="space-y-2">
                {lightThemes.map((t) => (
                  <button
                    key={t.value}
                    onMouseEnter={() => setPreviewTheme(t.value)}
                    onFocus={() => setPreviewTheme(t.value)}
                    onClick={() => { setTheme(t.value); setPreviewTheme(null); setThemePanelOpen(false); }}
                    className={`w-full text-left py-2 px-3 rounded ${theme === t.value ? 'bg-base-300 font-semibold' : 'hover:bg-base-300'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {darkThemes.length > 0 && (
            <div>
              <div className="text-xs opacity-60 mb-2">Dark</div>
              <div className="space-y-2">
                {darkThemes.map((t) => (
                  <button
                    key={t.value}
                    onMouseEnter={() => setPreviewTheme(t.value)}
                    onFocus={() => setPreviewTheme(t.value)}
                    onClick={() => { setTheme(t.value); setPreviewTheme(null); setThemePanelOpen(false); }}
                    className={`w-full text-left py-2 px-3 rounded ${theme === t.value ? 'bg-base-300 font-semibold' : 'hover:bg-base-300'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
