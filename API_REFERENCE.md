# API Reference

Complete API documentation for the Ankush Shared Library.

---

## Table of Contents

1. [Authentication Service](#authentication-service)
2. [Firestore Service](#firestore-service)
3. [Storage Service](#storage-service)
4. [Validators](#validators)
5. [Helpers](#helpers)
6. [Grade Calculator](#grade-calculator)
7. [Constants](#constants)

---

## Authentication Service

### Import

```javascript
import { AuthService } from '@ankush/shared';
```

### Methods

#### `signInWithEmail(email, password, expectedRole)`

Sign in with email and password.

**Parameters:**
- `email` (string): User email address
- `password` (string): User password
- `expectedRole` (string, optional): Expected user role ('admin' or 'student')

**Returns:** `Promise<Object>` - User object with role

**Example:**
```javascript
const user = await AuthService.signInWithEmail(
  'admin@school.com',
  'password123',
  'admin'
);
console.log(user.role); // 'admin'
```

**Throws:**
- `AUTH_USER_NOT_FOUND`: User doesn't exist
- `AUTH_WRONG_PASSWORD`: Incorrect password
- `PERMISSION_DENIED`: Role mismatch

---

#### `signInWithAdmissionNo(admissionNo, password)`

Sign in with admission number (students only).

**Parameters:**
- `admissionNo` (string): Student admission number
- `password` (string): User password

**Returns:** `Promise<Object>` - User object with student data

**Example:**
```javascript
const student = await AuthService.signInWithAdmissionNo('STU001', 'password123');
console.log(student.admissionNo); // 'STU001'
```

---

#### `createUser(userData)`

Create a new user account.

**Parameters:**
- `userData` (Object):
  - `email` (string): User email
  - `password` (string): User password
  - `role` (string): User role ('admin' or 'student')
  - `admissionNo` (string, optional): Admission number for students

**Returns:** `Promise<Object>` - Created user object

**Example:**
```javascript
const user = await AuthService.createUser({
  email: 'student@school.com',
  password: 'password123',
  role: 'student',
  admissionNo: 'STU001'
});
```

---

#### `signOut()`

Sign out current user.

**Returns:** `Promise<void>`

**Example:**
```javascript
await AuthService.signOut();
```

---

#### `resetPassword(email)`

Send password reset email.

**Parameters:**
- `email` (string): User email address

**Returns:** `Promise<void>`

**Example:**
```javascript
await AuthService.resetPassword('user@school.com');
```

---

#### `getCurrentUser()`

Get currently authenticated user.

**Returns:** `Object|null` - Current user or null if not authenticated

**Example:**
```javascript
const user = AuthService.getCurrentUser();
if (user) {
  console.log(user.uid);
}
```

---

#### `getUserRole(uid)`

Get user role from Firestore.

**Parameters:**
- `uid` (string): User ID

**Returns:** `Promise<string|null>` - User role or null

**Example:**
```javascript
const role = await AuthService.getUserRole(user.uid);
console.log(role); // 'admin' or 'student'
```

---

#### `onAuthStateChanged(callback)`

Listen to authentication state changes.

**Parameters:**
- `callback` (Function): Callback function that receives user object

**Returns:** `Function` - Unsubscribe function

**Example:**
```javascript
const unsubscribe = AuthService.onAuthStateChanged((user) => {
  if (user) {
    console.log('User signed in:', user.email);
  } else {
    console.log('User signed out');
  }
});

// Later, to stop listening:
unsubscribe();
```

---

## Firestore Service

### Import

```javascript
import { FirestoreService } from '@ankush/shared';
```

### Generic Methods

#### `create(collection, data, docId)`

Create a new document.

**Parameters:**
- `collection` (string): Collection name
- `data` (Object): Document data
- `docId` (string, optional): Custom document ID

**Returns:** `Promise<Object>` - Created document with ID

**Example:**
```javascript
const doc = await FirestoreService.create('students', {
  name: 'John Doe',
  class: '10th'
});
console.log(doc.id);
```

---

#### `read(collection, docId)`

Read a document.

**Parameters:**
- `collection` (string): Collection name
- `docId` (string): Document ID

**Returns:** `Promise<Object>` - Document data

**Example:**
```javascript
const student = await FirestoreService.read('students', 'abc123');
console.log(student.name);
```

---

#### `update(collection, docId, data)`

Update a document.

**Parameters:**
- `collection` (string): Collection name
- `docId` (string): Document ID
- `data` (Object): Fields to update

**Returns:** `Promise<void>`

**Example:**
```javascript
await FirestoreService.update('students', 'abc123', {
  class: '11th'
});
```

---

#### `delete(collection, docId)`

Delete a document.

**Parameters:**
- `collection` (string): Collection name
- `docId` (string): Document ID

**Returns:** `Promise<void>`

**Example:**
```javascript
await FirestoreService.delete('students', 'abc123');
```

---

#### `query(collection, filters, orderBy, limit)`

Query documents with filters.

**Parameters:**
- `collection` (string): Collection name
- `filters` (Array): Array of filter objects `[{ field, operator, value }]`
- `orderBy` (Object, optional): Order by `{ field, direction }`
- `limit` (number, optional): Limit results

**Returns:** `Promise<Array>` - Array of documents

**Example:**
```javascript
const students = await FirestoreService.query('students', [
  { field: 'class', operator: '==', value: '10th' },
  { field: 'section', operator: '==', value: 'A' }
], { field: 'rollNo', direction: 'asc' }, 50);
```

---

### Student Methods

#### `createStudent(studentData, authCredentials)`

Create a new student with authentication.

**Parameters:**
- `studentData` (Object): Student profile data
- `authCredentials` (Object): `{ email, password, admissionNo }`

**Returns:** `Promise<Object>` - Created student profile

**Example:**
```javascript
const student = await FirestoreService.createStudent({
  firstName: 'John',
  lastName: 'Doe',
  class: '10th',
  section: 'A',
  dateOfBirth: new Date('2010-01-01'),
  // ... other fields
}, {
  email: 'john.doe@student.com',
  password: 'password123',
  admissionNo: 'STU001'
});
```

---

#### `getStudentByAdmissionNo(admissionNo)`

Get student by admission number.

**Parameters:**
- `admissionNo` (string): Student admission number

**Returns:** `Promise<Object|null>` - Student data or null

**Example:**
```javascript
const student = await FirestoreService.getStudentByAdmissionNo('STU001');
```

---

#### `getStudentsByClass(className, section)`

Get students by class and section.

**Parameters:**
- `className` (string): Class name (e.g., '10th')
- `section` (string, optional): Section (e.g., 'A')

**Returns:** `Promise<Array>` - Array of students

**Example:**
```javascript
const students = await FirestoreService.getStudentsByClass('10th', 'A');
```

---

### Syllabus Methods

#### `createSyllabus(syllabusData)`

Create syllabus entry.

**Parameters:**
- `syllabusData` (Object): Syllabus information

**Returns:** `Promise<Object>` - Created syllabus

**Example:**
```javascript
const syllabus = await FirestoreService.createSyllabus({
  title: 'Mathematics - Class 10',
  class: '10th',
  subject: 'Mathematics',
  fileUrl: 'https://...',
  fileName: 'math_syllabus.pdf',
  fileSize: 1024000,
  fileType: 'application/pdf'
});
```

---

#### `getSyllabusByClass(className, subject)`

Get syllabus by class and subject.

**Parameters:**
- `className` (string): Class name
- `subject` (string, optional): Subject name

**Returns:** `Promise<Array>` - Array of syllabus documents

**Example:**
```javascript
const syllabus = await FirestoreService.getSyllabusByClass('10th', 'Mathematics');
```

---

### Homework Methods

#### `createHomework(homeworkData)`

Create homework assignment.

**Parameters:**
- `homeworkData` (Object): Homework details

**Returns:** `Promise<Object>` - Created homework

**Example:**
```javascript
const homework = await FirestoreService.createHomework({
  title: 'Chapter 5 Exercise',
  description: 'Complete all questions',
  class: '10th',
  section: 'A',
  subject: 'Mathematics',
  assignedDate: new Date(),
  dueDate: new Date('2026-03-25'),
  priority: 'high'
});
```

---

#### `getHomeworkByClass(className, section)`

Get homework for a class and section.

**Parameters:**
- `className` (string): Class name
- `section` (string): Section

**Returns:** `Promise<Array>` - Array of homework assignments

**Example:**
```javascript
const homework = await FirestoreService.getHomeworkByClass('10th', 'A');
```

---

### Test Methods

#### `createTest(testData)`

Create a test.

**Parameters:**
- `testData` (Object): Test information

**Returns:** `Promise<Object>` - Created test

**Example:**
```javascript
const test = await FirestoreService.createTest({
  title: 'Unit Test 1',
  class: '10th',
  subject: 'Mathematics',
  testDate: new Date(),
  maxMarks: 100,
  passingMarks: 40
});
```

---

#### `enterTestScore(scoreData)`

Enter test score for a student.

**Parameters:**
- `scoreData` (Object): Score information

**Returns:** `Promise<Object>` - Created score entry

**Example:**
```javascript
const score = await FirestoreService.enterTestScore({
  testId: 'test123',
  studentId: 'student123',
  admissionNo: 'STU001',
  marksObtained: 85,
  maxMarks: 100,
  percentage: 85,
  grade: 'A',
  isPublished: true
});
```

---

#### `getTestScoresByStudent(studentId, publishedOnly)`

Get test scores for a student.

**Parameters:**
- `studentId` (string): Student ID
- `publishedOnly` (boolean, default: true): Only return published scores

**Returns:** `Promise<Array>` - Array of test scores

**Example:**
```javascript
const scores = await FirestoreService.getTestScoresByStudent('student123', true);
```

---

### Real-time Listeners

#### `subscribeToCollection(collection, filters, callback)`

Subscribe to collection changes.

**Parameters:**
- `collection` (string): Collection name
- `filters` (Array): Filter array
- `callback` (Function): Callback receives documents array

**Returns:** `Function` - Unsubscribe function

**Example:**
```javascript
const unsubscribe = FirestoreService.subscribeToCollection(
  'students',
  [{ field: 'class', operator: '==', value: '10th' }],
  (students) => {
    console.log('Students updated:', students.length);
  }
);

// Unsubscribe when done
unsubscribe();
```

---

#### `subscribeToDocument(collection, docId, callback)`

Subscribe to document changes.

**Parameters:**
- `collection` (string): Collection name
- `docId` (string): Document ID
- `callback` (Function): Callback receives document data

**Returns:** `Function` - Unsubscribe function

**Example:**
```javascript
const unsubscribe = FirestoreService.subscribeToDocument(
  'students',
  'abc123',
  (student) => {
    console.log('Student updated:', student.name);
  }
);
```

---

## Storage Service

### Import

```javascript
import { StorageService } from '@ankush/shared';
```

### Methods

#### `uploadFile(path, fileUri, metadata)`

Upload a file.

**Parameters:**
- `path` (string): Storage path
- `fileUri` (string): Local file URI
- `metadata` (Object, optional): File metadata

**Returns:** `Promise<string>` - Download URL

**Example:**
```javascript
const url = await StorageService.uploadFile(
  'syllabus/10th/Math/chapter1.pdf',
  'file:///path/to/file.pdf',
  { contentType: 'application/pdf' }
);
```

---

#### `uploadFileWithProgress(path, fileUri, onProgress, metadata)`

Upload file with progress tracking.

**Parameters:**
- `path` (string): Storage path
- `fileUri` (string): Local file URI
- `onProgress` (Function): Progress callback (receives percentage)
- `metadata` (Object, optional): File metadata

**Returns:** `Promise<string>` - Download URL

**Example:**
```javascript
const url = await StorageService.uploadFileWithProgress(
  'syllabus/10th/Math/chapter1.pdf',
  'file:///path/to/file.pdf',
  (progress) => {
    console.log(`Upload: ${progress}%`);
  }
);
```

---

#### `downloadFile(url, localPath)`

Download a file.

**Parameters:**
- `url` (string): Download URL
- `localPath` (string): Local path to save file

**Returns:** `Promise<string>` - Local file path

**Example:**
```javascript
const path = await StorageService.downloadFile(
  'https://...',
  '/local/path/file.pdf'
);
```

---

#### `deleteFile(path)`

Delete a file.

**Parameters:**
- `path` (string): Storage path

**Returns:** `Promise<void>`

**Example:**
```javascript
await StorageService.deleteFile('syllabus/10th/Math/chapter1.pdf');
```

---

### Helper Methods

#### `getSyllabusPath(className, subject, fileName)`

Generate storage path for syllabus.

**Example:**
```javascript
const path = StorageService.getSyllabusPath('10th', 'Math', 'chapter1.pdf');
// Returns: 'syllabus/10th/Math/chapter1_1234567890.pdf'
```

---

#### `getHomeworkPath(className, subject, fileName)`

Generate storage path for homework.

---

#### `getProfileImagePath(admissionNo, fileName)`

Generate storage path for profile image.

---

#### `validateFileSize(fileSize, fileType)`

Validate file size against limits.

**Parameters:**
- `fileSize` (number): File size in bytes
- `fileType` (string): Type ('homework', 'syllabus', 'profile_image')

**Returns:** `boolean` - True if valid

**Example:**
```javascript
const isValid = StorageService.validateFileSize(5000000, 'homework');
```

---

## Validators

### Import

```javascript
import { validateEmail, validatePhone, /* ... */ } from '@ankush/shared';
```

### Functions

- `validateEmail(email)` - Returns `boolean`
- `validatePhone(phone)` - Returns `boolean` (Indian format)
- `validatePincode(pincode)` - Returns `boolean` (Indian format)
- `validateAdmissionNo(admissionNo)` - Returns `boolean`
- `validatePassword(password)` - Returns `{ isValid, message }`
- `validateRequired(value)` - Returns `boolean`
- `validateMarks(obtained, max)` - Returns `{ isValid, message }`
- `validateForm(formData, rules)` - Returns `{ isValid, errors }`

See [Shared Library README](shared/README.md) for detailed examples.

---

## Grade Calculator

### Import

```javascript
import { calculateGrade, calculatePercentage, /* ... */ } from '@ankush/shared';
```

### Functions

- `calculatePercentage(obtained, total)` - Returns `number`
- `calculateGrade(percentage)` - Returns `string` (A+, A, B+, etc.)
- `calculateGradeFromMarks(obtained, total)` - Returns `{ percentage, grade }`
- `getGradeColor(grade)` - Returns `string` (hex color)
- `isPassed(percentage, passingPercentage)` - Returns `boolean`
- `getGradePoint(grade)` - Returns `number`
- `calculateGPA(grades)` - Returns `number`
- `calculateAverage(scores)` - Returns `number`
- `calculateRank(studentScore, allScores)` - Returns `number`
- `getPerformanceCategory(percentage)` - Returns `string`

See [Shared Library README](shared/README.md) for detailed examples.

---

## Constants

### Import

```javascript
import { COLLECTIONS, USER_ROLES, GRADES, /* ... */ } from '@ankush/shared';
```

### Available Constants

- `COLLECTIONS` - Collection names
- `USER_ROLES` - User roles
- `TEST_TYPES` - Test types
- `PRIORITY_LEVELS` - Priority levels
- `GRADES` - Grade values
- `GRADE_THRESHOLDS` - Grade percentage thresholds
- `FILE_SIZE_LIMITS` - File size limits
- `SUPPORTED_FILE_TYPES` - Allowed file types
- `CLASSES` - Class list
- `SECTIONS` - Section list
- `SUBJECTS` - Subject list
- `GENDER_OPTIONS` - Gender options
- `BLOOD_GROUPS` - Blood group list
- `ERROR_MESSAGES` - Error message templates
- `SUCCESS_MESSAGES` - Success message templates
- `STORAGE_PATHS` - Storage path generators
- `VALIDATION_REGEX` - Regex patterns

See [constants.js](shared/src/config/constants.js) for complete list and values.

---

## Error Handling

All service methods throw errors with:
- `error.message` - User-friendly error message
- `error.code` - Error code for programmatic handling

**Example:**
```javascript
try {
  await AuthService.signInWithEmail(email, password);
} catch (error) {
  if (error.code === 'auth/user-not-found') {
    // Handle user not found
  } else {
    // Handle other errors
  }
  console.error(error.message);
}
```

---

**Version**: 1.0.0
**Last Updated**: March 2026
