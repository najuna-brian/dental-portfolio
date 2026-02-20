import { CheckCircle, Download, X } from 'lucide-react';

/**
 * Success animation modal after PDF generation
 */
export default function SuccessModal({ show, onClose }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="animate-checkmark mb-4">
          <CheckCircle className="w-16 h-16 text-primary-500 mx-auto" />
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-2 font-serif">
          Portfolio Generated!
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          Your professional dental portfolio has been successfully generated and downloaded.
        </p>

        <div className="flex items-center justify-center gap-2 text-primary-600">
          <Download className="w-4 h-4" />
          <span className="text-sm font-medium">Check your downloads folder</span>
        </div>

        <button
          onClick={onClose}
          className="mt-6 px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium
            hover:bg-primary-700 transition-colors w-full"
        >
          Continue Editing
        </button>
      </div>
    </div>
  );
}
