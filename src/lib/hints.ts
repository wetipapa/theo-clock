import type { ClockTime } from "./time";

export interface HandHint {
  hand: "hour" | "minute" | null;
  message: string;
}

/**
 * 시곗바늘 맞추기 오답 힌트.
 * 처음엔 "어떤 바늘을 다시 볼지"만 알려주고, 계속 틀리면 방향까지 구체적으로 알려준다.
 * 정답을 대신 넣어주지 않고 아이가 마지막 조작을 하게 하는 것이 목표다.
 */
export function buildSetHandsHint(current: ClockTime, target: ClockTime, wrongAttempts: number): HandHint {
  const hourWrong = current.hour !== target.hour;
  const minuteWrong = current.minute !== target.minute;

  if (!hourWrong && !minuteWrong) return { hand: null, message: "" };

  const hand: "hour" | "minute" = hourWrong ? "hour" : "minute";

  if (wrongAttempts < 2) {
    return {
      hand,
      message: hand === "hour" ? "짧은 바늘(시침)을 다시 확인해볼까?" : "긴 바늘(분침)을 다시 확인해볼까?",
    };
  }

  if (hand === "hour") {
    return { hand, message: "짧은 바늘이 가리키는 숫자를 다시 세어볼까? 하나, 둘…" };
  }

  const forwardDelta = ((target.minute - current.minute) % 60 + 60) % 60;
  const direction = forwardDelta <= 30 ? "시계 방향으로 조금 더" : "반대 방향으로 조금";
  return { hand, message: `긴 바늘을 ${direction} 돌려볼까?` };
}

const PRAISES = [
  "정답이에요! 최고예요!",
  "우와, 시간을 딱 맞췄어요!",
  "완벽해요! 웨티가 신났어요!",
  "잘했어요! 시계 박사네요!",
  "정확해요! 다음으로 가볼까요?",
];

export function randomPraise(rng: () => number = Math.random): string {
  return PRAISES[Math.floor(rng() * PRAISES.length)];
}
