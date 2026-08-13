import type { DayEvent } from "../types";

/**
 * 웨티의 하루 일정 (시간순).
 * 각 스테이지의 "마지막 문제"는 이 목록의 시간을 정답으로 사용해
 * "문제를 풀면 웨티가 실제로 그 행동을 한다"는 이야기 흐름을 만든다.
 * 하루 일정 완성하기(스테이지 6)에서는 이 목록 전체를 카드로 사용한다.
 */
export const DAY_EVENTS: DayEvent[] = [
  {
    id: "bus",
    icon: "bus",
    label: "유치원 버스",
    time: { hour: 8, minute: 0 },
    sceneId: "bus-stop",
    promptTemplate: "{name}야, 유치원 버스가 {time}에 와요! 시계를 맞춰서 버스를 놓치지 말자.",
    actionText: "웨티가 버스를 타고 유치원으로 출발했어요!",
  },
  {
    id: "class",
    icon: "pencil",
    label: "유치원 놀이시간",
    time: { hour: 9, minute: 30 },
    sceneId: "kindergarten",
    promptTemplate: "유치원에서 신나는 놀이 시간은 {time_ieyo}! 시계를 맞춰볼까?",
    actionText: "웨티가 친구들과 신나게 놀았어요!",
  },
  {
    id: "lunch",
    icon: "rice",
    label: "점심시간",
    time: { hour: 12, minute: 20 },
    sceneId: "lunch",
    promptTemplate: "맛있는 점심시간은 {time_ieyo}! 시계를 맞춰줄래?",
    actionText: "웨티가 밥을 냠냠 먹었어요!",
  },
  {
    id: "snack",
    icon: "cookie",
    label: "간식시간",
    time: { hour: 3, minute: 25 },
    sceneId: "snack",
    promptTemplate: "달콤한 간식 시간은 {time_ieyo}! 정확하게 맞혀볼까?",
    actionText: "웨티가 쿠키를 냠냠 먹었어요!",
  },
  {
    id: "bath",
    icon: "bath",
    label: "목욕시간",
    time: { hour: 6, minute: 30 },
    sceneId: "bath",
    promptTemplate: "{name}야, {time}에는 목욕을 해요!",
    actionText: "웨티가 보글보글 목욕을 했어요!",
  },
  {
    id: "sleep",
    icon: "moon",
    label: "잠자리",
    time: { hour: 8, minute: 30 },
    sceneId: "night",
    promptTemplate: "{name}야, {time_iga} 되면 잠자리에 들 시간이에요!",
    actionText: "웨티가 폭 잠들었어요. 잘 자요!",
  },
];

export function getDayEvent(id: string): DayEvent {
  const event = DAY_EVENTS.find((e) => e.id === id);
  if (!event) throw new Error(`Unknown day event: ${id}`);
  return event;
}
