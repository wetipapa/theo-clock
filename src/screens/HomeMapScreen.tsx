import { useState } from "react";
import { STAGES, pickResumeStage } from "../data/stages";
import { useGame } from "../state/GameContext";
import type { StageId } from "../types";
import { Icon } from "../components/Icon";
import { StarCounter } from "../components/ui/StarCounter";
import sceneClock from "../assets/characters/weti-scene-clock.png";

interface HomeMapScreenProps {
  onPlayStage: (stageId: StageId) => void;
  onOpenRoom: () => void;
  onOpenSettings: () => void;
}

export function HomeMapScreen({ onPlayStage, onOpenRoom, onOpenSettings }: HomeMapScreenProps) {
  const { state } = useGame();
  // 6~8세가 "다음에 뭘 누를지"를 읽지 않고 알 수 있도록, 이어서 할 단계 하나를 크게 띄운다.
  // 단계 목록은 그대로 아래에 남겨 원하는 단계를 직접 고를 수도 있다.
  const resume = pickResumeStage(state.stageProgress);
  // 단계 목록은 접어 둔다. 형제 서비스(웨티 레이싱·구구단 팡팡)와 같은 구조로,
  // 첫 화면에서 가장 큰 것은 '시작하기'이고 고르는 일은 원할 때 펼쳐서 한다.
  const [stagesOpen, setStagesOpen] = useState(false);

  return (
    <div className="relative min-h-full flex flex-col bg-[var(--color-cream)]">
      <header className="flex items-center justify-between px-4 pt-4 safe-top">
        <button
          type="button"
          onClick={() => onOpenSettings()}
          aria-label="부모님 설정 열기"
          className="flex items-center justify-center h-11 w-11 rounded-full bg-white border-2 border-[#f1e0c4] shadow-[0_3px_0_#f1e0c4] active:translate-y-0.5"
        >
          <Icon name="settings" size={22} />
        </button>
        <StarCounter count={state.starBalance} />
      </header>

      <div className="flex flex-col items-center px-5 pt-1 pb-2">
        <img
          src={sceneClock}
          alt="벽시계를 올려다보는 웨티"
          className="h-[22vh] max-h-40 w-auto"
          draggable={false}
        />
        <p className="mt-1 text-xl font-black text-[var(--color-ink)]">안녕!</p>
        <p className="text-sm font-bold text-[var(--color-ink-soft)]">오늘은 어떤 시간을 배워볼까요?</p>
      </div>

      <div className="px-4 pb-1">
        <button
          type="button"
          onClick={() => onPlayStage(resume.stage.id)}
          aria-label={`${resume.stage.title} ${resume.isFirstTime ? "시작하기" : "다시 해보기"}`}
          className="w-full flex items-center gap-3 rounded-3xl bg-[var(--color-sunset)] px-5 py-4 text-left text-white shadow-[0_5px_0_var(--color-sunset-deep)] active:translate-y-1 active:shadow-[0_1px_0_var(--color-sunset-deep)] transition-transform"
        >
          <span className="flex items-center justify-center h-12 w-12 rounded-full bg-white/25 shrink-0">
            <Icon name={resume.stage.icon} size={24} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-black text-white/85">
              {resume.isFirstTime ? "여기부터 시작해요" : "다시 해볼까요?"}
            </span>
            <span className="block text-xl font-black truncate">{resume.stage.title}</span>
          </span>
          <span className="flex items-center justify-center h-11 w-11 rounded-full bg-white text-[var(--color-sunset)] shrink-0">
            <Icon name="arrow" size={20} />
          </span>
        </button>
      </div>

      <main className="flex-1 px-4 pb-6 overflow-y-auto">
        {/* 보조 행동 두 개를 나란히 둔다.
            방 꾸미기가 화면 맨 아래에 붙어 있을 때는 단계 목록을 접으면 한참 떨어져 있어
            있는지도 모르고 지나쳤다. */}
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setStagesOpen((v) => !v)}
            aria-expanded={stagesOpen}
            className="flex-1 rounded-2xl border-2 border-[#f1e0c4] bg-[var(--color-card)] px-3 py-3 text-sm font-black text-[var(--color-ink-soft)] shadow-[0_3px_0_#f1e0c4] active:translate-y-0.5"
          >
            단계 고르기 {stagesOpen ? "▴" : "▾"}
          </button>
          <button
            type="button"
            onClick={onOpenRoom}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl border-2 border-[#bfe6f2] bg-[#8fd3e8] px-3 py-3 text-sm font-black text-[#1f4a57] shadow-[0_3px_0_#4fa8c2] active:translate-y-0.5"
          >
            <Icon name="home" size={18} />
            방 꾸미기
          </button>
        </div>

        {stagesOpen && (
        <ol className="relative mt-3 flex flex-col gap-2 pl-2">
          {STAGES.map((stage, i) => {
            const progress = state.stageProgress[stage.id];
            const isLast = i === STAGES.length - 1;
            const isResume = stage.id === resume.stage.id;
            return (
              <li key={stage.id} className="relative flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full border-4 shrink-0 bg-[#ffd166] border-[#ffb703]">
                    <Icon name={stage.icon} size={22} />
                  </div>
                  {!isLast && <span className="w-1 flex-1 min-h-8 rounded-full bg-[#ffd166]" />}
                </div>

                <button
                  type="button"
                  onClick={() => onPlayStage(stage.id)}
                  aria-label={`${stage.title} 시작하기`}
                  className={`flex-1 mb-3 flex items-center justify-between gap-3 rounded-3xl border-2 px-4 py-3.5 text-left transition-transform bg-[var(--color-card)] active:scale-[0.98] ${
                    isResume
                      ? "border-[var(--color-sunset)] shadow-[0_4px_0_var(--color-sunset-deep)]"
                      : "border-[#f1e0c4] shadow-[0_4px_0_#f1e0c4]"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-extrabold text-[var(--color-ink)] truncate">{stage.title}</p>
                    <p className="text-xs font-bold text-[var(--color-ink-soft)] truncate">{stage.subtitle}</p>
                    {progress && (
                      <p className="mt-1 flex items-center gap-1 text-xs font-black text-[#c2830f]">
                        <Icon name="star" size={14} />
                        {progress.bestStars}
                      </p>
                    )}
                  </div>
                  <span className="flex items-center justify-center h-10 w-10 rounded-full bg-[#ff8a5c] text-white shrink-0">
                    <Icon name="arrow" size={18} />
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        )}
      </main>

    </div>
  );
}
