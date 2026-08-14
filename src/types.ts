import type { ClockTime, SnapMinutes } from "./lib/time";

export type StageId = "hour" | "half" | "ten" | "five" | "flow";

export type GameMode = "set-hands" | "choose-clock" | "time-flow";

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
  /** {time} 플레이스홀더를 포함한 안내 문구 */
  promptTemplate: string;
  /** 정답을 맞혔을 때 이어지는 장면 설명 */
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

export type Problem = SetHandsProblem | ChooseClockProblem | TimeFlowProblem;

export interface RewardItem {
  id: string;
  label: string;
  icon: IconName;
  cost: number;
  /**
   * 어디에 놓이는 물건인가.
   * `wall`은 x/y 퍼센트 좌표의 중심에, `floor`는 x 좌표의 바닥선 위에 세운다.
   * 바닥 물건을 y좌표로 일일이 맞추면 조금만 틀어져도 공중에 뜬 것처럼 보인다.
   */
  layer: "wall" | "floor";
  /** 가로 위치(%) — 방 미리보기 폭 기준 */
  x: number;
  /** 세로 위치(%) — `wall`일 때만 쓴다 */
  y?: number;
  /** 그려질 크기(px) — 가구다운 덩치가 나오도록 아이템마다 다르게 준다 */
  size: number;
}
