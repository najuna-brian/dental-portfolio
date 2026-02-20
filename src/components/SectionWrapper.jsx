/**
 * Wrapper component for each portfolio section with consistent styling
 */
export default function SectionWrapper({ title, subtitle, children, icon }) {
  return (
    <div className="animate-fadeIn">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          {icon && (
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold text-slate-800 font-serif">{title}</h2>
            {subtitle && (
              <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-primary-200 via-slate-200 to-transparent mt-4" />
      </div>
      <div>{children}</div>
    </div>
  );
}
