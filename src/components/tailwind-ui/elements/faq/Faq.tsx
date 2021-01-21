import clsx from 'clsx';
import React, { ReactNode } from 'react';

import { SvgOutlineChevronDown } from '../../svg/heroicon/outline';

export interface QuestionType {
  id: string;
  question: ReactNode;
  answer: ReactNode;
}

export interface FaqProps {
  title: ReactNode;
  questions: Array<QuestionType>;
  selectedQuestionId: string;
  onSelect: (id: string) => void;
}

export interface QuestionProps {
  selectedQuestionId: string;
  onSelect: (id: string) => void;
  question: QuestionType;
}

const Question = (props: QuestionProps) => {
  const {
    question: { id, question, answer },
    selectedQuestionId,
    onSelect,
  } = props;

  const onToggle = () => {
    if (id === selectedQuestionId) onSelect('');
    else onSelect(id);
  };

  return (
    <div id={id} className="pt-6">
      <dt className="text-lg">
        <button
          onClick={onToggle}
          type="button"
          className="text-left w-full flex justify-between items-start text-neutral-400"
        >
          <span className="font-medium text-neutral-900">{question}</span>
          <span className="ml-6 h-7 flex items-center">
            <SvgOutlineChevronDown
              className={clsx('w-6 h-6 transform', {
                '-rotate-180': selectedQuestionId === id,
              })}
            />
          </span>
        </button>
      </dt>
      <dd className={clsx('mt-2 pr-12', { hidden: selectedQuestionId !== id })}>
        <p className="text-base text-neutral-500">{answer}</p>
      </dd>
    </div>
  );
};

export function Faq(props: FaqProps) {
  const { title, questions, selectedQuestionId, onSelect } = props;

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {title}
          </h2>
          <dl className="mt-6 space-y-6 divide-y divide-gray-200">
            {questions.map((question) => (
              <Question
                key={question.id}
                selectedQuestionId={selectedQuestionId}
                question={question}
                onSelect={onSelect}
              />
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
