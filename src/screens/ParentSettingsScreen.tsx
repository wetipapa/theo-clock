import { useState } from "react";
import { STAGES } from "../data/stages";
import { useGame } from "../state/GameContext";
import { Icon } from "../components/Icon";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { playTap } from "../lib/audio";
import type { CustomScheduleEntry } from "../state/gameState";

const MINUTE_OPTIONS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

export function ParentSettingsScreen({ onBack }: { onBack: () => void }) {
  const { state, dispatch } = useGame();
  const [nameDraft, setNameDraft] = useState(state.childName);
  const [confirmReset, setConfirmReset] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newHour, setNewHour] = useState(8);
  const [newMinute, setNewMinute] = useState(0);

  const totalCompleted = Object.values(state.stageProgress).filter(Boolean).length;

  const handleAddCustomEntry = () => {
    const label = newLabel.trim().slice(0, 12);
    if (!label) return;
    const entry: CustomScheduleEntry = { id: `custom-${Date.now()}`, label, time: { hour: newHour, minute: newMinute } };
    dispatch({ type: "SET_CUSTOM_SCHEDULE", entries: [...state.customSchedule, entry].slice(0, 5) });
    setNewLabel("");
  };

  const handleRemoveCustomEntry = (id: string) => {
    dispatch({ type: "SET_CUSTOM_SCHEDULE", entries: state.customSchedule.filter((e) => e.id !== id) });
  };

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
        {/* 이름 변경 */}
        <Card className="p-4 flex flex-col gap-2.5">
          <h2 className="font-extrabold text-[var(--color-ink)]">아이 이름</h2>
          <div className="flex gap-2">
            <input
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              maxLength={8}
              className="flex-1 h-11 rounded-xl border-2 border-[#f1e0c4] bg-[#fffaf1] px-3 font-bold text-[var(--color-ink)] outline-none focus:border-[#ff8a5c]"
              aria-label="아이 이름 수정"
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                const trimmed = nameDraft.trim();
                if (trimmed) dispatch({ type: "SET_CHILD_NAME", name: trimmed });
              }}
            >
              저장
            </Button>
          </div>
        </Card>

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

        {/* 우리 아이 일정 커스텀 */}
        <Card className="p-4 flex flex-col gap-2.5">
          <h2 className="font-extrabold text-[var(--color-ink)]">우리 아이 일정 (선택)</h2>
          <p className="text-xs font-bold text-[var(--color-ink-soft)]">
            아이의 실제 일정을 몇 가지 적어두면 기록으로 남아요.
          </p>
          {state.customSchedule.length > 0 && (
            <ul className="flex flex-col gap-1.5">
              {state.customSchedule.map((entry) => (
                <li key={entry.id} className="flex items-center justify-between rounded-xl bg-[#fffaf1] border border-[#f1e0c4] px-3 py-2">
                  <span className="font-bold text-sm text-[var(--color-ink)]">
                    {entry.label} · {entry.time.hour}시 {entry.time.minute > 0 ? `${entry.time.minute}분` : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomEntry(entry.id)}
                    aria-label={`${entry.label} 삭제`}
                    className="text-xs font-black text-[#ff6b57]"
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          )}
          {state.customSchedule.length < 5 && (
            <div className="flex flex-wrap gap-2 items-center">
              <input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="예: 피아노"
                maxLength={12}
                className="flex-1 min-w-24 h-10 rounded-xl border-2 border-[#f1e0c4] bg-[#fffaf1] px-2.5 text-sm font-bold outline-none focus:border-[#ff8a5c]"
                aria-label="일정 이름"
              />
              <select
                value={newHour}
                onChange={(e) => setNewHour(Number(e.target.value))}
                className="h-10 rounded-xl border-2 border-[#f1e0c4] bg-[#fffaf1] px-1.5 text-sm font-bold"
                aria-label="시"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={h}>
                    {h}시
                  </option>
                ))}
              </select>
              <select
                value={newMinute}
                onChange={(e) => setNewMinute(Number(e.target.value))}
                className="h-10 rounded-xl border-2 border-[#f1e0c4] bg-[#fffaf1] px-1.5 text-sm font-bold"
                aria-label="분"
              >
                {MINUTE_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}분
                  </option>
                ))}
              </select>
              <Button size="sm" variant="secondary" onClick={handleAddCustomEntry} disabled={!newLabel.trim()}>
                추가
              </Button>
            </div>
          )}
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
