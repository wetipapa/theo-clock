import type { StageId } from "../types";
import { STAGES, getNextStage } from "../data/stages";
import { REWARD_ITEMS } from "../data/rewards";
import type { CustomScheduleEntry, GameState } from "./gameState";
import { createDefaultState } from "./gameState";

export type GameAction =
  | { type: "SET_CHILD_NAME"; name: string }
  | { type: "COMPLETE_ONBOARDING"; name: string }
  | { type: "COMPLETE_STAGE"; stageId: StageId; starsEarned: number }
  | { type: "UNLOCK_STAGE"; stageId: StageId }
  | { type: "UNLOCK_ALL_STAGES" }
  | { type: "UNLOCK_REWARD"; rewardId: string }
  | { type: "SET_SOUND"; on: boolean }
  | { type: "SET_REDUCE_MOTION"; on: boolean }
  | { type: "SET_CUSTOM_SCHEDULE"; entries: CustomScheduleEntry[] }
  | { type: "RESET_PROGRESS" }
  | { type: "HYDRATE"; state: GameState };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SET_CHILD_NAME":
      return { ...state, childName: action.name };

    case "COMPLETE_ONBOARDING":
      return { ...state, onboarded: true, childName: action.name };

    case "COMPLETE_STAGE": {
      const prevProgress = state.stageProgress[action.stageId];
      const timesCompleted = (prevProgress?.timesCompleted ?? 0) + 1;
      const bestStars = Math.max(prevProgress?.bestStars ?? 0, action.starsEarned);
      const nextStage = getNextStage(action.stageId);
      const unlockedStageIds =
        nextStage && !state.unlockedStageIds.includes(nextStage.id)
          ? [...state.unlockedStageIds, nextStage.id]
          : state.unlockedStageIds;

      return {
        ...state,
        starBalance: state.starBalance + action.starsEarned,
        starsLifetime: state.starsLifetime + action.starsEarned,
        stageProgress: {
          ...state.stageProgress,
          [action.stageId]: { timesCompleted, bestStars },
        },
        unlockedStageIds,
      };
    }

    case "UNLOCK_STAGE": {
      if (state.unlockedStageIds.includes(action.stageId)) return state;
      return { ...state, unlockedStageIds: [...state.unlockedStageIds, action.stageId] };
    }

    case "UNLOCK_ALL_STAGES":
      return { ...state, unlockedStageIds: STAGES.map((s) => s.id) };

    case "UNLOCK_REWARD": {
      const reward = REWARD_ITEMS.find((r) => r.id === action.rewardId);
      if (!reward) return state;
      if (state.unlockedRewardIds.includes(action.rewardId)) return state;
      if (state.starBalance < reward.cost) return state;
      return {
        ...state,
        starBalance: state.starBalance - reward.cost,
        unlockedRewardIds: [...state.unlockedRewardIds, action.rewardId],
      };
    }

    case "SET_SOUND":
      return { ...state, settings: { ...state.settings, soundOn: action.on } };

    case "SET_REDUCE_MOTION":
      return { ...state, settings: { ...state.settings, reduceMotion: action.on } };

    case "SET_CUSTOM_SCHEDULE":
      return { ...state, customSchedule: action.entries };

    case "RESET_PROGRESS":
      return { ...createDefaultState(), settings: state.settings };

    case "HYDRATE":
      return action.state;

    default:
      return state;
  }
}
