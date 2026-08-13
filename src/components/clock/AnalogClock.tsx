import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { ClockTime, SnapMinutes } from "../../lib/time";
import { formatKoreanTime, fromTotalMinutes, hourAngle, minuteAngle, snapToGrid, toTotalMinutes } from "../../lib/time";
import { angleDelta, pointToAngle, polarToPoint } from "../../lib/clockGeometry";
import { playSnap } from "../../lib/audio";

export type HandKind = "hour" | "minute";

export interface AnalogClockProps {
  value: ClockTime;
  onChange?: (value: ClockTime) => void;
  grid?: SnapMinutes;
  interactive?: boolean;
  highlightHand?: HandKind | null;
  size?: number | string;
  ariaLabel?: string;
  showLegend?: boolean;
  reduceMotion?: boolean;
  className?: string;
}

const CENTER = 100;
const FACE_RADIUS = 92;
const HOUR_LEN = 46;
const MINUTE_LEN = 74;
const NUMBER_RADIUS = 74;

const CARDINAL_NUMBERS = new Set([12, 3, 6, 9]);

function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

export function AnalogClock({
  value,
  onChange,
  grid = 1,
  interactive = true,
  highlightHand = null,
  size = "100%",
  ariaLabel,
  showLegend = true,
  reduceMotion = false,
  className,
}: AnalogClockProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [angles, setAngles] = useState(() => ({ hourDeg: hourAngle(value), minuteDeg: minuteAngle(value) }));
  const [dragging, setDragging] = useState<HandKind | null>(null);
  const draggingRef = useRef<HandKind | null>(null);
  const lastPointerAngleRef = useRef(0);
  const minuteTotalRef = useRef(toTotalMinutes(value));
  const hourAngleAccumRef = useRef(hourAngle(value));
  const valueRef = useLatest(value);
  const onChangeRef = useLatest(onChange);
  const gridRef = useLatest(grid);

  // 외부에서 value가 바뀌면(드래그 중이 아닐 때) 화면도 맞춰준다
  // value.hour/minute(원시값)만 의존성으로 써서 매 렌더 새로 생기는 객체 참조 때문에
  // 불필요하게 재실행되는 것을 막는다.
  useEffect(() => {
    if (draggingRef.current) return;
    setAngles({ hourDeg: hourAngle(value), minuteDeg: minuteAngle(value) });
  }, [value.hour, value.minute]);

  const getAngleFromEvent = useCallback((e: PointerEvent | ReactPointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return 0;
    const rect = svg.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return pointToAngle(e.clientX - cx, e.clientY - cy);
  }, []);

  const handlePointerDown = useCallback(
    (hand: HandKind) => (e: ReactPointerEvent<SVGElement>) => {
      if (!interactive) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      draggingRef.current = hand;
      setDragging(hand);
      lastPointerAngleRef.current = getAngleFromEvent(e);
      if (hand === "minute") {
        minuteTotalRef.current = toTotalMinutes(valueRef.current);
      } else {
        hourAngleAccumRef.current = hourAngle(valueRef.current);
      }
    },
    [interactive, getAngleFromEvent, valueRef],
  );

  useEffect(() => {
    if (!dragging) return;

    let lastSnapBucket: number | null = null;

    const handleMove = (e: PointerEvent) => {
      const angle = getAngleFromEvent(e);
      const delta = angleDelta(lastPointerAngleRef.current, angle);
      lastPointerAngleRef.current = angle;

      if (dragging === "minute") {
        minuteTotalRef.current += delta / 6; // 6도 = 1분
        const total = minuteTotalRef.current;
        setAngles({ hourDeg: total / 2, minuteDeg: total * 6 });

        const bucket = Math.round(total / gridRef.current);
        if (lastSnapBucket !== null && bucket !== lastSnapBucket) playSnap();
        lastSnapBucket = bucket;
      } else {
        hourAngleAccumRef.current += delta;
        setAngles((prev) => ({ hourDeg: hourAngleAccumRef.current, minuteDeg: prev.minuteDeg }));

        const bucket = Math.round(hourAngleAccumRef.current / 30);
        if (lastSnapBucket !== null && bucket !== lastSnapBucket) playSnap();
        lastSnapBucket = bucket;
      }
    };

    const handleUp = () => {
      const hand = draggingRef.current;
      let newTime: ClockTime;
      if (hand === "minute") {
        const snappedTotal = snapToGrid(minuteTotalRef.current, gridRef.current);
        newTime = fromTotalMinutes(snappedTotal);
      } else {
        const normalizedHourDeg = ((hourAngleAccumRef.current % 360) + 360) % 360;
        const sector = Math.round(normalizedHourDeg / 30) % 12;
        const newHour = sector === 0 ? 12 : sector;
        newTime = { hour: newHour, minute: valueRef.current.minute };
      }
      setAngles({ hourDeg: hourAngle(newTime), minuteDeg: minuteAngle(newTime) });
      draggingRef.current = null;
      setDragging(null);
      playSnap();
      onChangeRef.current?.(newTime);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };
  }, [dragging, getAngleFromEvent, onChangeRef, gridRef, valueRef]);

  const numbers = Array.from({ length: 12 }, (_, i) => i + 1);
  const ticks = Array.from({ length: 60 }, (_, i) => i);

  const transition = dragging || reduceMotion ? "none" : "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";

  return (
    <div className={`select-none touch-none ${className ?? ""}`} style={{ width: size, maxWidth: "100%", aspectRatio: "1 / 1" }}>
      <svg
        ref={svgRef}
        viewBox="0 0 200 200"
        role="img"
        aria-label={ariaLabel ?? `아날로그 시계, 현재 ${formatKoreanTime(value)}`}
        className="w-full h-full touch-none"
      >
        {/* 시계 판 */}
        <circle cx={CENTER} cy={CENTER} r={FACE_RADIUS} fill="var(--clock-face, #fffaf1)" stroke="var(--clock-rim, #5b3a29)" strokeWidth={5} />
        <circle cx={CENTER} cy={CENTER} r={FACE_RADIUS - 8} fill="none" stroke="#f1c896" strokeWidth={1.5} opacity={0.6} />

        {/* 눈금 */}
        {ticks.map((i) => {
          const isMajor = i % 5 === 0;
          const outer = polarToPoint(CENTER, CENTER, i * 6, FACE_RADIUS - 6);
          const inner = polarToPoint(CENTER, CENTER, i * 6, FACE_RADIUS - (isMajor ? 15 : 10));
          return (
            <line
              key={i}
              x1={outer.x}
              y1={outer.y}
              x2={inner.x}
              y2={inner.y}
              stroke="#8a6a4a"
              strokeWidth={isMajor ? 2.6 : 1.2}
              strokeLinecap="round"
              opacity={isMajor ? 0.85 : 0.45}
            />
          );
        })}

        {/* 숫자 */}
        {numbers.map((n) => {
          const p = polarToPoint(CENTER, CENTER, n * 30, NUMBER_RADIUS);
          const cardinal = CARDINAL_NUMBERS.has(n);
          return (
            <text
              key={n}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={cardinal ? 22 : 17}
              fontWeight={cardinal ? 800 : 600}
              fill="#4a3626"
              fontFamily="var(--font-rounded)"
            >
              {n}
            </text>
          );
        })}

        {/* 힌트: 강조 표시할 바늘 뒤로 은은한 펄스 링 */}
        {highlightHand && (
          <HandHighlight hand={highlightHand} angle={highlightHand === "hour" ? angles.hourDeg : angles.minuteDeg} reduceMotion={reduceMotion} />
        )}

        {/* 시침 (짧고 굵은 바늘) */}
        <g style={{ transform: `rotate(${angles.hourDeg}deg)`, transformOrigin: `${CENTER}px ${CENTER}px`, transition }}>
          <line x1={CENTER} y1={CENTER} x2={CENTER} y2={CENTER - HOUR_LEN} stroke="#3b3355" strokeWidth={9} strokeLinecap="round" />
          <circle cx={CENTER} cy={CENTER - HOUR_LEN} r={6.5} fill="#3b3355" />
          {interactive && (
            <>
              <line
                x1={CENTER}
                y1={CENTER}
                x2={CENTER}
                y2={CENTER - HOUR_LEN}
                stroke="transparent"
                strokeWidth={34}
                strokeLinecap="round"
                onPointerDown={handlePointerDown("hour")}
                style={{ cursor: "grab", touchAction: "none" }}
              />
              <circle
                cx={CENTER}
                cy={CENTER - HOUR_LEN}
                r={20}
                fill="transparent"
                onPointerDown={handlePointerDown("hour")}
                style={{ cursor: "grab", touchAction: "none" }}
                aria-label="시침(짧은 바늘) 드래그"
                role="slider"
                aria-valuetext={`${value.hour}시`}
              />
            </>
          )}
        </g>

        {/* 분침 (길고 얇은 바늘, 화살촉 모양) */}
        <g style={{ transform: `rotate(${angles.minuteDeg}deg)`, transformOrigin: `${CENTER}px ${CENTER}px`, transition }}>
          <line x1={CENTER} y1={CENTER} x2={CENTER} y2={CENTER - MINUTE_LEN + 6} stroke="#ff6b57" strokeWidth={5} strokeLinecap="round" />
          <MinuteTip />
          {interactive && (
            <>
              <line
                x1={CENTER}
                y1={CENTER}
                x2={CENTER}
                y2={CENTER - MINUTE_LEN}
                stroke="transparent"
                strokeWidth={30}
                strokeLinecap="round"
                onPointerDown={handlePointerDown("minute")}
                style={{ cursor: "grab", touchAction: "none" }}
              />
              <circle
                cx={CENTER}
                cy={CENTER - MINUTE_LEN}
                r={22}
                fill="transparent"
                onPointerDown={handlePointerDown("minute")}
                style={{ cursor: "grab", touchAction: "none" }}
                aria-label="분침(긴 바늘) 드래그"
                role="slider"
                aria-valuetext={`${value.minute}분`}
              />
            </>
          )}
        </g>

        {/* 중심 축 */}
        <circle cx={CENTER} cy={CENTER} r={7} fill="#ff8a5c" stroke="#3b3355" strokeWidth={2} />
      </svg>

      {showLegend && (
        <div className="mt-1.5 flex items-center justify-center gap-4 text-[11px] font-bold text-[var(--ink-soft,#6b5847)]">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-2 w-4 rounded-full bg-[#3b3355]" aria-hidden="true" />
            짧은 바늘 = 시
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-1.5 w-5 rounded-full bg-[#ff6b57]" aria-hidden="true" />
            긴 바늘 = 분
          </span>
        </div>
      )}
    </div>
  );
}

function MinuteTip() {
  const tip = polarToPoint(CENTER, CENTER, 0, MINUTE_LEN + 5);
  const left = polarToPoint(CENTER, CENTER, -7, MINUTE_LEN - 7);
  const right = polarToPoint(CENTER, CENTER, 7, MINUTE_LEN - 7);
  return <polygon points={`${tip.x},${tip.y} ${left.x},${left.y} ${right.x},${right.y}`} fill="#ff6b57" />;
}

function HandHighlight({ hand, angle, reduceMotion }: { hand: HandKind; angle: number; reduceMotion: boolean }) {
  const radius = hand === "hour" ? HOUR_LEN : MINUTE_LEN;
  const p = polarToPoint(CENTER, CENTER, angle, radius);
  return (
    <circle
      cx={p.x}
      cy={p.y}
      r={18}
      fill="none"
      stroke="#ffb703"
      strokeWidth={4}
      opacity={0.85}
      className={reduceMotion ? undefined : "animate-pulse"}
    />
  );
}
