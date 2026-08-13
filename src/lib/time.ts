/**
 * 시간 계산 유틸리티
 *
 * 게임 내부에서 시간은 항상 "12시간제 아날로그시계" 기준으로 다룬다.
 * - hour: 1~12 (0시/13시 같은 표현은 쓰지 않는다)
 * - minute: 0~59
 *
 * 자정/정오 경계에서 오류가 나기 쉬우므로, 모든 연산은 일단
 * "totalMinutes(0~719, 12시간 = 720분 기준 절대 분)"로 변환한 뒤 계산하고
 * 마지막에 다시 hour/minute로 되돌리는 방식을 쓴다.
 */

export interface ClockTime {
  hour: number; // 1~12
  minute: number; // 0~59
}

export type SnapMinutes = 60 | 30 | 10 | 5 | 1;

const MINUTES_PER_HALF_DAY = 12 * 60; // 720

/** hour(1~12), minute(0~59) -> 0~719 사이의 절대 분으로 변환 */
export function toTotalMinutes(time: ClockTime): number {
  const normalizedHour = ((time.hour % 12) + 12) % 12; // 12 -> 0
  return normalizedHour * 60 + time.minute;
}

/** 0~719를 벗어나는 값도 포함해 안전하게 정규화(모듈로)한다 */
export function normalizeTotalMinutes(totalMinutes: number): number {
  return ((totalMinutes % MINUTES_PER_HALF_DAY) + MINUTES_PER_HALF_DAY) % MINUTES_PER_HALF_DAY;
}

/** 절대 분(범위 제한 없음) -> ClockTime. 12시간 경계를 자동으로 감아준다 */
export function fromTotalMinutes(totalMinutes: number): ClockTime {
  const normalized = normalizeTotalMinutes(totalMinutes);
  const hour = Math.floor(normalized / 60);
  const minute = Math.floor(normalized % 60);
  return {
    hour: hour === 0 ? 12 : hour,
    minute,
  };
}

/**
 * time에 deltaMinutes(음수 가능)를 더한 새 시간을 12시간 경계를 넘나들어도
 * 안전하게 계산한다. 예: 11시 50분 + 20분 -> 12시 10분 / 12시 10분 - 20분 -> 11시 50분
 */
export function addMinutes(time: ClockTime, deltaMinutes: number): ClockTime {
  return fromTotalMinutes(toTotalMinutes(time) + deltaMinutes);
}

/** 가장 가까운 grid(분 단위)로 스냅. 60이면 정각, 30이면 30분 단위 등 */
export function snapToGrid(totalMinutes: number, grid: SnapMinutes): number {
  const rounded = Math.round(totalMinutes / grid) * grid;
  return normalizeTotalMinutes(rounded);
}

export function snapTime(time: ClockTime, grid: SnapMinutes): ClockTime {
  return fromTotalMinutes(snapToGrid(toTotalMinutes(time), grid));
}

/** 두 시간이 같은지 (시/분 모두 일치) */
export function isSameTime(a: ClockTime, b: ClockTime): boolean {
  return toTotalMinutes(a) === toTotalMinutes(b);
}

/**
 * a에서 b까지 "시계방향(정방향)"으로 얼마나 떨어져 있는지 0~719 범위로 반환.
 * 오답 힌트("긴 바늘을 몇 분 더/덜 돌려야 하는지")를 계산할 때 사용.
 */
export function forwardDistanceMinutes(a: ClockTime, b: ClockTime): number {
  const diff = toTotalMinutes(b) - toTotalMinutes(a);
  return normalizeTotalMinutes(diff);
}

/** -360~360 사이 최단 회전 거리(분). 음수면 반시계, 양수면 시계 방향이 더 가깝다는 뜻 */
export function shortestSignedDistanceMinutes(a: ClockTime, b: ClockTime): number {
  const forward = forwardDistanceMinutes(a, b);
  return forward > MINUTES_PER_HALF_DAY / 2 ? forward - MINUTES_PER_HALF_DAY : forward;
}

/** "8시" / "8시 30분" 같은 한글 시간 표현 생성 */
export function formatKoreanTime(time: ClockTime): string {
  if (time.minute === 0) return `${time.hour}시`;
  return `${time.hour}시 ${time.minute}분`;
}

/** 분침 각도(도, 12시=0도 기준 시계방향) */
export function minuteAngle(time: ClockTime): number {
  return time.minute * 6;
}

/** 시침 각도(도, 12시=0도 기준 시계방향). 분에 따라 미세하게 이동한다 */
export function hourAngle(time: ClockTime): number {
  const hour12 = time.hour % 12;
  return hour12 * 30 + time.minute * 0.5;
}
