# 캐릭터 이미지

`WTPP/brand-assets/confirmed/character-mono/`의 확정 자산에서 가져온 사본이다.
**여기서 그림을 고치지 않는다.** 원본을 바꿔야 하면 `brand-assets` 쪽을 고치고 다시 뽑는다.
(각 저장소는 독립 배포되므로 `brand-assets`를 코드에서 직접 참조할 수 없다.)

| 파일 | 원본 |
|---|---|
| `weti-idle.png` | `weti_mono_00_master.png` |
| `weti-blink.png` | `weti_mono_00_master_blink.png` |
| `weti-happy.png` | `weti_mono_01_happy.png` |
| `weti-proud.png` | `weti_mono_06_proud.png` |
| `weti-thinking.png` | `weti_mono_05_thinking.png` |
| `weti-sleepy.png` | `weti_mono_08_sleepy.png` |
| `weti-scene-clock.png` | `character-scenes/transparent/weti_scene_clock.png` (첫 화면) |
| `weti-fullbody.png` | `character-fullbody/transparent/weti_fullbody_02_thumbsup.png` (방 꾸미기) |
| `wetipapa-idle.png` | `wetipapa_mono_00_master.png` |

## 처리 방식

원본은 1120x1120 흰 배경 선화다. 아래 두 가지만 했고 그림은 건드리지 않았다.

1. **언매트** — 흰 배경을 알파로 되돌린다(`alpha = 255 - 밝기`, 색은 검정).
   얼굴 안쪽으로 배지 색이 비쳐 배지 위에 자연스럽게 얹힌다.
2. **400px로 축소** — 화면에서 가장 크게 쓰는 곳이 150px이라 2~3배수를 덮는다.
   원본을 그대로 넣으면 장당 200~900KB라 게임 로딩에 부담이 된다.

`weti-fullbody.png`는 위 두 가지 대신 **투명본을 내용에 딱 맞춰 잘라** 세로 560px로 줄였다.
방 안에서 키(세로)를 기준으로 물건 크기를 계산하기 때문에, 그림 주변에 여백이 남아 있으면
"웨티 키"가 실제보다 커져서 가구 비율이 전부 어긋난다.

`weti-blink.png`는 `weti-idle.png`와 눈만 다르고 나머지 선은 동일해서,
두 장을 번갈아 띄우면 눈 깜빡임이 된다 (`WetiCharacter`의 `animate` 참고).
