/**
 * Application Constants
 * App-wide constants and configuration values
 */

export const APP_NAME = 'Ankush';

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student',
};

// Collections
export const COLLECTIONS = {
  USERS: 'users',
  STUDENTS: 'students',
  SYLLABUS: 'syllabus',
  HOMEWORK: 'homework',
  TESTS: 'tests',
  TEST_SCORES: 'test_scores',
  ADMIN_ACTIVITY_LOG: 'admin_activity_log',
  // Phase 2 Collections
  FEES: 'fees',
  ATTENDANCE: 'attendance',
  TRANSPORT: 'transport',
  GALLERY: 'gallery',
  TIMETABLE: 'timetable',
  CONTACTS: 'contacts',
  EXAMS: 'exams',
  NOTICES: 'notices',
};

// Test Types
export const TEST_TYPES = {
  UNIT: 'unit',
  MIDTERM: 'midterm',
  FINAL: 'final',
  SURPRISE: 'surprise',
};

// Priority Levels
export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

// Grade System
export const GRADES = {
  A_PLUS: 'A+',
  A: 'A',
  B_PLUS: 'B+',
  B: 'B',
  C: 'C',
  D: 'D',
  F: 'F',
};

// Grade Thresholds
export const GRADE_THRESHOLDS = {
  A_PLUS: 90,
  A: 80,
  B_PLUS: 70,
  B: 60,
  C: 50,
  D: 40,
  F: 0,
};

// File Size Limits (in bytes)
export const FILE_SIZE_LIMITS = {
  HOMEWORK: 10 * 1024 * 1024, // 10MB
  SYLLABUS: 20 * 1024 * 1024, // 20MB
  PROFILE_IMAGE: 5 * 1024 * 1024, // 5MB
  GALLERY_IMAGE: 5 * 1024 * 1024, // 5MB
  TIMETABLE: 10 * 1024 * 1024, // 10MB
  NOTICE_ATTACHMENT: 10 * 1024 * 1024, // 10MB
};

// Supported File Types
export const SUPPORTED_FILE_TYPES = {
  DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  IMAGES: ['image/jpeg', 'image/png', 'image/jpg'],
  ALL: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/jpg'],
};

// Pagination
export const PAGINATION = {
  STUDENTS_PER_PAGE: 50,
  HOMEWORK_PER_PAGE: 20,
  TESTS_PER_PAGE: 20,
  SCORES_PER_PAGE: 50,
};

// Classes
export const CLASSES = [
  '1st', '2nd', '3rd', '4th', '5th',
  '6th', '7th', '8th', '9th', '10th',
  '11th', '12th'
];

// Sections
export const SECTIONS = ['A', 'B', 'C', 'D', 'E'];

// Subjects (can be customized per class)
export const SUBJECTS = [
  'Mathematics',
  'Science',
  'English',
  'Hindi',
  'Social Studies',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Physical Education',
];

// Gender Options
export const GENDER_OPTIONS = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
};

// Blood Groups
export const BLOOD_GROUPS = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

// Guardian Relations
export const GUARDIAN_RELATIONS = {
  FATHER: 'father',
  MOTHER: 'mother',
  GUARDIAN: 'guardian',
};

// Error Messages
export const ERROR_MESSAGES = {
  AUTH_USER_NOT_FOUND: 'User not found. Please check your credentials.',
  AUTH_WRONG_PASSWORD: 'Incorrect password. Please try again.',
  AUTH_INVALID_EMAIL: 'Invalid email address.',
  AUTH_EMAIL_ALREADY_IN_USE: 'Email address is already in use.',
  AUTH_WEAK_PASSWORD: 'Password is too weak. Please use at least 6 characters.',
  PERMISSION_DENIED: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  INVALID_ADMISSION_NO: 'Invalid admission number.',
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit.',
  UNSUPPORTED_FILE_TYPE: 'Unsupported file type.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logout successful!',
  STUDENT_CREATED: 'Student profile created successfully!',
  STUDENT_UPDATED: 'Student profile updated successfully!',
  SYLLABUS_UPLOADED: 'Syllabus uploaded successfully!',
  HOMEWORK_CREATED: 'Homework assigned successfully!',
  TEST_CREATED: 'Test created successfully!',
  SCORES_ENTERED: 'Test scores entered successfully!',
  PASSWORD_RESET_SENT: 'Password reset email sent successfully!',
};

// Storage Paths
export const STORAGE_PATHS = {
  SYLLABUS: (className, subject) => `syllabus/${className}/${subject}`,
  HOMEWORK: (className, subject) => `homework/${className}/${subject}`,
  PROFILE_IMAGES: 'students/profile-images',
  GALLERY: 'gallery',
  TIMETABLE: (className) => `timetable/${className}`,
  NOTICE_ATTACHMENTS: 'notices/attachments',
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  ISO: 'YYYY-MM-DD',
};

// Validation Regex
export const VALIDATION_REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[6-9]\d{9}$/,
  PINCODE: /^\d{6}$/,
  ADMISSION_NO: /^[A-Z0-9]{6,10}$/,
};

// Phase 2 Constants

// Attendance Status
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused',
};

// Fee Status
export const FEE_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
  PARTIAL: 'partial',
};

// Fee Types
export const FEE_TYPES = {
  TUITION: 'tuition',
  TRANSPORT: 'transport',
  EXAMINATION: 'examination',
  LIBRARY: 'library',
  SPORTS: 'sports',
  LAB: 'lab',
  OTHER: 'other',
};

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  ONLINE: 'online',
  CHEQUE: 'cheque',
  BANK_TRANSFER: 'bank_transfer',
  RAZORPAY: 'razorpay',
};

// Notice Types
export const NOTICE_TYPES = {
  GENERAL: 'general',
  URGENT: 'urgent',
  EVENT: 'event',
  HOLIDAY: 'holiday',
  EXAM: 'exam',
  FEE: 'fee',
};

// Notice Targets
export const NOTICE_TARGETS = {
  ALL: 'all',
  CLASS: 'class',
  STUDENT: 'student',
};

// Contact Types
export const CONTACT_TYPES = {
  TEACHER: 'teacher',
  STAFF: 'staff',
  PRINCIPAL: 'principal',
  VICE_PRINCIPAL: 'vice_principal',
  ACCOUNTANT: 'accountant',
};

// Exam Types (Extended)
export const EXAM_TYPES = {
  ...TEST_TYPES,
  ANNUAL: 'annual',
  HALF_YEARLY: 'half_yearly',
  QUARTERLY: 'quarterly',
  MONTHLY: 'monthly',
};

// Days of Week
export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// Pagination (Extended)
export const PAGINATION_EXTENDED = {
  ...PAGINATION,
  ATTENDANCE_PER_PAGE: 50,
  FEES_PER_PAGE: 20,
  NOTICES_PER_PAGE: 20,
  GALLERY_PER_PAGE: 20,
};
