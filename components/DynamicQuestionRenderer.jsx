'use client';

import React from 'react';
import { Star, UploadCloud, Check } from 'lucide-react';

export default function DynamicQuestionRenderer({
  question,
  value,
  onChange,
  disabled = false,
}) {
  const { label, description, questionType, isRequired, placeholder, options = [], scaleConfig } =
    question;

  const minScale = scaleConfig?.min ?? 1;
  const maxScale = scaleConfig?.max ?? (questionType === 'rating_10' ? 10 : 5);
  const minLabel = scaleConfig?.minLabel || 'Poor';
  const maxLabel = scaleConfig?.maxLabel || 'Excellent';

  const renderControl = () => {
    switch (questionType) {
      case 'short_text':
        return (
          <input
            type="text"
            disabled={disabled}
            placeholder={placeholder || 'Your response...'}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-slate-50"
          />
        );

      case 'long_text':
        return (
          <textarea
            rows={4}
            disabled={disabled}
            placeholder={placeholder || 'Type detailed feedback here...'}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-slate-50"
          />
        );

      case 'multiple_choice':
        return (
          <div className="space-y-2 mt-2">
            {options.map((opt, i) => (
              <label
                key={i}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  value === opt
                    ? 'border-blue-500 bg-blue-50/50 text-blue-900 font-medium'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                } ${disabled ? 'pointer-events-none opacity-80' : ''}`}
              >
                <input
                  type="radio"
                  name={`q_${question._id}`}
                  disabled={disabled}
                  checked={value === opt}
                  onChange={() => onChange(opt)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        const selectedArr = Array.isArray(value) ? value : [];
        const toggleOption = (opt) => {
          if (selectedArr.includes(opt)) {
            onChange(selectedArr.filter((item) => item !== opt));
          } else {
            onChange([...selectedArr, opt]);
          }
        };

        return (
          <div className="space-y-2 mt-2">
            {options.map((opt, i) => (
              <label
                key={i}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedArr.includes(opt)
                    ? 'border-blue-500 bg-blue-50/50 text-blue-900 font-medium'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                } ${disabled ? 'pointer-events-none opacity-80' : ''}`}
              >
                <input
                  type="checkbox"
                  disabled={disabled}
                  checked={selectedArr.includes(opt)}
                  onChange={() => toggleOption(opt)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
        );

      case 'dropdown':
        return (
          <select
            disabled={disabled}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-slate-50"
          >
            <option value="">-- Select an option --</option>
            {options.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case 'yes_no':
        return (
          <div className="flex items-center space-x-3 mt-2">
            {['Yes', 'No'].map((opt) => (
              <button
                key={opt}
                type="button"
                disabled={disabled}
                onClick={() => onChange(opt)}
                className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg border transition-all ${
                  value === opt
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        );

      case 'rating_5':
        return (
          <div className="mt-3">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange(star)}
                  className="p-1 rounded-md hover:scale-110 transition-transform focus:outline-hidden"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      Number(value) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200 hover:text-amber-200'
                    }`}
                  />
                </button>
              ))}
              {value && (
                <span className="ml-3 text-sm font-bold text-slate-700">{value} of 5 Stars</span>
              )}
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 mt-2 max-w-xs">
              <span>1 - {minLabel}</span>
              <span>5 - {maxLabel}</span>
            </div>
          </div>
        );

      case 'rating_10':
      case 'linear_scale':
        const scaleRange = [];
        for (let i = minScale; i <= maxScale; i++) {
          scaleRange.push(i);
        }

        return (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {scaleRange.map((num) => (
                <button
                  key={num}
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange(num)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 text-xs sm:text-sm font-semibold rounded-lg border transition-all ${
                    Number(value) === num
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs scale-105'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-medium mt-2">
              <span>
                {minScale}: {minLabel}
              </span>
              <span>
                {maxScale}: {maxLabel}
              </span>
            </div>
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            disabled={disabled}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full max-w-xs px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-slate-50"
          />
        );

      case 'file_upload':
        return (
          <div className="mt-2">
            <input
              type="text"
              disabled={disabled}
              placeholder="Enter attachment link or document URL"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-slate-50"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Supports Google Drive, Dropbox, or OneDrive shareable links.
            </p>
          </div>
        );

      default:
        return (
          <input
            type="text"
            disabled={disabled}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
          />
        );
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors">
      <div className="flex items-start justify-between">
        <label className="block text-sm font-semibold text-slate-900 leading-snug">
          {label}
          {isRequired && <span className="text-red-500 ml-1 font-bold">*</span>}
        </label>
        <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
          {questionType.replace('_', ' ')}
        </span>
      </div>

      {description && <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>}

      <div className="mt-3.5">{renderControl()}</div>
    </div>
  );
}
