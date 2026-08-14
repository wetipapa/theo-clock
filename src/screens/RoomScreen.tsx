import { useEffect, useRef, useState } from "react";
import { REWARD_ITEMS } from "../data/rewards";
import { useGame } from "../state/GameContext";
import { Icon } from "../components/Icon";
import { StarCounter } from "../components/ui/StarCounter";
import { WetiCharacter } from "../components/WetiCharacter";
import { Confetti } from "../components/ui/Confetti";
import { playReward } from "../lib/audio";
import { withEulReul } from "../lib/korean";
import type { RewardItem } from "../types";

/** 미리보기 박스에서 바닥이 시작되는 높이(아래에서부터 %) */
const FLOOR_TOP = 30;
/** 바닥 물건이 서는 선(아래에서부터 %) — 바닥면보다 조금 앞쪽 */
const FLOOR_LINE = 13;

function RoomItem({ item, popping }: { item: RewardItem; popping: boolean }) {
  const anim = popping ? "animate-[pop-in_0.5s_ease-out]" : "";
  if (item.layer === "wall") {
    return (
      <div
        className={`absolute -translate-x-1/2 -translate-y-1/2 ${anim}`}
        style={{ left: `${item.x}%`, top: `${item.y}%` }}
      >
        <Icon name={item.icon} size={item.size} />
      </div>
    );
  }
  // 러그는 바닥에 깔리는 물건이라 캐릭터·다른 가구보다 뒤(아래)에 깐다.
  // 아이콘 원본(24칸 중 10칸 높이)을 그대로 키우면 두툼한 덩어리로 보여
  // 러그가 아니라 정체 불명의 물체가 되므로, 폭만 살리고 높이를 눌러 깐다.
  const isRug = item.id === "rug";
  return (
    <div
      className={`absolute ${anim}`}
      style={{
        left: `${item.x}%`,
        bottom: `${isRug ? FLOOR_LINE - 5 : FLOOR_LINE}%`,
        zIndex: isRug ? 1 : 3,
        transform: isRug ? "translateX(-50%) scaleY(0.42)" : "translateX(-50%)",
        transformOrigin: "bottom center",
      }}
    >
      <Icon name={item.icon} size={item.size} />
    </div>
  );
}

export function RoomScreen({ onBack }: { onBack: () => void }) {
  const { state, dispatch } = useGame();
  const [justUnlocked, setJustUnlocked] = useState<string | null>(null);
  // 연달아 사면 앞 타이머가 살아남아 방금 산 물건의 안내 문구를 지워 버렸다.
  const clearTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(clearTimer.current), []);
  const reduceMotion = state.settings.reduceMotion;

  const unlocked = REWARD_ITEMS.filter((item) => state.unlockedRewardIds.includes(item.id));
  const justUnlockedItem = REWARD_ITEMS.find((item) => item.id === justUnlocked);

  const handleUnlock = (id: string, cost: number) => {
    if (state.starBalance < cost) {
      return;
    }
    dispatch({ type: "UNLOCK_REWARD", rewardId: id });
    playReward();
    setJustUnlocked(id);
    window.clearTimeout(clearTimer.current);
    clearTimer.current = window.setTimeout(() => setJustUnlocked(null), 2200);
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
        <h1 className="font-black text-lg text-[var(--color-ink)]">내 방 꾸미기</h1>
        <StarCounter count={state.starBalance} />
      </header>

      {/* 방 미리보기 — 산 물건이 여기에 바로 나타나야 "샀다"는 게 느껴진다 */}
      <div
        className="relative mx-4 mt-4 h-64 sm:h-72 rounded-[32px] overflow-hidden border-4 border-[#f1e0c4]"
        style={{ background: "linear-gradient(180deg,#fff1dc 0%,#fff8ee 55%)" }}
      >
        {/* 바닥 */}
        <div className="absolute inset-x-0 bottom-0" style={{ height: `${FLOOR_TOP}%`, background: "#e8c893" }} />
        <div className="absolute inset-x-0" style={{ bottom: `${FLOOR_TOP}%`, height: 4, background: "#d3ab72" }} />

        {unlocked.map((item) => (
          <RoomItem key={item.id} item={item} popping={!reduceMotion && justUnlocked === item.id} />
        ))}

        <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: `${FLOOR_LINE - 3}%`, zIndex: 2 }}>
          <WetiCharacter mood="happy" size={76} />
        </div>

        {unlocked.length === 0 && (
          <p className="absolute inset-x-0 top-5 text-center text-sm font-bold text-[#b79a6a]">
            아직 텅 비었어요
          </p>
        )}

        <Confetti active={!!justUnlocked} reduceMotion={reduceMotion} count={14} />
      </div>

      <p
        aria-live="polite"
        className={`text-center text-sm font-black mt-3 px-6 min-h-5 ${
          justUnlockedItem ? "text-[#2f7d55]" : "text-[var(--color-ink-soft)]"
        }`}
      >
        {justUnlockedItem
          ? `${withEulReul(justUnlockedItem.label)} 방에 놓았어요!`
          : "별을 모아서 방을 예쁘게 꾸며주세요!"}
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
