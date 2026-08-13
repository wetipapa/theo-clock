import type {
  ChooseClockProblem,
  DayEvent,
  Problem,
  ScheduleCard,
  ScheduleProblem,
  SetHandsProblem,
  StageConfig,
  TimeFlowProblem,
} from "../types";
import { DAY_EVENTS } from "../data/schedule";
import type { ClockTime, SnapMinutes } from "./time";
import { addMinutes, formatKoreanTime, isSameTime } from "./time";
import { type Rng, pickFrom, pickInt, shuffle } from "./rng";
import { withEulReul, withEuroRo, withIGa, withIeyoYeyo } from "./korean";

// {time_eul}="8시를"/"8시 30분을", {time_euro}="8시로"/"8시 30분으로" 처럼
// 받침 유무에 맞는 조사가 이미 붙은 형태로 치환값을 준비해 문법 오류를 막는다.
const SET_HANDS_TEMPLATES = [
  "{name}아, 시계 바늘을 돌려서 {time_eul} 만들어볼까?",
  "지금 시계를 {time_euro} 맞춰줄래?",
  "짧은 바늘과 긴 바늘을 움직여서 {time_eul} 표시해보자!",
];

const CHOOSE_CLOCK_TEMPLATES = [
  "{time_eul} 가리키는 시계는 어떤 걸까요?",
  "{name}아, {time}인 시계를 찾아줄래?",
  "여러 시계 중에서 {time_eul} 가리키는 시계를 골라보자!",
];

const FLOW_AFTER_TEMPLATES = ["지금은 {start_ieyo}. {delta}분 후에는 몇 시일까요?", "{start}에서 {delta}분이 지나면 몇 시가 될까요?"];
const FLOW_BEFORE_TEMPLATES = ["지금은 {start_ieyo}. {delta}분 전에는 몇 시였을까요?", "{start}보다 {delta}분 전은 몇 시일까요?"];
const FLOW_FINAL_TEMPLATE = "{name}야, 지금은 {start_ieyo}. {delta}분 후면 {label} 시간이에요! 시계를 몇 시로 맞추면 될까요?";

const SCHEDULE_PROMPT = "웨티의 하루를 순서대로 완성해볼까요? 카드를 알맞은 시간에 놓아주세요!";

/** grid에서 허용되는 분 목록 (예: 10분 그리드 -> 0,10,20,...,50) */
function allowedMinutes(grid: SnapMinutes): number[] {
  const steps: number[] = [];
  for (let m = 0; m < 60; m += grid) steps.push(m);
  return steps;
}

function wrapHour(hour: number, offset: number): number {
  return (((hour - 1 + offset) % 12) + 12) % 12 + 1;
}

function replaceVars(template: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce((acc, [key, value]) => acc.replaceAll(`{${key}}`, value), template);
}

function randomTimeOnGrid(grid: SnapMinutes, rng: Rng, avoid: ClockTime[] = []): ClockTime {
  const minutes = allowedMinutes(grid);
  for (let attempt = 0; attempt < 50; attempt++) {
    const candidate: ClockTime = { hour: pickInt(rng, 1, 12), minute: pickFrom(rng, minutes) };
    if (!avoid.some((a) => isSameTime(a, candidate))) return candidate;
  }
  // 회피 목록과 계속 겹치면(가능성은 매우 낮음) 마지막 후보를 그대로 사용
  return { hour: pickInt(rng, 1, 12), minute: pickFrom(rng, minutes) };
}

/** 알맞은 시계 고르기용 오답 3개 생성. 아이들이 흔히 헷갈리는 패턴을 반영한다 */
function buildClockOptions(target: ClockTime, grid: SnapMinutes, rng: Rng): { options: ClockTime[]; correctIndex: number } {
  const minutes = allowedMinutes(grid);
  const candidates: ClockTime[] = [target];

  const tryAdd = (candidate: ClockTime) => {
    if (candidates.length >= 4) return;
    if (candidates.some((c) => isSameTime(c, candidate))) return;
    candidates.push(candidate);
  };

  // 시침을 헷갈린 경우 (분은 같은데 시가 다름)
  tryAdd({ hour: wrapHour(target.hour, 1), minute: target.minute });
  tryAdd({ hour: wrapHour(target.hour, -1), minute: target.minute });
  // 분침을 헷갈린 경우 (시는 같은데 분이 다름)
  tryAdd({ hour: target.hour, minute: minutes[(minutes.indexOf(target.minute) + 1) % minutes.length] });
  // 긴 바늘 반대쪽을 읽은 경우 (예: 10분과 50분 혼동)
  tryAdd({ hour: target.hour, minute: (60 - target.minute) % 60 });

  let guard = 0;
  while (candidates.length < 4 && guard < 100) {
    guard++;
    tryAdd(randomTimeOnGrid(grid, rng));
  }

  const shuffled = shuffle(rng, candidates);
  const correctIndex = shuffled.findIndex((c) => isSameTime(c, target));
  return { options: shuffled, correctIndex };
}

function buildClockProblems(stage: StageConfig, dayEvent: DayEvent, childName: string, rng: Rng): Problem[] {
  const problems: Problem[] = [];
  let prevTarget: ClockTime | null = null;

  for (let i = 0; i < stage.problemCount; i++) {
    const isFinal = i === stage.problemCount - 1;
    const mode: "set-hands" | "choose-clock" = isFinal ? "set-hands" : i % 2 === 0 ? "choose-clock" : "set-hands";
    const target: ClockTime = isFinal
      ? dayEvent.time
      : randomTimeOnGrid(stage.grid, rng, [prevTarget, dayEvent.time].filter((t): t is ClockTime => t !== null));
    prevTarget = target;
    const timeText = formatKoreanTime(target);
    const id = `${stage.id}-${i}`;

    const vars = {
      name: childName,
      time: timeText,
      time_eul: withEulReul(timeText),
      time_euro: withEuroRo(timeText),
      time_ieyo: withIeyoYeyo(timeText),
      time_iga: withIGa(timeText),
    };

    if (mode === "set-hands") {
      const template = isFinal ? dayEvent.promptTemplate : pickFrom(rng, SET_HANDS_TEMPLATES);
      const promptText = replaceVars(template, vars);
      const problem: SetHandsProblem = { id, mode: "set-hands", grid: stage.grid, target, promptText, isFinal };
      problems.push(problem);
    } else {
      const { options, correctIndex } = buildClockOptions(target, stage.grid, rng);
      const promptText = replaceVars(pickFrom(rng, CHOOSE_CLOCK_TEMPLATES), vars);
      const problem: ChooseClockProblem = {
        id,
        mode: "choose-clock",
        grid: stage.grid,
        target,
        promptText,
        options,
        correctIndex,
        isFinal,
      };
      problems.push(problem);
    }
  }
  return problems;
}

const FLOW_DELTA_OPTIONS = [5, 10, 15, 20, 30, 40, 45];
const FLOW_FINAL_DELTA_OPTIONS = [15, 20, 30];

function buildFlowProblems(stage: StageConfig, dayEvent: DayEvent, childName: string, rng: Rng): TimeFlowProblem[] {
  const problems: TimeFlowProblem[] = [];
  let prevStart: ClockTime | null = null;

  for (let i = 0; i < stage.problemCount; i++) {
    const isFinal = i === stage.problemCount - 1;
    let start: ClockTime;
    let deltaMinutes: number;
    let target: ClockTime;
    let promptText: string;

    if (isFinal) {
      const delta = pickFrom(rng, FLOW_FINAL_DELTA_OPTIONS);
      start = addMinutes(dayEvent.time, -delta);
      deltaMinutes = delta;
      target = dayEvent.time;
      const startText = formatKoreanTime(start);
      promptText = replaceVars(FLOW_FINAL_TEMPLATE, {
        name: childName,
        start: startText,
        start_ieyo: withIeyoYeyo(startText),
        delta: String(delta),
        label: dayEvent.label,
      });
    } else {
      const delta = pickFrom(rng, FLOW_DELTA_OPTIONS);
      const direction = pickFrom(rng, [1, -1]);
      start = randomTimeOnGrid(5, rng, prevStart ? [prevStart] : []);
      deltaMinutes = direction * delta;
      target = addMinutes(start, deltaMinutes);
      const templates = direction > 0 ? FLOW_AFTER_TEMPLATES : FLOW_BEFORE_TEMPLATES;
      const startText = formatKoreanTime(start);
      promptText = replaceVars(pickFrom(rng, templates), {
        name: childName,
        start: startText,
        start_ieyo: withIeyoYeyo(startText),
        delta: String(delta),
      });
    }

    prevStart = start;
    problems.push({
      id: `${stage.id}-${i}`,
      mode: "time-flow",
      grid: 5,
      start,
      deltaMinutes,
      target,
      promptText,
      isFinal,
    });
  }
  return problems;
}

function buildScheduleProblem(childName: string, rng: Rng): ScheduleProblem {
  const slots: ScheduleCard[] = DAY_EVENTS.map((e) => ({ id: e.id, label: e.label, icon: e.icon, time: e.time }));
  let cards = shuffle(rng, slots);
  let guard = 0;
  while (cards.every((c, i) => c.id === slots[i].id) && guard < 10) {
    cards = shuffle(rng, slots);
    guard++;
  }
  return {
    id: "schedule-0",
    mode: "schedule",
    grid: 5,
    slots,
    cards,
    promptText: replaceVars(SCHEDULE_PROMPT, { name: childName }),
    isFinal: true,
  };
}

/** 스테이지에 맞는 문제 목록을 생성한다 */
export function generateStageProblems(stage: StageConfig, dayEvent: DayEvent, childName: string, rng: Rng): Problem[] {
  if (stage.id === "schedule") return [buildScheduleProblem(childName, rng)];
  if (stage.id === "flow") return buildFlowProblems(stage, dayEvent, childName, rng);
  return buildClockProblems(stage, dayEvent, childName, rng);
}
