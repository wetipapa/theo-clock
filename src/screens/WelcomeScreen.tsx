import { useState } from "react";
import { WetyCharacter } from "../components/WetyCharacter";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { SceneBackground } from "../components/SceneBackground";
import { AnalogClock } from "../components/clock/AnalogClock";
import { unlockAudio, playTap } from "../lib/audio";

interface WelcomeScreenProps {
  onDone: (name: string) => void;
  reduceMotion: boolean;
}

export function WelcomeScreen({ onDone, reduceMotion }: WelcomeScreenProps) {
  const [step, setStep] = useState<0 | 1>(0);
  const [name, setName] = useState("");

  const handleNameSubmit = () => {
    unlockAudio();
    playTap();
    const trimmed = name.trim().slice(0, 8);
    setName(trimmed);
    setStep(1);
  };

  return (
    <div className="relative min-h-full flex flex-col overflow-hidden">
      <SceneBackground sceneId="home-morning" />
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-6 px-6 py-10 safe-top safe-bottom">
        {step === 0 ? (
          <>
            <WetyCharacter mood="happy" size={130} bounce={!reduceMotion} />
            <div className="text-center">
              <h1 className="text-2xl font-black text-[var(--color-ink)]">웨티의 시간 대작전</h1>
              <p className="mt-1 font-bold text-[var(--color-ink-soft)]">시계 읽기와 친해지는 하루 이야기</p>
            </div>
            <Card className="w-full max-w-sm px-6 py-6 flex flex-col items-center gap-4">
              <label htmlFor="child-name" className="font-extrabold text-[var(--color-ink)] text-center">
                내 이름을 알려줄래요?
              </label>
              <input
                id="child-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && name.trim() && handleNameSubmit()}
                maxLength={8}
                placeholder="예: 지우"
                className="w-full h-14 rounded-2xl border-2 border-[#f1e0c4] bg-[#fffaf1] px-4 text-center text-xl font-extrabold text-[var(--color-ink)] outline-none focus:border-[#ff8a5c]"
                aria-label="아이 이름 입력"
              />
              <Button variant="primary" size="lg" className="w-full" onClick={handleNameSubmit} disabled={!name.trim()}>
                다음
              </Button>
            </Card>
          </>
        ) : (
          <TutorialStep name={name.trim() || "친구"} onStart={() => onDone(name.trim() || "친구")} reduceMotion={reduceMotion} />
        )}
      </div>
    </div>
  );
}

function TutorialStep({ name, onStart, reduceMotion }: { name: string; onStart: () => void; reduceMotion: boolean }) {
  return (
    <>
      <h2 className="text-xl font-black text-[var(--color-ink)] text-center text-balance">
        {name}야, 만나서 반가워요! 시곗바늘을 손가락으로 쓱 돌려서 시간을 맞춰봐요.
      </h2>
      <Card className="px-8 py-6 flex flex-col items-center gap-3">
        <div className="w-40">
          <AnalogClock value={{ hour: 8, minute: 0 }} interactive={false} showLegend reduceMotion={reduceMotion} />
        </div>
        <p className="text-sm font-bold text-[var(--color-ink-soft)] text-center">
          정답을 맞히면 웨티가 다음 장소로 이동해요!
        </p>
      </Card>
      <Button variant="primary" size="lg" onClick={onStart} aria-label="게임 시작하기">
        시작할래요!
      </Button>
    </>
  );
}
