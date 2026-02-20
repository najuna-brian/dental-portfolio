import { FileCheck, Edit3, User, GraduationCap, Stethoscope, FolderOpen, Wrench, Award, Heart, MessageSquare } from 'lucide-react';
import SectionWrapper from '../components/SectionWrapper';

/**
 * Section 9: Final Review Page - displays all data with edit buttons
 */
export default function FinalReview({ data, onEditSection }) {
  const { personal, education, experience, cases, skills, workshops, outreach, testimonials } = data;

  return (
    <SectionWrapper
      title="Final Review"
      subtitle="Review your portfolio before generating the PDF"
      icon={<FileCheck className="w-5 h-5" />}
    >
      {/* Personal Info */}
      <ReviewCard
        title="Personal Information"
        icon={<User className="w-4 h-4" />}
        onEdit={() => onEditSection(0)}
      >
        <div className="flex items-start gap-4">
          {personal.profilePhoto && (
            <img
              src={personal.profilePhoto}
              alt="Profile"
              className="w-16 h-16 rounded-xl object-cover border border-slate-200"
            />
          )}
          <div>
            <p className="font-semibold text-slate-800">
              {personal.title} {personal.fullName || 'Not provided'}
            </p>
            {personal.email && <p className="text-sm text-slate-500">{personal.email}</p>}
            {personal.phone && <p className="text-sm text-slate-500">{personal.phone}</p>}
            {personal.address && <p className="text-sm text-slate-500">{personal.address}</p>}
            {personal.summary && (
              <p className="text-sm text-slate-600 mt-2 leading-relaxed line-clamp-3">{personal.summary}</p>
            )}
          </div>
        </div>
      </ReviewCard>

      {/* Education */}
      <ReviewCard
        title="Education & Qualifications"
        icon={<GraduationCap className="w-4 h-4" />}
        onEdit={() => onEditSection(1)}
      >
        {education.entries?.length > 0 ? (
          education.entries.map((e, i) => (
            <div key={e.id || i} className={`${i > 0 ? 'mt-3 pt-3 border-t border-slate-100' : ''}`}>
              <p className="font-medium text-slate-700">{e.degree || 'Untitled'}</p>
              <p className="text-sm text-slate-500">{e.university} {e.year && `• ${e.year}`}</p>
              {e.licenseNumber && <p className="text-xs text-slate-400">License: {e.licenseNumber}</p>}
              {e.certificates?.length > 0 && (
                <p className="text-xs text-primary-600 mt-1">{e.certificates.length} certificate(s) attached</p>
              )}
            </div>
          ))
        ) : (
          <EmptyState />
        )}
      </ReviewCard>

      {/* Experience */}
      <ReviewCard
        title="Clinical Experience"
        icon={<Stethoscope className="w-4 h-4" />}
        onEdit={() => onEditSection(2)}
      >
        {experience.entries?.length > 0 ? (
          experience.entries.map((e, i) => (
            <div key={e.id || i} className={`${i > 0 ? 'mt-3 pt-3 border-t border-slate-100' : ''}`}>
              <p className="font-medium text-slate-700">{e.role || 'Untitled'}</p>
              <p className="text-sm text-slate-500">{e.clinicName} {e.location && `• ${e.location}`}</p>
              {e.duration && <p className="text-xs text-slate-400">{e.duration}</p>}
            </div>
          ))
        ) : (
          <EmptyState />
        )}
      </ReviewCard>

      {/* Cases */}
      <ReviewCard
        title="Clinical Case Portfolio"
        icon={<FolderOpen className="w-4 h-4" />}
        onEdit={() => onEditSection(3)}
      >
        {cases.entries?.length > 0 ? (
          <div>
            <p className="text-sm text-slate-600 mb-3">{cases.entries.length} case(s) documented</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cases.entries.map((c, i) => (
                <div key={c.id || i} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <p className="font-medium text-sm text-slate-700">{c.title || `Case ${i + 1}`}</p>
                  <div className="flex gap-3 mt-1">
                    {c.beforeImages?.length > 0 && (
                      <span className="text-xs text-slate-400">{c.beforeImages.length} before</span>
                    )}
                    {c.afterImages?.length > 0 && (
                      <span className="text-xs text-slate-400">{c.afterImages.length} after</span>
                    )}
                    {c.xrays?.length > 0 && (
                      <span className="text-xs text-slate-400">{c.xrays.length} x-rays</span>
                    )}
                  </div>
                  {/* Thumbnail previews */}
                  {(c.beforeImages?.length > 0 || c.afterImages?.length > 0) && (
                    <div className="flex gap-1 mt-2">
                      {[...(c.beforeImages || []).slice(0, 2), ...(c.afterImages || []).slice(0, 2)].map((img, j) => (
                        <img
                          key={j}
                          src={img.data}
                          alt=""
                          className="w-10 h-10 rounded object-cover border border-slate-200"
                        />
                      ))}
                      {(c.beforeImages?.length + c.afterImages?.length) > 4 && (
                        <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                          +{(c.beforeImages?.length || 0) + (c.afterImages?.length || 0) - 4}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </ReviewCard>

      {/* Skills */}
      <ReviewCard
        title="Technical Skills"
        icon={<Wrench className="w-4 h-4" />}
        onEdit={() => onEditSection(4)}
      >
        {skills.selected?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.selected.map((s) => (
              <span
                key={s}
                className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium border border-primary-100"
              >
                {s}
              </span>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </ReviewCard>

      {/* Workshops */}
      <ReviewCard
        title="Workshops & Conferences"
        icon={<Award className="w-4 h-4" />}
        onEdit={() => onEditSection(5)}
      >
        {workshops.entries?.length > 0 ? (
          workshops.entries.map((e, i) => (
            <div key={e.id || i} className={`${i > 0 ? 'mt-2 pt-2 border-t border-slate-100' : ''}`}>
              <p className="font-medium text-sm text-slate-700">{e.title || 'Untitled'}</p>
              <p className="text-xs text-slate-500">{e.organizer} {e.year && `• ${e.year}`}</p>
            </div>
          ))
        ) : (
          <EmptyState text="No workshops added (optional)" />
        )}
      </ReviewCard>

      {/* Outreach */}
      <ReviewCard
        title="Community Outreach"
        icon={<Heart className="w-4 h-4" />}
        onEdit={() => onEditSection(6)}
      >
        {outreach.entries?.length > 0 ? (
          outreach.entries.map((e, i) => (
            <div key={e.id || i} className={`${i > 0 ? 'mt-2 pt-2 border-t border-slate-100' : ''}`}>
              <p className="font-medium text-sm text-slate-700">{e.title || 'Untitled'}</p>
              <p className="text-xs text-slate-500">{e.organization} {e.year && `• ${e.year}`}</p>
            </div>
          ))
        ) : (
          <EmptyState text="No outreach activities added (optional)" />
        )}
      </ReviewCard>

      {/* Testimonials */}
      <ReviewCard
        title="Testimonials"
        icon={<MessageSquare className="w-4 h-4" />}
        onEdit={() => onEditSection(7)}
      >
        {testimonials.entries?.length > 0 ? (
          testimonials.entries.map((e, i) => (
            <div key={e.id || i} className={`${i > 0 ? 'mt-3 pt-3 border-t border-slate-100' : ''}`}>
              <p className="text-sm text-slate-600 italic leading-relaxed">"{e.text || '...'}"</p>
              <p className="text-sm font-medium text-slate-700 mt-1">— {e.name || 'Anonymous'}</p>
              <p className="text-xs text-slate-400">{e.role} {e.organization && `at ${e.organization}`}</p>
            </div>
          ))
        ) : (
          <EmptyState text="No testimonials added (optional)" />
        )}
      </ReviewCard>
    </SectionWrapper>
  );
}

/** Reusable review card with edit button */
function ReviewCard({ title, icon, onEdit, children }) {
  return (
    <div className="mb-4 p-5 rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-primary-600">{icon}</span>
          <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium
            text-primary-600 hover:bg-primary-50 transition-colors"
        >
          <Edit3 className="w-3 h-3" />
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}

/** Empty state placeholder */
function EmptyState({ text = 'Not yet filled' }) {
  return <p className="text-sm text-slate-400 italic">{text}</p>;
}
