// ─────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  username: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  role: string;
}

// ─────────────────────────────────────────────────────
// ACADEMIC
// ─────────────────────────────────────────────────────
export interface AcademicYear {
  id: number;
  yearName: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface Class {
  id: number;
  name: string;
  code?: string;
}

export interface Section {
  id: number;
  name: string;
  classId: number;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  classId: number;
  teacherId: number;
}

export interface Enrollment {
  id: number;
  studentId: number;
  sectionId: number;
  academicYearId: number;
  enrollmentDate: string;
}

// ─────────────────────────────────────────────────────
// STUDENTS
// ─────────────────────────────────────────────────────
export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  parentId: number;
  userId: number;
}

// ─────────────────────────────────────────────────────
// STAFF / TEACHERS
// ─────────────────────────────────────────────────────
export interface Staff {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  jobTitle: string;
  hireDate: string;
  userId: number;
}

// ─────────────────────────────────────────────────────
// ATTENDANCE
// ─────────────────────────────────────────────────────
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';

export interface Attendance {
  id: number;
  studentId: number;
  sectionId: number;
  date: string;
  status: AttendanceStatus;
}

export interface AttendanceSummary {
  totalDays: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

// ─────────────────────────────────────────────────────
// TIMETABLE
// ─────────────────────────────────────────────────────
export interface Timetable {
  id: number;
  sectionId: number;
  subjectId: number;
  teacherId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  roomNumber: string;
}

// ─────────────────────────────────────────────────────
// EXAMS
// ─────────────────────────────────────────────────────
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
  grade: string;
}

// ─────────────────────────────────────────────────────
// ASSIGNMENTS & SUBMISSIONS
// ─────────────────────────────────────────────────────
export interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  fileUrl: string;
  sectionId: number;
  subjectId: number;
  teacherId: number;
}

export interface Submission {
  id: number;
  assignmentId: number;
  studentId: number;
  fileUrl: string;
  submittedAt: string;
  grade: string;
  feedback: string;
}

// ─────────────────────────────────────────────────────
// FEES & PAYMENTS
// ─────────────────────────────────────────────────────
export interface FeeCategory {
  id: number;
  name: string;
  amount: number;
  description: string;
}

export type PaymentMethod = 'CASH' | 'ONLINE';

export interface Payment {
  id: number;
  studentId: number;
  feeCategoryId: number;
  amount: number;
  paidAt: string;
  method: PaymentMethod;
  remarks: string;
}

// ─────────────────────────────────────────────────────
// LIBRARY
// ─────────────────────────────────────────────────────
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

export interface BookIssue {
  id: number;
  bookId: number;
  studentId: number;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  status: string;
}

// ─────────────────────────────────────────────────────
// HOSTEL
// ─────────────────────────────────────────────────────
export type HostelBlockType = 'BOYS' | 'GIRLS';

export interface HostelBlock {
  id: number;
  name: string;
  type: HostelBlockType;
  description: string;
}

export interface HostelRoom {
  id: number;
  blockId: number;
  roomNumber: string;
  roomType: string;
  capacity: number;
  occupied: number;
  costPerMonth: number;
}

export interface HostelAllocation {
  id: number;
  roomId: number;
  studentId: number;
  allocationDate: string;
  vacantDate: string | null;
  isActive: boolean;
}

// ─────────────────────────────────────────────────────
// TRANSPORT
// ─────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────
// COMMUNICATION
// ─────────────────────────────────────────────────────
export interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  organizer: string;
  createdAt: string;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  author: string;
  publishedAt: string;
  isActive: boolean;
}

export interface Message {
  id: number;
  senderId?: number;
  senderName: string;
  receiverId?: number;
  receiverName: string;
  subject: string;
  body: string;
  isRead: boolean;
  sentAt: string;
}

export interface UserRecipient {
  id: number;
  username: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: string;
}

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveApplication {
  id: number;
  applicantName: string;
  reason: string;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  appliedAt: string;
}

// ─────────────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────────────
export interface Notification {
  id: number;
  title: string;
  message: string;
  recipientType: string;
  recipientId: number;
  isRead: boolean;
  createdAt: string;
}

// ─────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────
export interface User {
  id: number;
  username: string;
  role: string;
}