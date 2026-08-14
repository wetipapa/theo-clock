import type { RewardItem } from "../types";

/**
 * 방을 꾸미는 해금 아이템.
 *
 * **크기는 아이콘 크기가 아니라 "방에서의 키"로 정한다.**
 * 예전에는 아이콘 뷰박스 크기(px)를 그대로 줬는데, 아이콘마다 그림이 뷰박스를 채우는
 * 정도가 달라서 같은 값을 줘도 어떤 건 크고 어떤 건 작게 나왔다. 침대보다 곰인형이
 * 커 보이는 식이라 방으로 읽히지 않았다.
 * 지금은 `art`(그림이 실제로 차지하는 영역)와 `scale`(웨티 키 대비 높이)로 계산한다.
 * 스탠드는 웨티만큼 크고, 곰인형은 웨티 무릎에도 못 오는 게 눈에 보인다.
 *
 * 배치는 세 층이다. 큰 가구는 벽에 붙이고(`floorBack`), 작은 물건이 그 앞에 선다(`floor`).
 * 한 줄로 세우면 폭이 모자라 서로 겹친다.
 */
export const REWARD_ITEMS: RewardItem[] = [
  // 바닥 — 앞줄
  { id: "rug",       label: "포근한 러그",   icon: "rug",       cost: 3,  layer: "floor",     x: 50, art: [3, 7, 21, 17],        scale: 0.80, squashY: 0.34 },
  { id: "teddy",     label: "곰인형",       icon: "teddy",     cost: 4,  layer: "floor",     x: 82, art: [4.8, 3.8, 19.2, 17.5], scale: 0.26 },
  { id: "plant",     label: "화분",         icon: "plant",     cost: 6,  layer: "floor",     x: 70, art: [7, 8, 17, 20],        scale: 0.40 },
  { id: "toybox",    label: "장난감 상자",   icon: "toybox",    cost: 7,  layer: "floor",     x: 32, art: [2, 8.5, 22, 20],      scale: 0.32 },
  { id: "lamp",      label: "별빛 스탠드",   icon: "lamp",      cost: 15, layer: "floor",     x: 10, art: [7, 4, 17, 21],        scale: 0.92 },

  // 바닥 — 벽에 붙는 큰 가구
  { id: "bed",       label: "포근한 침대",   icon: "bed",       cost: 12, layer: "floorBack", x: 28, art: [2, 9, 22, 20],        scale: 0.38 },
  { id: "desk",      label: "작은 책상",     icon: "desk",      cost: 9,  layer: "floorBack", x: 63, art: [2, 9, 22, 20],        scale: 0.40 },

  // 벽과 천장
  { id: "garland",   label: "별 가랜드",     icon: "garland",   cost: 10, layer: "wall", x: 50, y: 8,  art: [2, 4.4, 22, 16.2],   scale: 0.28 },
  { id: "wallclock", label: "벽시계",       icon: "wallclock", cost: 5,  layer: "wall", x: 20, y: 16, art: [3, 3, 21, 21],       scale: 0.22 },
  { id: "kite",      label: "구름 연",      icon: "kite",      cost: 11, layer: "wall", x: 30, y: 27, art: [5, 2, 19, 24],       scale: 0.42 },
  { id: "balloon",   label: "풍선",         icon: "balloon",   cost: 5,  layer: "wall", x: 91, y: 20, art: [5.5, 1.5, 18.5, 23], scale: 0.30 },
  { id: "poster",    label: "무지개 액자",   icon: "poster",    cost: 8,  layer: "wall", x: 76, y: 15, art: [3, 3, 21, 17],       scale: 0.34 },
  { id: "shelf",     label: "장난감 선반",   icon: "shelf",     cost: 13, layer: "wall", x: 82, y: 38, art: [3, 4, 21, 20],       scale: 0.62 },
  { id: "window",    label: "창문",         icon: "window",    cost: 14, layer: "wall", x: 50, y: 30, art: [3, 2, 21, 19.1],     scale: 0.72 },
];

export function getRewardItem(id: string): RewardItem | undefined {
  return REWARD_ITEMS.find((r) => r.id === id);
}
