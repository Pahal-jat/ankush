# Phase 1: Database Schema (Firebase Firestore)

## Overview
This document outlines the Firebase Firestore database schema for the dual-app ecosystem (Admin + Student). The schema is designed to support real-time synchronization and secure role-based access.

## Collections

### 1. `users`
Stores authentication and basic user information.

**Document ID**: Auto-generated Firebase Auth UID

**Structure**:
```javascript
{
  uid: string,                    // Firebase Auth UID
  email: string,                  // User email
  role: string,                   // "admin" | "student"
  createdAt: timestamp,           // Account creation date
  updatedAt: timestamp,           // Last update
  isActive: boolean,              // Account status

  // Student-specific fields (null for admin)
  admissionNo: string | null,     // Unique admission number
  studentId: string | null,       // Reference to students collection
}
```

**Indexes**:
- `email` (ascending)
- `admissionNo` (ascending)
- `role` (ascending)

---

### 2. `students`
Stores comprehensive student profile information.

**Document ID**: Auto-generated unique ID

**Structure**:
```javascript
{
  id: string,                     // Document ID
  admissionNo: string,            // Unique admission number (primary identifier)
  userId: string,                 // Reference to users collection

  // Personal Information
  firstName: string,
  lastName: string,
  dateOfBirth: timestamp,
  gender: string,                 // "male" | "female" | "other"
  bloodGroup: string,
  profileImageUrl: string | null,

  // Contact Information
  email: string,
  phone: string,
  address: {
    street: string,
    city: string,
    state: string,
    pincode: string,
    country: string
  },

  // Academic Information
  class: string,                  // Current class (e.g., "10th", "12th")
  section: string,                // Section (e.g., "A", "B")
  rollNo: string,                 // Roll number in class
  academicYear: string,           // e.g., "2026-2027"

  // Parent/Guardian Information
  guardian: {
    name: string,
    relation: string,             // "father" | "mother" | "guardian"
    phone: string,
    email: string,
    occupation: string
  },

  // Metadata
  admissionDate: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp,
  createdBy: string,              // Admin UID who created this record
  lastModifiedBy: string          // Admin UID who last modified
}
```

**Indexes**:
- `admissionNo` (ascending, unique)
- `class` (ascending)
- `academicYear` (ascending)
- Compound: `class`, `section`, `rollNo`

---

### 3. `syllabus`
Stores syllabus documents for different classes and subjects.

**Document ID**: Auto-generated unique ID

**Structure**:
```javascript
{
  id: string,                     // Document ID
  title: string,                  // e.g., "Mathematics - Class 10"
  description: string,
  class: string,                  // e.g., "10th"
  subject: string,                // e.g., "Mathematics"
  academicYear: string,           // e.g., "2026-2027"

  // File Information
  fileUrl: string,                // Firebase Storage URL
  fileName: string,               // Original file name
  fileSize: number,               // Size in bytes
  fileType: string,               // MIME type (e.g., "application/pdf")

  // Metadata
  uploadedBy: string,             // Admin UID
  uploadedAt: timestamp,
  updatedAt: timestamp,
  isActive: boolean,              // Visibility control

  // Optional: Chapter breakdown
  chapters: [
    {
      chapterNo: number,
      title: string,
      topics: [string]            // Array of topic names
    }
  ] | null
}
```

**Indexes**:
- `class` (ascending)
- `subject` (ascending)
- `academicYear` (ascending)
- Compound: `class`, `subject`, `academicYear`

---

### 4. `homework`
Stores homework assignments.

**Document ID**: Auto-generated unique ID

**Structure**:
```javascript
{
  id: string,                     // Document ID
  title: string,                  // e.g., "Chapter 5 Exercise"
  description: string,            // Detailed instructions
  class: string,                  // Target class
  section: string | "all",        // Target section or "all"
  subject: string,                // Subject name

  // Assignment Details
  assignedDate: timestamp,
  dueDate: timestamp,
  priority: string,               // "low" | "medium" | "high"

  // File Information (optional)
  fileUrl: string | null,         // Firebase Storage URL for attachment
  fileName: string | null,
  fileSize: number | null,
  fileType: string | null,

  // Metadata
  assignedBy: string,             // Admin UID
  createdAt: timestamp,
  updatedAt: timestamp,
  isActive: boolean               // Visibility control
}
```

**Indexes**:
- `class` (ascending)
- `subject` (ascending)
- `dueDate` (ascending)
- Compound: `class`, `section`, `dueDate`

---

### 5. `tests`
Stores test/exam information.

**Document ID**: Auto-generated unique ID

**Structure**:
```javascript
{
  id: string,                     // Document ID
  title: string,                  // e.g., "Unit Test 1"
  description: string,
  testType: string,               // "unit" | "midterm" | "final" | "surprise"
  class: string,                  // e.g., "10th"
  section: string | "all",        // Section or "all"
  subject: string,                // Subject name

  // Test Details
  testDate: timestamp,
  maxMarks: number,               // Total marks
  passingMarks: number,           // Passing threshold
  duration: number,               // Duration in minutes

  // Metadata
  createdBy: string,              // Admin UID
  createdAt: timestamp,
  updatedAt: timestamp,
  isPublished: boolean,           // Whether results are published
  academicYear: string
}
```

**Indexes**:
- `class` (ascending)
- `subject` (ascending)
- `testDate` (ascending)
- Compound: `class`, `section`, `subject`

---

### 6. `test_scores`
Stores individual student test scores.

**Document ID**: Auto-generated unique ID

**Structure**:
```javascript
{
  id: string,                     // Document ID
  testId: string,                 // Reference to tests collection
  studentId: string,              // Reference to students collection
  admissionNo: string,            // Student admission number

  // Score Information
  marksObtained: number,          // Marks scored
  maxMarks: number,               // Total marks (duplicated for convenience)
  percentage: number,             // Calculated percentage
  grade: string,                  // "A+" | "A" | "B+" | "B" | "C" | "D" | "F"

  // Details
  remarks: string | null,         // Teacher remarks

  // Metadata
  enteredBy: string,              // Admin UID who entered the marks
  enteredAt: timestamp,
  updatedAt: timestamp,
  isPublished: boolean            // Whether visible to student
}
```

**Indexes**:
- `testId` (ascending)
- `studentId` (ascending)
- `admissionNo` (ascending)
- Compound: `studentId`, `testId`

---

### 7. `admin_activity_log`
Tracks admin actions for audit purposes.

**Document ID**: Auto-generated unique ID

**Structure**:
```javascript
{
  id: string,                     // Document ID
  adminId: string,                // Admin UID
  adminEmail: string,             // Admin email
  action: string,                 // Action type (e.g., "create_student", "upload_syllabus")
  entityType: string,             // Entity affected (e.g., "student", "homework")
  entityId: string | null,        // ID of affected entity

  // Action Details
  description: string,            // Human-readable description
  metadata: object | null,        // Additional action-specific data

  // Metadata
  timestamp: timestamp,
  ipAddress: string | null,
  userAgent: string | null
}
```

**Indexes**:
- `adminId` (ascending)
- `timestamp` (descending)
- `action` (ascending)

---

## Firebase Storage Structure

### Folder Organization
```
/storage
  /syllabus
    /{class}
      /{subject}
        /{filename}_{timestamp}.pdf

  /homework
    /{class}
      /{subject}
        /{filename}_{timestamp}.{ext}

  /students
    /profile-images
      /{admissionNo}_{timestamp}.{ext}
```

---

## Data Flow: Admin to Student

### 1. Student Profile Creation
```
Admin App → Firebase Auth (create user)
          → users collection (create user doc)
          → students collection (create student profile)
          → Student App (auto-sync via real-time listener)
```

### 2. Syllabus Upload
```
Admin App → Firebase Storage (upload file)
          → syllabus collection (create doc with file URL)
          → Student App (real-time listener updates list)
```

### 3. Homework Assignment
```
Admin App → Firebase Storage (optional file upload)
          → homework collection (create doc)
          → Student App (real-time listener + filter by class/section)
```

### 4. Test Score Entry
```
Admin App → tests collection (create test)
          → test_scores collection (create score for each student)
          → Student App (query by admissionNo, filter published=true)
```

---

## Security Considerations

### 1. Authentication Rules
- Students can only read their own data (filtered by admissionNo)
- Admins can read/write all data
- All writes are logged in `admin_activity_log`

### 2. Data Validation
- Admission numbers must be unique
- Email validation on user creation
- File size limits: 10MB for homework, 20MB for syllabus
- Supported file types: PDF, DOC, DOCX, JPG, PNG

### 3. Real-time Sync
- Students use real-time listeners for:
  - Their profile
  - Syllabus for their class
  - Homework for their class/section
  - Published test scores
- Admins use real-time listeners for:
  - Student list
  - Recent activity logs

---

## Scalability Notes

### Query Optimization
1. Use composite indexes for frequently combined filters
2. Paginate large collections (students, test_scores)
3. Cache static data (syllabus) locally on mobile apps
4. Use Cloud Functions for complex aggregations

### Data Limits
- Document size: < 1MB (Firestore limit)
- Batch writes: Up to 500 operations
- Query results: Implement pagination after 50 documents

### Future Considerations (Phase 2+)
- Add `fees` collection for payment tracking
- Add `attendance` collection for daily attendance
- Add `transport` collection for bus route information
- Add `notifications` collection for push notifications

---

## Grade Calculation Logic

### Percentage to Grade Conversion
```javascript
function calculateGrade(percentage) {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 40) return "D";
  return "F";
}
```

---

## Document Naming Conventions

- Use camelCase for field names
- Use snake_case for collection names
- Boolean fields start with `is` or `has`
- Timestamp fields end with `At` or `Date`
- Reference fields end with `Id`

---

## Backup Strategy

- Enable daily automated backups in Firebase Console
- Export critical collections weekly to Cloud Storage
- Maintain audit trail in `admin_activity_log`
- Test restore procedures monthly
