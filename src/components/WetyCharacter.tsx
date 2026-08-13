export type WetyMood = "idle" | "happy" | "excited" | "thinking" | "sleepy" | "eating";

interface WetyCharacterProps {
  mood?: WetyMood;
  size?: number;
  className?: string;
  bounce?: boolean;
}

/**
 * 웨티 캐릭터 — 저작권 걱정 없는 오리지널 SVG 캐릭터.
 * 동글동글한 몸에 새싹 모양 머리 장식이 특징인 친근한 아이 캐릭터.
 * mood에 따라 표정과 팔 동작이 바뀐다.
 */
export function WetyCharacter({ mood = "idle", size = 140, className, bounce = false }: WetyCharacterProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={`${className ?? ""} ${bounce ? "animate-[wety-bounce_0.6s_ease-in-out_infinite]" : ""}`}
      role="img"
      aria-label="웨티"
    >
      {/* 그림자 */}
      <ellipse cx="60" cy="106" rx="26" ry="6" fill="#00000014" />

      {/* 팔 */}
      <Arms mood={mood} />

      {/* 발 */}
      <ellipse cx="46" cy="100" rx="9" ry="6" fill="#e3763f" />
      <ellipse cx="74" cy="100" rx="9" ry="6" fill="#e3763f" />

      {/* 몸통 */}
      <ellipse cx="60" cy="62" rx="38" ry="36" fill="#ff9d6c" />
      <ellipse cx="60" cy="62" rx="38" ry="36" fill="url(#wety-shine)" opacity="0.5" />
      <ellipse cx="60" cy="70" rx="24" ry="16" fill="#ffb98d" opacity="0.6" />

      {/* 새싹 머리 장식 */}
      <path d="M60 26c-3-9 3-16 10-18-1 8-3 13-10 18z" fill="#6fcf97" />
      <path d="M60 26c3-9-3-16-10-18 1 8 3 13 10 18z" fill="#8fe0ab" />

      {/* 볼 */}
      <ellipse cx="40" cy="66" rx="7" ry="5" fill="#ff7a59" opacity="0.55" />
      <ellipse cx="80" cy="66" rx="7" ry="5" fill="#ff7a59" opacity="0.55" />

      {/* 얼굴 */}
      <Face mood={mood} />

      <defs>
        <radialGradient id="wety-shine" cx="35%" cy="25%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function Arms({ mood }: { mood: WetyMood }) {
  if (mood === "excited" || mood === "happy") {
    return (
      <g stroke="#e3763f" strokeWidth="7" strokeLinecap="round" fill="none">
        <path d="M28 62c-8-10-10-18-8-24" />
        <path d="M92 62c8-10 10-18 8-24" />
      </g>
    );
  }
  if (mood === "thinking") {
    return (
      <g stroke="#e3763f" strokeWidth="7" strokeLinecap="round" fill="none">
        <path d="M30 70c-10-2-14 2-16 8" />
        <path d="M90 66c8-8 14-6 16 0" />
      </g>
    );
  }
  return (
    <g stroke="#e3763f" strokeWidth="7" strokeLinecap="round" fill="none">
      <path d="M26 72c-6 4-8 10-6 16" />
      <path d="M94 72c6 4 8 10 6 16" />
    </g>
  );
}

function Face({ mood }: { mood: WetyMood }) {
  switch (mood) {
    case "happy":
    case "excited":
      return (
        <g>
          <path d="M40 56q4-8 10 0" stroke="#4a3626" strokeWidth="3.4" strokeLinecap="round" fill="none" />
          <path d="M70 56q4-8 10 0" stroke="#4a3626" strokeWidth="3.4" strokeLinecap="round" fill="none" />
          <path d="M42 70q18 16 36 0" stroke="#4a3626" strokeWidth="3.6" strokeLinecap="round" fill="none" />
        </g>
      );
    case "thinking":
      return (
        <g>
          <circle cx="45" cy="58" r="4" fill="#4a3626" />
          <circle cx="75" cy="58" r="4" fill="#4a3626" />
          <path d="M38 48q7-5 13-1" stroke="#4a3626" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="60" cy="72" r="3.4" fill="none" stroke="#4a3626" strokeWidth="3" />
        </g>
      );
    case "sleepy":
      return (
        <g>
          <path d="M39 58q6 4 12 0" stroke="#4a3626" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          <path d="M69 58q6 4 12 0" stroke="#4a3626" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          <ellipse cx="60" cy="72" rx="4" ry="3" fill="#4a3626" />
          <text x="86" y="40" fontSize="14" fill="#8a6a4a" fontWeight="700">
            z
          </text>
          <text x="94" y="30" fontSize="10" fill="#8a6a4a" fontWeight="700">
            z
          </text>
        </g>
      );
    case "eating":
      return (
        <g>
          <circle cx="45" cy="58" r="4" fill="#4a3626" />
          <circle cx="75" cy="58" r="4" fill="#4a3626" />
          <ellipse cx="60" cy="73" rx="8" ry="7" fill="#8a4a2f" />
          <ellipse cx="60" cy="76" rx="5" ry="3" fill="#ffb98d" />
        </g>
      );
    default:
      return (
        <g>
          <circle cx="45" cy="58" r="4.2" fill="#4a3626" />
          <circle cx="75" cy="58" r="4.2" fill="#4a3626" />
          <circle cx="46.4" cy="56.4" r="1.3" fill="#fff" />
          <circle cx="76.4" cy="56.4" r="1.3" fill="#fff" />
          <path d="M50 70q10 8 20 0" stroke="#4a3626" strokeWidth="3.4" strokeLinecap="round" fill="none" />
        </g>
      );
  }
}
