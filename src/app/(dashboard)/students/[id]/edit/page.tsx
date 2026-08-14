'use client';

import React, { useEffect, useRef, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { studentsApi } from '@/lib/api/students';
import { studentUpdateSchema, StudentUpdateInput } from '@/lib/validators/student.schema';
import { Camera, ImagePlus, Trash2, Link2, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

const MAX_PHOTO_SIZE = 2 * 1024 * 1024; // 2MB

function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const inputBase =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10';

export default function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const studentId = parseInt(id, 10);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<StudentUpdateInput>({
    resolver: zodResolver(studentUpdateSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      admissionNumber: '',
      dateOfBirth: '',
      gender: 'MALE',
      bloodGroup: '',
      address: '',
      profilePhoto: '',
    },
  });

  const photo = watch('profilePhoto') || '';

  useEffect(() => {
    async function loadStudent() {
      try {
        setLoading(true);
        const s = await studentsApi.getById(studentId);
        reset({
          firstName: s.firstName || '',
          lastName: s.lastName || '',
          email: s.email || '',
          admissionNumber: s.admissionNumber || '',
          dateOfBirth: s.dateOfBirth || '',
          gender: s.gender || 'MALE',
          bloodGroup: s.bloodGroup || '',
          address: s.address || '',
          profilePhoto: s.profilePhoto || '',
        });
      } catch (err) {
        setLoadError('Failed to load student information.');
      } finally {
        setLoading(false);
      }
    }
    if (!isNaN(studentId)) {
      loadStudent();
    } else {
      setLoadError('Invalid student ID provided.');
      setLoading(false);
    }
  }, [studentId, reset]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please choose an image file (PNG, JPG, etc.).');
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setErrorMsg('Image is too large. Please choose a file under 2MB.');
      return;
    }
    try {
      const dataUrl = await toDataUrl(file);
      setValue('profilePhoto', dataUrl, { shouldValidate: true });
      setErrorMsg('');
    } catch {
      setErrorMsg('Could not read the selected file.');
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

  const onSubmit = async (data: StudentUpdateInput) => {
    setSaving(true);
    setErrorMsg('');
    try {
      await studentsApi.update(studentId, {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        admissionNumber: data.admissionNumber.trim(),
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        bloodGroup: data.bloodGroup?.trim(),
        address: data.address?.trim(),
        profilePhoto: photo || '',
      });
      router.push(`/students/${studentId}`);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to update student record.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center gap-2 text-sm text-slate-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading student details...
      </div>
    );
  }

  if (loadError) {
    return <div className="p-6 text-red-500">{loadError}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <Link
          href={`/students/${studentId}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to student profile
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Student</h1>
        <p className="text-sm text-gray-500">
          Update student details and profile photo for student #{studentId}
        </p>
      </div>

      {errorMsg && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
        {/* Profile photo */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 uppercase mb-2">
            <ImagePlus className="w-3.5 h-3.5 text-gray-400" />
            Profile Photo
          </label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-[#5b51ef]/10 text-[#5b51ef] flex items-center justify-center shrink-0 ring-2 ring-slate-100">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="Student preview" className="w-full h-full object-cover" />
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
              <span className="text-[11px] text-gray-400">PNG or JPG, max 2MB</span>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400 mb-1.5">
              <Link2 className="w-3 h-3" />
              Or paste an image URL
            </div>
            <input
              type="text"
              placeholder="https://example.com/photo.jpg"
              value={photo.startsWith('data:') ? '' : photo}
              onChange={handleLink}
              className={inputBase}
            />
            {errors.profilePhoto && (
              <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.profilePhoto.message}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">First Name</label>
            <input {...register('firstName')} className={inputBase} />
            {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Last Name</label>
            <input {...register('lastName')} className={inputBase} />
            {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Email</label>
            <input {...register('email')} type="email" className={inputBase} />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Admission Number</label>
            <input {...register('admissionNumber')} className={inputBase} />
            {errors.admissionNumber && <p className="text-xs text-red-500 mt-1">{errors.admissionNumber.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Gender</label>
            <select {...register('gender')} className={`${inputBase} bg-white`}>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Blood Group</label>
            <input {...register('bloodGroup')} placeholder="e.g. O+" className={inputBase} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Date of Birth</label>
          <input {...register('dateOfBirth')} type="date" className={inputBase} />
          {errors.dateOfBirth && <p className="text-xs text-red-500 mt-1">{errors.dateOfBirth.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Address</label>
          <textarea {...register('address')} rows={2} placeholder="Enter full address" className={`${inputBase} resize-none`} />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Link
            href={`/students/${studentId}`}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-[#5b51ef] hover:bg-[#4b42db] rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
