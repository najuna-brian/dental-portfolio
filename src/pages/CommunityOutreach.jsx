import { Heart, Plus, Trash2 } from 'lucide-react';
import SectionWrapper from '../components/SectionWrapper';
import FormInput from '../components/FormInput';
import TextArea from '../components/TextArea';

/**
 * Section 7: Community Outreach / Volunteer Work (Optional)
 */
export default function CommunityOutreach({ data, updateSection }) {
  const entries = data.outreach.entries || [];

  const addEntry = () => {
    updateSection('outreach', {
      ...data.outreach,
      entries: [
        ...entries,
        {
          id: crypto.randomUUID(),
          title: '',
          organization: '',
          year: '',
          description: '',
        },
      ],
    });
  };

  const removeEntry = (id) => {
    updateSection('outreach', {
      ...data.outreach,
      entries: entries.filter((e) => e.id !== id),
    });
  };

  const updateEntry = (id, field, value) => {
    updateSection('outreach', {
      ...data.outreach,
      entries: entries.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    });
  };

  return (
    <SectionWrapper
      title="Community Outreach"
      subtitle="Volunteer work, camps, and community service (optional)"
      icon={<Heart className="w-5 h-5" />}
    >
      {entries.length === 0 && (
        <div className="text-center py-10 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 mb-6">
          <Heart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No community outreach added yet</p>
          <p className="text-xs text-slate-400 mt-1">This section is optional</p>
        </div>
      )}

      {entries.map((entry, index) => (
        <div
          key={entry.id}
          className="mb-4 p-5 rounded-xl border border-slate-200 bg-white animate-fadeIn"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700">
              Activity {index + 1}
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
              label="Activity Title"
              name={`outreach-title-${entry.id}`}
              value={entry.title}
              onChange={(v) => updateEntry(entry.id, 'title', v)}
              placeholder="e.g., Free Dental Camp"
              className="md:col-span-2"
            />
            <FormInput
              label="Year"
              name={`outreach-year-${entry.id}`}
              value={entry.year}
              onChange={(v) => updateEntry(entry.id, 'year', v)}
              placeholder="e.g., 2023"
            />
            <FormInput
              label="Organization"
              name={`outreach-org-${entry.id}`}
              value={entry.organization}
              onChange={(v) => updateEntry(entry.id, 'organization', v)}
              placeholder="e.g., Red Cross Society"
              className="md:col-span-3"
            />
          </div>

          <TextArea
            label="Description"
            name={`outreach-desc-${entry.id}`}
            value={entry.description}
            onChange={(v) => updateEntry(entry.id, 'description', v)}
            placeholder="Describe your role and impact..."
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
        Add Community Activity
      </button>
    </SectionWrapper>
  );
}
