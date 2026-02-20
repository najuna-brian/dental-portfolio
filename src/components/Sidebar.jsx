import {
  User, GraduationCap, Stethoscope, FolderOpen,
  Wrench, Award, Heart, MessageSquare, FileCheck, ChevronRight
} from 'lucide-react';

const SECTIONS = [
  { key: 'personal', label: 'Personal Information', icon: User },
  { key: 'education', label: 'Education', icon: GraduationCap },
  { key: 'experience', label: 'Clinical Experience', icon: Stethoscope },
  { key: 'cases', label: 'Case Portfolio', icon: FolderOpen },
  { key: 'skills', label: 'Technical Skills', icon: Wrench },
  { key: 'workshops', label: 'Workshops', icon: Award },
  { key: 'outreach', label: 'Community Outreach', icon: Heart },
  { key: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  { key: 'review', label: 'Final Review', icon: FileCheck },
];

/**
 * Sidebar navigation with step indicators
 */
export default function Sidebar({ currentStep, onStepChange, completedSections = {} }) {
  return (
    <nav className="w-64 bg-white border-r border-slate-200 min-h-screen flex-shrink-0 hidden lg:block">
      {/* Logo/Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800">Dental Portfolio</h1>
            <p className="text-xs text-slate-400">Professional Builder</p>
          </div>
        </div>
      </div>

      {/* Navigation items */}
      <div className="p-3">
        {SECTIONS.map((section, index) => {
          const Icon = section.icon;
          const isActive = currentStep === index;
          const isComplete = completedSections[section.key];

          return (
            <button
              key={section.key}
              onClick={() => onStepChange(index)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5
                text-left transition-all duration-200 group
                ${isActive
                  ? 'bg-primary-50 text-primary-700 border border-primary-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 border border-transparent'
                }`}
            >
              {/* Step number / check */}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium
                ${isActive
                  ? 'bg-primary-600 text-white'
                  : isComplete
                    ? 'bg-primary-100 text-primary-600'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {isComplete ? '✓' : index + 1}
              </div>

              <div className="flex-1 min-w-0">
                <span className={`text-sm font-medium block truncate
                  ${isActive ? 'text-primary-700' : ''}`}
                >
                  {section.label}
                </span>
              </div>

              {isActive && (
                <ChevronRight className="w-4 h-4 text-primary-400 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Target clinic info */}
      <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-slate-100 bg-slate-50/50">
        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Applying to</p>
        <p className="text-xs font-semibold text-slate-600">Stunning Dentistry</p>
        <p className="text-[10px] text-slate-400">New Delhi, India</p>
      </div>
    </nav>
  );
}

export { SECTIONS };
