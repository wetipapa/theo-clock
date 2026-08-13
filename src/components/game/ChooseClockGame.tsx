import { useEffect, useState } from "react";
import { AnalogClock } from "../clock/AnalogClock";
import type { ClockTime } from "../../lib/time";
import { playHint } from "../../lib/audio";

interface ChooseClockGameProps {
  problemKey: string;
  promptText: string;
  options: ClockTime[];
  correctIndex: number;
  disabled?: boolean;
  reduceMotion: boolean;
  onCorrect: () => void;
  onWrongAttempt: () => void;
}

const HINTS = ["다시 살펴볼까? 짧은 바늘과 긴 바늘을 잘 확인해보자!", "괜찮아요, 한 번 더 볼까요?", "긴 바늘이 가리키는 숫자를 세어볼까?"];

export function ChooseClockGame({
  problemKey,
  promptText,
  options,
  correctIndex,
  disabled = false,
  reduceMotion,
  onCorrect,
  onWrongAttempt,
}: ChooseClockGameProps) {
  const [wrongIndex, setWrongIndex] = useState<number | null>(null);
  const [solvedIndex, setSolvedIndex] = useState<number | null>(null);
  const [hintText, setHintText] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    setWrongIndex(null);
    setSolvedIndex(null);
    setHintText(null);
    setAttempts(0);
  }, [problemKey]);

  const handlePick = (index: number) => {
    if (disabled || solvedIndex !== null) return;
    if (index === correctIndex) {
      setSolvedIndex(index);
      setWrongIndex(null);
      setHintText(null);
      onCorrect();
      return;
    }
    const next = attempts + 1;
    setAttempts(next);
    setWrongIndex(index);
    setHintText(HINTS[Math.min(next - 1, HINTS.length - 1)]);
    playHint();
    onWrongAttempt();
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <p className="text-center text-lg sm:text-xl font-bold leading-relaxed text-[var(--color-ink)] px-2 text-balance">{promptText}</p>

      <div className="min-h-9 flex items-center justify-center px-4">
        {hintText && (
          <p className="text-center text-sm sm:text-base font-bold text-[#c2701b] bg-[#fff1da] rounded-2xl px-4 py-1.5 border-2 border-[#ffd166]" role="status">
            {hintText}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-sm" role="group" aria-label="시계 보기 중 정답을 골라주세요">
        {options.map((opt, i) => {
          const isWrong = wrongIndex === i;
          const isSolved = solvedIndex === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => handlePick(i)}
              disabled={disabled || solvedIndex !== null}
              aria-label={`시계 보기 ${i + 1}`}
              aria-pressed={isSolved}
              className={`relative flex items-center justify-center rounded-3xl border-4 p-2 bg-[var(--color-card)] transition-transform disabled:opacity-70 ${
                isSolved
                  ? "border-[#6fcf97] scale-[1.03]"
                  : isWrong
                    ? `border-[#ff8a5c] ${reduceMotion ? "" : "animate-[shake_0.4s_ease-in-out]"}`
                    : "border-[#f1e0c4] active:scale-95"
              }`}
            >
              <AnalogClock value={opt} interactive={false} showLegend={false} size={110} reduceMotion={reduceMotion} />
              {isSolved && (
                <span className="absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#6fcf97] text-white text-sm font-black">
                  ✓
                </span>
              )}
              {isWrong && (
                <span className="absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#ff8a5c] text-white text-sm font-black">
                  ?
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
