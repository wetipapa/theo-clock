import type { StageConfig } from "../types";

export const STAGES: StageConfig[] = [
  {
    id: "hour",
    order: 1,
    title: "정각 맞추기",
    subtitle: "짧은 바늘로 몇 시인지 알아봐요",
    grid: 60,
    dayEventId: "bus",
    problemCount: 5,
    icon: "bus",
    description: "정각(1시, 2시…)을 읽고 맞추는 연습을 해요.",
  },
  {
    id: "half",
    order: 2,
    title: "30분 맞추기",
    subtitle: "긴 바늘이 6에 오면 30분이에요",
    grid: 30,
    dayEventId: "class",
    problemCount: 5,
    icon: "pencil",
    description: "정각과 30분을 읽고 맞추는 연습을 해요.",
  },
  {
    id: "ten",
    order: 3,
    title: "10분 단위 맞추기",
    subtitle: "긴 바늘 눈금을 10분씩 세어봐요",
    grid: 10,
    dayEventId: "lunch",
    problemCount: 5,
    icon: "rice",
    description: "10분 단위로 시간을 읽고 맞추는 연습을 해요.",
  },
  {
    id: "five",
    order: 4,
    title: "5분 단위 맞추기",
    subtitle: "작은 눈금 하나가 1분이에요",
    grid: 5,
    dayEventId: "snack",
    problemCount: 5,
    icon: "cookie",
    description: "5분 단위까지 정확하게 시간을 읽어요.",
  },
  {
    id: "flow",
    order: 5,
    title: "시간의 흐름",
    subtitle: "몇 분 후, 몇 분 전을 알아봐요",
    grid: 5,
    dayEventId: "bath",
    problemCount: 5,
    icon: "bath",
    description: "지금 시간에서 몇 분 후, 몇 분 전을 계산해요.",
  },
  {
    id: "schedule",
    order: 6,
    title: "웨티의 하루 완성",
    subtitle: "하루 일정 카드를 시간에 맞게 놓아요",
    grid: 5,
    dayEventId: "sleep",
    problemCount: 6,
    icon: "moon",
    description: "하루 동안 배운 시간을 모두 모아 웨티의 하루를 완성해요.",
  },
];

export function getStage(id: string): StageConfig {
  const stage = STAGES.find((s) => s.id === id);
  if (!stage) throw new Error(`Unknown stage: ${id}`);
  return stage;
}

export function getNextStage(id: string): StageConfig | null {
  const stage = getStage(id);
  return STAGES.find((s) => s.order === stage.order + 1) ?? null;
}
