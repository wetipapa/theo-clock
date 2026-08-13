import { Icon } from "../Icon";

export function StarCounter({ count, className }: { count: number; className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full bg-[#fffaf1] border-2 border-[#ffd166] px-3.5 py-1.5 font-extrabold text-[#a9761c] shadow-[0_3px_0_#f1e0c4] ${className ?? ""}`}
      role="status"
      aria-label={`별 ${count}개`}
    >
      <Icon name="star" size={20} />
      <span className="text-lg tabular-nums">{count}</span>
    </div>
  );
}
