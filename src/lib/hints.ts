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

// 한 판에 여러 문제를 푸는데 다섯 개뿐이라 같은 칭찬이 금방 되풀이됐다.
// 특정 아이(웨티)를 주어로 세우지 않고, 지금 맞힌 아이 본인을 칭찬한다.
const PRAISES = [
  "정답이에요! 최고예요!",
  "우와, 시간을 딱 맞췄어요!",
  "완벽해요! 눈이 정말 좋네요!",
  "잘했어요! 시계 박사네요!",
  "정확해요! 다음으로 가볼까요?",
  "딩동댕! 바늘을 제대로 읽었어요!",
  "멋져요! 한 번에 맞혔어요!",
  "이야, 시계 읽기 실력이 쑥쑥!",
  "그렇죠! 바로 그 시간이에요!",
  "대단해요! 어려운 걸 해냈어요!",
  "짝짝짝! 정말 잘 맞혔어요!",
  "좋아요! 이 느낌 그대로 가봐요!",
  "훌륭해요! 바늘 위치가 딱이에요!",
  "성공! 시계가 활짝 웃고 있어요!",
];

// 바로 앞에 나온 칭찬은 다시 뽑지 않는다. 연달아 같은 문장이 뜨면
// 문구를 아무리 늘려도 "매번 똑같다"고 느껴진다.
let lastPraiseIndex = -1;

export function randomPraise(rng: () => number = Math.random): string {
  let index = Math.floor(rng() * PRAISES.length);
  if (index === lastPraiseIndex) index = (index + 1) % PRAISES.length;
  lastPraiseIndex = index;
  return PRAISES[index];
}
