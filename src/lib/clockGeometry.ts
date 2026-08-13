/**
 * 시계 드래그 조작에 필요한 순수 기하 계산.
 * DOM에 의존하지 않으므로 단위 테스트가 가능하다.
 */

/** 임의의 각도를 0~360 범위로 정규화 */
export function normalizeDegrees(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * from에서 to로 회전할 때의 최단 각도(부호 있음, -180~180).
 * 포인터 드래그 중 360도 경계(예: 0도/360도)를 넘나들 때도
 * 자연스러운 델타를 계산하기 위해 사용한다.
 */
export function angleDelta(from: number, to: number): number {
  let delta = normalizeDegrees(to) - normalizeDegrees(from);
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return delta;
}

/**
 * 중심점 기준 (dx, dy) 방향의 각도를 계산한다.
 * 0도 = 12시 방향(위쪽), 시계방향으로 증가 (90도 = 3시 방향)
 */
export function pointToAngle(dx: number, dy: number): number {
  const raw = Math.atan2(dx, -dy) * (180 / Math.PI);
  return normalizeDegrees(raw);
}

/** 각도(도) -> 라디안 */
export function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** 중심(cx,cy)에서 angle(도, 0=위/시계방향) 방향으로 radius만큼 떨어진 좌표 */
export function polarToPoint(cx: number, cy: number, angleDeg: number, radius: number): { x: number; y: number } {
  const rad = toRadians(angleDeg);
  return {
    x: cx + radius * Math.sin(rad),
    y: cy - radius * Math.cos(rad),
  };
}
