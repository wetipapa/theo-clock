import { useEffect, useRef, useState } from "react";
import { REWARD_ITEMS } from "../data/rewards";
import { useGame } from "../state/GameContext";
import { Icon } from "../components/Icon";
import { StarCounter } from "../components/ui/StarCounter";
import { Confetti } from "../components/ui/Confetti";
import { playReward } from "../lib/audio";
import { withEulReul } from "../lib/korean";
import type { RewardItem } from "../types";
import wetiFullbody from "../assets/characters/weti-fullbody.png";

/** 방 높이 대비 웨티 키(%). 물건 크기는 전부 이 키를 기준으로 계산한다 */
const WETI_H_PCT = 40;
/** 바닥면이 시작되는 높이 = 벽과 바닥이 만나는 선(아래에서부터 %) */
const FLOOR_TOP = 34;
/** 앞줄 물건이 서는 선(아래에서부터 %) */
const FLOOR_LINE = 12;
/**
 * 벽에 붙는 뒷줄 가구가 서는 선.
 * 벽과 바닥이 만나는 선에 딱 세워야 "벽에 붙어 있다"로 읽힌다.
 * 앞줄과 높이가 비슷하면 전부 한 덩어리로 뭉쳐 보인다.
 */
const FLOOR_LINE_BACK = FLOOR_TOP;

/** 컨테이너의 실제 픽셀 크기. 물건 크기를 방 크기에 맞춰 계산하려면 필요하다 */
function useBoxSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: width, h: height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return size;
}

function RoomItem({ item, boxH, popping }: { item: RewardItem; boxH: number; popping: boolean }) {
  const [ax0, ay0, ax1, ay1] = item.art;
  const artH = ay1 - ay0;
  // 그리고 싶은 실제 높이에서 거꾸로 아이콘 뷰박스 크기를 구한다
  const size = (item.scale * boxH * (WETI_H_PCT / 100) * 24) / artH;
  const artCx = ((ax0 + ax1) / 2 / 24) * size; // svg 왼쪽 끝에서 그림 한가운데까지
  const artBottom = (ay1 / 24) * size; // svg 위쪽 끝에서 그림 밑단까지
  const gapBelow = size - artBottom; // 그림 밑단 아래로 남는 빈 공간

  const anim = popping ? "animate-[pop-in_0.5s_ease-out]" : "";
  const inner = (
    <div
      style={
        item.squashY
          ? { transform: `scaleY(${item.squashY})`, transformOrigin: `50% ${artBottom}px` }
          : undefined
      }
    >
      <Icon name={item.icon} size={size} />
    </div>
  );

  if (item.layer === "wall") {
    const artCy = ((ay0 + ay1) / 2 / 24) * size;
    return (
      <div
        className={`absolute ${anim}`}
        style={{ left: `${item.x}%`, top: `${item.y}%`, transform: `translate(${-artCx}px, ${-artCy}px)` }}
      >
        {inner}
      </div>
    );
  }

  const back = item.layer === "floorBack";
  return (
    <div
      className={`absolute ${anim}`}
      style={{
        left: `${item.x}%`,
        bottom: `${back ? FLOOR_LINE_BACK : FLOOR_LINE}%`,
        // 그림 밑단이 정확히 바닥선에 오도록, 아래 빈 공간만큼 내려 준다
        transform: `translate(${-artCx}px, ${gapBelow}px)`,
        // 벽 가구는 웨티 뒤, 러그처럼 바닥에 깔리는 것도 뒤, 나머지 작은 물건은 앞
        zIndex: back || item.squashY ? 1 : 3,
      }}
    >
      {inner}
    </div>
  );
}

export function RoomScreen({ onBack }: { onBack: () => void }) {
  const { state, dispatch } = useGame();
  const [justUnlocked, setJustUnlocked] = useState<string | null>(null);
  // 연달아 사면 앞 타이머가 살아남아 방금 산 물건의 안내 문구를 지워 버렸다.
  const clearTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(clearTimer.current), []);
  const roomRef = useRef<HTMLDivElement>(null);
  const box = useBoxSize(roomRef);
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
    <div className="theme-service relative h-full flex flex-col bg-[var(--color-cream)]">
      <header className="flex items-center justify-between px-4 pt-4 safe-top">
        <button
          type="button"
          onClick={onBack}
          aria-label="홈으로 돌아가기"
          className="flex items-center justify-center h-11 w-11 rounded-full bg-white border-2 border-[var(--color-line)] shadow-[0_3px_0_var(--color-line)] active:translate-y-0.5"
        >
          <Icon name="arrow" className="rotate-180" size={20} />
        </button>
        <h1 className="font-black text-lg text-[var(--color-ink)]">내 방 꾸미기</h1>
        <StarCounter count={state.starBalance} />
      </header>

      {/* 방 미리보기 — 산 물건이 여기에 바로 나타나야 "샀다"는 게 느껴진다 */}
      <div
        ref={roomRef}
        className="relative mx-4 mt-4 h-72 sm:h-80 shrink-0 rounded-[32px] overflow-hidden border-4 border-[var(--color-line)]"
        style={{ background: "linear-gradient(180deg,#fff1dc 0%,#fff8ee 55%)" }}
      >
        <div className="absolute inset-x-0 bottom-0" style={{ height: `${FLOOR_TOP}%`, background: "#e8c893" }} />
        <div className="absolute inset-x-0" style={{ bottom: `${FLOOR_TOP}%`, height: 4, background: "#d3ab72" }} />

        {box.h > 0 &&
          unlocked.map((item) => (
            <RoomItem
              key={item.id}
              item={item}
              boxH={box.h}
              popping={!reduceMotion && justUnlocked === item.id}
            />
          ))}

        <img
          src={wetiFullbody}
          alt="자기 방에 서 있는 웨티"
          draggable={false}
          className="absolute left-1/2 -translate-x-1/2"
          style={{ bottom: `${FLOOR_LINE}%`, height: `${WETI_H_PCT}%`, width: "auto", zIndex: 2 }}
        />

        {unlocked.length === 0 && (
          <p className="absolute inset-x-0 top-5 text-center text-sm font-bold text-[#b79a6a]">아직 텅 비었어요</p>
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

      <main className="flex-1 min-h-0 px-4 py-4 overflow-y-auto">
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
