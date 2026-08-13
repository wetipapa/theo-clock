import { useEffect, useState } from "react";
import { Icon } from "../Icon";
import { formatKoreanTime } from "../../lib/time";
import { playHint } from "../../lib/audio";
import type { ScheduleCard } from "../../types";

interface ScheduleGameProps {
  problemKey: string;
  promptText: string;
  slots: ScheduleCard[];
  cards: ScheduleCard[];
  disabled?: boolean;
  reduceMotion: boolean;
  onCorrectItem: () => void;
  onWrongAttempt: () => void;
  onAllComplete: () => void;
}

export function ScheduleGame({
  problemKey,
  promptText,
  slots,
  cards,
  disabled = false,
  reduceMotion,
  onCorrectItem,
  onWrongAttempt,
  onAllComplete,
}: ScheduleGameProps) {
  const [placed, setPlaced] = useState<Record<string, boolean>>({});
  const [remaining, setRemaining] = useState<ScheduleCard[]>(cards);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shakeSlotId, setShakeSlotId] = useState<string | null>(null);

  useEffect(() => {
    setPlaced({});
    setRemaining(cards);
    setSelectedId(null);
    setShakeSlotId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemKey]);

  const handleSelectCard = (id: string) => {
    if (disabled) return;
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleTapSlot = (slotId: string) => {
    if (disabled || placed[slotId] || !selectedId) return;
    if (selectedId === slotId) {
      const nextPlaced = { ...placed, [slotId]: true };
      setPlaced(nextPlaced);
      setRemaining((prev) => prev.filter((c) => c.id !== selectedId));
      setSelectedId(null);
      onCorrectItem();
      if (Object.keys(nextPlaced).length === slots.length) {
        onAllComplete();
      }
    } else {
      setShakeSlotId(slotId);
      playHint();
      onWrongAttempt();
      window.setTimeout(() => setShakeSlotId(null), 420);
    }
  };

  const selectedCard = remaining.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <p className="text-center text-lg sm:text-xl font-bold leading-relaxed text-[var(--color-ink)] px-2 text-balance">{promptText}</p>

      <div className="min-h-9 flex items-center justify-center px-4">
        {selectedCard && (
          <p className="text-center text-sm sm:text-base font-bold text-[#2f7d55] bg-[#eafbf1] rounded-2xl px-4 py-1.5 border-2 border-[#6fcf97]">
            "{selectedCard.label}" 카드를 골랐어요. 알맞은 시간에 놓아주세요!
          </p>
        )}
      </div>

      <ol className="w-full max-w-sm flex flex-col gap-2" aria-label="웨티의 하루 시간표">
        {slots.map((slot) => {
          const isFilled = !!placed[slot.id];
          const isShaking = shakeSlotId === slot.id;
          return (
            <li key={slot.id}>
              <button
                type="button"
                onClick={() => handleTapSlot(slot.id)}
                disabled={disabled || isFilled}
                aria-label={isFilled ? `${formatKoreanTime(slot.time)}, ${slot.label} 완료` : `${formatKoreanTime(slot.time)}에 카드 놓기`}
                className={`w-full flex items-center gap-3 rounded-2xl border-2 px-4 py-2.5 transition-colors ${
                  isFilled
                    ? "bg-[#eafbf1] border-[#6fcf97]"
                    : isShaking
                      ? `bg-[#fff1da] border-[#ff8a5c] ${reduceMotion ? "" : "animate-[shake_0.4s_ease-in-out]"}`
                      : "bg-[var(--color-card)] border-[#f1e0c4] active:scale-[0.98]"
                }`}
              >
                <span className="w-16 shrink-0 text-left font-extrabold text-[var(--color-ink-soft)] tabular-nums">
                  {formatKoreanTime(slot.time)}
                </span>
                {isFilled ? (
                  <span className="flex items-center gap-2 font-bold text-[#2f7d55]">
                    <Icon name={slot.icon} size={22} />
                    {slot.label}
                    <Icon name="check" size={16} />
                  </span>
                ) : (
                  <span className="flex-1 text-left text-[var(--color-ink-soft)] font-semibold opacity-60">무엇을 할까요?</span>
                )}
              </button>
            </li>
          );
        })}
      </ol>

      {remaining.length > 0 && (
        <div className="w-full max-w-sm">
          <p className="text-xs font-bold text-[var(--color-ink-soft)] mb-1.5 text-center">카드를 눌러 고른 뒤, 시간표에 놓아주세요</p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {remaining.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => handleSelectCard(card.id)}
                disabled={disabled}
                aria-pressed={selectedId === card.id}
                className={`flex items-center gap-1.5 rounded-2xl border-2 px-3 py-2 font-bold transition-transform active:scale-95 ${
                  selectedId === card.id
                    ? "bg-[#ffe8a3] border-[#ffb703] scale-105"
                    : "bg-[var(--color-card)] border-[#f1e0c4]"
                }`}
              >
                <Icon name={card.icon} size={20} />
                {card.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
