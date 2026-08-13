import { describe, expect, it } from "vitest";
import {
  addMinutes,
  formatKoreanTime,
  forwardDistanceMinutes,
  fromTotalMinutes,
  hourAngle,
  isSameTime,
  minuteAngle,
  normalizeTotalMinutes,
  shortestSignedDistanceMinutes,
  snapTime,
  toTotalMinutes,
} from "./time";

describe("toTotalMinutes / fromTotalMinutes", () => {
  it("변환이 서로 역함수 관계다", () => {
    for (let h = 1; h <= 12; h++) {
      for (let m = 0; m < 60; m += 5) {
        const total = toTotalMinutes({ hour: h, minute: m });
        expect(fromTotalMinutes(total)).toEqual({ hour: h, minute: m });
      }
    }
  });

  it("12시는 0분으로 취급된다", () => {
    expect(toTotalMinutes({ hour: 12, minute: 0 })).toBe(0);
  });

  it("음수/초과 값도 12시간 경계로 감싼다", () => {
    expect(fromTotalMinutes(-10)).toEqual({ hour: 11, minute: 50 });
    expect(fromTotalMinutes(720)).toEqual({ hour: 12, minute: 0 });
    expect(fromTotalMinutes(725)).toEqual({ hour: 12, minute: 5 });
  });
});

describe("normalizeTotalMinutes", () => {
  it("범위를 벗어난 큰 값도 0~719로 정규화한다", () => {
    expect(normalizeTotalMinutes(720 * 3 + 15)).toBe(15);
    expect(normalizeTotalMinutes(-5)).toBe(715);
  });
});

describe("addMinutes: 12시 경계 처리", () => {
  it("11시 50분 + 20분 = 12시 10분", () => {
    expect(addMinutes({ hour: 11, minute: 50 }, 20)).toEqual({ hour: 12, minute: 10 });
  });

  it("12시 10분 - 20분 = 11시 50분", () => {
    expect(addMinutes({ hour: 12, minute: 10 }, -20)).toEqual({ hour: 11, minute: 50 });
  });

  it("12시 정각 - 30분 = 11시 30분", () => {
    expect(addMinutes({ hour: 12, minute: 0 }, -30)).toEqual({ hour: 11, minute: 30 });
  });

  it("여러 바퀴를 돌아도 정확하다 (720분 = 정확히 한 바퀴)", () => {
    expect(addMinutes({ hour: 3, minute: 15 }, 720)).toEqual({ hour: 3, minute: 15 });
    expect(addMinutes({ hour: 3, minute: 15 }, -720 * 2)).toEqual({ hour: 3, minute: 15 });
  });

  it("1시 -10분 = 12시 50분", () => {
    expect(addMinutes({ hour: 1, minute: 0 }, -10)).toEqual({ hour: 12, minute: 50 });
  });
});

describe("snapTime", () => {
  it("정각(60분) 그리드로 스냅한다", () => {
    expect(snapTime({ hour: 3, minute: 40 }, 60)).toEqual({ hour: 4, minute: 0 });
    expect(snapTime({ hour: 3, minute: 20 }, 60)).toEqual({ hour: 3, minute: 0 });
  });

  it("59분은 다음 정각(12시 경계 포함)으로 스냅된다", () => {
    expect(snapTime({ hour: 12, minute: 59 }, 60)).toEqual({ hour: 1, minute: 0 });
  });

  it("5분 그리드로 스냅한다", () => {
    expect(snapTime({ hour: 5, minute: 32 }, 5)).toEqual({ hour: 5, minute: 30 });
    expect(snapTime({ hour: 5, minute: 33 }, 5)).toEqual({ hour: 5, minute: 35 });
  });

  it("10분 그리드에서 58분은 다음 시간 0분으로 스냅된다", () => {
    expect(snapTime({ hour: 7, minute: 58 }, 10)).toEqual({ hour: 8, minute: 0 });
  });
});

describe("isSameTime", () => {
  it("시/분이 같으면 true", () => {
    expect(isSameTime({ hour: 8, minute: 30 }, { hour: 8, minute: 30 })).toBe(true);
    expect(isSameTime({ hour: 8, minute: 30 }, { hour: 8, minute: 31 })).toBe(false);
  });
});

describe("forwardDistanceMinutes / shortestSignedDistanceMinutes", () => {
  it("정방향 거리는 항상 0~719다", () => {
    expect(forwardDistanceMinutes({ hour: 11, minute: 55 }, { hour: 12, minute: 5 })).toBe(10);
    expect(forwardDistanceMinutes({ hour: 12, minute: 5 }, { hour: 11, minute: 55 })).toBe(710);
  });

  it("최단 회전 거리는 부호를 갖고 절반 범위를 넘지 않는다", () => {
    expect(shortestSignedDistanceMinutes({ hour: 11, minute: 55 }, { hour: 12, minute: 5 })).toBe(10);
    expect(shortestSignedDistanceMinutes({ hour: 12, minute: 5 }, { hour: 11, minute: 55 })).toBe(-10);
  });
});

describe("formatKoreanTime", () => {
  it("정각은 분을 생략한다", () => {
    expect(formatKoreanTime({ hour: 8, minute: 0 })).toBe("8시");
  });
  it("정각이 아니면 분까지 표기한다", () => {
    expect(formatKoreanTime({ hour: 8, minute: 30 })).toBe("8시 30분");
  });
});

describe("각도 계산", () => {
  it("분침은 6도/분", () => {
    expect(minuteAngle({ hour: 1, minute: 0 })).toBe(0);
    expect(minuteAngle({ hour: 1, minute: 30 })).toBe(180);
    expect(minuteAngle({ hour: 1, minute: 45 })).toBe(270);
  });

  it("시침은 분에 따라 미세하게 이동한다", () => {
    expect(hourAngle({ hour: 3, minute: 0 })).toBe(90);
    expect(hourAngle({ hour: 3, minute: 30 })).toBe(105);
    expect(hourAngle({ hour: 12, minute: 0 })).toBe(0);
  });
});
