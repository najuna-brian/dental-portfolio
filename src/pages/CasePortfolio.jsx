import { FolderOpen, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import SectionWrapper from '../components/SectionWrapper';
import FormInput from '../components/FormInput';
import TextArea from '../components/TextArea';
import FileUploadWithPreview from '../components/FileUploadWithPreview';

/**
 * Create a new empty case entry
 */
function createCase() {
  return {
    id: crypto.randomUUID(),
    title: '',
    complaint: '',
    diagnosis: '',
    treatmentPlan: '',
    procedure: '',
    outcome: '',
    beforeImages: [],
    afterImages: [],
    xrays: [],
    documents: [],
  };
}

/**
 * Section 4: Clinical Case Portfolio (Repeatable with images)
 */
export default function CasePortfolio({ data, updateSection }) {
  const entries = data.cases.entries || [];
  const [expandedCase, setExpandedCase] = useState(null);

  const addCase = () => {
    const newCase = createCase();
    updateSection('cases', {
      ...data.cases,
      entries: [...entries, newCase],
    });
    setExpandedCase(newCase.id);
  };

  const removeCase = (id) => {
    updateSection('cases', {
      ...data.cases,
      entries: entries.filter((e) => e.id !== id),
    });
    if (expandedCase === id) setExpandedCase(null);
  };

  const updateCase = (id, field, value) => {
    updateSection('cases', {
      ...data.cases,
      entries: entries.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    });
  };

  return (
    <SectionWrapper
      title="Clinical Case Portfolio"
      subtitle="Document your clinical cases with before/after imagery and detailed descriptions"
      icon={<FolderOpen className="w-5 h-5" />}
    >
      {entries.length === 0 && (
        <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 mb-6">
          <FolderOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500 mb-1">No cases added yet</p>
          <p className="text-xs text-slate-400">Click below to add your first clinical case</p>
        </div>
      )}

      {entries.map((entry, index) => {
        const isExpanded = expandedCase === entry.id;

        return (
          <div
            key={entry.id}
            className="mb-4 rounded-xl border border-slate-200 bg-white overflow-hidden animate-fadeIn"
          >
            {/* Case header */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => setExpandedCase(isExpanded ? null : entry.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 text-sm font-bold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700">
                    {entry.title || `Case ${index + 1}`}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {entry.beforeImages.length + entry.afterImages.length} images &bull; {entry.xrays.length} x-rays
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeCase(entry.id); }}
                  className="text-red-400 hover:text-red-600 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </div>

            {/* Case details (expanded) */}
            {isExpanded && (
              <div className="p-5 pt-0 border-t border-slate-100 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-4">
                  <FormInput
                    label="Case Title"
                    name={`case-title-${entry.id}`}
                    value={entry.title}
                    onChange={(v) => updateCase(entry.id, 'title', v)}
                    placeholder="e.g., Full Mouth Rehabilitation"
                    required
                    className="md:col-span-2"
                  />
                </div>

                <TextArea
                  label="Patient Complaint"
                  name={`complaint-${entry.id}`}
                  value={entry.complaint}
                  onChange={(v) => updateCase(entry.id, 'complaint', v)}
                  placeholder="Chief complaint presented by the patient..."
                  rows={2}
                />

                <TextArea
                  label="Diagnosis"
                  name={`diagnosis-${entry.id}`}
                  value={entry.diagnosis}
                  onChange={(v) => updateCase(entry.id, 'diagnosis', v)}
                  placeholder="Clinical diagnosis..."
                  rows={2}
                />

                <TextArea
                  label="Treatment Plan"
                  name={`treatment-${entry.id}`}
                  value={entry.treatmentPlan}
                  onChange={(v) => updateCase(entry.id, 'treatmentPlan', v)}
                  placeholder="Planned treatment approach..."
                  rows={2}
                />

                <TextArea
                  label="Procedure Description"
                  name={`procedure-${entry.id}`}
                  value={entry.procedure}
                  onChange={(v) => updateCase(entry.id, 'procedure', v)}
                  placeholder="Step-by-step procedure performed..."
                  rows={3}
                />

                <TextArea
                  label="Outcome"
                  name={`outcome-${entry.id}`}
                  value={entry.outcome}
                  onChange={(v) => updateCase(entry.id, 'outcome', v)}
                  placeholder="Treatment outcome and follow-up..."
                  rows={2}
                />

                {/* Image uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                  <FileUploadWithPreview
                    label="Before Images"
                    files={entry.beforeImages}
                    onChange={(files) => updateCase(entry.id, 'beforeImages', files)}
                    maxFiles={20}
                    compact
                  />
                  <FileUploadWithPreview
                    label="After Images"
                    files={entry.afterImages}
                    onChange={(files) => updateCase(entry.id, 'afterImages', files)}
                    maxFiles={20}
                    compact
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                  <FileUploadWithPreview
                    label="X-Rays"
                    files={entry.xrays}
                    onChange={(files) => updateCase(entry.id, 'xrays', files)}
                    maxFiles={10}
                    compact
                  />
                  <FileUploadWithPreview
                    label="Supporting Documents"
                    files={entry.documents}
                    onChange={(files) => updateCase(entry.id, 'documents', files)}
                    maxFiles={10}
                    allowPdf
                    compact
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={addCase}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-slate-300
          text-sm font-medium text-slate-600 hover:border-primary-300 hover:text-primary-600
          hover:bg-primary-50/30 transition-all duration-200 w-full justify-center"
      >
        <Plus className="w-4 h-4" />
        Add Clinical Case
      </button>
    </SectionWrapper>
  );
}
