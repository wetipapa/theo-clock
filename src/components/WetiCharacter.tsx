import { useEffect, useState } from "react";
import idle from "../assets/characters/weti-idle.png";
import blink from "../assets/characters/weti-blink.png";
import happy from "../assets/characters/weti-happy.png";
import proud from "../assets/characters/weti-proud.png";
import thinking from "../assets/characters/weti-thinking.png";
import sleepy from "../assets/characters/weti-sleepy.png";
import papaIdle from "../assets/characters/wetipapa-idle.png";

export type WetiMood = "idle" | "happy" | "excited" | "thinking" | "sleepy";

const FACE: Record<WetiMood, string> = {
  idle,
  happy,
  excited: proud,
  thinking,
  sleepy,
};

const LABEL: Record<WetiMood, string> = {
  idle: "웨티",
  happy: "웃고 있는 웨티",
  excited: "뿌듯해하는 웨티",
  thinking: "고민하는 웨티",
  sleepy: "졸린 웨티",
};

interface WetiCharacterProps {
  mood?: WetiMood;
  size?: number;
  className?: string;
  /** 움직임 허용 여부. 부모 설정의 "움직임 줄이기"가 꺼져 있을 때만 true */
  animate?: boolean;
  /** 웨티아빠로 그린다. 부모용 화면에만 쓴다 */
  papa?: boolean;
}

/**
 * 웨티 캐릭터 — 브랜드 확정 자산(`brand-assets/confirmed/character-mono/`)의 손그림 얼굴.
 *
 * 왜 배지(둥근 받침) 안에 넣는가:
 * 브랜드 캐릭터는 가는 흑백 선화라 받침 없이 얹으면 두 방향으로 다 실패한다.
 * 밤 씬(#1d2049) 위에서는 검은 선이 묻히고, 흰 카드 위에서는 윤곽이 녹는다.
 * 크림색 원판과 코랄 테두리를 주면 어떤 배경에서도 캐릭터가 자기 영역을 갖는다.
 * (단어 뚝딱의 공유 카드도 같은 방식으로 얼굴을 원형 테두리 안에 넣는다.)
 *
 * 얼굴 원본은 흰 배경 선화를 언매트한 것이라 얼굴 안쪽으로 배지 색이 비친다.
 */
export function WetiCharacter({ mood = "idle", size = 140, className, animate = false, papa = false }: WetiCharacterProps) {
  const [blinking, setBlinking] = useState(false);

  // 눈 깜빡임: 확정 세트에 00_master와 픽셀이 같고 눈만 감은 프레임이 있어서 가능하다.
  const canBlink = animate && !papa && mood === "idle";
  useEffect(() => {
    if (!canBlink) {
      setBlinking(false);
      return;
    }
    let closeTimer = 0;
    const openTimer = window.setInterval(() => {
      setBlinking(true);
      closeTimer = window.setTimeout(() => setBlinking(false), 140);
    }, 4200);
    return () => {
      window.clearInterval(openTimer);
      window.clearTimeout(closeTimer);
    };
  }, [canBlink]);

  const src = papa ? papaIdle : blinking ? blink : FACE[mood];
  const label = papa ? "웨티아빠" : LABEL[mood];

  return (
    <div
      className={`${className ?? ""} shrink-0 rounded-full bg-[var(--color-card)] border-[3px] border-[var(--color-sunset)] overflow-hidden ${
        animate ? "animate-[weti-bounce_2.4s_ease-in-out_infinite]" : ""
      }`}
      style={{ width: size, height: size }}
    >
      <img src={src} alt={label} width={size} height={size} className="w-full h-full object-contain" draggable={false} />
    </div>
  );
}
