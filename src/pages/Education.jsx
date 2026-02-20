import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import SectionWrapper from '../components/SectionWrapper';
import FormInput from '../components/FormInput';
import FileUploadWithPreview from '../components/FileUploadWithPreview';

/**
 * Section 2: Education & Qualifications
 */
export default function Education({ data, updateSection }) {
  const entries = data.education.entries || [];

  const addEntry = () => {
    updateSection('education', {
      ...data.education,
      entries: [
        ...entries,
        {
          id: crypto.randomUUID(),
          degree: '',
          university: '',
          year: '',
          licenseNumber: '',
          certificates: [],
        },
      ],
    });
  };

  const removeEntry = (id) => {
    updateSection('education', {
      ...data.education,
      entries: entries.filter((e) => e.id !== id),
    });
  };

  const updateEntry = (id, field, value) => {
    updateSection('education', {
      ...data.education,
      entries: entries.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    });
  };

  return (
    <SectionWrapper
      title="Education & Qualifications"
      subtitle="Your academic background and professional certifications"
      icon={<GraduationCap className="w-5 h-5" />}
    >
      {entries.map((entry, index) => (
        <div
          key={entry.id}
          className="mb-6 p-5 rounded-xl border border-slate-200 bg-white animate-fadeIn"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700">
              Qualification {index + 1}
            </h3>
            {entries.length > 1 && (
              <button
                type="button"
                onClick={() => removeEntry(entry.id)}
                className="text-red-400 hover:text-red-600 transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <FormInput
              label="Degree / Qualification"
              name={`degree-${entry.id}`}
              value={entry.degree}
              onChange={(v) => updateEntry(entry.id, 'degree', v)}
              placeholder="e.g., BDS, MDS Prosthodontics"
              required
            />
            <FormInput
              label="University / Institution"
              name={`university-${entry.id}`}
              value={entry.university}
              onChange={(v) => updateEntry(entry.id, 'university', v)}
              placeholder="e.g., AIIMS New Delhi"
              required
            />
            <FormInput
              label="Year of Completion"
              name={`year-${entry.id}`}
              value={entry.year}
              onChange={(v) => updateEntry(entry.id, 'year', v)}
              placeholder="e.g., 2020"
            />
            <FormInput
              label="License / Registration Number"
              name={`license-${entry.id}`}
              value={entry.licenseNumber}
              onChange={(v) => updateEntry(entry.id, 'licenseNumber', v)}
              placeholder="e.g., DCI-12345"
            />
          </div>

          <FileUploadWithPreview
            label="Upload Certificates"
            files={entry.certificates}
            onChange={(files) => updateEntry(entry.id, 'certificates', files)}
            maxFiles={10}
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
        Add Another Qualification
      </button>
    </SectionWrapper>
  );
}
