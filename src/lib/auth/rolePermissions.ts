export type RoleKey = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT' | 'STAFF';

export const ROLE_KEYS: RoleKey[] = ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'STAFF'];

export const roleLabels: Record<RoleKey, string> = {
  ADMIN: 'Administrator',
  TEACHER: 'Teacher',
  STUDENT: 'Student',
  PARENT: 'Parent',
  STAFF: 'Staff',
};

export const roleStyles: Record<RoleKey, string> = {
  ADMIN: 'bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200',
  TEACHER: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200',
  STUDENT: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
  PARENT: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
  STAFF: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200',
};

export interface PermissionFeature {
  key: string;
  label: string;
  description?: string;
  roles: RoleKey[];
}

export const permissionFeatures: PermissionFeature[] = [
  { key: 'dashboard', label: 'Dashboard', description: 'Overview of school activity', roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
  { key: 'students', label: 'Students', description: 'View & manage student records', roles: ['ADMIN', 'TEACHER'] },
  { key: 'teachers', label: 'Teachers', description: 'View & manage teacher records', roles: ['ADMIN'] },
  { key: 'academic-years', label: 'Academic Years', description: 'Manage academic years', roles: ['ADMIN'] },
  { key: 'classes', label: 'Classes', description: 'Manage classes & sections', roles: ['ADMIN'] },
  { key: 'sections', label: 'Sections', description: 'Manage sections', roles: ['ADMIN'] },
  { key: 'subjects', label: 'Subjects', description: 'Manage subjects', roles: ['ADMIN'] },
  { key: 'enrollments', label: 'Enrollments', description: 'Manage student enrollments', roles: ['ADMIN'] },
  { key: 'attendance', label: 'Attendance', description: 'Record & view attendance', roles: ['ADMIN', 'TEACHER'] },
  { key: 'attendance-reports', label: 'Attendance Reports', description: 'Attendance summaries', roles: ['ADMIN', 'TEACHER', 'PARENT'] },
  { key: 'timetable', label: 'Timetable', description: 'View class timetables', roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'] },
  { key: 'exams', label: 'Exams & Results', description: 'Manage exams and view results', roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
  { key: 'assignments', label: 'Assignments', description: 'Create & submit assignments', roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
  { key: 'fees', label: 'Fees & Payments', description: 'Collect & view fee payments', roles: ['ADMIN', 'STUDENT', 'PARENT'] },
  { key: 'library', label: 'Library', description: 'Manage books & transactions', roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
  { key: 'hostel', label: 'Hostel & Transport', description: 'Manage hostel blocks & transport', roles: ['ADMIN', 'STAFF'] },
  { key: 'communication', label: 'Communication', description: 'Notices & events', roles: ['ADMIN', 'TEACHER', 'STAFF'] },
  { key: 'messages', label: 'Messages', description: 'Internal chat & messaging', roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'STAFF'] },
  { key: 'leave', label: 'Leave Applications', description: 'Apply for & approve leave', roles: ['ADMIN', 'TEACHER', 'STAFF'] },
  { key: 'reports', label: 'Report Cards', description: 'Student report cards', roles: ['ADMIN', 'TEACHER', 'PARENT'] },
  { key: 'notifications', label: 'Notifications', description: 'View notifications', roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'STAFF'] },
  { key: 'settings', label: 'Settings', description: 'Profile & account settings', roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'STAFF'] },
  { key: 'users', label: 'User Management', description: 'Manage system users', roles: ['ADMIN'] },
  { key: 'files', label: 'File Explorer', description: 'Browse project files', roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'STAFF'] },
  { key: 'permissions', label: 'Role Permissions', description: 'View role access matrix', roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'STAFF'] },
];
