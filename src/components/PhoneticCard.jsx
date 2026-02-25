import { useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { getAudioUrl } from '../utils/api';

export function PhoneticCard({ phonetics = [], primaryPhonetic }) {
  const [playing, setPlaying]   = useState(false);
  const [error,   setError]     = useState(false);
  const audioRef                = useRef(null);

  const audioUrl = getAudioUrl(phonetics);

  const playAudio = async () => {
    if (!audioUrl) return;
    setError(false);
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.onended  = () => setPlaying(false);
        audioRef.current.onerror  = () => { setPlaying(false); setError(true); };
      }
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
      setError(true);
    }
  };

  if (!primaryPhonetic && !phonetics?.length) return null;

  // Deduplicate phonetic texts
  const phoneticTexts = [
    ...new Set(
      phonetics
        .filter((p) => p.text)
        .map((p) => p.text)
    ),
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 mt-1">
      {phoneticTexts.slice(0, 3).map((p, i) => (
        <span key={i} className="text-lg text-base-content/70 font-mono tracking-wide">
          {p}
        </span>
      ))}

      {audioUrl && (
        <button
          onClick={playAudio}
          disabled={playing}
          className={`btn btn-circle btn-sm ${
            error ? 'btn-error' : playing ? 'btn-primary' : 'btn-outline btn-primary'
          } transition-all`}
          title="Play pronunciation"
        >
          {error ? (
            <VolumeX size={15} />
          ) : playing ? (
            <span className="loading loading-bars loading-xs" />
          ) : (
            <Volume2 size={15} />
          )}
        </button>
      )}
    </div>
  );
}
