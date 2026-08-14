import type { IconName } from "../types";

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

/**
 * 간단한 플랫 스타일 SVG 아이콘 모음.
 * 저작권 문제가 없도록 전부 직접 그린 도형으로 구성한다.
 */
export function Icon({ name, size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {renderIcon(name)}
    </svg>
  );
}

function renderIcon(name: IconName) {
  switch (name) {
    case "sun":
      return (
        <g>
          <circle cx="12" cy="12" r="5" fill="#ffd166" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <rect key={deg} x="11" y="1.5" width="2" height="4" rx="1" fill="#ffb703" transform={`rotate(${deg} 12 12)`} />
          ))}
        </g>
      );
    case "bus":
      return (
        <g>
          <rect x="2" y="6" width="20" height="11" rx="3" fill="#ffd166" />
          <rect x="4" y="8.5" width="5" height="4" rx="1" fill="#fff6ea" />
          <rect x="10.5" y="8.5" width="5" height="4" rx="1" fill="#fff6ea" />
          <rect x="17" y="8.5" width="3" height="4" rx="1" fill="#fff6ea" />
          <circle cx="7" cy="18.5" r="2.2" fill="#4a3626" />
          <circle cx="17" cy="18.5" r="2.2" fill="#4a3626" />
        </g>
      );
    case "pencil":
      return (
        <g>
          <path d="M4 20l1-5 11-11 4 4-11 11z" fill="#8fd3e8" />
          <path d="M5 15l4 4-3.4 1z" fill="#4a3626" />
          <path d="M15 4l4 4 2-2-4-4z" fill="#ff6b57" />
        </g>
      );
    case "rice":
      return (
        <g>
          <ellipse cx="12" cy="17" rx="8" ry="4" fill="#8a6a4a" />
          <path d="M4.5 16.5a7.5 4 0 0 1 15 0z" fill="#fffaf1" />
          <circle cx="9" cy="15" r="0.8" fill="#e8d9c0" />
          <circle cx="12" cy="14" r="0.8" fill="#e8d9c0" />
          <circle cx="15" cy="15.3" r="0.8" fill="#e8d9c0" />
        </g>
      );
    case "cookie":
      return (
        <g>
          <circle cx="12" cy="12" r="9" fill="#e3a45c" />
          <circle cx="9" cy="9" r="1.3" fill="#6b4326" />
          <circle cx="14" cy="8.5" r="1.1" fill="#6b4326" />
          <circle cx="15.5" cy="13.5" r="1.2" fill="#6b4326" />
          <circle cx="10" cy="15" r="1.1" fill="#6b4326" />
        </g>
      );
    case "swing":
      return (
        <g>
          <path d="M4 3v18M20 3v18" stroke="#8a6a4a" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 3h16" stroke="#8a6a4a" strokeWidth="2" strokeLinecap="round" />
          <path d="M8 3l3 13M16 3l-3 13" stroke="#ff8a5c" strokeWidth="1.6" />
          <rect x="8.5" y="16" width="7" height="2.4" rx="1.2" fill="#ff6b57" />
        </g>
      );
    case "bath":
      return (
        <g>
          <path d="M3 12h18v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z" fill="#8fd3e8" />
          <path d="M3 12a2 2 0 1 1 0-4h1V6a2 2 0 0 1 4 0" fill="none" stroke="#4fa8c2" strokeWidth="1.6" strokeLinecap="round" />
          {[7, 12, 17].map((x) => (
            <circle key={x} cx={x} cy="7" r="1" fill="#fff" opacity="0.9" />
          ))}
        </g>
      );
    case "moon":
      return (
        <g>
          <path d="M20 13.5A8.5 8.5 0 1 1 10.5 4a7 7 0 1 0 9.5 9.5z" fill="#5b4b8a" />
          <circle cx="18" cy="6" r="0.9" fill="#ffd166" />
          <circle cx="15" cy="4" r="0.6" fill="#ffd166" />
        </g>
      );
    case "star":
      return <path d={starPath(12, 12, 9, 4)} fill="#ffd166" />;
    case "home":
      return (
        <g>
          <path d="M3 11l9-7 9 7" fill="none" stroke="#8a6a4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9" fill="#ffd8a8" />
          <rect x="10" y="14" width="4" height="6" fill="#8a6a4a" />
        </g>
      );
    case "gift":
      return (
        <g>
          <rect x="4" y="10" width="16" height="10" rx="1.5" fill="#ff8a5c" />
          <rect x="4" y="7" width="16" height="4" rx="1" fill="#ff6b57" />
          <rect x="11" y="7" width="2" height="13" fill="#fff6ea" />
          <path d="M9 7c-2 0-3-1.4-3-2.6C6 3 7 2 8.4 2 10 2 11 4 11 7zM15 7c2 0 3-1.4 3-2.6C18 3 17 2 15.6 2 14 2 13 4 13 7z" fill="#ffd166" />
        </g>
      );
    case "clock":
      return (
        <g>
          <circle cx="12" cy="12" r="9" fill="#fffaf1" stroke="#5b3a29" strokeWidth="1.6" />
          <path d="M12 7v5l4 2" stroke="#3b3355" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      );
    case "sparkle":
      return (
        <g>
          <path d={starPath(8, 8, 3.4, 4)} fill="#ffd166" />
          <path d={starPath(17, 15, 4.4, 4)} fill="#ff8a5c" />
        </g>
      );
    case "settings":
      return (
        <g>
          <circle cx="12" cy="12" r="3.2" fill="none" stroke="#4a3626" strokeWidth="1.8" />
          <path
            d="M12 3.5v2M12 18.5v2M20.5 12h-2M5.5 12h-2M17.7 6.3l-1.4 1.4M7.7 16.3l-1.4 1.4M17.7 17.7l-1.4-1.4M7.7 7.7 6.3 6.3"
            stroke="#4a3626"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>
      );
    case "lock":
      return (
        <g>
          <rect x="5" y="11" width="14" height="9" rx="2" fill="#8a6a4a" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="#8a6a4a" strokeWidth="2" />
          <circle cx="12" cy="15" r="1.6" fill="#fff6ea" />
        </g>
      );
    case "check":
      return <path d="M4 12.5l5 5 11-11" fill="none" stroke="#6fcf97" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />;
    case "arrow":
      return <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />;
    case "bed":
      return (
        <g>
          <rect x="3" y="12" width="18" height="7" rx="1.5" fill="#ff8a5c" />
          <rect x="3" y="9" width="8" height="4" rx="1.5" fill="#fff6ea" />
          <rect x="11.5" y="9" width="9.5" height="4" rx="1.5" fill="#8fd3e8" />
          <rect x="2" y="12" width="2" height="8" rx="1" fill="#8a6a4a" />
          <rect x="20" y="12" width="2" height="8" rx="1" fill="#8a6a4a" />
        </g>
      );
    case "lamp":
      return (
        <g>
          <path d="M8 4h8l-2 6H10z" fill="#ffd166" />
          <rect x="11" y="10" width="2" height="9" fill="#8a6a4a" />
          <rect x="7" y="19" width="10" height="2" rx="1" fill="#8a6a4a" />
        </g>
      );
    case "plant":
      return (
        <g>
          <path d="M12 14c0-4 3-6 3-6s1 4-1 6-2 0-2 0z" fill="#6fcf97" />
          <path d="M12 14c0-4-3-6-3-6s-1 4 1 6 2 0 2 0z" fill="#8fd3a0" />
          <path d="M12 14v6" stroke="#4c8f63" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M7 20h10l-1.4-4H8.4z" fill="#e3a45c" />
        </g>
      );
    case "teddy":
      return (
        <g>
          <circle cx="7" cy="6" r="2.2" fill="#c98a56" />
          <circle cx="17" cy="6" r="2.2" fill="#c98a56" />
          <circle cx="12" cy="11" r="6.5" fill="#e3a45c" />
          <circle cx="9.3" cy="10.5" r="0.9" fill="#4a3626" />
          <circle cx="14.7" cy="10.5" r="0.9" fill="#4a3626" />
          <ellipse cx="12" cy="13" rx="2" ry="1.4" fill="#fff6ea" />
        </g>
      );
    case "poster":
      return (
        <g>
          <rect x="3" y="3" width="18" height="14" rx="1.5" fill="#fff6ea" stroke="#8a6a4a" strokeWidth="1.4" />
          <path d="M5 14l4-5 3 3 3-4 4 6z" fill="#8fd3e8" />
          <circle cx="8" cy="7" r="1.5" fill="#ffd166" />
        </g>
      );
    case "rug":
      return (
        <g>
          <rect x="3" y="7" width="18" height="10" rx="3" fill="#ff8a5c" />
          <rect x="6" y="10" width="12" height="4" rx="2" fill="#fff6ea" opacity="0.85" />
        </g>
      );
    case "shelf":
      return (
        <g>
          <rect x="3" y="4" width="18" height="4" rx="1" fill="#8a6a4a" />
          <rect x="3" y="16" width="18" height="4" rx="1" fill="#8a6a4a" />
          <rect x="6" y="9" width="4" height="6" rx="1" fill="#ff8a5c" />
          <rect x="11.5" y="9" width="4" height="6" rx="1" fill="#8fd3e8" />
          <rect x="17" y="9" width="3" height="6" rx="1" fill="#ffd166" />
        </g>
      );
    case "kite":
      return (
        <g>
          <path d="M12 2l7 7-7 13-7-13z" fill="#8fd3e8" />
          <path d="M12 2l7 7-7 3z" fill="#4fa8c2" />
          <path d="M12 22c1 1 1 2 3 2M12 22c-1 1-1 2-3 2" stroke="#8a6a4a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </g>
      );
    case "window":
      return (
        <g>
          <rect x="3" y="2" width="18" height="16" rx="1.5" fill="#bfe6f2" stroke="#8a6a4a" strokeWidth="1.6" />
          <path d="M12 2v16M3 10h18" stroke="#8a6a4a" strokeWidth="1.4" />
          <circle cx="7.5" cy="6" r="1.6" fill="#ffd166" />
          <path d="M3 18h18" stroke="#8a6a4a" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      );
    case "wallclock":
      return (
        <g>
          <circle cx="12" cy="12" r="9" fill="#fff6ea" stroke="#8a6a4a" strokeWidth="1.8" />
          <path d="M12 7v5l3.5 2" stroke="#4a3626" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <circle cx="12" cy="12" r="1" fill="#ff8a5c" />
        </g>
      );
    case "balloon":
      return (
        <g>
          <ellipse cx="12" cy="9" rx="6.5" ry="7.5" fill="#ff8a5c" />
          <ellipse cx="9.6" cy="6.5" rx="1.6" ry="2.2" fill="#fff6ea" opacity="0.6" />
          <path d="M12 16.5l-1.4 2h2.8z" fill="#e06a3f" />
          <path d="M12 18.5c1.4 1.6-1.4 3 0 4.5" stroke="#8a6a4a" strokeWidth="1.1" fill="none" strokeLinecap="round" />
        </g>
      );
    case "desk":
      return (
        <g>
          <rect x="2" y="9" width="20" height="2.6" rx="1.2" fill="#c98a56" />
          <rect x="3.5" y="11.6" width="2" height="8.4" rx="0.8" fill="#8a6a4a" />
          <rect x="18.5" y="11.6" width="2" height="8.4" rx="0.8" fill="#8a6a4a" />
          <rect x="6.5" y="12" width="11" height="5.5" rx="1" fill="#e3a45c" />
          <path d="M9 14.8h6" stroke="#8a6a4a" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      );
    case "toybox":
      return (
        <g>
          <rect x="3" y="11" width="18" height="9" rx="1.6" fill="#ffd166" />
          <rect x="2" y="8.5" width="20" height="3.2" rx="1.4" fill="#ff8a5c" />
          <rect x="10.5" y="11" width="3" height="9" fill="#e0a52f" />
          <circle cx="12" cy="10.1" r="1" fill="#fff6ea" />
        </g>
      );
    case "garland":
      return (
        <g>
          <path d="M2 5q10 7 20 0" stroke="#8a6a4a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M5.5 7.6l1.1 2.3 2.5.3-1.9 1.7.5 2.5-2.2-1.2-2.2 1.2.5-2.5L2 10.2l2.5-.3z" fill="#ffd166" />
          <path d="M12 9.4l1.1 2.3 2.5.3-1.9 1.7.5 2.5L12 15l-2.2 1.2.5-2.5-1.9-1.7 2.5-.3z" fill="#ff8a5c" />
          <path d="M18.5 7.6l1.1 2.3 2.4.3-1.8 1.7.5 2.5-2.2-1.2-2.2 1.2.5-2.5-1.9-1.7 2.5-.3z" fill="#8fd3e8" />
        </g>
      );
    default:
      return null;
  }
}

function starPath(cx: number, cy: number, r: number, points: number): string {
  const step = Math.PI / points;
  let d = "";
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? r : r * 0.45;
    const angle = i * step - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)} `;
  }
  return d + "Z";
}
