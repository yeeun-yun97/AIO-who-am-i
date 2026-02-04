import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// 이름 마스킹 함수 (예: 홍길동 → 홍*동, 김수 → 김*)
export function maskName(name: string): string {
  if (!name || name.length === 0) return '';
  if (name.length === 1) return name;
  if (name.length === 2) return name[0] + '*';

  const first = name[0];
  const last = name[name.length - 1];
  const middle = '*'.repeat(name.length - 2);
  return first + middle + last;
}
