import { useCallback, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Globe, Mail, Sparkles, Laptop, Bolt, Check, User, Volume2, Search, Download, ShieldCheck, Users, Star, ArrowRight, X } from 'lucide-react';
import { useApp } from './context/AppContext';
import { useDictionary } from './hooks/useDictionary';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { WordDisplay } from './components/WordDisplay';
import { WordOfTheDay } from './components/WordOfTheDay';
import { EmptyState } from './components/EmptyState';
import { Loader } from './components/Loader';
import { ErrorDisplay } from './components/ErrorDisplay';
import { Sidebar } from './components/Sidebar';
import { ThemeDrawer } from './components/ThemeDrawer';

export default function App() {
  const { addToHistory, theme, themes } = useApp();
  const [promoOpen, setPromoOpen] = useState(false);
  const { data, loading, error, query, search, clear } = useDictionary();

  // Read ?q= from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q?.trim()) search(q.trim());
  }, []);

  // Respond to browser back/forward navigation
  useEffect(() => {
    function onPopState() {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      if (q?.trim()) {
        search(q.trim());
      } else {
        clear();
      }
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) {}
    }

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [search, clear]);

  // Update URL + history on search
  const handleSearch = useCallback(
    (word) => {
      if (!word?.trim()) { clear(); return; }
      const url = new URL(window.location);
      url.searchParams.set('q', word.trim());
      window.history.pushState({}, '', url);
      addToHistory(word.trim());
      search(word.trim());
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) {}
    },
    [search, clear, addToHistory]
  );

  const handleWordSelect = useCallback(
    (word) => {
      if (!word) {
        clear();
        const url = new URL(window.location);
        url.searchParams.delete('q');
        window.history.pushState({}, '', url);
        try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) {}
      } else {
        handleSearch(word);
      }
    },
    [handleSearch, clear]
  );

  const showEmpty = !loading && !error && !data;

  // Pick an alternate theme of the same mode for the promotional footer
  const currentThemeObj = themes.find((t) => t.value === theme) || { mode: 'dark' };
  const altTheme = themes.find((t) => t.mode === currentThemeObj.mode && t.value !== theme);
  const promoThemeValue = altTheme ? altTheme.value : (currentThemeObj.mode === 'dark' ? 'luxury' : 'cupcake');

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: '!bg-base-200 !text-base-content !border !border-base-300 !shadow-lg',
          duration: 2500,
        }}
      />

      <Header onWordSelect={handleWordSelect} />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl space-y-8">
        {/* Search bar */}
        <SearchBar
          onSearch={handleSearch}
          loading={loading}
          initialValue={query}
        />

        {/* Word of the Day — only on empty state */}
        {showEmpty && (
          <WordOfTheDay onSearch={handleSearch} />
        )}

        {/* Loading */}
        {loading && <Loader />}

        {/* Error */}
        {error && !loading && (
          <ErrorDisplay
            message={error}
            word={query}
            onRetry={() => query && handleSearch(query)}
          />
        )}

        {/* Results */}
        {data && !loading && (
          <WordDisplay data={data} onSearch={handleSearch} />
        )}

        {/* Empty state */}
        {showEmpty && (
          <EmptyState onSearch={handleSearch} />
        )}
      </main>

      {/* ── Compact Promo Strip ── */}
      <footer className="border-t border-base-300 bg-base-200/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-content ring-1 ring-primary/30 shadow-md">
                <Laptop size={16} />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-success rounded-full ring-2 ring-base-200" />
              </div>
              <div className="leading-tight">
                <span className="font-bold text-sm tracking-tight">The Extreme Coders</span>
                <span className="mx-1.5 text-base-content/30 text-sm">·</span>
                <span className="text-xs text-base-content/55">AI‑first web &amp; app development</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden lg:block text-xs text-base-content/45 italic">&ldquo;We build the things clients dream of.&rdquo;</span>
              <button
                onClick={() => setPromoOpen(true)}
                className="btn btn-primary btn-sm shadow-lg shadow-primary/25 gap-1.5 font-semibold"
              >
                Work with us <ArrowRight size={13} />
              </button>
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-base-content/35">
            WordVault &mdash; Powered by{' '}
            <a href="https://dictionaryapi.dev" target="_blank" rel="noopener noreferrer" className="link link-primary opacity-80 hover:opacity-100">Free Dictionary API</a>
            {' '}· Built with React, Vite &amp; DaisyUI
          </p>
        </div>
      </footer>

      {/* ── Promo Modal ── */}
      {promoOpen && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={() => setPromoOpen(false)}
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <div
              data-theme={theme}
              className="pointer-events-auto w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-base-100 shadow-2xl ring-1 ring-base-300 flex flex-col animate-in"
            >
              {/* Hero */}
              <div className="relative bg-gradient-to-br from-primary/20 via-secondary/10 to-base-200 p-8 pb-6 rounded-t-2xl">
                <button
                  onClick={() => setPromoOpen(false)}
                  className="absolute top-4 right-4 btn btn-ghost btn-circle btn-sm"
                >
                  <X size={16} />
                </button>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 text-primary ring-1 ring-primary/30">
                    <Sparkles size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.15em]">Built by</p>
                    <h2 className="text-2xl font-extrabold tracking-tight">The Extreme Coders</h2>
                  </div>
                </div>
                <p className="text-xl font-bold mb-1.5">We build products people love &mdash; fast.</p>
                <p className="text-base-content/70 text-sm max-w-xl leading-relaxed">
                  AI‑powered development studio specializing in beautiful, high‑performance web apps.
                  We combine expert engineers with cutting‑edge tooling to ship faster, smarter, and with less risk.
                </p>
              </div>

              {/* Feature grid */}
              <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: <Bolt size={15} />, title: 'AI‑First Workflow', desc: 'AI tooling + expert engineers. Less grunt work, faster delivery, no shortcuts.' },
                  { icon: <Star size={15} />, title: 'Design‑Led Craft', desc: 'Pixel‑perfect UI, delightful micro‑interactions, and full accessibility.' },
                  { icon: <Globe size={15} />, title: 'Scalable Architecture', desc: 'Modular codebases and cloud‑ready deployments built to grow with you.' },
                  { icon: <ShieldCheck size={15} />, title: 'Security & Reliability', desc: 'Secure by default — automated testing and CI/CD for production confidence.' },
                  { icon: <Users size={15} />, title: 'Collaborative Partner', desc: 'Transparent process, close collaboration — we become part of your team.' },
                  { icon: <Check size={15} />, title: 'Performance Focus', desc: 'Blazing‑fast experiences with monitoring and continuous improvement.' },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="rounded-xl bg-base-200 p-4 flex flex-col gap-2 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <div className="flex items-center gap-2 text-primary">
                      {icon}
                      <span className="font-semibold text-sm text-base-content">{title}</span>
                    </div>
                    <p className="text-xs text-base-content/65 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>

              {/* What we can add */}
              <div className="px-6 pb-5">
                <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <Sparkles size={14} className="text-primary" />
                  What we can add to this app
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {[
                    [Globe,      'Multilingual support & localization'],
                    [Bolt,       'Offline support & PWA'],
                    [Check,      'Enterprise API & integrations'],
                    [User,       'Account system & synced Favorites'],
                    [Volume2,    'Spoken pronunciations & audio player'],
                    [Search,     'Advanced search & filters (POS, frequency…)'],
                    [Download,   'Export / import word lists (CSV, JSON)'],
                    [ShieldCheck,'SSO & enterprise-grade authentication'],
                    [Users,      'Collaborative lists & team workflows'],
                    [Star,       'Personalized learning & spaced repetition'],
                    [Mail,       'Analytics, dashboards & admin tools'],
                    [Sparkles,   'Interactive etymology visuals & AI features'],
                  ].map(([Icon, text]) => (
                    <div key={text} className="flex items-center gap-2 text-xs text-base-content/70 py-1">
                      <Icon size={12} className="text-primary flex-shrink-0" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA row */}
              <div className="p-6 pt-4 border-t border-base-200 flex flex-col sm:flex-row gap-3">
                <a
                  href="mailto:hello@theextremecoders.com"
                  className="btn btn-primary flex-1 shadow-lg shadow-primary/20 gap-2"
                >
                  <Mail size={15} /> Request a Proposal
                </a>
                <a
                  href="https://theextremecoders.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost flex-1 gap-2"
                >
                  <Globe size={15} /> Visit our website
                </a>
              </div>
            </div>
          </div>
        </>
      )}

      <Sidebar onWordSelect={handleWordSelect} />
      <ThemeDrawer />
    </div>
  );
}
