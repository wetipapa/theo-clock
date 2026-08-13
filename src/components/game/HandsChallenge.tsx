import { useEffect, useState } from "react";
import { AnalogClock } from "../clock/AnalogClock";
import { Button } from "../ui/Button";
import type { ClockTime, SnapMinutes } from "../../lib/time";
import { isSameTime } from "../../lib/time";
import { buildSetHandsHint } from "../../lib/hints";
import { playHint } from "../../lib/audio";

interface HandsChallengeProps {
  problemKey: string;
  grid: SnapMinutes;
  target: ClockTime;
  promptText: string;
  referenceTime?: ClockTime | null;
  referenceLabel?: string;
  disabled?: boolean;
  reduceMotion: boolean;
  onCorrect: () => void;
  onWrongAttempt: () => void;
}

/** target에서 적당히 떨어진, 그리드에 맞는 랜덤 시작 위치 (매번 같은 위치로 시작하지 않도록) */
function randomStart(target: ClockTime, grid: SnapMinutes): ClockTime {
  const hourOffset = 3 + Math.floor(Math.random() * 4);
  const hour = ((target.hour - 1 + hourOffset) % 12) + 1;
  const steps = Math.max(1, Math.floor(60 / grid));
  const minute = (Math.floor(Math.random() * steps) * grid) % 60;
  return { hour, minute };
}

export function HandsChallenge({
  problemKey,
  grid,
  target,
  promptText,
  referenceTime = null,
  referenceLabel,
  disabled = false,
  reduceMotion,
  onCorrect,
  onWrongAttempt,
}: HandsChallengeProps) {
  const [value, setValue] = useState<ClockTime>(() => randomStart(target, grid));
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [hint, setHint] = useState<ReturnType<typeof buildSetHandsHint> | null>(null);

  useEffect(() => {
    setValue(randomStart(target, grid));
    setWrongAttempts(0);
    setHint(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemKey]);

  const handleCheck = () => {
    if (disabled) return;
    if (isSameTime(value, target)) {
      setHint(null);
      onCorrect();
      return;
    }
    const next = wrongAttempts + 1;
    setWrongAttempts(next);
    setHint(buildSetHandsHint(value, target, next));
    playHint();
    onWrongAttempt();
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <p className="text-center text-lg sm:text-xl font-bold leading-relaxed text-[var(--color-ink)] px-2 text-balance">{promptText}</p>

      {referenceTime && (
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-bold text-[var(--color-ink-soft)]">{referenceLabel ?? "지금"}</span>
          <AnalogClock value={referenceTime} interactive={false} showLegend={false} size={92} reduceMotion={reduceMotion} />
        </div>
      )}

      <div className="w-56 sm:w-64">
        <AnalogClock
          value={value}
          onChange={setValue}
          grid={grid}
          interactive={!disabled}
          highlightHand={hint?.hand ?? null}
          reduceMotion={reduceMotion}
        />
      </div>

      <div className="min-h-11 flex items-center justify-center px-4">
        {hint && (
          <p className="text-center text-sm sm:text-base font-bold text-[#c2701b] bg-[#fff1da] rounded-2xl px-4 py-2 border-2 border-[#ffd166]" role="status">
            {hint.message}
          </p>
        )}
      </div>

      <Button variant="primary" size="lg" onClick={handleCheck} disabled={disabled} aria-label="시계 확인하기">
        확인!
      </Button>
    </div>
  );
}
