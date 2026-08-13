import { useEffect } from "react";
import { WetyCharacter } from "../WetyCharacter";
import { Confetti } from "../ui/Confetti";
import { Icon } from "../Icon";

interface FeedbackOverlayProps {
  show: boolean;
  praise: string;
  starsEarned: number;
  actionText?: string;
  reduceMotion: boolean;
  onNext: () => void;
  autoAdvanceMs?: number;
}

export function FeedbackOverlay({ show, praise, starsEarned, actionText, reduceMotion, onNext, autoAdvanceMs = 1600 }: FeedbackOverlayProps) {
  useEffect(() => {
    if (!show) return;
    const timer = window.setTimeout(onNext, autoAdvanceMs);
    return () => window.clearTimeout(timer);
  }, [show, onNext, autoAdvanceMs]);

  if (!show) return null;

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#4a3626]/25 backdrop-blur-[2px]" role="status" aria-live="polite">
      <Confetti active={show} reduceMotion={reduceMotion} />
      <div
        className={`relative flex flex-col items-center gap-2 rounded-[32px] bg-[var(--color-card)] px-8 py-6 border-4 border-[#ffd166] shadow-xl ${
          reduceMotion ? "" : "animate-[pop-in_0.4s_ease-out]"
        }`}
      >
        <WetyCharacter mood="excited" size={110} bounce={!reduceMotion} />
        <p className="text-xl font-extrabold text-[var(--color-ink)] text-center">{praise}</p>
        {actionText && <p className="text-sm font-bold text-[var(--color-ink-soft)] text-center max-w-56">{actionText}</p>}
        {starsEarned > 0 && (
          <div className="flex items-center gap-1 text-[#c2830f] font-black text-lg">
            {Array.from({ length: starsEarned }).map((_, i) => (
              <Icon key={i} name="star" size={26} />
            ))}
            <span className="ml-1">+{starsEarned}</span>
          </div>
        )}
      </div>
    </div>
  );
}
