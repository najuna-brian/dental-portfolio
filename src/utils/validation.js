/**
 * Form validation utilities
 */

export function validateEmail(email) {
  if (!email) return true; // optional
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone) {
  if (!phone) return true; // optional
  const re = /^[+]?[\d\s()-]{7,20}$/;
  return re.test(phone);
}

export function validateRequired(value) {
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined;
}

/**
 * Validate a section of the portfolio data
 * Returns { valid: boolean, errors: string[] }
 */
export function validateSection(sectionKey, data) {
  const errors = [];

  switch (sectionKey) {
    case 'personal': {
      if (!validateRequired(data.fullName)) errors.push('Full name is required');
      if (!validateEmail(data.email)) errors.push('Invalid email address');
      if (!validatePhone(data.phone)) errors.push('Invalid phone number');
      break;
    }
    case 'education': {
      if (data.entries && data.entries.length > 0) {
        data.entries.forEach((entry, i) => {
          if (!validateRequired(entry.degree)) errors.push(`Education ${i + 1}: Degree is required`);
          if (!validateRequired(entry.university)) errors.push(`Education ${i + 1}: University is required`);
        });
      }
      break;
    }
    case 'experience': {
      if (data.entries && data.entries.length > 0) {
        data.entries.forEach((entry, i) => {
          if (!validateRequired(entry.clinicName)) errors.push(`Experience ${i + 1}: Clinic name is required`);
          if (!validateRequired(entry.role)) errors.push(`Experience ${i + 1}: Role is required`);
        });
      }
      break;
    }
    case 'cases': {
      // Cases are optional but if present should have a title
      if (data.entries && data.entries.length > 0) {
        data.entries.forEach((entry, i) => {
          if (!validateRequired(entry.title)) errors.push(`Case ${i + 1}: Title is required`);
        });
      }
      break;
    }
    default:
      break;
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Calculate completion percentage for the entire portfolio
 */
export function calculateCompletion(data) {
  let total = 0;
  let filled = 0;

  // Personal info (weight: 20%)
  const personalFields = ['fullName', 'title', 'phone', 'email', 'summary'];
  personalFields.forEach(f => {
    total += 4;
    if (data.personal?.[f]) filled += 4;
  });

  // Education (weight: 15%)
  total += 15;
  if (data.education?.entries?.length > 0) filled += 15;

  // Experience (weight: 15%)
  total += 15;
  if (data.experience?.entries?.length > 0) filled += 15;

  // Cases (weight: 20%)
  total += 20;
  if (data.cases?.entries?.length > 0) filled += 20;

  // Skills (weight: 10%)
  total += 10;
  if (data.skills?.selected?.length > 0) filled += 10;

  // Workshops (weight: 5%)
  total += 5;
  if (data.workshops?.entries?.length > 0) filled += 5;

  // Outreach (weight: 5%)
  total += 5;
  if (data.outreach?.entries?.length > 0) filled += 5;

  // Testimonials (weight: 5%)
  total += 5;
  if (data.testimonials?.entries?.length > 0) filled += 5;

  return total > 0 ? Math.round((filled / total) * 100) : 0;
}
