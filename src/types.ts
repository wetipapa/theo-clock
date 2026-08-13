import type { ClockTime, SnapMinutes } from "./lib/time";

export type StageId = "hour" | "half" | "ten" | "five" | "flow" | "schedule";

export type GameMode = "set-hands" | "choose-clock" | "time-flow" | "schedule";

export type IconName =
  | "sun"
  | "bus"
  | "pencil"
  | "rice"
  | "cookie"
  | "swing"
  | "bath"
  | "moon"
  | "star"
  | "home"
  | "gift"
  | "clock"
  | "sparkle"
  | "settings"
  | "lock"
  | "check"
  | "arrow"
  | "bed"
  | "lamp"
  | "plant"
  | "teddy"
  | "poster"
  | "rug"
  | "shelf"
  | "kite";

export interface DayEvent {
  id: string;
  icon: IconName;
  label: string;
  time: ClockTime;
  sceneId: SceneId;
  /** {name}과 {time} 플레이스홀더를 포함한 안내 문구 */
  promptTemplate: string;
  /** 정답을 맞혔을 때 웨티가 하는 행동 설명 */
  actionText: string;
}

export type SceneId = "home-morning" | "bus-stop" | "kindergarten" | "lunch" | "snack" | "bath" | "night";

export interface StageConfig {
  id: StageId;
  order: number;
  title: string;
  subtitle: string;
  grid: SnapMinutes;
  dayEventId: string;
  problemCount: number;
  icon: IconName;
  description: string;
}

export interface BaseProblem {
  id: string;
  mode: GameMode;
  grid: SnapMinutes;
  promptText: string;
  isFinal: boolean;
}

export interface SetHandsProblem extends BaseProblem {
  mode: "set-hands";
  target: ClockTime;
}

export interface ChooseClockProblem extends BaseProblem {
  mode: "choose-clock";
  target: ClockTime;
  options: ClockTime[];
  correctIndex: number;
}

export interface TimeFlowProblem extends BaseProblem {
  mode: "time-flow";
  start: ClockTime;
  deltaMinutes: number;
  target: ClockTime;
}

export interface ScheduleCard {
  id: string;
  label: string;
  icon: IconName;
  time: ClockTime;
}

export interface ScheduleProblem extends BaseProblem {
  mode: "schedule";
  slots: ScheduleCard[]; // 시간순 정렬된 정답 슬롯
  cards: ScheduleCard[]; // 섞인 카드
}

export type Problem = SetHandsProblem | ChooseClockProblem | TimeFlowProblem | ScheduleProblem;

export interface RewardItem {
  id: string;
  label: string;
  icon: IconName;
  cost: number;
  /** 방 안에서의 배치 위치 (퍼센트 좌표) */
  position: { x: number; y: number };
}
