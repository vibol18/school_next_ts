'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { studentsApi } from '@/lib/api/students';

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = Number(params.id);

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['student-profile', studentId],
    queryFn: () => studentsApi.getFullProfile(studentId),
    enabled: !!studentId,
  });

  const profileData = profile && typeof profile === 'object' && 'data' in profile ? (profile as any).data : profile;

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isError || !profileData) {
    return (
      <div className="p-6">
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
          Failed to load student profile details.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Profile Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {profileData.firstName || 'Unknown'} {profileData.lastName || ''}
          </h1>
          <p className="text-sm text-gray-500">Admission No: {profileData.admissionNumber || 'N/A'}</p>
        </div>
        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100">
          Student ID: #{profileData.id || 'N/A'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal details */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-2">
            Personal Details
          </h2>
          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-gray-500">Gender</dt>
            <dd className="font-medium text-gray-900">{profileData.gender || 'N/A'}</dd>
            <dt className="text-gray-500">Date of Birth</dt>
            <dd className="font-medium text-gray-900">{profileData.dateOfBirth || 'N/A'}</dd>
            <dt className="text-gray-500">Blood Group</dt>
            <dd className="font-medium text-gray-900">{profileData.bloodGroup || 'N/A'}</dd>
            <dt className="text-gray-500">Address</dt>
            <dd className="font-medium text-gray-900">{profileData.address || 'N/A'}</dd>
          </dl>
        </div>

        {/* User Account details */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-2">
            Linked User Account
          </h2>
          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-gray-500">Username</dt>
            <dd className="font-medium text-gray-900">{profileData.username || 'N/A'}</dd>
            <dt className="text-gray-500">Email Address</dt>
            <dd className="font-medium text-gray-900">{profileData.email || 'N/A'}</dd>
            <dt className="text-gray-500">System User ID</dt>
            <dd className="font-medium text-gray-900">{profileData.userId || 'N/A'}</dd>
          </dl>
        </div>
      </div>

      {/* Linked Parents */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-2">
          Parents & Guardians
        </h2>
        {profileData.parents && profileData.parents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profileData.parents.map((parent) => (
              <div key={parent.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm space-y-1">
                <p className="font-semibold text-gray-900">Parent ID: #{parent.id}</p>
                <p className="text-gray-600">Contact: {parent.contactNumber || 'N/A'}</p>
                <p className="text-gray-600">Occupation: {parent.occupation || 'N/A'}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No parents currently linked to this student record.</p>
        )}
      </div>
    </div>
  );
}