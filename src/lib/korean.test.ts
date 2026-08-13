import { describe, expect, it } from "vitest";
import { withEulReul, withEuroRo, withIGa, withIeyoYeyo } from "./korean";

describe("한글 조사 선택", () => {
  it("받침 없는 말(시)은 를/로/예요/가", () => {
    expect(withEulReul("8시")).toBe("8시를");
    expect(withEuroRo("8시")).toBe("8시로");
    expect(withIeyoYeyo("8시")).toBe("8시예요");
    expect(withIGa("8시")).toBe("8시가");
  });

  it("받침 있는 말(분)은 을/으로/이에요/이", () => {
    expect(withEulReul("8시 30분")).toBe("8시 30분을");
    expect(withEuroRo("8시 30분")).toBe("8시 30분으로");
    expect(withIeyoYeyo("8시 30분")).toBe("8시 30분이에요");
    expect(withIGa("8시 30분")).toBe("8시 30분이");
  });

  it("ㄹ받침은 으로가 아니라 로", () => {
    expect(withEuroRo("출발")).toBe("출발로");
  });
});
