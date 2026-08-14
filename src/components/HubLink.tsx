/**
 * 허브(WTPP PLAY)로 돌아가는 링크.
 *
 * 서비스마다 따로 떨어져 있으면 한 게임을 끝낸 아이가 다른 게임이 있다는 걸 알 수 없다.
 * 허브가 있는데 한 방향으로만 흐르던 걸 되돌리는 자리다.
 *
 * 게임 중에는 넣지 않는다 — 눈에 띄면 한 판을 끝내기 전에 빠져나간다.
 * 끝난 뒤(결과·완료 화면)와 첫 화면 아래에만 둔다. 블로그 링크와 같은 원칙이다.
 */
export function HubLink({ className = "" }: { className?: string }) {
  return (
    <p className={`text-center text-xs font-bold text-[var(--color-ink-soft)] ${className}`}>
      <a
        href="https://play.wetipapa.com"
        className="underline decoration-2 underline-offset-4 hover:text-[var(--color-ink)]"
      >
        WTPP PLAY
      </a>
      에서 다른 게임도 만나보세요
    </p>
  );
}
