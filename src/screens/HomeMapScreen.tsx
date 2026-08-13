import { STAGES } from "../data/stages";
import { useGame } from "../state/GameContext";
import type { StageId } from "../types";
import { Icon } from "../components/Icon";
import { StarCounter } from "../components/ui/StarCounter";
import { WetyCharacter } from "../components/WetyCharacter";
import { playTap } from "../lib/audio";
import { withAYa } from "../lib/korean";

interface HomeMapScreenProps {
  onPlayStage: (stageId: StageId) => void;
  onOpenRoom: () => void;
  onOpenSettings: () => void;
}

export function HomeMapScreen({ onPlayStage, onOpenRoom, onOpenSettings }: HomeMapScreenProps) {
  const { state } = useGame();
  const name = state.childName || "친구";

  return (
    <div className="relative min-h-full flex flex-col bg-[var(--color-cream)]">
      <header className="flex items-center justify-between px-4 pt-4 safe-top">
        <button
          type="button"
          onClick={() => {
            playTap();
            onOpenSettings();
          }}
          aria-label="부모님 설정 열기"
          className="flex items-center justify-center h-11 w-11 rounded-full bg-white border-2 border-[#f1e0c4] shadow-[0_3px_0_#f1e0c4] active:translate-y-0.5"
        >
          <Icon name="settings" size={22} />
        </button>
        <StarCounter count={state.starBalance} />
      </header>

      <div className="flex items-center gap-3 px-5 pt-4 pb-2">
        <WetyCharacter mood="idle" size={64} />
        <div>
          <p className="text-lg font-black text-[var(--color-ink)]">{withAYa(name)}, 안녕!</p>
          <p className="text-sm font-bold text-[var(--color-ink-soft)]">오늘은 어떤 시간을 배워볼까요?</p>
        </div>
      </div>

      <main className="flex-1 px-4 pb-24 overflow-y-auto">
        <ol className="relative flex flex-col gap-2 pl-2">
          {STAGES.map((stage, i) => {
            const progress = state.stageProgress[stage.id];
            const isLast = i === STAGES.length - 1;
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
                  onClick={() => {
                    playTap();
                    onPlayStage(stage.id);
                  }}
                  aria-label={`${stage.title} 시작하기`}
                  className="flex-1 mb-3 flex items-center justify-between gap-3 rounded-3xl border-2 px-4 py-3.5 text-left transition-transform bg-[var(--color-card)] border-[#f1e0c4] active:scale-[0.98] shadow-[0_4px_0_#f1e0c4]"
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
      </main>

      <button
        type="button"
        onClick={() => {
          playTap();
          onOpenRoom();
        }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 whitespace-nowrap rounded-full bg-[#8fd3e8] border-2 border-[#bfe6f2] px-6 py-3.5 font-extrabold text-[#1f4a57] shadow-[0_5px_0_#4fa8c2] active:translate-y-1 active:shadow-[0_1px_0_#4fa8c2] safe-bottom"
      >
        <Icon name="home" size={20} />
        웨티의 방 꾸미기
      </button>
    </div>
  );
}
