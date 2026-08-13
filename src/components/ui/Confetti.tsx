import { useMemo } from "react";
import { Icon } from "../Icon";

interface ConfettiProps {
  active: boolean;
  reduceMotion?: boolean;
  count?: number;
}

const COLORS = ["#ffd166", "#ff8a5c", "#8fd3e8", "#6fcf97", "#ff6b57"];

/** 정답/보상 시 터지는 별과 색종이 효과. reduceMotion이면 은은하게만 표시한다 */
export function Confetti({ active, reduceMotion = false, count = 16 }: ConfettiProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
        const distance = 60 + Math.random() * 70;
        return {
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          delay: Math.random() * 0.15,
          color: COLORS[i % COLORS.length],
          isStar: i % 2 === 0,
          rotate: Math.random() * 360,
        };
      }),
    [count],
  );

  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-50" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute"
          style={
            reduceMotion
              ? { transform: `translate(${p.x * 0.3}px, ${p.y * 0.3}px)`, opacity: 0.8 }
              : ({
                  "--tx": `${p.x}px`,
                  "--ty": `${p.y}px`,
                  animation: `confetti-burst 0.9s ease-out ${p.delay}s forwards`,
                } as React.CSSProperties)
          }
        >
          {p.isStar ? (
            <Icon name="star" size={18} />
          ) : (
            <span
              className="block rounded-full"
              style={{ width: 10, height: 10, background: p.color, transform: `rotate(${p.rotate}deg)` }}
            />
          )}
        </span>
      ))}
    </div>
  );
}
