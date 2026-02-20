import { useCallback, useRef } from 'react';
import { User, Camera } from 'lucide-react';
import SectionWrapper from '../components/SectionWrapper';
import FormInput from '../components/FormInput';
import TextArea from '../components/TextArea';
import { compressImage } from '../utils/imageUtils';

/**
 * Section 1: Personal Information
 */
export default function PersonalInfo({ data, updateField }) {
  const photoInputRef = useRef(null);

  const handlePhotoUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file, 600, 0.85);
      updateField('personal', 'profilePhoto', compressed);
    } catch (err) {
      console.error('Failed to process photo:', err);
    }
  }, [updateField]);

  const field = (key, value) => updateField('personal', key, value);

  return (
    <SectionWrapper
      title="Personal Information"
      subtitle="Your professional identity and contact details"
      icon={<User className="w-5 h-5" />}
    >
      {/* Profile photo */}
      <div className="flex items-start gap-6 mb-8">
        <div className="relative flex-shrink-0">
          <div
            onClick={() => photoInputRef.current?.click()}
            className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-dashed border-slate-200
              bg-slate-50 flex items-center justify-center cursor-pointer
              hover:border-primary-300 hover:bg-primary-50/30 transition-all duration-200 group"
          >
            {data.personal.profilePhoto ? (
              <img
                src={data.personal.profilePhoto}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <Camera className="w-6 h-6 text-slate-400 mx-auto group-hover:text-primary-500 transition-colors" />
                <span className="text-[10px] text-slate-400 mt-1 block">Upload Photo</span>
              </div>
            )}
          </div>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
          />
          {data.personal.profilePhoto && (
            <button
              type="button"
              onClick={() => updateField('personal', 'profilePhoto', null)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full
                flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          )}
        </div>
        <div className="flex-1 pt-2">
          <p className="text-sm text-slate-600 mb-1">Profile Photo</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Upload a professional headshot. This will appear on the cover page of your portfolio.
            Recommended: square aspect ratio, high resolution.
          </p>
        </div>
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <FormInput
          label="Title"
          name="title"
          value={data.personal.title}
          onChange={(v) => field('title', v)}
          placeholder="e.g., Dr."
        />
        <FormInput
          label="Full Name"
          name="fullName"
          value={data.personal.fullName}
          onChange={(v) => field('fullName', v)}
          placeholder="e.g., Priya Sharma"
          required
        />
        <FormInput
          label="Phone Number"
          name="phone"
          type="tel"
          value={data.personal.phone}
          onChange={(v) => field('phone', v)}
          placeholder="+91 98765 43210"
        />
        <FormInput
          label="Email Address"
          name="email"
          type="email"
          value={data.personal.email}
          onChange={(v) => field('email', v)}
          placeholder="doctor@email.com"
        />
        <FormInput
          label="Address"
          name="address"
          value={data.personal.address}
          onChange={(v) => field('address', v)}
          placeholder="City, State, Country"
          className="md:col-span-2"
        />
        <FormInput
          label="LinkedIn Profile"
          name="linkedin"
          value={data.personal.linkedin}
          onChange={(v) => field('linkedin', v)}
          placeholder="https://linkedin.com/in/..."
          className="md:col-span-2"
        />
      </div>

      <TextArea
        label="Professional Summary"
        name="summary"
        value={data.personal.summary}
        onChange={(v) => field('summary', v)}
        placeholder="Write a brief professional summary highlighting your expertise, years of experience, and career objectives..."
        rows={5}
        maxLength={1000}
      />
    </SectionWrapper>
  );
}
