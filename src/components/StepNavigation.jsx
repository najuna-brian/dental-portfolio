import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Bottom navigation bar for step wizard
 */
export default function StepNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onGenerate,
  isLastStep = false,
}) {
  return (
    <div className="flex items-center justify-between pt-6 mt-8 border-t border-slate-100">
      <button
        type="button"
        onClick={onPrev}
        disabled={currentStep === 0}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium
          text-slate-600 bg-white border border-slate-200
          hover:bg-slate-50 hover:border-slate-300
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-200"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300
              ${i === currentStep
                ? 'w-6 bg-primary-500'
                : i < currentStep
                  ? 'w-1.5 bg-primary-300'
                  : 'w-1.5 bg-slate-200'
              }`}
          />
        ))}
      </div>

      {isLastStep ? (
        <button
          type="button"
          onClick={onGenerate}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold
            text-white bg-gradient-to-r from-primary-600 to-primary-700
            hover:from-primary-700 hover:to-primary-800
            shadow-lg shadow-primary-200
            transition-all duration-200"
        >
          Generate PDF
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={currentStep >= totalSteps - 1}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium
            text-white bg-primary-600 hover:bg-primary-700
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all duration-200"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
