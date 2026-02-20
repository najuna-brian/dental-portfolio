import { useState, useCallback, useMemo } from 'react';
import { usePortfolioStore } from './hooks/usePortfolioStore';
import { calculateCompletion } from './utils/validation';
import { generatePortfolioPDF } from './utils/pdfGenerator';

// Components
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import ProgressBar from './components/ProgressBar';
import StepNavigation from './components/StepNavigation';
import SuccessModal from './components/SuccessModal';

// Pages
import PersonalInfo from './pages/PersonalInfo';
import Education from './pages/Education';
import ClinicalExperience from './pages/ClinicalExperience';
import CasePortfolio from './pages/CasePortfolio';
import TechnicalSkills from './pages/TechnicalSkills';
import Workshops from './pages/Workshops';
import CommunityOutreach from './pages/CommunityOutreach';
import Testimonials from './pages/Testimonials';
import FinalReview from './pages/FinalReview';

import { RotateCcw, Loader2 } from 'lucide-react';

const TOTAL_STEPS = 9;

/**
 * Main Application Component
 * Dental Portfolio Builder — Professional multi-step form with PDF generation
 */
export default function App() {
  const {
    data,
    currentStep,
    setCurrentStep,
    updateSection,
    updateField,
    resetData,
    lastSaved,
  } = usePortfolioStore();

  const [showSuccess, setShowSuccess] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Calculate completion percentage
  const completion = useMemo(() => calculateCompletion(data), [data]);

  // Determine which sections have content (for sidebar indicators)
  const completedSections = useMemo(() => ({
    personal: !!(data.personal.fullName),
    education: data.education.entries?.some(e => e.degree),
    experience: data.experience.entries?.some(e => e.clinicName),
    cases: data.cases.entries?.length > 0,
    skills: data.skills.selected?.length > 0,
    workshops: data.workshops.entries?.length > 0,
    outreach: data.outreach.entries?.length > 0,
    testimonials: data.testimonials.entries?.length > 0,
    review: false,
  }), [data]);

  // Navigation handlers
  const goNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
  }, [setCurrentStep]);

  const goPrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, [setCurrentStep]);

  // PDF generation
  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    try {
      await generatePortfolioPDF(data);
      setShowSuccess(true);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setGenerating(false);
    }
  }, [data]);

  // Reset handler
  const handleReset = useCallback(() => {
    resetData();
    setCurrentStep(0);
    setShowResetConfirm(false);
  }, [resetData, setCurrentStep]);

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 0: return <PersonalInfo data={data} updateField={updateField} />;
      case 1: return <Education data={data} updateSection={updateSection} />;
      case 2: return <ClinicalExperience data={data} updateSection={updateSection} />;
      case 3: return <CasePortfolio data={data} updateSection={updateSection} />;
      case 4: return <TechnicalSkills data={data} updateField={updateField} />;
      case 5: return <Workshops data={data} updateSection={updateSection} />;
      case 6: return <CommunityOutreach data={data} updateSection={updateSection} />;
      case 7: return <Testimonials data={data} updateSection={updateSection} />;
      case 8: return <FinalReview data={data} onEditSection={setCurrentStep} />;
      default: return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <Sidebar
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        completedSections={completedSections}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        {/* Mobile navigation */}
        <MobileNav currentStep={currentStep} onStepChange={setCurrentStep} />

        {/* Progress bar */}
        <ProgressBar percentage={completion} lastSaved={lastSaved} />

        {/* Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 max-w-4xl w-full mx-auto">
          {renderStep()}

          {/* Step navigation */}
          <StepNavigation
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            onNext={goNext}
            onPrev={goPrev}
            onGenerate={handleGenerate}
            isLastStep={currentStep === TOTAL_STEPS - 1}
          />

          {/* Bottom actions */}
          <div className="flex items-center justify-between mt-6 pb-8">
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-2 text-xs text-slate-400 hover:text-red-500 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Data
            </button>

            {currentStep === TOTAL_STEPS - 1 && (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating}
                className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold
                  text-white bg-gradient-to-r from-primary-600 to-primary-700
                  hover:from-primary-700 hover:to-primary-800
                  shadow-lg shadow-primary-200/50
                  disabled:opacity-60 disabled:cursor-wait
                  transition-all duration-200"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  'Generate Professional Portfolio PDF'
                )}
              </button>
            )}
          </div>
        </main>
      </div>

      {/* Success Modal */}
      <SuccessModal show={showSuccess} onClose={() => setShowSuccess(false)} />

      {/* Reset Confirmation */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-scaleIn">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Reset All Data?</h3>
            <p className="text-sm text-slate-500 mb-6">
              This will permanently delete all your portfolio data including uploaded files. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium
                  text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium
                  text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
