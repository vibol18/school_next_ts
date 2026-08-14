'use client';

import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { teacherSchema, TeacherFormData } from '@/lib/validators/teacher.schema';
import { BadgeCheck, GraduationCap, CalendarDays, TimerReset, AlertCircle, Camera, ImagePlus, Trash2, Link2 } from 'lucide-react';

interface TeacherFormProps {
  initialValues?: TeacherFormData;
  onSubmit: (data: TeacherFormData) => Promise<void>;
  isLoading?: boolean;
  buttonText?: string;
}

const defaultValues: TeacherFormData = {
  employeeId: '',
  qualification: '',
  experienceYears: '',
  dateOfJoining: '',
  profilePhoto: '',
};

const MAX_PHOTO_SIZE = 2 * 1024 * 1024; // 2MB

function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Shared field wrapper — icon, label, input, and error message live together
// so every field in the form follows the exact same anatomy.
function Field({
  label,
  icon: Icon,
  error,
  children,
}: {
  label: string;
  icon: React.ElementType;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-700 mb-1.5">
        <Icon className="w-3.5 h-3.5 text-slate-400" />
        {label}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-[11px] text-rose-500 mt-1.5">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

const inputBase =
  'w-full px-3.5 py-2.5 text-[13px] rounded-lg border bg-slate-50/60 text-slate-800 placeholder-slate-400 outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-[#5b51ef]/15 focus:border-[#5b51ef]';
const inputValid = 'border-slate-200 hover:border-slate-300';
const inputError = 'border-rose-300 bg-rose-50/40 focus:ring-rose-500/15 focus:border-rose-400';

export default function TeacherForm({
  initialValues,
  onSubmit,
  isLoading = false,
  buttonText = 'Save Teacher',
}: TeacherFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: initialValues || defaultValues,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photo = watch('profilePhoto') || '';

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file (PNG, JPG, etc.).');
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      alert('Image is too large. Please choose a file under 2MB.');
      return;
    }
    try {
      const dataUrl = await toDataUrl(file);
      setValue('profilePhoto', dataUrl, { shouldValidate: true });
    } catch {
      alert('Could not read the selected file.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleLink = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('profilePhoto', e.target.value, { shouldValidate: true });
  };

  const handleRemove = () => {
    setValue('profilePhoto', '', { shouldValidate: true });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-lg bg-white rounded-xl border border-slate-200 shadow-sm shadow-slate-900/[0.03] overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-slate-100">
        <h2 className="text-[15px] font-bold text-slate-800">Teacher details</h2>
        <p className="text-[12px] text-slate-400 mt-0.5">
          Employment, qualification and profile photo for this teacher.
        </p>
      </div>

      {/* Fields */}
      <div className="px-6 py-5 space-y-4">
        {/* Profile photo */}
        <div>
          <label className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-700 mb-2">
            <ImagePlus className="w-3.5 h-3.5 text-slate-400" />
            Profile Photo
          </label>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-[#5b51ef]/10 text-[#5b51ef] flex items-center justify-center shrink-0 ring-2 ring-slate-100">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="Teacher preview" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-6 h-6" />
              )}
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5b51ef] bg-[#5b51ef]/5 hover:bg-[#5b51ef]/10 px-3 py-2 rounded-lg transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Upload from computer
                </button>
                {photo && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
              />
              <span className="text-[11px] text-slate-400">PNG or JPG, max 2MB</span>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 mb-1.5">
              <Link2 className="w-3 h-3" />
              Or paste an image URL
            </div>
            <input
              type="text"
              placeholder="https://example.com/photo.jpg"
              value={photo.startsWith('data:') ? '' : photo}
              onChange={handleLink}
              className={`${inputBase} ${errors.profilePhoto ? inputError : inputValid}`}
            />
            {errors.profilePhoto && (
              <p className="flex items-center gap-1 text-[11px] text-rose-500 mt-1.5">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.profilePhoto.message}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4" />

        <Field label="Employee ID" icon={BadgeCheck} error={errors.employeeId?.message}>
          <input
            {...register('employeeId')}
            type="text"
            placeholder="e.g. EMP-1002"
            className={`${inputBase} ${errors.employeeId ? inputError : inputValid}`}
          />
        </Field>

        <Field label="Qualification" icon={GraduationCap} error={errors.qualification?.message}>
          <input
            {...register('qualification')}
            type="text"
            placeholder="e.g. M.Sc. Mathematics"
            className={`${inputBase} ${errors.qualification ? inputError : inputValid}`}
          />
        </Field>

        {/* Related fields grouped side-by-side */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Experience (yrs)" icon={TimerReset} error={errors.experienceYears?.message}>
            <input
              {...register('experienceYears')}
              type="number"
              min={0}
              placeholder="e.g. 5"
              className={`${inputBase} ${errors.experienceYears ? inputError : inputValid}`}
            />
          </Field>

          <Field label="Date of joining" icon={CalendarDays} error={errors.dateOfJoining?.message}>
            <input
              {...register('dateOfJoining')}
              type="date"
              className={`${inputBase} ${errors.dateOfJoining ? inputError : inputValid}`}
            />
          </Field>
        </div>
      </div>

      {/* Footer / actions */}
      <div className="px-6 py-4 bg-slate-50/60 border-t border-slate-100">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-[#5b51ef] text-white font-semibold py-2.5 px-4 rounded-lg text-[13px] hover:bg-[#4a41d6] active:bg-[#3f37c2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading && (
            <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          )}
          {isLoading ? 'Processing…' : buttonText}
        </button>
      </div>
    </form>
  );
}
