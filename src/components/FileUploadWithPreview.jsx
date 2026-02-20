import { useCallback, useRef, useState } from 'react';
import { Upload, X, FileText, Image } from 'lucide-react';
import { processFiles, formatFileSize } from '../utils/imageUtils';

/**
 * File upload component with drag-and-drop, preview, and multi-file support
 */
export default function FileUploadWithPreview({
  label,
  files = [],
  onChange,
  maxFiles = 20,
  allowPdf = false,
  compact = false,
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState([]);

  const acceptTypes = allowPdf
    ? 'image/jpeg,image/png,image/webp,application/pdf'
    : 'image/jpeg,image/png,image/webp';

  const handleFiles = useCallback(async (fileList) => {
    if (!fileList || fileList.length === 0) return;

    const remaining = maxFiles - files.length;
    if (remaining <= 0) {
      setErrors([`Maximum ${maxFiles} files allowed`]);
      return;
    }

    const filesToProcess = Array.from(fileList).slice(0, remaining);
    setUploading(true);
    setErrors([]);

    const { results, errors: processErrors } = await processFiles(filesToProcess, allowPdf);
    setUploading(false);

    if (processErrors.length > 0) setErrors(processErrors);
    if (results.length > 0) onChange([...files, ...results]);
  }, [files, onChange, maxFiles, allowPdf]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = useCallback((index) => {
    onChange(files.filter((_, i) => i !== index));
  }, [files, onChange]);

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200
          ${compact ? 'p-4' : 'p-6'}
          ${isDragging
            ? 'border-primary-500 bg-primary-50'
            : 'border-slate-200 bg-slate-50 hover:border-primary-300 hover:bg-primary-50/30'
          }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptTypes}
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <div className="flex flex-col items-center text-center">
          <Upload className={`text-slate-400 ${compact ? 'w-5 h-5 mb-1' : 'w-8 h-8 mb-2'}`} />
          <p className={`text-slate-600 ${compact ? 'text-xs' : 'text-sm'}`}>
            {uploading ? 'Processing...' : 'Drop files here or click to upload'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {allowPdf ? 'Images & PDFs' : 'Images only'} &bull; Max {maxFiles} files
          </p>
        </div>
      </div>

      {/* Error messages */}
      {errors.length > 0 && (
        <div className="mt-2">
          {errors.map((err, i) => (
            <p key={i} className="text-xs text-red-500">{err}</p>
          ))}
        </div>
      )}

      {/* File previews */}
      {files.length > 0 && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative group rounded-lg overflow-hidden border border-slate-200 bg-white"
            >
              {file.type?.startsWith('image/') || file.data?.startsWith('data:image/') ? (
                <img
                  src={file.data}
                  alt={file.name}
                  className="w-full h-24 object-cover"
                />
              ) : (
                <div className="w-full h-24 flex flex-col items-center justify-center bg-slate-50">
                  <FileText className="w-6 h-6 text-slate-400" />
                  <span className="text-xs text-slate-500 mt-1 truncate max-w-full px-1">
                    {file.name}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full p-1
                  hover:bg-red-600 active:bg-red-700 transition-colors duration-200 shadow-sm"
                aria-label={`Remove ${file.name || 'file'}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="px-1.5 py-1 bg-white">
                <p className="text-[10px] text-slate-500 truncate">{file.name}</p>
                {file.size && (
                  <p className="text-[10px] text-slate-400">{formatFileSize(file.size)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
