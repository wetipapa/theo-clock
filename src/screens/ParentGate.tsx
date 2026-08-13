import { useMemo, useState } from "react";
import { Icon } from "../components/Icon";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { playTap } from "../lib/audio";

interface ParentGateProps {
  onPass: () => void;
  onCancel: () => void;
}

/** 아이가 실수로 부모 설정에 들어가지 않도록 막는 간단한 계산 확인 */
export function ParentGate({ onPass, onCancel }: ParentGateProps) {
  const question = useMemo(() => {
    const a = 4 + Math.floor(Math.random() * 5);
    const b = 3 + Math.floor(Math.random() * 5);
    const answer = a + b;
    const wrongs = new Set<number>();
    while (wrongs.size < 2) {
      const delta = 1 + Math.floor(Math.random() * 3);
      const candidate = Math.random() > 0.5 ? answer + delta : Math.max(1, answer - delta);
      if (candidate !== answer) wrongs.add(candidate);
    }
    const options = [...wrongs, answer].sort(() => Math.random() - 0.5);
    return { a, b, answer, options };
  }, []);
  const [wrong, setWrong] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4a3626]/40 backdrop-blur-sm px-6">
      <Card className="w-full max-w-xs px-6 py-7 flex flex-col items-center gap-4">
        <Icon name="lock" size={30} />
        <p className="text-center font-extrabold text-[var(--color-ink)]">부모님만 들어올 수 있어요</p>
        <p className="text-center text-sm font-bold text-[var(--color-ink-soft)]">
          계산 문제를 풀어주세요: {question.a} + {question.b} = ?
        </p>
        <div className="grid grid-cols-3 gap-2 w-full">
          {question.options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                playTap();
                if (opt === question.answer) onPass();
                else setWrong(true);
              }}
              className="h-12 rounded-xl border-2 border-[#f1e0c4] bg-[#fffaf1] font-extrabold text-lg text-[var(--color-ink)] active:scale-95"
            >
              {opt}
            </button>
          ))}
        </div>
        {wrong && <p className="text-xs font-bold text-[#c2701b]">다시 한번 확인해주세요.</p>}
        <Button variant="ghost" size="sm" onClick={onCancel}>
          취소
        </Button>
      </Card>
    </div>
  );
}
