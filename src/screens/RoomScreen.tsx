import { useState } from "react";
import { REWARD_ITEMS } from "../data/rewards";
import { useGame } from "../state/GameContext";
import { Icon } from "../components/Icon";
import { StarCounter } from "../components/ui/StarCounter";
import { WetyCharacter } from "../components/WetyCharacter";
import { Confetti } from "../components/ui/Confetti";
import { playReward, playTap } from "../lib/audio";

export function RoomScreen({ onBack }: { onBack: () => void }) {
  const { state, dispatch } = useGame();
  const [justUnlocked, setJustUnlocked] = useState<string | null>(null);
  const reduceMotion = state.settings.reduceMotion;

  const handleUnlock = (id: string, cost: number) => {
    if (state.starBalance < cost) {
      playTap();
      return;
    }
    dispatch({ type: "UNLOCK_REWARD", rewardId: id });
    playReward();
    setJustUnlocked(id);
    window.setTimeout(() => setJustUnlocked(null), 1000);
  };

  return (
    <div className="relative min-h-full flex flex-col bg-[var(--color-cream)]">
      <header className="flex items-center justify-between px-4 pt-4 safe-top">
        <button
          type="button"
          onClick={onBack}
          aria-label="홈으로 돌아가기"
          className="flex items-center justify-center h-11 w-11 rounded-full bg-white border-2 border-[#f1e0c4] shadow-[0_3px_0_#f1e0c4] active:translate-y-0.5"
        >
          <Icon name="arrow" className="rotate-180" size={20} />
        </button>
        <h1 className="font-black text-lg text-[var(--color-ink)]">웨티의 방</h1>
        <StarCounter count={state.starBalance} />
      </header>

      {/* 방 미리보기 */}
      <div className="relative mx-4 mt-4 h-60 sm:h-72 rounded-[32px] overflow-hidden border-4 border-[#f1e0c4]" style={{ background: "linear-gradient(180deg,#ffe8c9 0%,#fff6ea 60%,#f0dcb8 100%)" }}>
        <div className="absolute inset-x-0 bottom-0 h-1/4" style={{ background: "#e3c48f" }} />
        {REWARD_ITEMS.filter((item) => state.unlockedRewardIds.includes(item.id)).map((item) => (
          <div
            key={item.id}
            className={`absolute -translate-x-1/2 -translate-y-1/2 ${!reduceMotion && justUnlocked === item.id ? "animate-[pop-in_0.5s_ease-out]" : ""}`}
            style={{ left: `${item.position.x}%`, top: `${item.position.y}%` }}
          >
            <Icon name={item.icon} size={40} />
          </div>
        ))}
        <div className="absolute left-1/2 bottom-2 -translate-x-1/2">
          <WetyCharacter mood="happy" size={72} />
        </div>
        <Confetti active={!!justUnlocked} reduceMotion={reduceMotion} count={14} />
      </div>

      <p className="text-center text-sm font-bold text-[var(--color-ink-soft)] mt-3 px-6">
        별을 모아서 웨티의 방을 예쁘게 꾸며주세요!
      </p>

      <main className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {REWARD_ITEMS.map((item) => {
            const owned = state.unlockedRewardIds.includes(item.id);
            const affordable = state.starBalance >= item.cost;
            return (
              <button
                key={item.id}
                type="button"
                disabled={owned || !affordable}
                onClick={() => handleUnlock(item.id, item.cost)}
                aria-label={owned ? `${item.label}, 보유중` : `${item.label}, 별 ${item.cost}개로 해금하기`}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-3.5 transition-transform ${
                  owned
                    ? "bg-[#eafbf1] border-[#6fcf97]"
                    : affordable
                      ? "bg-[var(--color-card)] border-[#ffd166] active:scale-95"
                      : "bg-[#f3ece0] border-[#e8dcc8] opacity-60"
                }`}
              >
                <Icon name={item.icon} size={32} />
                <span className="text-xs font-extrabold text-[var(--color-ink)] text-center">{item.label}</span>
                {owned ? (
                  <span className="flex items-center gap-1 text-xs font-black text-[#2f7d55]">
                    <Icon name="check" size={12} /> 보유중
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-black text-[#c2830f]">
                    <Icon name="star" size={12} /> {item.cost}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
