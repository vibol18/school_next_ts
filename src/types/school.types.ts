// =============================================================
//  SCHOOL MANAGEMENT SYSTEM — Complete TypeScript Type Definitions
//  Auto-generated from Spring Boot backend entities
//  Base URL: http://localhost:8080/api
// =============================================================

// ─── AUTH ────────────────────────────────────────────────────
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  role: UserRole;
  username: string;
}

// ─── USER ────────────────────────────────────────────────────
export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT' | 'STAFF';

export interface User {
  id: number;
  username: string;
  role: UserRole;
}

// ─── ACADEMIC ────────────────────────────────────────────────
export interface AcademicYear {
  id: number;
  yearName: string;      // e.g. "2025-2026"
  startDate: string;     // ISO date "YYYY-MM-DD"
  endDate: string;
  current: boolean;
}

export interface SchoolClass {
  id: number;
  name: string;          // e.g. "Grade 10"
  code?: string;         // e.g. "G10"
}

export interface Section {
  id: number;
  name: string;          // e.g. "Section A"
  classId: number;
}

export interface Subject {
  id: number;
  name: string;          // e.g. "Mathematics"
  code: string;          // e.g. "MATH101"
}

export interface Enrollment {
  id: number;
  studentId: number;
  sectionId: number;
  academicYearId: number;
  enrollmentDate: string;
}

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  dob: string;           // "YYYY-MM-DD"
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  address: string;
  phone: string;
  email: string;
  parentId?: number;
  userId?: number;
  admissionNumber?: string;
  username?: string;
  bloodGroup?: string;
  profilePhoto?: string | null;
}

// ─── STAFF / TEACHER ─────────────────────────────────────────
export interface Staff {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  jobTitle: string;
  hireDate: string;      // "YYYY-MM-DD"
  userId?: number;
}

// ─── ATTENDANCE ──────────────────────────────────────────────
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';

export interface Attendance {
  id: number;
  studentId: number;
  sectionId: number;
  date: string;          // "YYYY-MM-DD"
  status: AttendanceStatus;
}

export interface AttendanceSummary {
  totalDays: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

// ─── TIMETABLE ───────────────────────────────────────────────
export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY';

export interface Timetable {
  id: number;
  sectionId: number;
  subjectId: number;
  teacherId: number;
  dayOfWeek: DayOfWeek;
  startTime: string;     // "HH:MM"
  endTime: string;       // "HH:MM"
  roomNumber: string;
}

// ─── EXAMS ───────────────────────────────────────────────────
export type ExamType = 'MIDTERM' | 'FINAL' | 'QUIZ' | 'ASSIGNMENT' | 'PRACTICAL';

export interface Exam {
  id: number;
  name: string;
  term: string;
  academicYearId: number;
}

export interface ExamResult {
  id: number;
  examId: number;
  studentId: number;
  subjectId: number;
  marksObtained: number;
  totalMarks: number;
  grade: string;         // "A+", "B", "C", "FAIL"
}

// ─── ASSIGNMENTS ─────────────────────────────────────────────
export interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;       // "YYYY-MM-DD"
  fileUrl?: string;
  sectionId: number;
  subjectId: number;
  teacherId: number;
  createdAt?: string;
}

export interface Submission {
  id: number;
  assignmentId: number;
  studentId: number;
  fileUrl: string;
  submittedAt: string;
  grade?: string;
  feedback?: string;
}

// ─── FEE & PAYMENTS ──────────────────────────────────────────
export interface FeeCategory {
  id: number;
  name: string;          // e.g. "Tuition Fee", "Lab Fee"
  amount: number;
  description: string;
}

export type PaymentMethod = 'CASH' | 'ONLINE' | 'CHEQUE' | 'BANK_TRANSFER';

export interface Payment {
  id: number;
  studentId: number;
  feeCategoryId: number;
  amount: number;
  paidAt: string;        // ISO datetime
  method: PaymentMethod;
  remarks?: string;
}

// ─── LIBRARY ─────────────────────────────────────────────────
export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
}

export type BookIssueStatus = 'ISSUED' | 'RETURNED' | 'OVERDUE';

export interface BookIssue {
  id: number;
  bookId: number;
  studentId: number;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: BookIssueStatus;
}

// ─── HOSTEL ──────────────────────────────────────────────────
export type HostelType = 'BOYS' | 'GIRLS';

export interface HostelBlock {
  id: number;
  name: string;          // "Block A", "Block B"
  type: HostelType;
  description: string;
}

export interface HostelRoom {
  id: number;
  blockId: number;
  roomNumber: string;
  roomType: string;      // "AC", "NON_AC", "SINGLE", "DOUBLE"
  capacity: number;
  occupied: number;
  costPerMonth: number;
}

export interface HostelAllocation {
  id: number;
  roomId: number;
  studentId: number;
  allocationDate: string;
  vacantDate?: string;
  isActive: boolean;
}

// ─── TRANSPORT ───────────────────────────────────────────────
export interface TransportRoute {
  id: number;
  routeName: string;
  startLocation: string;
  endLocation: string;
  vehicleNumber: string;
  driverName: string;
  driverContact: string;
}

export interface TransportStop {
  id: number;
  routeId: number;
  stopName: string;
  fare: number;
}

export interface StudentTransport {
  id: number;
  studentId: number;
  routeId: number;
  stopId: number;
}

// ─── COMMUNICATION ───────────────────────────────────────────
export interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: string;     // "YYYY-MM-DD"
  location: string;
  organizer: string;
  createdAt?: string;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  author: string;
  publishedAt?: string;
  isActive: boolean;
}

export interface Message {
  id: number;
  senderName: string;
  receiverName: string;
  subject: string;
  body: string;
  isRead: boolean;
  sentAt?: string;
}

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveApplication {
  id: number;
  applicantName: string;
  reason: string;
  startDate: string;     // "YYYY-MM-DD"
  endDate: string;
  status: LeaveStatus;
  appliedAt?: string;
}

// ─── NOTIFICATIONS ───────────────────────────────────────────
export type RecipientType = 'STUDENT' | 'TEACHER' | 'STAFF' | 'PARENT' | 'ALL';

export interface Notification {
  id: number;
  title: string;
  message: string;
  recipientType: RecipientType;
  recipientId?: number;
  isRead: boolean;
  createdAt?: string;
}

// ─── GENERIC API RESPONSE WRAPPER (optional) ─────────────────
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
