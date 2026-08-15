import { WetiCharacter } from "../components/WetiCharacter";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { SceneBackground } from "../components/SceneBackground";
import { AnalogClock } from "../components/clock/AnalogClock";
import { unlockAudio } from "../lib/audio";

interface WelcomeScreenProps {
  onDone: () => void;
  reduceMotion: boolean;
}

/**
 * 첫 방문 화면.
 *
 * 이름을 묻지 않는다. 기본값이 "웨티"라 처음 쓰는 아이에게 남의 이름으로 말을 거는 꼴이었고,
 * 시작 전에 무언가를 입력하게 하는 것 자체가 형제 서비스(레이싱·구구단 팡팡)와도 어긋난다.
 * 조작 설명 한 화면만 보여주고 바로 들여보낸다.
 *
 * **짧은 화면에서 `시작할래요!`가 잘리면 게임을 시작할 방법이 없다.**
 * iPhone SE·mini의 사파리는 보이는 높이가 550~630px밖에 안 되는데,
 * 여기에 그림·시계·설명·버튼이 다 들어가야 한다. 그래서 두 겹으로 막아 뒀다.
 * 짧으면 여백과 시계를 줄이고, 그래도 넘치면 스크롤된다.
 */
export function WelcomeScreen({ onDone, reduceMotion }: WelcomeScreenProps) {
  return (
    <div className="relative h-full flex flex-col overflow-hidden">
      <SceneBackground sceneId="home-morning" />
      {/* 넘치면 스크롤되게 한다. 안쪽을 min-h-full로 두어야 자리가 남을 때는
          지금처럼 가운데 정렬되고, 모자랄 때만 늘어나 스크롤된다 */}
      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto">
        <div className="flex min-h-full flex-col items-center justify-center gap-6 px-6 py-10 safe-top safe-bottom [@media(max-height:680px)]:gap-3 [@media(max-height:680px)]:py-4">
        <WetiCharacter mood="happy" size={120} animate={!reduceMotion} />
        <div className="text-center">
          <h1 className="text-2xl font-black text-[var(--color-ink)]">시계탐험대</h1>
          <p className="mt-1 font-bold text-[var(--color-ink-soft)]">시계 읽기와 친해지는 하루 이야기</p>
        </div>

        <Card className="px-8 py-6 flex flex-col items-center gap-3 [@media(max-height:680px)]:px-6 [@media(max-height:680px)]:py-4">
          <div className="w-40 [@media(max-height:680px)]:w-28">
            <AnalogClock value={{ hour: 8, minute: 0 }} interactive={false} showLegend reduceMotion={reduceMotion} />
          </div>
          <p className="text-sm font-bold text-[var(--color-ink-soft)] text-center">
            시곗바늘을 손가락으로 쓱 돌려서 시간을 맞춰봐요
          </p>
        </Card>

        <Button
          variant="primary"
          size="lg"
          onClick={() => {
            unlockAudio();
            onDone();
          }}
          aria-label="게임 시작하기"
        >
          시작할래요!
        </Button>
        </div>
      </div>
    </div>
  );
}
