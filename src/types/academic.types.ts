export interface AcademicYear {
  id: number;
  yearName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface AcademicYearCreateInput {
  yearName: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
}

export interface ClassEntity {
  id: number;
  className: string;
  level?: string;
}

export interface ClassCreateInput {
  className: string;
  level?: string;
}

export interface Section {
  id: number;
  sectionName: string;
  classId: number;
}

export interface SectionCreateInput {
  sectionName: string;
  classId: number;
}

export interface Subject {
  id: number;
  subjectName: string;
  subjectCode: string;
}

export interface SubjectCreateInput {
  subjectName: string;
  subjectCode: string;
}

export interface ClassSubjectTeacher {
  id: number;
  classId: number;
  sectionId: number;
  subjectId: number;
  teacherId: number;
}

export interface ClassSubjectTeacherCreateInput {
  classId: number;
  sectionId: number;
  subjectId: number;
  teacherId: number;
}
