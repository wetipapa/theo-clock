import { describe, expect, it } from "vitest";
import { angleDelta, normalizeDegrees, pointToAngle, polarToPoint } from "./clockGeometry";

describe("normalizeDegrees", () => {
  it("범위를 벗어난 각도를 0~360으로 감싼다", () => {
    expect(normalizeDegrees(-30)).toBe(330);
    expect(normalizeDegrees(370)).toBe(10);
    expect(normalizeDegrees(360)).toBe(0);
  });
});

describe("angleDelta: 0/360 경계에서도 자연스러운 최단 회전", () => {
  it("경계를 넘지 않는 일반적인 경우", () => {
    expect(angleDelta(10, 20)).toBe(10);
    expect(angleDelta(20, 10)).toBe(-10);
  });

  it("0도 경계를 시계방향으로 넘을 때 점프 없이 양수로 처리된다", () => {
    expect(angleDelta(350, 10)).toBe(20);
  });

  it("0도 경계를 반시계방향으로 넘을 때 점프 없이 음수로 처리된다", () => {
    expect(angleDelta(10, 350)).toBe(-20);
  });

  it("정확히 180도 차이는 안정적으로 처리된다", () => {
    expect(Math.abs(angleDelta(0, 180))).toBe(180);
  });
});

describe("pointToAngle", () => {
  it("12시 방향(위)은 0도", () => {
    expect(pointToAngle(0, -10)).toBeCloseTo(0);
  });
  it("3시 방향(오른쪽)은 90도", () => {
    expect(pointToAngle(10, 0)).toBeCloseTo(90);
  });
  it("6시 방향(아래)은 180도", () => {
    expect(pointToAngle(0, 10)).toBeCloseTo(180);
  });
  it("9시 방향(왼쪽)은 270도", () => {
    expect(pointToAngle(-10, 0)).toBeCloseTo(270);
  });
});

describe("polarToPoint", () => {
  it("0도(위쪽)는 중심보다 y가 작다", () => {
    const p = polarToPoint(100, 100, 0, 50);
    expect(p.x).toBeCloseTo(100);
    expect(p.y).toBeCloseTo(50);
  });
  it("90도(오른쪽)는 중심보다 x가 크다", () => {
    const p = polarToPoint(100, 100, 90, 50);
    expect(p.x).toBeCloseTo(150);
    expect(p.y).toBeCloseTo(100);
  });
});
