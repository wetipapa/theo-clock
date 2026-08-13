/**
 * 한글 조사(을/를, 으로/로, 이에요/예요, 이/가) 자동 선택.
 * "8시"처럼 받침 없는 말과 "8시 30분"처럼 받침 있는 말이 섞여 나오므로
 * 문제 문구를 자연스럽게 만들려면 받침 유무를 계산해서 조사를 붙여야 한다.
 */
function hasBatchim(text: string): boolean {
  const lastChar = text.trim().slice(-1);
  const code = lastChar.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return false; // 한글 음절이 아니면 받침 없다고 간주
  return (code - 0xac00) % 28 !== 0;
}

export function withEulReul(word: string): string {
  return word + (hasBatchim(word) ? "을" : "를");
}

export function withEuroRo(word: string): string {
  const lastChar = word.trim().slice(-1);
  const code = lastChar.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return `${word}로`;
  const jong = (code - 0xac00) % 28;
  // 받침 없음(0) 또는 ㄹ받침(8)이면 '로', 그 외에는 '으로'
  return word + (jong === 0 || jong === 8 ? "로" : "으로");
}

export function withIeyoYeyo(word: string): string {
  return word + (hasBatchim(word) ? "이에요" : "예요");
}

export function withIGa(word: string): string {
  return word + (hasBatchim(word) ? "이" : "가");
}

/** 이름을 부를 때 쓰는 호격 조사 (받침 있으면 "아", 없으면 "야") */
export function withAYa(word: string): string {
  return word + (hasBatchim(word) ? "아" : "야");
}
