import { ClarificationQuestion } from "@/lib/types";
import React, { useMemo, useState } from "react";

type Props = {
  questionList: ClarificationQuestion[];
  onComplete: (answer: Record<string, AnswerValue>)=> void
};

type AnswerValue = string | string[];

const AgentQuestionary = ({ questionList, onComplete }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});

  const [error, setError] = useState("");

  const currentQuestion = questionList[currentIndex];

  const totalQuestions = questionList.length;

  const questionNumber = currentIndex + 1;

  const progress = useMemo(() => {
    if (!totalQuestions) return 0;

    return Math.round((questionNumber / totalQuestions) * 100);
  }, [questionNumber, totalQuestions]);

  if (!totalQuestions) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-white p-6 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">
        No questions available.
      </div>
    );
  }

  const currentAnswer = answers[currentQuestion.id];

  const updateAnswer = (value: AnswerValue) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));

    setError("");
  };

  const handleSingleSelect = (option: string) => {
    updateAnswer(option);
  };

  const handleMultiSelect = (option: string) => {
    const existing = Array.isArray(currentAnswer) ? currentAnswer : [];

    const alreadySelected = existing.includes(option);

    const updated = alreadySelected
      ? existing.filter((item) => item !== option)
      : [...existing, option];

    updateAnswer(updated);
  };

  const isAnswered = () => {
    const answer = answers[currentQuestion.id];

    if (answer === undefined || answer === null) {
      return false;
    }

    if (Array.isArray(answer)) {
      return answer.length > 0;
    }

    return String(answer).trim().length > 0;
  };

  const handleNext = () => {
    if (!isAnswered()) {
      setError("Please answer this question before continuing.");
      return;
    }

    setError("");

    if (currentIndex === totalQuestions - 1) {
      console.log("Questionnaire completed:", answers);
      onComplete(answers);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setError("");

    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const isOptionSelected = (option: string) => {
    if (currentQuestion.type === "multi_select") {
      return Array.isArray(currentAnswer) && currentAnswer.includes(option);
    }

    return currentAnswer === option;
  };



  return (
    <div className="mx-auto w-full px-4 py-6 transition-colors duration-300 sm:px-6">
  {/* Header + Progress */}
  <div className="mb-8">
    <div className="mb-3 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-zinc-900 dark:text-purple-50">
          Questions {questionNumber} of {totalQuestions}
        </p>

        <p className="mt-1 text-xs text-zinc-500 dark:text-purple-300/60">
          {progress}% completed
        </p>
      </div>

      <span className="text-sm font-semibold text-zinc-700 dark:text-purple-200">
        {progress}%
      </span>
    </div>

    {/* Progress bar */}
    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-purple-950/60">
      <div
        className="h-full rounded-full bg-purple-600 transition-all duration-500 ease-out dark:bg-purple-400"
        style={{
          width: `${progress}%`,
        }}
      />
    </div>
  </div>

  {/* Content */}
  <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-colors duration-300 sm:p-7 dark:border-[#302044] dark:bg-[#170D29]">
    {/* Intro */}
    <div className="mb-8">
      <h2 className="text-xl font-semibold tracking-tight text-zinc-950 transition-colors duration-300 sm:text-2xl dark:text-purple-50">
        Help me process your request
      </h2>

      <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500 dark:text-purple-200/60">
        I need a few details to better understand your request and generate
        the best result for you.
      </p>
    </div>

    {/* Question */}
    <div
      key={currentQuestion.id}
      className="animate-in fade-in slide-in-from-right-2 duration-300"
    >
      <div className="mb-5">
        <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-purple-400/60">
          Question {questionNumber}
        </span>

        <h3 className="text-lg font-medium leading-7 text-zinc-950 transition-colors duration-300 dark:text-purple-50">
          {currentQuestion.question}
        </h3>
      </div>

      {/* Select Options */}
      {(currentQuestion.type === "single_select" ||
        currentQuestion.type === "multi_select") && (
        <div className="space-y-3">
          {currentQuestion.options.map((option) => {
            const selected = isOptionSelected(option);

            return (
              <button
                key={option}
                type="button"
                onClick={() =>
                  currentQuestion.type === "single_select"
                    ? handleSingleSelect(option)
                    : handleMultiSelect(option)
                }
                className={`group flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200 ${
                  selected
                    ? "border-purple-600 bg-purple-600 text-white shadow-sm dark:border-purple-400 dark:bg-purple-500 dark:text-white"
                    : "border-zinc-200 bg-white text-zinc-800 hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-sm dark:border-[#302044] dark:bg-[#100A1F] dark:text-purple-100 dark:hover:border-purple-700 dark:hover:bg-purple-950/30"
                }`}
              >
                {/* Checkbox / Radio */}
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center border transition-all ${
                    currentQuestion.type === "multi_select"
                      ? "rounded-md"
                      : "rounded-full"
                  } ${
                    selected
                      ? "border-white bg-white text-purple-600 dark:border-white dark:bg-white dark:text-purple-600"
                      : "border-zinc-300 dark:border-purple-800"
                  }`}
                >
                  {selected && (
                    <span className="text-xs font-bold">✓</span>
                  )}
                </span>

                <span className="text-sm font-medium">{option}</span>
              </button>
            );
          })}

          {/* Custom option */}
          {currentQuestion.allowCustom && (
            <input
              type="text"
              placeholder={
                currentQuestion.customPlaceholder || "Enter your own answer"
              }
              value={
                typeof currentAnswer === "string" &&
                !currentQuestion.options.includes(currentAnswer)
                  ? currentAnswer
                  : ""
              }
              onChange={(e) => updateAnswer(e.target.value)}
              className="mt-3 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/10 dark:border-[#302044] dark:bg-[#100A1F] dark:text-purple-50 dark:placeholder:text-purple-300/40 dark:focus:border-purple-500 dark:focus:ring-purple-500/10"
            />
          )}
        </div>
      )}

      {/* Text / Number / Date / Time */}
      {currentQuestion.type === "text" && (
        <input
          type="text"
          value={typeof currentAnswer === "string" ? currentAnswer : ""}
          placeholder={
            currentQuestion.customPlaceholder || "Enter your answer"
          }
          onChange={(e) => updateAnswer(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10 dark:border-[#302044] dark:bg-[#100A1F] dark:text-purple-50 dark:placeholder:text-purple-300/40 dark:focus:border-purple-500"
        />
      )}

      {currentQuestion.type === "number" && (
        <input
          type="number"
          value={typeof currentAnswer === "string" ? currentAnswer : ""}
          placeholder={
            currentQuestion.customPlaceholder || "Enter a number"
          }
          onChange={(e) => updateAnswer(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10 dark:border-[#302044] dark:bg-[#100A1F] dark:text-purple-50 dark:placeholder:text-purple-300/40 dark:focus:border-purple-500"
        />
      )}

      {currentQuestion.type === "date" && (
        <input
          type="date"
          value={typeof currentAnswer === "string" ? currentAnswer : ""}
          onChange={(e) => updateAnswer(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-sm text-zinc-900 outline-none transition-all focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10 dark:border-[#302044] dark:bg-[#100A1F] dark:text-purple-50 dark:focus:border-purple-500"
        />
      )}

      {currentQuestion.type === "time" && (
        <input
          type="time"
          value={typeof currentAnswer === "string" ? currentAnswer : ""}
          onChange={(e) => updateAnswer(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-sm text-zinc-900 outline-none transition-all focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10 dark:border-[#302044] dark:bg-[#100A1F] dark:text-purple-50 dark:focus:border-purple-500"
        />
      )}

      {/* Error */}
      {error && (
        <p className="mt-3 text-sm font-medium text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
    </div>

    {/* Footer */}
    <div className="mt-8 flex items-center justify-between gap-3 border-t border-zinc-100 pt-5 transition-colors duration-300 dark:border-[#302044]">
      <button
        type="button"
        onClick={handlePrevious}
        disabled={currentIndex === 0}
        className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#302044] dark:text-purple-200 dark:hover:bg-purple-950/40"
      >
        Previous
      </button>

      <button
        type="button"
        onClick={handleNext}
        className="rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-95 dark:bg-purple-600 dark:text-white dark:hover:bg-purple-500"
      >
        {currentIndex === totalQuestions - 1 ? "Complete" : "Next"}
      </button>
    </div>
  </div>
</div>
  );
};

export default AgentQuestionary;
