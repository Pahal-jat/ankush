# Phase 2: Database Schema (Firebase Firestore)

## Overview
This document outlines the Phase 2 database schema additions for the dual-app ecosystem (Admin + Student). Phase 2 adds operational and financial features including fees management, attendance tracking, transport management, gallery, timetables, contacts, exam schedules, and notices.

---

## Phase 2 Collections

### 1. `fees`
Stores fee records and payment information for students.

**Document ID**: Auto-generated unique ID

**Structure**:
```javascript
{
  id: string,                     // Document ID
  studentId: string,              // Reference to students collection
  admissionNo: string,            // Student admission number
  class: string,                  // Student class
  section: string,                // Student section

  // Fee Details
  feeType: string,                // "tuition" | "transport" | "examination" | "library" | "sports" | "lab" | "other"
  amount: number,                 // Total fee amount
  dueDate: timestamp,             // Due date for payment
  academicYear: string,           // e.g., "2026-2027"
  term: string,                   // e.g., "Q1", "Q2", "Annual"
  description: string,            // Fee description

  // Payment Information
  status: string,                 // "pending" | "paid" | "overdue" | "partial"
  paidAmount: number,             // Amount paid (0 for pending)
  paymentMethod: string | null,   // "cash" | "online" | "cheque" | "bank_transfer" | "razorpay"
  paymentDate: timestamp | null,  // Date of payment
  transactionId: string | null,   // Transaction/receipt ID
  razorpayOrderId: string | null, // Razorpay order ID (if applicable)
  razorpayPaymentId: string | null, // Razorpay payment ID (if applicable)

  // Metadata
  createdBy: string,              // Admin UID who created fee record
  paidBy: string | null,          // Admin UID who recorded payment
  paidAt: timestamp | null,       // When payment was recorded
  createdAt: timestamp,
  updatedAt: timestamp,

  // Optional
  remarks: string | null,         // Additional remarks
}
```

**Indexes**:
- `studentId` (ascending)
- `admissionNo` (ascending)
- `class` (ascending)
- `status` (ascending)
- `dueDate` (ascending)
- Compound: `studentId`, `status`
- Compound: `class`, `academicYear`, `term`

---

### 2. `attendance`
Stores daily attendance records for students.

**Document ID**: Auto-generated unique ID

**Structure**:
```javascript
{
  id: string,                     // Document ID
  studentId: string,              // Reference to students collection
  admissionNo: string,            // Student admission number
  class: string,                  // Student class
  section: string,                // Student section

  // Attendance Details
  date: timestamp,                // Attendance date (date only, no time)
  status: string,                 // "present" | "absent" | "late" | "excused"
  remarks: string | null,         // Additional remarks (reason for absence, etc.)

  // Metadata
  markedBy: string,               // Admin UID who marked attendance
  createdAt: timestamp,
  updatedAt: timestamp,
}
```

**Indexes**:
- `studentId` (ascending)
- `admissionNo` (ascending)
- `date` (descending)
- `status` (ascending)
- Compound: `studentId`, `date`
- Compound: `class`, `section`, `date`

---

### 3. `transport`
Stores bus route information and transport details.

**Document ID**: Auto-generated unique ID

**Structure**:
```javascript
{
  id: string,                     // Document ID
  routeName: string,              // e.g., "Route 1", "Green Line"
  routeNumber: string,            // Route identifier

  // Route Details
  stops: [                        // Array of stops
    {
      stopName: string,
      stopTime: string,           // e.g., "07:30 AM"
      stopOrder: number,          // Order of stop in route
      address: string,
      latitude: number | null,    // For future GPS tracking
      longitude: number | null,
    }
  ],

  // Vehicle Details
  vehicleNumber: string,          // Bus registration number
  vehicleType: string,            // e.g., "Bus", "Van"
  capacity: number,               // Seating capacity
  driverName: string,
  driverPhone: string,
  conductorName: string | null,
  conductorPhone: string | null,

  // Schedule
  departureTime: string,          // e.g., "07:00 AM"
  arrivalTime: string,            // e.g., "08:30 AM"
  operatingDays: [string],        // Array of days: ["Monday", "Tuesday", ...]

  // Fee Information
  monthlyFee: number,             // Monthly transport fee

  // Status
  isActive: boolean,              // Route active status

  // Metadata
  createdBy: string,              // Admin UID
  lastModifiedBy: string,         // Admin UID
  createdAt: timestamp,
  updatedAt: timestamp,

  // Optional
  remarks: string | null,
}
```

**Indexes**:
- `routeName` (ascending)
- `routeNumber` (ascending)
- `isActive` (ascending)

---

### 4. `gallery`
Stores school gallery images and event photos.

**Document ID**: Auto-generated unique ID

**Structure**:
```javascript
{
  id: string,                     // Document ID
  title: string,                  // Image title
  description: string | null,     // Image description

  // Image Information
  imageUrl: string,               // Firebase Storage URL
  thumbnailUrl: string | null,    // Thumbnail URL (if generated)
  fileName: string,               // Original file name
  fileSize: number,               // Size in bytes

  // Categorization
  category: string,               // e.g., "Events", "Sports", "Academics", "Celebrations"
  tags: [string],                 // Array of tags for searching
  eventDate: timestamp | null,    // Date when photo was taken

  // Visibility
  isActive: boolean,              // Visibility control

  // Metadata
  uploadedBy: string,             // Admin UID
  uploadedAt: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp,
}
```

**Indexes**:
- `category` (ascending)
- `isActive` (ascending)
- `uploadedAt` (descending)
- `eventDate` (descending)

---

### 5. `timetable`
Stores class timetables/schedules.

**Document ID**: Auto-generated unique ID

**Structure**:
```javascript
{
  id: string,                     // Document ID
  class: string,                  // e.g., "10th"
  section: string,                // e.g., "A"
  academicYear: string,           // e.g., "2026-2027"

  // Timetable Data
  schedule: {                     // Weekly schedule
    Monday: [
      {
        period: number,           // Period number (1, 2, 3, ...)
        subject: string,          // Subject name
        teacher: string,          // Teacher name
        startTime: string,        // e.g., "09:00 AM"
        endTime: string,          // e.g., "09:45 AM"
        room: string | null,      // Room number
      }
    ],
    Tuesday: [ /* ... */ ],
    Wednesday: [ /* ... */ ],
    Thursday: [ /* ... */ ],
    Friday: [ /* ... */ ],
    Saturday: [ /* ... */ ],
  },

  // File Attachment (optional PDF/image of timetable)
  fileUrl: string | null,         // Firebase Storage URL
  fileName: string | null,
  fileSize: number | null,
  fileType: string | null,

  // Status
  isActive: boolean,              // Current timetable or archived
  effectiveFrom: timestamp,       // When this timetable becomes active

  // Metadata
  createdBy: string,              // Admin UID
  createdAt: timestamp,
  updatedAt: timestamp,
}
```

**Indexes**:
- `class` (ascending)
- `section` (ascending)
- `isActive` (ascending)
- `academicYear` (ascending)
- Compound: `class`, `section`, `isActive`

---

### 6. `contacts`
Stores contact information for teachers and staff.

**Document ID**: Auto-generated unique ID

**Structure**:
```javascript
{
  id: string,                     // Document ID
  name: string,                   // Full name
  type: string,                   // "teacher" | "staff" | "principal" | "vice_principal" | "accountant"

  // Contact Information
  email: string,
  phone: string,
  alternatePhone: string | null,

  // Additional Details
  designation: string,            // Job title/designation
  department: string | null,      // Department (e.g., "Science", "Administration")
  subjects: [string] | null,      // Subjects taught (for teachers)
  classes: [string] | null,       // Classes taught (for teachers)

  // Office Details
  officeRoom: string | null,      // Office/room number
  officeHours: string | null,     // e.g., "9 AM - 5 PM"

  // Profile
  profileImageUrl: string | null, // Profile photo URL
  bio: string | null,             // Short bio
  qualifications: string | null,  // Educational qualifications

  // Status
  isActive: boolean,              // Currently employed

  // Metadata
  createdBy: string,              // Admin UID
  createdAt: timestamp,
  updatedAt: timestamp,
}
```

**Indexes**:
- `name` (ascending)
- `type` (ascending)
- `isActive` (ascending)
- `email` (ascending)

---

### 7. `exams`
Stores exam schedules and information.

**Document ID**: Auto-generated unique ID

**Structure**:
```javascript
{
  id: string,                     // Document ID
  examName: string,               // e.g., "Mid-Term Exam", "Annual Exam 2026"
  examType: string,               // "unit" | "midterm" | "final" | "annual" | "half_yearly" | "quarterly" | "monthly"

  // Applicable To
  class: string,                  // Target class
  section: string | "all",        // Target section or "all"
  academicYear: string,           // e.g., "2026-2027"

  // Exam Period
  startDate: timestamp,           // Exam start date
  endDate: timestamp,             // Exam end date

  // Schedule Details
  schedule: [                     // Array of exam papers
    {
      subject: string,
      date: timestamp,
      startTime: string,          // e.g., "09:00 AM"
      endTime: string,            // e.g., "12:00 PM"
      duration: number,           // Duration in minutes
      maxMarks: number,           // Total marks
      room: string | null,        // Exam room
      instructions: string | null, // Special instructions
    }
  ],

  // Additional Information
  description: string | null,     // Exam description
  syllabusUrl: string | null,     // Link to syllabus/topics

  // Status
  isPublished: boolean,           // Whether visible to students

  // Metadata
  createdBy: string,              // Admin UID
  createdAt: timestamp,
  updatedAt: timestamp,
}
```

**Indexes**:
- `class` (ascending)
- `academicYear` (ascending)
- `startDate` (descending)
- `isPublished` (ascending)
- Compound: `class`, `section`, `startDate`

---

### 8. `notices`
Stores school notices and circulars.

**Document ID**: Auto-generated unique ID

**Structure**:
```javascript
{
  id: string,                     // Document ID
  title: string,                  // Notice title
  content: string,                // Notice content/description
  type: string,                   // "general" | "urgent" | "event" | "holiday" | "exam" | "fee"

  // Targeting
  target: string,                 // "all" | "class" | "student"
  targetClass: string | null,     // Target class (if target is "class")
  targetStudents: [string] | null, // Array of student IDs (if target is "student")

  // Attachment (optional)
  attachmentUrl: string | null,   // Firebase Storage URL for PDF/image
  attachmentName: string | null,
  attachmentSize: number | null,
  attachmentType: string | null,

  // Priority & Visibility
  priority: string,               // "low" | "medium" | "high"
  isActive: boolean,              // Whether notice is visible
  publishDate: timestamp,         // When to publish (can be future)
  expiryDate: timestamp | null,   // When notice expires (optional)

  // Metadata
  createdBy: string,              // Admin UID
  createdAt: timestamp,
  updatedAt: timestamp,

  // Read Tracking (optional)
  readBy: [string] | null,        // Array of user IDs who have read this notice
  readCount: number,              // Count of users who read
}
```

**Indexes**:
- `target` (ascending)
- `targetClass` (ascending)
- `type` (ascending)
- `isActive` (ascending)
- `publishDate` (descending)
- `createdAt` (descending)
- Compound: `target`, `targetClass`, `isActive`

---

## Firebase Storage Structure (Phase 2)

### Folder Organization
```
/storage
  /syllabus              # Phase 1
    /{class}
      /{subject}
        /{filename}_{timestamp}.pdf

  /homework              # Phase 1 (supports images now)
    /{class}
      /{subject}
        /{filename}_{timestamp}.{ext}

  /students              # Phase 1
    /profile-images
      /{admissionNo}_{timestamp}.{ext}

  /gallery               # Phase 2
    /{filename}_{timestamp}.{ext}

  /timetable             # Phase 2
    /{class}
      /{filename}_{timestamp}.{ext}

  /notices               # Phase 2
    /attachments
      /{filename}_{timestamp}.{ext}
```

---

## Data Flow Examples

### 1. Fee Payment Flow
```
Admin Creates Fee → fees collection (status: pending)
                 → Student sees pending fee
                 → Student pays via Razorpay
                 → Admin records payment (status: paid)
                 → Student sees paid status
```

### 2. Attendance Marking Flow
```
Admin Opens Attendance → Fetches students by class/section
                       → Marks attendance (bulk operation)
                       → attendance collection (created)
                       → Student App shows attendance percentage
```

### 3. Notice Broadcasting Flow
```
Admin Creates Notice → Sets target (all/class/student)
                    → Uploads attachment (optional)
                    → notices collection (created)
                    → Real-time listener updates Student App
                    → Students see notice based on targeting
```

### 4. Gallery Upload Flow
```
Admin Uploads Image → Firebase Storage (gallery/{filename})
                    → gallery collection (created with imageUrl)
                    → Real-time listener updates Student App
                    → Students see gallery images
```

---

## Security Considerations

### 1. Access Control
- **Fees**: Students can only read their own fee records
- **Attendance**: Students can only read their own attendance
- **Transport**: All authenticated users can read (public info)
- **Gallery**: All authenticated users can read
- **Timetable**: All authenticated users can read their class timetable
- **Contacts**: All authenticated users can read
- **Exams**: Students can only read published exam schedules
- **Notices**: Students can only read notices targeted to them

### 2. Data Validation
- Fee amounts must be positive numbers
- Attendance dates cannot be in the future
- Payment methods must be from allowed list
- File size limits enforced in storage rules
- Notice expiry dates must be after publish dates

### 3. Privacy
- Student fee records are private (not visible to other students)
- Attendance records are private
- Notices can be targeted to specific students
- Admin activity is logged for all operations

---

## Query Optimization

### Common Queries
1. Get pending fees for a student: `fees where studentId == X AND status == 'pending'`
2. Get attendance for date range: `attendance where studentId == X AND date >= start AND date <= end`
3. Get active notices for class: `notices where target == 'class' AND targetClass == X AND isActive == true`
4. Get gallery images by category: `gallery where category == X AND isActive == true`
5. Get published exam schedules: `exams where class == X AND isPublished == true`

### Index Requirements
All compound indexes mentioned above should be created in Firestore console for optimal query performance.

---

## Integration with Phase 1

Phase 2 builds on Phase 1 infrastructure:
- Uses same `students` collection for student references
- Uses same `admin_activity_log` for admin actions
- Uses same authentication system
- Uses same real-time listeners pattern
- Follows same security rules structure

---

## Future Enhancements (Phase 3+)

- Automated attendance using facial recognition
- Automated fee reminders via email/SMS
- Live bus tracking with GPS
- Push notifications for notices
- Payment analytics and reports
- Attendance reports and analytics
- Parent app integration

---

## Document Naming Conventions

- Use camelCase for field names
- Use snake_case for collection names
- Boolean fields start with `is` or `has`
- Timestamp fields end with `At` or `Date`
- Reference fields end with `Id`
- Array fields are plural (e.g., `stops`, `tags`, `subjects`)

---

## Backup Strategy

- Enable daily automated backups in Firebase Console
- Export all Phase 2 collections weekly to Cloud Storage
- Maintain audit trail in `admin_activity_log`
- Test restore procedures monthly
- Keep payment records for 7 years (compliance)

---

**Version**: 2.0.0 (Phase 2 - Operational & Financial)
**Last Updated**: March 2026
**Status**: Implemented
