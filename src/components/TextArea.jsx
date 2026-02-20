/**
 * Reusable textarea component with label and clean styling
 */
export default function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  rows = 4,
  className = '',
  maxLength,
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className={`w-full px-4 py-2.5 rounded-lg border transition-all duration-200 resize-y
          ${error
            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
            : 'border-slate-200 focus:border-primary-500 focus:ring-primary-50'
          }
          bg-white text-slate-800 placeholder-slate-400
          focus:outline-none focus:ring-2
          text-sm leading-relaxed`}
      />
      <div className="flex justify-between mt-1">
        {error && <p className="text-xs text-red-500">{error}</p>}
        {maxLength && (
          <p className="text-xs text-slate-400 ml-auto">
            {(value || '').length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}
