'use client';

import { Question, Answer } from '@/types/quiz';
import Card from '@/components/ui/Card';
import OptionButton from './OptionButton';

interface QuestionCardProps {
  question: Question;
  selectedOptionKey?: string;
  onSelectOption: (answer: Answer) => void;
}

export default function QuestionCard({
  question,
  selectedOptionKey,
  onSelectOption,
}: QuestionCardProps) {
  const handleSelect = (optionKey: string) => {
    const option = question.options.find((o) => o.key === optionKey);
    if (option) {
      onSelectOption({
        questionId: question.id,
        optionKey: option.key,
        score: option.score,
      });
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-[#191F28] mb-6 leading-relaxed">{question.question}</h2>
      <div className="space-y-3">
        {question.options.map((option) => (
          <OptionButton
            key={option.key}
            text={option.text}
            selected={selectedOptionKey === option.key}
            onClick={() => handleSelect(option.key)}
          />
        ))}
      </div>
    </Card>
  );
}
