import type { Metadata } from 'next';
import './globals.css';
import { QuizProvider } from '@/contexts/QuizContext';

export const metadata: Metadata = {
  title: '나를 알아가는 여정',
  description: '33개의 질문으로 알아보는 MBTI와 기질',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-white">
        <QuizProvider>{children}</QuizProvider>
      </body>
    </html>
  );
}
