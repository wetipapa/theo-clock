import type { ClockTime } from "../lib/time";
import type { StageId } from "../types";
import { STAGES } from "../data/stages";

export interface StageProgress {
  /** 이 스테이지를 완주한 횟수 */
  timesCompleted: number;
  /** 가장 좋았던 시도에서 얻은 별 개수 */
  bestStars: number;
}

export interface CustomScheduleEntry {
  id: string;
  label: string;
  time: ClockTime;
}

export interface GameSettings {
  soundOn: boolean;
  reduceMotion: boolean;
}

export interface GameState {
  version: 1;
  onboarded: boolean;
  childName: string;
  starBalance: number;
  starsLifetime: number;
  unlockedStageIds: StageId[];
  stageProgress: Partial<Record<StageId, StageProgress>>;
  unlockedRewardIds: string[];
  settings: GameSettings;
  customSchedule: CustomScheduleEntry[];
}

export function createDefaultState(): GameState {
  return {
    version: 1,
    onboarded: false,
    childName: "",
    starBalance: 0,
    starsLifetime: 0,
    // 모든 스테이지를 처음부터 자유롭게 고를 수 있게 한다 (깨야만 다음이 열리는 방식이 아님)
    unlockedStageIds: STAGES.map((s) => s.id),
    stageProgress: {},
    unlockedRewardIds: [],
    settings: {
      soundOn: true,
      reduceMotion: false,
    },
    customSchedule: [],
  };
}
