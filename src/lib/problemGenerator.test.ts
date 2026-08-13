import { describe, expect, it } from "vitest";
import { generateStageProblems } from "./problemGenerator";
import { getStage } from "../data/stages";
import { getDayEvent } from "../data/schedule";
import { createRng } from "./rng";
import { isSameTime } from "./time";
import type { ChooseClockProblem, ScheduleProblem, SetHandsProblem, TimeFlowProblem } from "../types";

describe("generateStageProblems: 정각/30분/10분/5분 스테이지", () => {
  for (const stageId of ["hour", "half", "ten", "five"] as const) {
    it(`${stageId} 스테이지는 요청한 개수만큼 문제를 만들고 마지막 문제는 해당 날짜 이벤트와 일치한다`, () => {
      const stage = getStage(stageId);
      const dayEvent = getDayEvent(stage.dayEventId);
      const problems = generateStageProblems(stage, dayEvent, "웨티", createRng(42));

      expect(problems).toHaveLength(stage.problemCount);

      const last = problems[problems.length - 1];
      expect(last.isFinal).toBe(true);
      expect(last.mode).toBe("set-hands");
      expect(isSameTime((last as SetHandsProblem).target, dayEvent.time)).toBe(true);

      // 그리드에 맞는 시간만 생성되어야 한다
      for (const p of problems) {
        const target = p.mode === "choose-clock" || p.mode === "set-hands" ? p.target : null;
        if (target) {
          expect(target.minute % stage.grid).toBe(0);
          expect(target.hour).toBeGreaterThanOrEqual(1);
          expect(target.hour).toBeLessThanOrEqual(12);
        }
      }
    });

    it(`${stageId} 스테이지의 선택형 문제는 정답을 포함한 4개의 서로 다른 보기를 만든다`, () => {
      const stage = getStage(stageId);
      const dayEvent = getDayEvent(stage.dayEventId);
      const problems = generateStageProblems(stage, dayEvent, "웨티", createRng(7)) as (
        | SetHandsProblem
        | ChooseClockProblem
      )[];

      const chooseProblems = problems.filter((p): p is ChooseClockProblem => p.mode === "choose-clock");
      expect(chooseProblems.length).toBeGreaterThan(0);

      for (const p of chooseProblems) {
        expect(p.options).toHaveLength(4);
        // 모든 보기가 서로 달라야 한다
        for (let i = 0; i < p.options.length; i++) {
          for (let j = i + 1; j < p.options.length; j++) {
            expect(isSameTime(p.options[i], p.options[j])).toBe(false);
          }
        }
        expect(isSameTime(p.options[p.correctIndex], p.target)).toBe(true);
      }
    });

    it(`${stageId} 스테이지는 시드가 같으면 항상 같은 문제를 만든다 (결정적)`, () => {
      const stage = getStage(stageId);
      const dayEvent = getDayEvent(stage.dayEventId);
      const a = generateStageProblems(stage, dayEvent, "웨티", createRng(123));
      const b = generateStageProblems(stage, dayEvent, "웨티", createRng(123));
      expect(a).toEqual(b);
    });
  }
});

describe("generateStageProblems: 시간의 흐름", () => {
  it("모든 문제가 time-flow이며 target = start + deltaMinutes을 만족한다 (12시 경계 포함)", () => {
    const stage = getStage("flow");
    const dayEvent = getDayEvent(stage.dayEventId);
    const problems = generateStageProblems(stage, dayEvent, "웨티", createRng(99)) as TimeFlowProblem[];

    expect(problems).toHaveLength(stage.problemCount);
    for (const p of problems) {
      expect(p.mode).toBe("time-flow");
    }

    const last = problems[problems.length - 1];
    expect(last.isFinal).toBe(true);
    expect(isSameTime(last.target, dayEvent.time)).toBe(true);
    expect(last.deltaMinutes).toBeGreaterThan(0);
  });
});

describe("generateStageProblems: 하루 일정 완성하기", () => {
  it("슬롯은 하루 시간 순서를 유지하고, 카드는 섞여 있다", () => {
    const stage = getStage("schedule");
    const dayEvent = getDayEvent(stage.dayEventId);
    const [problem] = generateStageProblems(stage, dayEvent, "웨티", createRng(5)) as [ScheduleProblem];

    expect(problem.slots.length).toBeGreaterThanOrEqual(5);
    expect(problem.cards).toHaveLength(problem.slots.length);

    // 카드 집합과 슬롯 집합은 동일해야 한다(순서만 다름)
    const slotIds = new Set(problem.slots.map((s) => s.id));
    const cardIds = new Set(problem.cards.map((c) => c.id));
    expect(cardIds).toEqual(slotIds);
  });
});
