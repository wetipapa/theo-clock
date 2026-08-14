import { useState } from "react";
import { STAGES } from "../data/stages";
import { useGame } from "../state/GameContext";
import { Icon } from "../components/Icon";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { WetiCharacter } from "../components/WetiCharacter";
import { playTap } from "../lib/audio";

export function ParentSettingsScreen({ onBack }: { onBack: () => void }) {
  const { state, dispatch } = useGame();
  const [confirmReset, setConfirmReset] = useState(false);

  const totalCompleted = Object.values(state.stageProgress).filter(Boolean).length;

  return (
    <div className="relative min-h-full flex flex-col bg-[var(--color-cream)]">
      <header className="flex items-center gap-3 px-4 pt-4 safe-top">
        <button
          type="button"
          onClick={onBack}
          aria-label="홈으로 돌아가기"
          className="flex items-center justify-center h-11 w-11 rounded-full bg-white border-2 border-[#f1e0c4] shadow-[0_3px_0_#f1e0c4] active:translate-y-0.5"
        >
          <Icon name="arrow" className="rotate-180" size={20} />
        </button>
        <h1 className="font-black text-lg text-[var(--color-ink)]">부모님 설정</h1>
      </header>

      <main className="flex-1 px-4 py-4 overflow-y-auto flex flex-col gap-4 max-w-md w-full mx-auto">
        {/* 부모용 화면이라 웨티아빠가 안내를 맡는다. 아이가 노는 화면에는 웨티만 나온다. */}
        <div className="flex items-center gap-3 px-1">
          <WetiCharacter papa size={52} />
          <p className="text-sm font-bold leading-snug text-[var(--color-ink-soft)]">
            여기는 부모님을 위한 화면이에요.
            <br />
            아이가 노는 화면은 그대로 두고 설정만 바꿀 수 있어요.
          </p>
        </div>

        {/* 사운드 */}
        <Card className="p-4 flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-[var(--color-ink)]">효과음</h2>
            <p className="text-xs font-bold text-[var(--color-ink-soft)]">버튼, 정답, 보상 소리를 켜고 꺼요</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={state.settings.soundOn}
            onClick={() => {
              dispatch({ type: "SET_SOUND", on: !state.settings.soundOn });
              if (!state.settings.soundOn) playTap();
            }}
            className={`relative h-8 w-14 rounded-full transition-colors ${state.settings.soundOn ? "bg-[#6fcf97]" : "bg-[#e8dcc8]"}`}
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${state.settings.soundOn ? "translate-x-7" : "translate-x-1"}`}
            />
          </button>
        </Card>

        {/* 움직임 줄이기 */}
        <Card className="p-4 flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-[var(--color-ink)]">움직임 줄이기</h2>
            <p className="text-xs font-bold text-[var(--color-ink-soft)]">애니메이션과 효과를 최소화해요</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={state.settings.reduceMotion}
            onClick={() => dispatch({ type: "SET_REDUCE_MOTION", on: !state.settings.reduceMotion })}
            className={`relative h-8 w-14 rounded-full transition-colors ${state.settings.reduceMotion ? "bg-[#6fcf97]" : "bg-[#e8dcc8]"}`}
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${state.settings.reduceMotion ? "translate-x-7" : "translate-x-1"}`}
            />
          </button>
        </Card>

        {/* 진행도 */}
        <Card className="p-4 flex flex-col gap-2">
          <h2 className="font-extrabold text-[var(--color-ink)]">학습 진행도</h2>
          <p className="text-sm font-bold text-[var(--color-ink-soft)]">
            완료한 스테이지 {totalCompleted}/{STAGES.length} · 모은 별 {state.starsLifetime}개
          </p>
          <ul className="flex flex-col gap-1.5 mt-1">
            {STAGES.map((s) => {
              const p = state.stageProgress[s.id];
              return (
                <li key={s.id} className="flex items-center justify-between text-sm">
                  <span className="font-bold text-[var(--color-ink)]">{s.title}</span>
                  {p ? (
                    <span className="flex items-center gap-1 text-[#c2830f] font-black">
                      <Icon name="star" size={14} /> {p.bestStars}
                    </span>
                  ) : (
                    <span className="text-[var(--color-ink-soft)] font-bold">-</span>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="text-xs font-bold text-[var(--color-ink-soft)]">모든 단계는 처음부터 자유롭게 선택할 수 있어요.</p>
        </Card>


        {/* 초기화 */}
        <Card className="p-4 flex flex-col gap-2.5 border-[#ffb3a1]">
          <h2 className="font-extrabold text-[#c2452f]">기록 초기화</h2>
          <p className="text-xs font-bold text-[var(--color-ink-soft)]">모든 별, 진행도, 꾸미기 아이템이 사라져요.</p>
          {confirmReset ? (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="primary"
                className="!bg-[#e0503a] !shadow-[0_6px_0_#a83a28]"
                onClick={() => {
                  dispatch({ type: "RESET_PROGRESS" });
                  setConfirmReset(false);
                }}
              >
                정말 초기화할게요
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setConfirmReset(false)}>
                취소
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="soft" className="self-start" onClick={() => setConfirmReset(true)}>
              초기화하기
            </Button>
          )}
        </Card>
      </main>
    </div>
  );
}
