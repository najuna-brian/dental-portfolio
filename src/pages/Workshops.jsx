import { Award, Plus, Trash2 } from 'lucide-react';
import SectionWrapper from '../components/SectionWrapper';
import FormInput from '../components/FormInput';
import FileUploadWithPreview from '../components/FileUploadWithPreview';

/**
 * Section 6: Workshops & Conferences (Repeatable)
 */
export default function Workshops({ data, updateSection }) {
  const entries = data.workshops.entries || [];

  const addEntry = () => {
    updateSection('workshops', {
      ...data.workshops,
      entries: [
        ...entries,
        {
          id: crypto.randomUUID(),
          title: '',
          organizer: '',
          year: '',
          certificate: [],
        },
      ],
    });
  };

  const removeEntry = (id) => {
    updateSection('workshops', {
      ...data.workshops,
      entries: entries.filter((e) => e.id !== id),
    });
  };

  const updateEntry = (id, field, value) => {
    updateSection('workshops', {
      ...data.workshops,
      entries: entries.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    });
  };

  return (
    <SectionWrapper
      title="Workshops & Conferences"
      subtitle="Professional development, continuing education, and training"
      icon={<Award className="w-5 h-5" />}
    >
      {entries.length === 0 && (
        <div className="text-center py-10 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 mb-6">
          <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No workshops added yet</p>
        </div>
      )}

      {entries.map((entry, index) => (
        <div
          key={entry.id}
          className="mb-4 p-5 rounded-xl border border-slate-200 bg-white animate-fadeIn"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700">
              Workshop {index + 1}
            </h3>
            <button
              type="button"
              onClick={() => removeEntry(entry.id)}
              className="text-red-400 hover:text-red-600 transition-colors p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
            <FormInput
              label="Title"
              name={`ws-title-${entry.id}`}
              value={entry.title}
              onChange={(v) => updateEntry(entry.id, 'title', v)}
              placeholder="e.g., Advanced Implantology Workshop"
              className="md:col-span-2"
            />
            <FormInput
              label="Year"
              name={`ws-year-${entry.id}`}
              value={entry.year}
              onChange={(v) => updateEntry(entry.id, 'year', v)}
              placeholder="e.g., 2023"
            />
            <FormInput
              label="Organizer"
              name={`ws-organizer-${entry.id}`}
              value={entry.organizer}
              onChange={(v) => updateEntry(entry.id, 'organizer', v)}
              placeholder="e.g., Indian Dental Association"
              className="md:col-span-3"
            />
          </div>

          <FileUploadWithPreview
            label="Certificate"
            files={entry.certificate}
            onChange={(files) => updateEntry(entry.id, 'certificate', files)}
            maxFiles={3}
            allowPdf
            compact
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addEntry}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-slate-300
          text-sm font-medium text-slate-600 hover:border-primary-300 hover:text-primary-600
          hover:bg-primary-50/30 transition-all duration-200 w-full justify-center"
      >
        <Plus className="w-4 h-4" />
        Add Workshop / Conference
      </button>
    </SectionWrapper>
  );
}
