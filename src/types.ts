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
  | "window"
  | "wallclock"
  | "balloon"
  | "desk"
  | "toybox"
  | "garland"
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
   * `floor`는 바닥선 위에 세우고, `wall`은 x/y 좌표를 그림의 중심에 맞춘다.
   * `floorBack`은 벽에 붙는 큰 가구 — 한 줄에 다 세우면 폭이 모자라서 뒷줄에 둔다.
   */
  layer: "wall" | "floor" | "floorBack";
  /** 가로 위치(%) — 그림의 가운데가 여기에 온다 */
  x: number;
  /** 세로 위치(%) — `wall`일 때만 쓴다 */
  y?: number;
  /**
   * 아이콘 그림이 24칸 뷰박스에서 실제로 차지하는 영역 [x0, y0, x1, y1].
   * 아이콘마다 뷰박스를 채우는 정도가 달라서, 같은 size를 줘도 그려지는 크기가 제각각이다.
   * 이 값이 있어야 "방에서 이만큼 커야 한다"를 실제 픽셀로 옮길 수 있다.
   */
  art: [number, number, number, number];
  /** 방에서 차지할 높이 — 웨티 키를 1로 본 비율 */
  scale: number;
  /** 러그처럼 위에서 내려다본 그림을 옆모습 방에 깔 때 눌러 주는 비율 */
  squashY?: number;
}
