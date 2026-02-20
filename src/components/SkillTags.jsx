import { useState } from 'react';
import { Plus, X } from 'lucide-react';

const PRESET_SKILLS = [
  'Root Canal Treatment',
  'Dental Implants',
  'Orthodontics',
  'Veneers',
  'Smile Design',
  'Pediatric Dentistry',
  'Radiography',
  'Digital Dentistry',
  'Oral Surgery',
  'Prosthodontics',
  'Periodontics',
  'Endodontics',
  'Cosmetic Dentistry',
  'Crown & Bridge',
  'Teeth Whitening',
  'TMJ Treatment',
  'Dental Lasers',
  'Full Mouth Rehabilitation',
  'CAD/CAM Dentistry',
  'Microscope Dentistry',
  'Conscious Sedation',
  'Maxillofacial Surgery',
  'Dental Photography',
  'Invisalign / Aligners',
];

/**
 * Multi-select tag input for technical skills
 */
export default function SkillTags({ selected = [], onChange }) {
  const [customInput, setCustomInput] = useState('');

  const toggleSkill = (skill) => {
    if (selected.includes(skill)) {
      onChange(selected.filter((s) => s !== skill));
    } else {
      onChange([...selected, skill]);
    }
  };

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
      setCustomInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustom();
    }
  };

  return (
    <div>
      {/* Selected skills */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selected.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                bg-primary-50 text-primary-700 text-sm font-medium
                border border-primary-200 transition-all hover:bg-primary-100"
            >
              {skill}
              <button
                type="button"
                onClick={() => toggleSkill(skill)}
                className="text-primary-400 hover:text-primary-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Preset skills grid */}
      <div className="mb-4">
        <p className="text-sm font-medium text-slate-600 mb-2">Select your skills:</p>
        <div className="flex flex-wrap gap-2">
          {PRESET_SKILLS.filter((s) => !selected.includes(s)).map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className="px-3 py-1.5 rounded-full text-sm
                bg-slate-100 text-slate-600 border border-slate-200
                hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200
                transition-all duration-200"
            >
              + {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Custom skill input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a custom skill..."
          className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-sm
            focus:outline-none focus:ring-2 focus:ring-primary-50 focus:border-primary-500
            bg-white text-slate-800 placeholder-slate-400"
        />
        <button
          type="button"
          onClick={addCustom}
          disabled={!customInput.trim()}
          className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium
            hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors duration-200 flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>
    </div>
  );
}
