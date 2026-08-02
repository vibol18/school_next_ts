import React from "react";
import { User, Mail, Phone, Calendar, MapPin, Briefcase } from "lucide-react";

interface StudentCardProps {
  student: any;
}

export function StudentCard({ student }: StudentCardProps) {
  if (!student) return null;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-90" />
      
      <div className="relative z-10 flex flex-col items-center text-center mt-6">
        <div className="w-24 h-24 bg-white rounded-full p-1.5 shadow-lg shadow-indigo-500/20 mb-4">
          <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
            {student.profileImageUrl ? (
              <img src={student.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-slate-400" />
            )}
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-slate-900">{student.firstName} {student.lastName}</h2>
        <p className="text-sm font-semibold text-indigo-600 mt-1">{student.studentCode || `STU-${student.id}`}</p>
        
        <div className="flex items-center gap-2 mt-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold text-slate-600">Active Student</span>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-400">Email Address</p>
            <p className="text-sm font-medium text-slate-800 truncate">{student.email || "N/A"}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-400">Phone Number</p>
            <p className="text-sm font-medium text-slate-800 truncate">{student.phoneNumber || "N/A"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-400">Date of Birth</p>
            <p className="text-sm font-medium text-slate-800 truncate">{student.dateOfBirth || "N/A"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-400">Address</p>
            <p className="text-sm font-medium text-slate-800 truncate">{student.address || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
