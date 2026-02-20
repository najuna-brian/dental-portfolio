import { MessageSquare, Plus, Trash2, Quote } from 'lucide-react';
import SectionWrapper from '../components/SectionWrapper';
import FormInput from '../components/FormInput';
import TextArea from '../components/TextArea';

/**
 * Section 8: Testimonials / Recommendations
 */
export default function Testimonials({ data, updateSection }) {
  const entries = data.testimonials.entries || [];

  const addEntry = () => {
    updateSection('testimonials', {
      ...data.testimonials,
      entries: [
        ...entries,
        {
          id: crypto.randomUUID(),
          name: '',
          role: '',
          organization: '',
          text: '',
        },
      ],
    });
  };

  const removeEntry = (id) => {
    updateSection('testimonials', {
      ...data.testimonials,
      entries: entries.filter((e) => e.id !== id),
    });
  };

  const updateEntry = (id, field, value) => {
    updateSection('testimonials', {
      ...data.testimonials,
      entries: entries.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    });
  };

  return (
    <SectionWrapper
      title="Testimonials & Recommendations"
      subtitle="Professional endorsements from colleagues, mentors, or supervisors"
      icon={<MessageSquare className="w-5 h-5" />}
    >
      {entries.length === 0 && (
        <div className="text-center py-10 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 mb-6">
          <Quote className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No testimonials added yet</p>
        </div>
      )}

      {entries.map((entry, index) => (
        <div
          key={entry.id}
          className="mb-4 p-5 rounded-xl border border-slate-200 bg-white animate-fadeIn"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700">
              Testimonial {index + 1}
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
              label="Recommender Name"
              name={`test-name-${entry.id}`}
              value={entry.name}
              onChange={(v) => updateEntry(entry.id, 'name', v)}
              placeholder="e.g., Dr. Rajesh Kumar"
            />
            <FormInput
              label="Role / Title"
              name={`test-role-${entry.id}`}
              value={entry.role}
              onChange={(v) => updateEntry(entry.id, 'role', v)}
              placeholder="e.g., Head of Department"
            />
            <FormInput
              label="Organization"
              name={`test-org-${entry.id}`}
              value={entry.organization}
              onChange={(v) => updateEntry(entry.id, 'organization', v)}
              placeholder="e.g., AIIMS New Delhi"
            />
          </div>

          <TextArea
            label="Testimonial Text"
            name={`test-text-${entry.id}`}
            value={entry.text}
            onChange={(v) => updateEntry(entry.id, 'text', v)}
            placeholder="Write the recommendation / testimonial text..."
            rows={4}
            maxLength={800}
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
        Add Testimonial
      </button>
    </SectionWrapper>
  );
}
