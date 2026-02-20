import { Wrench } from 'lucide-react';
import SectionWrapper from '../components/SectionWrapper';
import SkillTags from '../components/SkillTags';

/**
 * Section 5: Technical Skills (Multi-select tag input)
 */
export default function TechnicalSkills({ data, updateField }) {
  return (
    <SectionWrapper
      title="Technical Skills"
      subtitle="Highlight your clinical competencies and areas of expertise"
      icon={<Wrench className="w-5 h-5" />}
    >
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <SkillTags
          selected={data.skills.selected || []}
          onChange={(skills) => updateField('skills', 'selected', skills)}
        />
      </div>

      <div className="mt-4 p-4 rounded-lg bg-primary-50/50 border border-primary-100">
        <p className="text-xs text-primary-700">
          <strong>Tip:</strong> Select skills relevant to the position at Stunning Dentistry.
          Key areas include Dental Implants, Smile Design, Digital Dentistry, and Full Mouth Rehabilitation.
        </p>
      </div>
    </SectionWrapper>
  );
}
