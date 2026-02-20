import { Stethoscope, Plus, Trash2 } from 'lucide-react';
import SectionWrapper from '../components/SectionWrapper';
import FormInput from '../components/FormInput';
import TextArea from '../components/TextArea';

/**
 * Section 3: Clinical Experience (Repeatable)
 */
export default function ClinicalExperience({ data, updateSection }) {
  const entries = data.experience.entries || [];

  const addEntry = () => {
    updateSection('experience', {
      ...data.experience,
      entries: [
        ...entries,
        {
          id: crypto.randomUUID(),
          clinicName: '',
          role: '',
          location: '',
          duration: '',
          responsibilities: '',
          procedures: '',
        },
      ],
    });
  };

  const removeEntry = (id) => {
    updateSection('experience', {
      ...data.experience,
      entries: entries.filter((e) => e.id !== id),
    });
  };

  const updateEntry = (id, field, value) => {
    updateSection('experience', {
      ...data.experience,
      entries: entries.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    });
  };

  return (
    <SectionWrapper
      title="Clinical Experience"
      subtitle="Your professional work history and clinical roles"
      icon={<Stethoscope className="w-5 h-5" />}
    >
      {entries.map((entry, index) => (
        <div
          key={entry.id}
          className="mb-6 p-5 rounded-xl border border-slate-200 bg-white animate-fadeIn"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700">
              Position {index + 1}
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
              label="Clinic / Hospital Name"
              name={`clinic-${entry.id}`}
              value={entry.clinicName}
              onChange={(v) => updateEntry(entry.id, 'clinicName', v)}
              placeholder="e.g., Apollo Dental Clinic"
              required
            />
            <FormInput
              label="Role / Designation"
              name={`role-${entry.id}`}
              value={entry.role}
              onChange={(v) => updateEntry(entry.id, 'role', v)}
              placeholder="e.g., Senior Dental Surgeon"
              required
            />
            <FormInput
              label="Location"
              name={`location-${entry.id}`}
              value={entry.location}
              onChange={(v) => updateEntry(entry.id, 'location', v)}
              placeholder="e.g., New Delhi, India"
            />
            <FormInput
              label="Duration"
              name={`duration-${entry.id}`}
              value={entry.duration}
              onChange={(v) => updateEntry(entry.id, 'duration', v)}
              placeholder="e.g., Jan 2020 - Dec 2023"
            />
          </div>

          <TextArea
            label="Key Responsibilities"
            name={`responsibilities-${entry.id}`}
            value={entry.responsibilities}
            onChange={(v) => updateEntry(entry.id, 'responsibilities', v)}
            placeholder="Describe your key responsibilities and achievements..."
            rows={3}
          />

          <TextArea
            label="Procedures Performed"
            name={`procedures-${entry.id}`}
            value={entry.procedures}
            onChange={(v) => updateEntry(entry.id, 'procedures', v)}
            placeholder="List major procedures you performed regularly..."
            rows={3}
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
        Add Another Position
      </button>
    </SectionWrapper>
  );
}
