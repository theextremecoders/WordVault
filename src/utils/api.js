const BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

export async function fetchWord(word) {
  const trimmed = word.trim().toLowerCase();
  if (!trimmed) throw new Error('Please enter a word to search.');

  const res = await fetch(`${BASE_URL}/${encodeURIComponent(trimmed)}`);

  if (res.status === 404) {
    throw new Error(`No definitions found for "${word}".`);
  }
  if (!res.ok) {
    throw new Error(`Network error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data; // array of result objects
}

// Fast autocomplete suggestions using Datamuse with quality filtering.
// - Primary source: /sug (fast). We filter out low-scored, non-alpha, or multi-word
//   suggestions using a dynamic score threshold and a strict word regex.
// - Fallback: /words?sp=<prefix>*&md=d — only returns entries with definitions
//   (more reliable but slightly heavier).
// Returns an array of suggestion strings (max `limit`).
export async function fetchSuggestions(query, limit = 8, signal) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];

  const isValidWord = (w) => /^[a-z'-]{2,24}$/i.test(w);

  try {
    // try the fast suggestion endpoint first (request a few extra to allow filtering)
    const sugUrl = `https://api.datamuse.com/sug?s=${encodeURIComponent(q)}&max=${Number(
      Math.max(limit, 8)
    )}`;
    const res = await fetch(sugUrl, { signal });
    if (!res.ok) throw new Error('Datamuse /sug failed');

    const raw = await res.json(); // [{word, score}, ...]

    if (Array.isArray(raw) && raw.length) {
      // compute a dynamic threshold: keep items with score >= maxScore * 0.20,
      // but never lower than a small absolute floor to drop extremely low scores.
      const scores = raw.map((r) => r.score || 0);
      const maxScore = Math.max(...scores, 0);
      const relThreshold = Math.max(30, Math.floor(maxScore * 0.2));

      const filtered = raw
        .filter((r) => r && r.word && isValidWord(r.word))
        .filter((r) => (typeof r.score === 'number' ? r.score >= relThreshold : true))
        .map((r) => r.word)
        .filter(Boolean)
        .slice(0, limit);

      if (filtered.length) return filtered;
    }

    // Fallback: use Datamuse `/words?sp=<prefix>*&md=d` which includes definitions
    // (more likely to be real dictionary words). This returns objects where `defs`
    // exist for words found in WordNet.
    const wordsUrl = `https://api.datamuse.com/words?sp=${encodeURIComponent(
      q
    )}*&max=${Number(limit)}&md=d`;
    const wres = await fetch(wordsUrl, { signal });
    if (!wres.ok) return [];
    const wraw = await wres.json();
    const verified = (wraw || [])
      .filter((w) => w && w.word && isValidWord(w.word) && Array.isArray(w.defs) && w.defs.length)
      .map((w) => w.word)
      .slice(0, limit);

    return verified;
  } catch {
    // aborted or network error — silently fallback to no suggestions
    return [];
  }
}

export function getAudioUrl(phonetics) {
  if (!phonetics?.length) return null;
  const withAudio = phonetics.find((p) => p.audio && p.audio.trim());
  if (!withAudio) return null;
  const url = withAudio.audio;
  return url.startsWith('//') ? `https:${url}` : url;
}

export function getPrimaryPhonetic(data) {
  if (!data?.length) return null;
  const entry = data[0];
  if (entry.phonetic) return entry.phonetic;
  const ph = entry.phonetics?.find((p) => p.text);
  return ph?.text || null;
}

export function getAllSynonyms(meanings) {
  const set = new Set();
  meanings?.forEach((m) => {
    m.synonyms?.forEach((s) => s && set.add(s));
    m.definitions?.forEach((d) => d.synonyms?.forEach((s) => s && set.add(s)));
  });
  return [...set].slice(0, 20);
}

export function getAllAntonyms(meanings) {
  const set = new Set();
  meanings?.forEach((m) => {
    m.antonyms?.forEach((a) => a && set.add(a));
    m.definitions?.forEach((d) => d.antonyms?.forEach((a) => a && set.add(a)));
  });
  return [...set].slice(0, 20);
}
