# Ankush Shared Library

Shared functionality and services for the Ankush Admin and Student apps.

## Overview

This library provides common code used by both the Admin and Student applications, including:
- Firebase configuration and initialization
- Authentication services
- Firestore database operations
- Firebase Storage file operations
- Input validators
- Utility functions
- Grade calculation logic
- App-wide constants

## Installation

```bash
npm install
```

## Project Structure

```
shared/
├── src/
│   ├── config/
│   │   ├── firebase.config.js      # Firebase initialization
│   │   └── constants.js            # App-wide constants
│   ├── services/
│   │   ├── auth.service.js         # Authentication operations
│   │   ├── firestore.service.js    # Firestore CRUD operations
│   │   └── storage.service.js      # File upload/download
│   ├── utils/
│   │   ├── validators.js           # Input validation functions
│   │   ├── helpers.js              # General utility functions
│   │   └── grade-calculator.js     # Grade calculation logic
│   └── index.js                    # Library exports
└── package.json
```

## Usage

### Importing Services

```javascript
import {
  AuthService,
  FirestoreService,
  StorageService
} from '@ankush/shared';

// Use the services
await AuthService.signInWithEmail(email, password);
const students = await FirestoreService.getStudentsByClass('10th', 'A');
const url = await StorageService.uploadFile(path, fileUri);
```

### Importing Utilities

```javascript
import {
  validateEmail,
  calculateGrade,
  formatDate,
  COLLECTIONS,
  USER_ROLES
} from '@ankush/shared';

// Use utilities
const isValid = validateEmail('test@example.com');
const grade = calculateGrade(85); // Returns 'A'
const formatted = formatDate(new Date());
```

## Services

### AuthService

Handles all authentication operations:

```javascript
// Sign in with email/password
await AuthService.signInWithEmail(email, password, 'admin');

// Sign in with admission number (students only)
await AuthService.signInWithAdmissionNo(admissionNo, password);

// Create new user
await AuthService.createUser({
  email,
  password,
  role: 'student',
  admissionNo
});

// Sign out
await AuthService.signOut();

// Reset password
await AuthService.resetPassword(email);

// Get current user
const user = AuthService.getCurrentUser();

// Listen to auth state changes
const unsubscribe = AuthService.onAuthStateChanged((user) => {
  // Handle auth state change
});
```

### FirestoreService

Handles all Firestore database operations:

```javascript
// Generic CRUD operations
await FirestoreService.create('students', studentData);
const student = await FirestoreService.read('students', studentId);
await FirestoreService.update('students', studentId, updates);
await FirestoreService.delete('students', studentId);

// Query with filters
const students = await FirestoreService.query('students', [
  { field: 'class', operator: '==', value: '10th' },
  { field: 'section', operator: '==', value: 'A' }
]);

// Student operations
await FirestoreService.createStudent(studentData, authCredentials);
const student = await FirestoreService.getStudentByAdmissionNo('ABC123');
const students = await FirestoreService.getStudentsByClass('10th', 'A');

// Syllabus operations
await FirestoreService.createSyllabus(syllabusData);
const syllabus = await FirestoreService.getSyllabusByClass('10th', 'Mathematics');

// Homework operations
await FirestoreService.createHomework(homeworkData);
const homework = await FirestoreService.getHomeworkByClass('10th', 'A');

// Test operations
await FirestoreService.createTest(testData);
await FirestoreService.enterTestScore(scoreData);
const scores = await FirestoreService.getTestScoresByStudent(studentId);

// Real-time listeners
const unsubscribe = FirestoreService.subscribeToCollection(
  'students',
  [{ field: 'class', operator: '==', value: '10th' }],
  (students) => {
    // Handle updates
  }
);
```

### StorageService

Handles Firebase Storage file operations:

```javascript
// Upload file
const downloadURL = await StorageService.uploadFile(path, fileUri, metadata);

// Upload with progress tracking
const downloadURL = await StorageService.uploadFileWithProgress(
  path,
  fileUri,
  (progress) => {
    console.log(`Upload progress: ${progress}%`);
  }
);

// Download file
const localPath = await StorageService.downloadFile(url, localPath);

// Get download URL
const url = await StorageService.getDownloadURL(path);

// Delete file
await StorageService.deleteFile(path);

// Helper methods
const syllabusPath = StorageService.getSyllabusPath('10th', 'Math', 'chapter1.pdf');
const homeworkPath = StorageService.getHomeworkPath('10th', 'Math', 'assignment.pdf');
const isValid = StorageService.validateFileSize(fileSize, 'syllabus');
```

## Utilities

### Validators

```javascript
import {
  validateEmail,
  validatePhone,
  validateAdmissionNo,
  validatePassword,
  validateMarks,
  validateForm
} from '@ankush/shared';

// Email validation
const isValid = validateEmail('test@example.com'); // true

// Phone validation (Indian format)
const isValid = validatePhone('9876543210'); // true

// Admission number validation
const isValid = validateAdmissionNo('ABC12345'); // true

// Password validation
const result = validatePassword('MyPassword123');
// { isValid: true, message: 'Password is strong' }

// Marks validation
const result = validateMarks(85, 100);
// { isValid: true, message: 'Valid' }

// Form validation
const result = validateForm(formData, {
  email: { required: true, email: true },
  phone: { required: true, phone: true },
  name: { required: true, minLength: 3 }
});
// { isValid: true, errors: {} }
```

### Grade Calculator

```javascript
import {
  calculatePercentage,
  calculateGrade,
  calculateGradeFromMarks,
  getGradeColor,
  isPassed,
  calculateGPA
} from '@ankush/shared';

// Calculate percentage
const percentage = calculatePercentage(85, 100); // 85

// Calculate grade
const grade = calculateGrade(85); // 'A'

// Calculate grade from marks
const result = calculateGradeFromMarks(85, 100);
// { percentage: 85, grade: 'A' }

// Get grade color for UI
const color = getGradeColor('A'); // '#27ae60'

// Check if passed
const passed = isPassed(45); // true (default passing: 40%)

// Calculate GPA
const gpa = calculateGPA([
  { grade: 'A+', credits: 4 },
  { grade: 'A', credits: 3 },
  { grade: 'B+', credits: 3 }
]);
```

### Helpers

```javascript
import {
  formatDate,
  formatFileSize,
  getFullName,
  getInitials,
  capitalizeFirst,
  debounce,
  throttle,
  sortBy,
  groupBy,
  filterBySearch,
  getTimeAgo
} from '@ankush/shared';

// Format date
const formatted = formatDate(new Date()); // '18/03/2026'

// Format file size
const size = formatFileSize(1024 * 1024); // '1 MB'

// Get full name
const name = getFullName('John', 'Doe'); // 'John Doe'

// Get initials
const initials = getInitials('John', 'Doe'); // 'JD'

// Debounce function
const debouncedFn = debounce(() => console.log('Called'), 300);

// Sort array by key
const sorted = sortBy(students, 'name', 'asc');

// Group array by key
const grouped = groupBy(students, 'class');

// Filter by search term
const filtered = filterBySearch(students, 'John', ['firstName', 'lastName']);

// Get time ago
const timeAgo = getTimeAgo(new Date(Date.now() - 3600000)); // '1 hour ago'
```

## Constants

### Collections

```javascript
import { COLLECTIONS } from '@ankush/shared';

COLLECTIONS.USERS          // 'users'
COLLECTIONS.STUDENTS       // 'students'
COLLECTIONS.SYLLABUS       // 'syllabus'
COLLECTIONS.HOMEWORK       // 'homework'
COLLECTIONS.TESTS          // 'tests'
COLLECTIONS.TEST_SCORES    // 'test_scores'
```

### User Roles

```javascript
import { USER_ROLES } from '@ankush/shared';

USER_ROLES.ADMIN    // 'admin'
USER_ROLES.STUDENT  // 'student'
```

### Grades

```javascript
import { GRADES, GRADE_THRESHOLDS } from '@ankush/shared';

GRADES.A_PLUS  // 'A+'
GRADES.A       // 'A'
GRADES.B_PLUS  // 'B+'

GRADE_THRESHOLDS.A_PLUS  // 90
GRADE_THRESHOLDS.A       // 80
```

### File Limits

```javascript
import { FILE_SIZE_LIMITS, SUPPORTED_FILE_TYPES } from '@ankush/shared';

FILE_SIZE_LIMITS.HOMEWORK       // 10MB
FILE_SIZE_LIMITS.SYLLABUS       // 20MB
FILE_SIZE_LIMITS.PROFILE_IMAGE  // 5MB

SUPPORTED_FILE_TYPES.DOCUMENTS  // ['application/pdf', ...]
SUPPORTED_FILE_TYPES.IMAGES     // ['image/jpeg', 'image/png']
```

### Error Messages

```javascript
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@ankush/shared';

ERROR_MESSAGES.AUTH_USER_NOT_FOUND    // 'User not found...'
ERROR_MESSAGES.PERMISSION_DENIED      // 'You do not have permission...'

SUCCESS_MESSAGES.LOGIN_SUCCESS        // 'Login successful!'
SUCCESS_MESSAGES.STUDENT_CREATED      // 'Student profile created...'
```

## Error Handling

All services throw errors with meaningful messages:

```javascript
try {
  await AuthService.signInWithEmail(email, password);
} catch (error) {
  console.error(error.message); // User-friendly error message
  console.error(error.code);    // Error code (e.g., 'auth/user-not-found')
}
```

## Real-time Data Synchronization

The library provides real-time listeners for automatic data updates:

```javascript
// Subscribe to student profile changes
const unsubscribe = FirestoreService.subscribeToDocument(
  'students',
  studentId,
  (student) => {
    if (student) {
      // Student data updated
      console.log('Student updated:', student);
    }
  }
);

// Unsubscribe when done
unsubscribe();
```

## Firebase Configuration

Before using the library, update the Firebase configuration in `src/config/firebase.config.js`:

```javascript
const firebaseConfig = {
  apiKey: 'your-api-key',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: 'your-sender-id',
  appId: 'your-app-id',
};
```

Or use environment variables:
```
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
```

## Dependencies

- @react-native-firebase/app
- @react-native-firebase/auth
- @react-native-firebase/firestore
- @react-native-firebase/storage

## License

MIT
