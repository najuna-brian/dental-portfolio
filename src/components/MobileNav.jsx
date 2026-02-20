import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { SECTIONS } from './Sidebar';

/**
 * Mobile navigation drawer for smaller screens
 */
export default function MobileNav({ currentStep, onStepChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <span className="text-sm font-semibold text-slate-800">Dental Portfolio</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-[57px] left-0 right-0 bg-white border-b border-slate-200 shadow-lg z-50 animate-fadeIn">
          <div className="p-2">
            {SECTIONS.map((section, index) => {
              const Icon = section.icon;
              const isActive = currentStep === index;
              return (
                <button
                  key={section.key}
                  onClick={() => { onStepChange(index); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm
                    ${isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Icon className="w-4 h-4" />
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Current step indicator */}
      <div className="bg-slate-50 px-4 py-2 text-xs text-slate-500 border-b border-slate-100">
        Step {currentStep + 1} of {SECTIONS.length}: <span className="font-medium text-slate-700">{SECTIONS[currentStep]?.label}</span>
      </div>
    </div>
  );
}
