// Core client
export { apiClient } from './client';

// Auth
export { authApi } from './auth.api';

// Academic
export {
  academicYearApi,
  classApi,
  sectionApi,
  subjectApi,
  enrollmentApi,
} from './academic.api';

// Students
export { studentApi } from './student.api';

// Staff / Teachers
export { staffApi } from './staff.api';

// Attendance
export { attendanceApi } from './attendance.api';

// Timetable
export { timetableApi } from './timetable.api';

// Exams
export { examApi, examScheduleApi, examResultApi } from './exam.api';

// Assignments & Submissions
export { assignmentApi, submissionApi } from './assignment.api';

// Fees & Payments
export { feeCategoryApi, paymentApi } from './fee.api';

// Library
export { bookApi, bookIssueApi } from './library.api';

// Hostel
export { hostelBlockApi, hostelRoomApi, hostelAllocationApi } from './hostel.api';

// Transport
export { transportRouteApi, transportStopApi, studentTransportApi } from './transport.api';

// Communication
export { eventApi, noticeApi, messageApi, leaveApplicationApi } from './communication.api';

// Notifications
export { notificationApi } from './notification.api';

// Users
export { userApi } from './user.api';
