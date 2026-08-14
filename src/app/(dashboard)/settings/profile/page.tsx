'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, User, Mail, Shield, Key, Loader2, Save, Trash2, School, Phone, MapPin } from 'lucide-react';
import { profileApi, UserProfile } from '@/lib/api/profile';
import { schoolInfoApi, SchoolInfo } from '@/lib/api/school';

const MAX_PHOTO_SIZE = 2 * 1024 * 1024; // 2MB

function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function syncLocalStorage(p: UserProfile) {
  localStorage.setItem('userFirstName', p.firstName ?? '');
  localStorage.setItem('userLastName', p.lastName ?? '');
  localStorage.setItem('userEmail', p.email ?? '');
  localStorage.setItem('userPhoto', p.profilePhoto ?? '');
  if (p.firstName || p.lastName) {
    localStorage.setItem('username', `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim() || p.username);
  }
}

export default function ProfileSettingsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin =
    (typeof window !== 'undefined' &&
      (localStorage.getItem('userRole') || '').toUpperCase()) === 'ADMIN';

  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null);
  const [schoolName, setSchoolName] = useState('');
  const [schoolPhone, setSchoolPhone] = useState('');
  const [schoolAddress, setSchoolAddress] = useState('');
  const [schoolLoading, setSchoolLoading] = useState(isAdmin);
  const [schoolSaving, setSchoolSaving] = useState(false);
  const [schoolError, setSchoolError] = useState('');
  const [schoolSuccess, setSchoolSuccess] = useState('');

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoDirty, setPhotoDirty] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    let cancelled = false;
    profileApi
      .getMe()
      .then((p) => {
        if (cancelled) return;
        setProfile(p);
        setFirstName(p.firstName ?? '');
        setLastName(p.lastName ?? '');
        setEmail(p.email ?? '');
        setPhoto(p.profilePhoto);
        syncLocalStorage(p);
      })
      .catch((err: any) => setErrorMsg(err?.message || 'Failed to load profile.'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    schoolInfoApi
      .getInfo()
      .then((info) => {
        if (cancelled) return;
        setSchoolInfo(info);
        setSchoolName(info.name ?? '');
        setSchoolPhone(info.phone ?? '');
        setSchoolAddress(info.address ?? '');
      })
      .catch((err: any) => !cancelled && setSchoolError(err?.message || 'Failed to load school information.'))
      .finally(() => !cancelled && setSchoolLoading(false));
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  const handleSchoolSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSchoolSaving(true);
    setSchoolError('');
    setSchoolSuccess('');
    try {
      const updated = await schoolInfoApi.updateInfo({
        name: schoolName.trim(),
        phone: schoolPhone.trim(),
        address: schoolAddress.trim(),
      });
      setSchoolInfo(updated);
      setSchoolSuccess('School information updated successfully.');
    } catch (err: any) {
      setSchoolError(err?.message || 'Failed to update school information.');
    } finally {
      setSchoolSaving(false);
    }
  };

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setErrorMsg('');
      setPhoto(dataUrl);
      setPhotoDirty(true);
    } catch {
      setErrorMsg('Could not read the selected file.');
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const updated = await profileApi.updateMe({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        profilePhoto: photoDirty ? (photo ?? null) : undefined,
      });
      setProfile(updated);
      setPhotoDirty(false);
      syncLocalStorage(updated);
      setSuccessMsg('Profile updated successfully.');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoDirty(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const displayName =
    profile?.firstName || profile?.lastName
      ? `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim()
      : profile?.username || 'User';
  const initials = displayName
    .split(' ')
    .map((s) => s.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-slate-400 gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading profile…
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Profile Settings</h1>
        <p className="text-sm text-[#6b7280]">Manage your account details, photo and preferences</p>
      </div>

      {errorMsg && (
        <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-700">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-[10px] border border-[#e5e7eb] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#e5e7eb] flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-[#4f46e5] to-[#4338ca] text-white flex items-center justify-center text-3xl font-bold ring-4 ring-[#e5e5fa]">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload photo"
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#5b51ef] text-white flex items-center justify-center shadow-md hover:bg-[#4338ca] transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#111827]">{displayName}</h2>
            <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#e5e5fa] text-[#4f46e5] text-xs font-semibold uppercase tracking-wide">
              {profile?.role ?? ''}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#111827] flex items-center gap-2">
                <User className="w-4 h-4 text-[#6b7280]" />
                Username
              </label>
              <input
                type="text"
                disabled
                value={profile?.username ?? ''}
                className="w-full px-3 py-2 bg-[#f8fafc] border border-[#e5e7eb] rounded-md text-[#6b7280] text-sm cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#111827] flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#6b7280]" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-md text-[#111827] text-sm focus:outline-none focus:ring-2 focus:ring-[#5b51ef]/20 focus:border-[#5b51ef]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#111827]">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Sokha"
                className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-md text-[#111827] text-sm focus:outline-none focus:ring-2 focus:ring-[#5b51ef]/20 focus:border-[#5b51ef]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#111827]">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Chea"
                className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-md text-[#111827] text-sm focus:outline-none focus:ring-2 focus:ring-[#5b51ef]/20 focus:border-[#5b51ef]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#111827] flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#6b7280]" />
                Access Role
              </label>
              <input
                type="text"
                disabled
                value={(profile?.role ?? '').charAt(0) + (profile?.role ?? '').slice(1).toLowerCase()}
                className="w-full px-3 py-2 bg-[#f8fafc] border border-[#e5e7eb] rounded-md text-[#6b7280] text-sm cursor-not-allowed"
              />
            </div>
          </div>

          {photoDirty && (
            <div className="flex items-center gap-3 text-sm text-slate-600 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">
              <span>Photo selected — save to keep it, or</span>
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
          )}

          <div className="pt-6 border-t border-[#e5e7eb] flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-[#111827] flex items-center gap-2">
                <Key className="w-4 h-4 text-[#6b7280]" />
                Security
              </h3>
              <p className="text-xs text-slate-500 mt-1">Password changes keep your account safe.</p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/forgot-password')}
              className="bg-white border border-[#e5e7eb] text-[#111827] hover:bg-slate-50 px-4 py-2 rounded-[8px] text-sm font-medium transition-colors shadow-sm"
            >
              Change Password
            </button>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#5b51ef] text-white px-5 py-2.5 rounded-[8px] text-sm font-semibold hover:bg-[#4338ca] transition-colors shadow-sm disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>

      {isAdmin && (
        <form
          onSubmit={handleSchoolSave}
          className="bg-white rounded-[10px] border border-[#e5e7eb] shadow-sm overflow-hidden mt-6"
        >
          <div className="p-6 border-b border-[#e5e7eb] flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#111827] flex items-center gap-2">
                <School className="w-5 h-5 text-[#5b51ef]" />
                School Information
              </h2>
              <p className="text-sm text-[#6b7280] mt-1">
                Update the school name, phone and address shown to users.
              </p>
            </div>
            {schoolInfo && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200">
                <Shield className="w-3 h-3" />
                Admin only
              </span>
            )}
          </div>

          {schoolError && (
            <div className="mx-6 mt-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
              {schoolError}
            </div>
          )}
          {schoolSuccess && (
            <div className="mx-6 mt-4 rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-700">
              {schoolSuccess}
            </div>
          )}

          {schoolLoading ? (
            <div className="flex items-center justify-center py-12 text-sm text-slate-400 gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading school information…
            </div>
          ) : (
            <div className="p-6 space-y-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#111827] flex items-center gap-2">
                  <School className="w-4 h-4 text-[#6b7280]" />
                  School Name
                </label>
                <input
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="e.g. EduCore School"
                  className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-md text-[#111827] text-sm focus:outline-none focus:ring-2 focus:ring-[#5b51ef]/20 focus:border-[#5b51ef]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#111827] flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#6b7280]" />
                    Phone
                  </label>
                  <input
                    type="text"
                    value={schoolPhone}
                    onChange={(e) => setSchoolPhone(e.target.value)}
                    placeholder="e.g. 012 345 678"
                    className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-md text-[#111827] text-sm focus:outline-none focus:ring-2 focus:ring-[#5b51ef]/20 focus:border-[#5b51ef]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#111827] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#6b7280]" />
                    Address
                  </label>
                  <input
                    type="text"
                    value={schoolAddress}
                    onChange={(e) => setSchoolAddress(e.target.value)}
                    placeholder="e.g. 123 Education Street, Phnom Penh"
                    className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-md text-[#111827] text-sm focus:outline-none focus:ring-2 focus:ring-[#5b51ef]/20 focus:border-[#5b51ef]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={schoolSaving}
                  className="inline-flex items-center gap-2 bg-[#5b51ef] text-white px-5 py-2.5 rounded-[8px] text-sm font-semibold hover:bg-[#4338ca] transition-colors shadow-sm disabled:opacity-50"
                >
                  {schoolSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {schoolSaving ? 'Saving…' : 'Save School Info'}
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
