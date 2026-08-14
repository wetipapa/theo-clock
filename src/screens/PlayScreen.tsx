import { useState } from "react";
import { HubLink } from "../components/HubLink";
import { getStage } from "../data/stages";
import { getDayEvent } from "../data/schedule";
import { generateStageProblems } from "../lib/problemGenerator";
import { createRng } from "../lib/rng";
import { randomPraise } from "../lib/hints";
import { playCorrect, playFanfare } from "../lib/audio";
import { useGame } from "../state/GameContext";
import type { StageId } from "../types";
import { SceneBackground } from "../components/SceneBackground";
import { WetiCharacter } from "../components/WetiCharacter";
import { StarCounter } from "../components/ui/StarCounter";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/Icon";
import { HandsChallenge } from "../components/game/HandsChallenge";
import { ChooseClockGame } from "../components/game/ChooseClockGame";
import { FeedbackOverlay } from "../components/game/FeedbackOverlay";
import type { Problem, StageConfig } from "../types";

interface PlayScreenProps {
  stageId: StageId;
  onExit: () => void;
  onStageComplete: (stageId: StageId, starsEarned: number) => void;
}

const STAGE_COMPLETE_BONUS = 2;

export function PlayScreen({ stageId, onExit, onStageComplete }: PlayScreenProps) {
  const { state, dispatch } = useGame();
  const stage = getStage(stageId);
  const dayEvent = getDayEvent(stage.dayEventId);
  const reduceMotion = state.settings.reduceMotion;

  const [problems] = useState(() => generateStageProblems(stage, dayEvent, createRng(Date.now() + Math.random() * 1e6)));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [sessionStars, setSessionStars] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [praise, setPraise] = useState("");
  const [feedbackStars, setFeedbackStars] = useState(0);
  const [feedbackAction, setFeedbackAction] = useState<string | undefined>(undefined);
  const [complete, setComplete] = useState(false);

  const totalUnits = problems.length;
  const currentUnit = currentIndex;

  const handleWrongAttempt = () => setWrongAttempts((n) => n + 1);

  const finalize = (finalStars: number) => {
    const totalStars = finalStars + STAGE_COMPLETE_BONUS;
    dispatch({ type: "COMPLETE_STAGE", stageId, starsEarned: totalStars });
    playFanfare();
    setComplete(true);
    setSessionStars(totalStars);
  };

  const handleCorrect = () => {
    const earned = wrongAttempts === 0 ? 2 : 1;
    setSessionStars((s) => s + earned);
    setFeedbackStars(earned);
    setPraise(randomPraise());
    const problem = problems[currentIndex];
    setFeedbackAction(problem.isFinal ? dayEvent.actionText : undefined);
    playCorrect();
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setWrongAttempts(0);
    if (currentIndex + 1 >= problems.length) {
      finalize(sessionStars);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  if (complete) {
    return (
      <StageCompleteView
        stage={stage}
        starsEarned={sessionStars}
        onContinue={() => onStageComplete(stageId, sessionStars)}
        reduceMotion={reduceMotion}
      />
    );
  }

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      <SceneBackground sceneId={dayEvent.sceneId} />

      <header className="relative z-10 flex items-center justify-between px-4 pt-4 safe-top">
        <button
          type="button"
          onClick={onExit}
          aria-label="스테이지 나가기"
          className="flex items-center justify-center h-11 w-11 rounded-full bg-[var(--color-card)]/90 border-2 border-[#f1e0c4] shadow-[0_3px_0_#f1e0c4] active:translate-y-0.5"
        >
          <Icon name="arrow" className="rotate-180" size={20} />
        </button>
        <StarCounter count={sessionStars} />
      </header>

      <div className="relative z-10 flex justify-center gap-1.5 mt-3" aria-label={`${currentUnit}/${totalUnits} 진행`}>
        {Array.from({ length: totalUnits }).map((_, i) => (
          <span
            key={i}
            className={`h-2.5 rounded-full transition-all ${i < currentUnit ? "w-6 bg-[#6fcf97]" : i === currentUnit ? "w-6 bg-[#ffd166]" : "w-2.5 bg-white/60"}`}
          />
        ))}
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center gap-5 px-4 py-6">
        <ProblemView
          problem={problems[currentIndex]}
          disabled={showFeedback}
          reduceMotion={reduceMotion}
          onCorrect={handleCorrect}
          onWrongAttempt={handleWrongAttempt}
        />
      </main>

      <FeedbackOverlay
        show={showFeedback}
        praise={praise}
        starsEarned={feedbackStars}
        actionText={feedbackAction}
        reduceMotion={reduceMotion}
        onNext={handleNext}
      />
    </div>
  );
}

function ProblemView({
  problem,
  disabled,
  reduceMotion,
  onCorrect,
  onWrongAttempt,
}: {
  problem: Problem;
  disabled: boolean;
  reduceMotion: boolean;
  onCorrect: () => void;
  onWrongAttempt: () => void;
}) {
  if (problem.mode === "set-hands") {
    return (
      <HandsChallenge
        problemKey={problem.id}
        grid={problem.grid}
        target={problem.target}
        promptText={problem.promptText}
        disabled={disabled}
        reduceMotion={reduceMotion}
        onCorrect={onCorrect}
        onWrongAttempt={onWrongAttempt}
      />
    );
  }
  if (problem.mode === "choose-clock") {
    return (
      <ChooseClockGame
        problemKey={problem.id}
        promptText={problem.promptText}
        options={problem.options}
        correctIndex={problem.correctIndex}
        disabled={disabled}
        reduceMotion={reduceMotion}
        onCorrect={onCorrect}
        onWrongAttempt={onWrongAttempt}
      />
    );
  }
  if (problem.mode === "time-flow") {
    return (
      <HandsChallenge
        problemKey={problem.id}
        grid={problem.grid}
        target={problem.target}
        promptText={problem.promptText}
        referenceTime={problem.start}
        referenceLabel="지금"
        disabled={disabled}
        reduceMotion={reduceMotion}
        onCorrect={onCorrect}
        onWrongAttempt={onWrongAttempt}
      />
    );
  }
  return null;
}

function StageCompleteView({
  stage,
  starsEarned,
  onContinue,
  reduceMotion,
}: {
  stage: StageConfig;
  starsEarned: number;
  onContinue: () => void;
  reduceMotion: boolean;
}) {
  return (
    <div className="relative flex flex-col items-center justify-center h-full gap-5 px-6 text-center overflow-hidden">
      <SceneBackground sceneId="home-morning" />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <WetiCharacter mood="excited" size={150} animate={!reduceMotion} />
        <h1 className="text-2xl font-black text-[var(--color-ink)]">{stage.title} 완료!</h1>
        <p className="font-bold text-[var(--color-ink-soft)] max-w-xs text-balance">
          정말 잘했어요! 이제 {stage.title}, 문제없어요!
        </p>
        <div className="flex items-center gap-2 text-[#c2830f] font-black text-2xl">
          <Icon name="star" size={30} />+{starsEarned}
        </div>
        <Button variant="primary" size="lg" onClick={onContinue}>
          계속하기
        </Button>
        <HubLink className="pt-1" />
      </div>
    </div>
  );
}
