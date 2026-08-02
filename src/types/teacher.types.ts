export interface Teacher {
  id: number;
  employeeId: string;
  qualification: string;
  experienceYears: string;
  dateOfJoining: string; // ISO date string YYYY-MM-DD
}

export interface TeacherCreateInput {
  employeeId: string;
  qualification: string;
  experienceYears: string;
  dateOfJoining: string;
}

export interface TeacherUpdateInput extends Partial<TeacherCreateInput> {}

export interface Subject {
  id: number;
  name: string;
  code: string;
}

export interface TimetableSlot {
  id: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  subjectName: string;
  className: string;
  sectionName: string;
}