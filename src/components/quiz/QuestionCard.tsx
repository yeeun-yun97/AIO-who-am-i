'use client';

import { Question, Answer } from '@/types/quiz';
import Card from '@/components/ui/Card';
import OptionButton from './OptionButton';

interface QuestionCardProps {
  question: Question;
  selectedOptionId?: string;
  onSelectOption: (answer: Answer) => void;
}

export default function QuestionCard({
  question,
  selectedOptionId,
  onSelectOption,
}: QuestionCardProps) {
  const handleSelect = (optionId: string) => {
    const option = question.options.find((o) => o.id === optionId);
    if (option) {
      onSelectOption({
        questionId: question.id,
        optionId: option.id,
        scores: option.scores,
      });
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-[#191F28] mb-6 leading-relaxed">{question.text}</h2>
      <div className="space-y-3">
        {question.options.map((option) => (
          <OptionButton
            key={option.id}
            text={option.text}
            selected={selectedOptionId === option.id}
            onClick={() => handleSelect(option.id)}
          />
        ))}
      </div>
    </Card>
  );
}
