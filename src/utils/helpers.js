// Curated list of interesting English words for Word of the Day
const DAILY_WORDS = [
  'serendipity','ephemeral','luminous','mellifluous','sanguine',
  'eloquent','perspicacious','loquacious','magnanimous','ineffable',
  'ethereal','quintessential','labyrinthine','sonorous','paradox',
  'zenith','catalyst','resilience','tenacious','languid',
  'vivacious','enigmatic','sapient','quixotic','laconic',
  'pristine','soliloquy','profound','whimsical','elusive',
  'sublime','ardent','bucolic','candor','diaphanous',
  'ebullient','facetious','gloaming','halcyon','incandescent',
  'jubilant','kaleidoscope','limerence','melancholy','nonchalant',
  'onomatopoeia','pensive','querulous','reverie','seraphic',
  'tranquil','umbra','verdant','wanderlust','xenial',
  'yearning','zephyr','ambivalent','byzantine','catharsis',
  'denouement','effervescent','felicity','gregarious','hubris',
  'idyllic','juxtapose','kinetic','labyrinth','mnemonic',
  'nostalgia','oblivion','palimpsest','quandary','rapture',
  'sonder','tacit','ubiquitous','vicarious','whimsy',
  'xenophile','yen','zealous','acumen','benevolent',
  'cacophony','diligent','empathy','fortitude','gratitude',
  'harmony','integrity','journey','knowledge','luminance',
];

export function getWordOfTheDay() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return DAILY_WORDS[dayOfYear % DAILY_WORDS.length];
}

export function getRandomWord() {
  return DAILY_WORDS[Math.floor(Math.random() * DAILY_WORDS.length)];
}

export function formatDate(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function truncate(str, maxLen = 120) {
  if (!str || str.length <= maxLen) return str;
  return str.slice(0, maxLen).trimEnd() + '…';
}

export const PART_OF_SPEECH_COLORS = {
  noun:        'badge-primary',
  verb:        'badge-secondary',
  adjective:   'badge-accent',
  adverb:      'badge-info',
  pronoun:     'badge-success',
  preposition: 'badge-warning',
  conjunction: 'badge-error',
  interjection:'badge-neutral',
  exclamation: 'badge-neutral',
  article:     'badge-ghost',
  determiner:  'badge-ghost',
};

export function badgeColor(pos) {
  return PART_OF_SPEECH_COLORS[pos?.toLowerCase()] || 'badge-neutral';
}

export const THEMES = [
  { value: 'light',        label: '☀️ Light',        mode: 'light' },
  { value: 'dark',         label: '🌙 Dark',         mode: 'dark' },
  { value: 'cupcake',      label: '🧁 Cupcake',      mode: 'light' },
  { value: 'bumblebee',    label: '🐝 Bumblebee',    mode: 'light' },
  { value: 'emerald',      label: '💚 Emerald',      mode: 'light' },
  { value: 'corporate',    label: '🏢 Corporate',    mode: 'light' },
  { value: 'synthwave',    label: '🌊 Synthwave',    mode: 'dark' },
  { value: 'retro',        label: '🕹 Retro',        mode: 'light' },
  { value: 'cyberpunk',    label: '⚡ Cyberpunk',     mode: 'light' },
  { value: 'valentine',    label: '💖 Valentine',    mode: 'light' },
  { value: 'halloween',    label: '🎃 Halloween',    mode: 'dark' },
  { value: 'garden',       label: '🌼 Garden',       mode: 'light' },
  { value: 'forest',       label: '🌲 Forest',       mode: 'dark' },
  { value: 'aqua',         label: '💧 Aqua',         mode: 'dark' },
  { value: 'lofi',         label: '🎧 Lofi',         mode: 'light' },
  { value: 'pastel',       label: '🎨 Pastel',       mode: 'light' },
  { value: 'fantasy',      label: '🪄 Fantasy',      mode: 'light' },
  { value: 'wireframe',    label: '🧩 Wireframe',    mode: 'light' },
  { value: 'black',        label: '⬛ Black',        mode: 'dark' },
  { value: 'luxury',       label: '💎 Luxury',       mode: 'dark' },
  { value: 'dracula',      label: '🧛 Dracula',      mode: 'dark' },
  { value: 'cmyk',         label: '🎨 CMYK',         mode: 'light' },
  { value: 'autumn',       label: '🍂 Autumn',       mode: 'light' },
  { value: 'business',     label: '💼 Business',     mode: 'dark' },
  { value: 'acid',         label: '🧪 Acid',         mode: 'light' },
  { value: 'lemonade',     label: '🍋 Lemonade',     mode: 'light' },
  { value: 'night',        label: '🌌 Night',        mode: 'dark' },
  { value: 'coffee',       label: '☕ Coffee',       mode: 'dark' },
  { value: 'winter',       label: '❄️ Winter',       mode: 'light' },
  { value: 'dim',          label: '🌑 Dim',          mode: 'dark' },
  { value: 'nord',         label: '❄️ Nord',         mode: 'light' },
  { value: 'sunset',       label: '🌇 Sunset',       mode: 'dark' },
  { value: 'caramellatte', label: '🥐 CaramelLatte', mode: 'light' },
  { value: 'abyss',        label: '🌊 Abyss',        mode: 'dark' },
  { value: 'silk',         label: '🧵 Silk',         mode: 'light' },
];

