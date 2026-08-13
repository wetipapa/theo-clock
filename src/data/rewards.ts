import type { RewardItem } from "../types";

/**
 * 웨티의 방을 꾸미는 해금 아이템.
 * position은 방 화면 안에서의 배치 위치(%) — RoomScreen에서 절대좌표로 사용한다.
 */
export const REWARD_ITEMS: RewardItem[] = [
  { id: "rug", label: "포근한 러그", icon: "rug", cost: 3, position: { x: 50, y: 86 } },
  { id: "plant", label: "화분", icon: "plant", cost: 4, position: { x: 12, y: 68 } },
  { id: "teddy", label: "곰인형", icon: "teddy", cost: 5, position: { x: 82, y: 72 } },
  { id: "lamp", label: "별빛 스탠드", icon: "lamp", cost: 6, position: { x: 85, y: 40 } },
  { id: "poster", label: "무지개 액자", icon: "poster", cost: 8, position: { x: 22, y: 22 } },
  { id: "shelf", label: "장난감 선반", icon: "shelf", cost: 10, position: { x: 78, y: 20 } },
  { id: "kite", label: "구름 연", icon: "kite", cost: 12, position: { x: 15, y: 15 } },
  { id: "bed", label: "포근한 침대 이불", icon: "bed", cost: 15, position: { x: 45, y: 55 } },
];

export function getRewardItem(id: string): RewardItem | undefined {
  return REWARD_ITEMS.find((r) => r.id === id);
}
