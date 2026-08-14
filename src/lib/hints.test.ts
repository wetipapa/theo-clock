import { describe, expect, it } from "vitest";
import { buildSetHandsHint, randomPraise } from "./hints";

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

describe("randomPraise", () => {
  it("바로 앞과 같은 칭찬을 연달아 내지 않는다", () => {
    // rng를 고정해 늘 같은 값을 뽑게 해도 두 번째는 다른 문구가 나와야 한다.
    const first = randomPraise(() => 0);
    const second = randomPraise(() => 0);
    expect(second).not.toBe(first);
  });

  it("충분히 다양한 칭찬을 낸다", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 300; i++) seen.add(randomPraise());
    expect(seen.size).toBeGreaterThanOrEqual(10);
  });

  it("특정 아이를 주어로 부르지 않는다", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 300; i++) seen.add(randomPraise());
    for (const praise of seen) expect(praise).not.toContain("웨티");
  });
});
