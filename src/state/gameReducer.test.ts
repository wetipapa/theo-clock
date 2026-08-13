import { describe, expect, it } from "vitest";
import { gameReducer } from "./gameReducer";
import { createDefaultState } from "./gameState";
import { STAGES } from "../data/stages";

describe("gameReducer", () => {
  it("모든 스테이지가 처음부터 열려 있다", () => {
    const state = createDefaultState();
    expect(state.unlockedStageIds).toHaveLength(STAGES.length);
  });

  it("스테이지를 완료하면 별이 쌓이고 진행도가 기록된다", () => {
    const state = createDefaultState();
    const next = gameReducer(state, { type: "COMPLETE_STAGE", stageId: "hour", starsEarned: 5 });

    expect(next.starBalance).toBe(5);
    expect(next.starsLifetime).toBe(5);
    expect(next.unlockedStageIds).toContain("half");
    expect(next.stageProgress.hour).toEqual({ timesCompleted: 1, bestStars: 5 });
  });

  it("같은 스테이지를 다시 완료하면 최고 별 기록만 갱신한다", () => {
    let state = createDefaultState();
    state = gameReducer(state, { type: "COMPLETE_STAGE", stageId: "hour", starsEarned: 3 });
    state = gameReducer(state, { type: "COMPLETE_STAGE", stageId: "hour", starsEarned: 5 });
    state = gameReducer(state, { type: "COMPLETE_STAGE", stageId: "hour", starsEarned: 2 });

    expect(state.stageProgress.hour).toEqual({ timesCompleted: 3, bestStars: 5 });
    expect(state.starBalance).toBe(10); // 3 + 5 + 2
  });

  it("별이 충분할 때만 보상을 해금한다", () => {
    let state = createDefaultState();
    state = gameReducer(state, { type: "COMPLETE_STAGE", stageId: "hour", starsEarned: 2 });
    // rug 비용은 3 -> 별 2개로는 부족
    const failed = gameReducer(state, { type: "UNLOCK_REWARD", rewardId: "rug" });
    expect(failed.unlockedRewardIds).not.toContain("rug");
    expect(failed.starBalance).toBe(2);

    state = gameReducer(state, { type: "COMPLETE_STAGE", stageId: "hour", starsEarned: 2 });
    const success = gameReducer(state, { type: "UNLOCK_REWARD", rewardId: "rug" });
    expect(success.unlockedRewardIds).toContain("rug");
    expect(success.starBalance).toBe(1);
  });

  it("보상을 중복 해금하지 않는다", () => {
    let state = createDefaultState();
    state = gameReducer(state, { type: "COMPLETE_STAGE", stageId: "hour", starsEarned: 20 });
    state = gameReducer(state, { type: "UNLOCK_REWARD", rewardId: "rug" });
    const again = gameReducer(state, { type: "UNLOCK_REWARD", rewardId: "rug" });
    expect(again.starBalance).toBe(state.starBalance);
  });

  it("RESET_PROGRESS는 설정을 보존하고 나머지는 초기화한다", () => {
    let state = createDefaultState();
    state = gameReducer(state, { type: "SET_SOUND", on: false });
    state = gameReducer(state, { type: "COMPLETE_STAGE", stageId: "hour", starsEarned: 5 });
    const reset = gameReducer(state, { type: "RESET_PROGRESS" });

    expect(reset.settings.soundOn).toBe(false);
    expect(reset.starBalance).toBe(0);
    expect(reset.unlockedStageIds).toHaveLength(STAGES.length);
  });

  it("UNLOCK_ALL_STAGES는 모든 스테이지를 즉시 연다", () => {
    const state = createDefaultState();
    const next = gameReducer(state, { type: "UNLOCK_ALL_STAGES" });
    expect(next.unlockedStageIds).toHaveLength(6);
  });
});
