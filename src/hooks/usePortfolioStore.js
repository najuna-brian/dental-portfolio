import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'dental-portfolio-draft';

/**
 * Default portfolio data structure
 */
const defaultData = {
  personal: {
    fullName: '',
    title: 'Dr.',
    profilePhoto: null,
    phone: '',
    email: '',
    address: '',
    linkedin: '',
    summary: '',
  },
  education: {
    entries: [
      {
        id: crypto.randomUUID(),
        degree: '',
        university: '',
        year: '',
        licenseNumber: '',
        certificates: [],
      },
    ],
  },
  experience: {
    entries: [
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
  },
  cases: {
    entries: [],
  },
  skills: {
    selected: [],
    custom: [],
  },
  workshops: {
    entries: [],
  },
  outreach: {
    entries: [],
  },
  testimonials: {
    entries: [],
  },
};

/**
 * Custom hook for managing portfolio state with localStorage persistence
 */
export function usePortfolioStore() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults to handle new fields
        return deepMerge(defaultData, parsed);
      }
    } catch (e) {
      console.warn('Failed to load saved draft:', e);
    }
    return structuredClone(defaultData);
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [lastSaved, setLastSaved] = useState(null);
  const saveTimeout = useRef(null);

  // Autosave to localStorage with debounce
  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setLastSaved(new Date());
      } catch (e) {
        console.warn('Failed to save draft:', e);
      }
    }, 1000);

    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [data]);

  /**
   * Update a specific section of the portfolio
   */
  const updateSection = useCallback((section, value) => {
    setData(prev => ({
      ...prev,
      [section]: typeof value === 'function' ? value(prev[section]) : value,
    }));
  }, []);

  /**
   * Update a specific field within a section
   */
  const updateField = useCallback((section, field, value) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  }, []);

  /**
   * Reset all data
   */
  const resetData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData(structuredClone(defaultData));
    setLastSaved(null);
  }, []);

  return {
    data,
    setData,
    currentStep,
    setCurrentStep,
    updateSection,
    updateField,
    resetData,
    lastSaved,
  };
}

/**
 * Deep merge two objects (target wins for non-object values)
 */
function deepMerge(defaults, target) {
  const result = { ...defaults };
  for (const key of Object.keys(target)) {
    if (
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key]) &&
      defaults[key] &&
      typeof defaults[key] === 'object' &&
      !Array.isArray(defaults[key])
    ) {
      result[key] = deepMerge(defaults[key], target[key]);
    } else {
      result[key] = target[key];
    }
  }
  return result;
}
