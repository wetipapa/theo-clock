import type { RewardItem } from "../types";

/**
 * 방을 꾸미는 해금 아이템.
 *
 * 좌표는 겹치지 않게 손으로 배치했다. 예전에는 모든 아이템이 중심 기준 x/y 퍼센트라
 * 러그(50, 86)와 이불(45, 55)이 한가운데 서 있는 캐릭터 뒤에 완전히 가려져,
 * 사도 방에 아무 변화가 없는 것처럼 보였다.
 *
 * - `floor`: 바닥선 위에 세운다. x는 캐릭터가 서 있는 가운데(40~60%)를 비워 둔다.
 * - `wall`: 벽면 중심 좌표. 바닥 물건과 세로로 겹치지 않게 위쪽에 둔다.
 */
export const REWARD_ITEMS: RewardItem[] = [
  { id: "rug", label: "포근한 러그", icon: "rug", cost: 3, layer: "floor", x: 50, size: 148 },
  { id: "plant", label: "화분", icon: "plant", cost: 4, layer: "floor", x: 33, size: 54 },
  { id: "teddy", label: "곰인형", icon: "teddy", cost: 5, layer: "floor", x: 67, size: 50 },
  { id: "lamp", label: "별빛 스탠드", icon: "lamp", cost: 6, layer: "floor", x: 87, size: 68 },
  { id: "poster", label: "무지개 액자", icon: "poster", cost: 8, layer: "wall", x: 21, y: 35, size: 62 },
  { id: "shelf", label: "장난감 선반", icon: "shelf", cost: 10, layer: "wall", x: 79, y: 34, size: 68 },
  { id: "kite", label: "구름 연", icon: "kite", cost: 12, layer: "wall", x: 50, y: 22, size: 54 },
  { id: "bed", label: "포근한 침대 이불", icon: "bed", cost: 15, layer: "floor", x: 18, size: 82 },
];

export function getRewardItem(id: string): RewardItem | undefined {
  return REWARD_ITEMS.find((r) => r.id === id);
}
