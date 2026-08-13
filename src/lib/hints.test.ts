import { describe, expect, it } from "vitest";
import { buildSetHandsHint } from "./hints";

describe("buildSetHandsHint", () => {
  it("정답이면 힌트가 없다", () => {
    const hint = buildSetHandsHint({ hour: 3, minute: 30 }, { hour: 3, minute: 30 }, 0);
    expect(hint.hand).toBeNull();
  });

  it("시가 틀리면 hour를 우선 지목한다", () => {
    const hint = buildSetHandsHint({ hour: 4, minute: 30 }, { hour: 3, minute: 30 }, 0);
    expect(hint.hand).toBe("hour");
  });

  it("시는 맞고 분만 틀리면 minute을 지목한다", () => {
    const hint = buildSetHandsHint({ hour: 3, minute: 15 }, { hour: 3, minute: 30 }, 0);
    expect(hint.hand).toBe("minute");
  });

  it("여러 번 틀리면 더 구체적인 방향 힌트를 준다", () => {
    const hint = buildSetHandsHint({ hour: 3, minute: 15 }, { hour: 3, minute: 30 }, 2);
    expect(hint.message).toContain("방향");
  });
});
