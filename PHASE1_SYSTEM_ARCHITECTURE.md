# Phase 1: System Architecture

## Overview
This document outlines the system architecture for the dual-app ecosystem (Admin + Student) built with React Native and Firebase. The architecture emphasizes real-time data synchronization, security, and scalability.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Firebase Cloud                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │   Firebase   │  │  Firestore   │  │  Firebase Storage    │ │
│  │     Auth     │  │   Database   │  │  (Files/Images)      │ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
           ▲                    ▲                    ▲
           │                    │                    │
           │    Real-time       │   File Upload/     │
           │    Listeners       │   Download         │
           │                    │                    │
    ┌──────┴────────┐    ┌──────┴───────┐          │
    │               │    │              │          │
┌───▼────────┐  ┌──▼─────────┐  ┌───────▼──────────┐
│   Admin    │  │  Student    │  │   Shared Core    │
│    App     │  │    App      │  │    Library       │
│            │  │             │  │                  │
│ React      │  │  React      │  │  - Auth Service  │
│ Native     │  │  Native     │  │  - API Service   │
│            │  │             │  │  - Utils         │
│ (iOS/      │  │  (iOS/      │  │  - Constants     │
│ Android)   │  │  Android)   │  │  - Validators    │
└────────────┘  └─────────────┘  └──────────────────┘
```

---

## Application Structure

### Monorepo Structure
```
ankush/
├── README.md
├── PHASE1_DATABASE_SCHEMA.md
├── PHASE1_SYSTEM_ARCHITECTURE.md
│
├── shared/                          # Shared code between apps
│   ├── package.json
│   ├── src/
│   │   ├── config/
│   │   │   ├── firebase.config.js   # Firebase initialization
│   │   │   └── constants.js         # App-wide constants
│   │   ├── services/
│   │   │   ├── auth.service.js      # Authentication logic
│   │   │   ├── firestore.service.js # Firestore operations
│   │   │   └── storage.service.js   # File upload/download
│   │   ├── utils/
│   │   │   ├── validators.js        # Input validation
│   │   │   ├── helpers.js           # Utility functions
│   │   │   └── grade-calculator.js  # Grade calculation
│   │   └── types/
│   │       └── index.ts             # TypeScript types (if using TS)
│   └── README.md
│
├── admin-app/                       # Admin Application
│   ├── package.json
│   ├── app.json
│   ├── babel.config.js
│   ├── metro.config.js
│   ├── android/
│   ├── ios/
│   ├── src/
│   │   ├── App.js                   # Root component
│   │   ├── navigation/
│   │   │   └── AppNavigator.js      # Navigation setup
│   │   ├── screens/
│   │   │   ├── auth/
│   │   │   │   ├── LoginScreen.js
│   │   │   │   └── ForgotPasswordScreen.js
│   │   │   ├── students/
│   │   │   │   ├── StudentListScreen.js
│   │   │   │   ├── CreateStudentScreen.js
│   │   │   │   └── StudentDetailScreen.js
│   │   │   ├── academics/
│   │   │   │   ├── SyllabusListScreen.js
│   │   │   │   ├── UploadSyllabusScreen.js
│   │   │   │   ├── HomeworkListScreen.js
│   │   │   │   └── CreateHomeworkScreen.js
│   │   │   └── tests/
│   │   │       ├── TestListScreen.js
│   │   │       ├── CreateTestScreen.js
│   │   │       └── EnterMarksScreen.js
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.js
│   │   │   │   ├── Input.js
│   │   │   │   ├── Card.js
│   │   │   │   └── Loader.js
│   │   │   ├── forms/
│   │   │   │   ├── StudentForm.js
│   │   │   │   ├── SyllabusForm.js
│   │   │   │   └── TestForm.js
│   │   │   └── lists/
│   │   │       ├── StudentCard.js
│   │   │       └── TestScoreRow.js
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useStudents.js
│   │   │   └── useFileUpload.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── styles/
│   │   │   ├── theme.js
│   │   │   └── globalStyles.js
│   │   └── assets/
│   │       └── images/
│   └── README.md
│
└── student-app/                     # Student Application
    ├── package.json
    ├── app.json
    ├── babel.config.js
    ├── metro.config.js
    ├── android/
    ├── ios/
    ├── src/
    │   ├── App.js                   # Root component
    │   ├── navigation/
    │   │   └── AppNavigator.js      # Navigation setup
    │   ├── screens/
    │   │   ├── auth/
    │   │   │   ├── LoginScreen.js
    │   │   │   └── ForgotPasswordScreen.js
    │   │   ├── profile/
    │   │   │   └── ProfileScreen.js
    │   │   ├── academics/
    │   │   │   ├── SyllabusScreen.js
    │   │   │   └── HomeworkScreen.js
    │   │   └── tests/
    │   │       └── TestScoresScreen.js
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── Button.js
    │   │   │   ├── Input.js
    │   │   │   ├── Card.js
    │   │   │   └── Loader.js
    │   │   └── profile/
    │   │       └── ProfileCard.js
    │   ├── hooks/
    │   │   ├── useAuth.js
    │   │   ├── useProfile.js
    │   │   └── useAcademics.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── styles/
    │   │   ├── theme.js
    │   │   └── globalStyles.js
    │   └── assets/
    │       └── images/
    └── README.md
```

---

## Component Architecture

### 1. Authentication Flow

#### Admin Login Flow
```
┌─────────────────┐
│  LoginScreen    │
│  (Admin App)    │
└────────┬────────┘
         │
         │ Enter email/password
         ▼
┌─────────────────────┐
│  auth.service.js    │
│  signInWithEmail()  │
└────────┬────────────┘
         │
         │ Firebase Auth
         ▼
┌──────────────────────┐
│  Check role in       │
│  users collection    │
└────────┬─────────────┘
         │
         ├─── role === "admin" ─────► Success → Dashboard
         │
         └─── role !== "admin" ─────► Error → Show message
```

#### Student Login Flow
```
┌─────────────────────────┐
│  LoginScreen            │
│  (Student App)          │
│  Email/Admission No.    │
└────────┬────────────────┘
         │
         │ Enter credentials
         ▼
┌─────────────────────────────┐
│  auth.service.js            │
│  signInWithEmail() OR       │
│  signInWithAdmissionNo()    │
└────────┬────────────────────┘
         │
         │ 1. If admission no., query users
         │    collection to get email
         │ 2. Sign in with Firebase Auth
         ▼
┌──────────────────────┐
│  Check role in       │
│  users collection    │
└────────┬─────────────┘
         │
         ├─── role === "student" ───► Success → Dashboard
         │
         └─── role !== "student" ───► Error → Show message
```

### 2. Data Synchronization

#### Real-time Listeners Pattern
```javascript
// Student App - Profile Listener
useEffect(() => {
  if (!user) return;

  const unsubscribe = firestore()
    .collection('students')
    .where('userId', '==', user.uid)
    .onSnapshot(
      (snapshot) => {
        if (!snapshot.empty) {
          const profileData = snapshot.docs[0].data();
          setProfile(profileData);
        }
      },
      (error) => {
        console.error('Profile listener error:', error);
      }
    );

  return () => unsubscribe();
}, [user]);
```

#### Admin to Student Data Flow
```
Admin Creates Student
       │
       ▼
┌──────────────────┐
│ 1. Create Auth   │ ─────► Firebase Auth
│    User          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 2. Create User   │ ─────► users collection
│    Document      │         (with role: "student")
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 3. Create        │ ─────► students collection
│    Student Doc   │         (detailed profile)
└────────┬─────────┘
         │
         │ Real-time listener triggers
         ▼
┌──────────────────┐
│ Student App      │
│ Receives Update  │
└──────────────────┘
```

---

## Security Architecture

### Firebase Security Rules

#### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isAdmin() {
      return isAuthenticated() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    function isStudent() {
      return isAuthenticated() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'student';
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Users collection
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isAdmin();
      allow update: if isAdmin() || (isOwner(userId) &&
        !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'admissionNo']));
      allow delete: if isAdmin();
    }

    // Students collection
    match /students/{studentId} {
      allow read: if isAdmin() ||
        (isStudent() && resource.data.userId == request.auth.uid);
      allow write: if isAdmin();
    }

    // Syllabus collection
    match /syllabus/{syllabusId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    // Homework collection
    match /homework/{homeworkId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    // Tests collection
    match /tests/{testId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    // Test scores collection
    match /test_scores/{scoreId} {
      allow read: if isAdmin() ||
        (isStudent() && resource.data.studentId ==
          get(/databases/$(database)/documents/users/$(request.auth.uid)).data.studentId &&
          resource.data.isPublished == true);
      allow write: if isAdmin();
    }

    // Admin activity log
    match /admin_activity_log/{logId} {
      allow read: if isAdmin();
      allow create: if isAdmin();
      allow update, delete: if false; // Logs are immutable
    }
  }
}
```

#### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    function isAuthenticated() {
      return request.auth != null;
    }

    function isAdmin() {
      return request.auth != null &&
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Syllabus files
    match /syllabus/{class}/{subject}/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    // Homework files
    match /homework/{class}/{subject}/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    // Student profile images
    match /students/profile-images/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
  }
}
```

---

## API Service Layer

### Shared Services Structure

#### auth.service.js
```javascript
/**
 * Authentication Service
 * Handles all authentication operations
 */
class AuthService {
  // Sign in with email/password
  async signInWithEmail(email, password)

  // Sign in with admission number
  async signInWithAdmissionNo(admissionNo, password)

  // Sign out
  async signOut()

  // Reset password
  async resetPassword(email)

  // Get current user
  getCurrentUser()

  // Check user role
  async getUserRole(uid)
}
```

#### firestore.service.js
```javascript
/**
 * Firestore Service
 * Handles all Firestore operations
 */
class FirestoreService {
  // Generic CRUD operations
  async create(collection, data)
  async read(collection, docId)
  async update(collection, docId, data)
  async delete(collection, docId)
  async query(collection, filters, orderBy, limit)

  // Student operations
  async createStudent(studentData, authCredentials)
  async getStudentByAdmissionNo(admissionNo)
  async getStudentsByClass(className, section)
  async updateStudent(studentId, data)

  // Syllabus operations
  async uploadSyllabus(syllabusData, file)
  async getSyllabusByClass(className)

  // Homework operations
  async createHomework(homeworkData, file)
  async getHomeworkByClass(className, section)

  // Test operations
  async createTest(testData)
  async enterTestScore(scoreData)
  async getTestScoresByStudent(studentId)

  // Real-time listeners
  subscribeToCollection(collection, filters, callback)
  unsubscribe(unsubscribeFunction)
}
```

#### storage.service.js
```javascript
/**
 * Storage Service
 * Handles file upload/download operations
 */
class StorageService {
  // Upload file
  async uploadFile(path, file, metadata)

  // Download file
  async downloadFile(url)

  // Get download URL
  async getDownloadURL(path)

  // Delete file
  async deleteFile(path)

  // Upload with progress
  uploadFileWithProgress(path, file, onProgress)
}
```

---

## State Management

### Context API Structure

#### AuthContext
```javascript
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const userRole = await getUserRole(authUser.uid);
        setUser(authUser);
        setRole(userRole);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    role,
    loading,
    signIn: (email, password) => { /* ... */ },
    signOut: () => { /* ... */ },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

---

## Navigation Architecture

### Admin App Navigation
```
┌─────────────────────────────────────────┐
│         AuthNavigator                   │
│  ┌────────────┐      ┌───────────────┐ │
│  │ LoginStack │ ◄──► │ AppStack      │ │
│  └────────────┘      │ (Tab Nav)     │ │
│                      │               │ │
│                      │ ├─ Students   │ │
│                      │ ├─ Academics  │ │
│                      │ ├─ Tests      │ │
│                      │ └─ Profile    │ │
│                      └───────────────┘ │
└─────────────────────────────────────────┘
```

### Student App Navigation
```
┌─────────────────────────────────────────┐
│         AuthNavigator                   │
│  ┌────────────┐      ┌───────────────┐ │
│  │ LoginStack │ ◄──► │ AppStack      │ │
│  └────────────┘      │ (Tab Nav)     │ │
│                      │               │ │
│                      │ ├─ Profile    │ │
│                      │ ├─ Syllabus   │ │
│                      │ ├─ Homework   │ │
│                      │ └─ Scores     │ │
│                      └───────────────┘ │
└─────────────────────────────────────────┘
```

---

## Performance Optimization

### 1. Caching Strategy
- Cache syllabus documents locally
- Use AsyncStorage for frequently accessed data
- Implement offline-first approach with Firebase offline persistence

### 2. Lazy Loading
- Paginate student lists (50 per page)
- Load test scores on demand
- Lazy load images with progressive loading

### 3. Optimization Techniques
- Memoize expensive components with React.memo
- Use useMemo and useCallback for expensive computations
- Optimize FlatList with proper keyExtractor and getItemLayout

---

## Error Handling

### Error Handling Strategy
```javascript
// Centralized error handler
const handleError = (error, context) => {
  // Log to console in development
  if (__DEV__) {
    console.error(`[${context}]`, error);
  }

  // Log to Firebase Crashlytics in production
  crashlytics().recordError(error);

  // Show user-friendly message
  Alert.alert('Error', getErrorMessage(error));
};

// Error message mapper
const getErrorMessage = (error) => {
  const errorMessages = {
    'auth/user-not-found': 'User not found. Please check your credentials.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-email': 'Invalid email address.',
    'permission-denied': 'You do not have permission to perform this action.',
    'not-found': 'The requested resource was not found.',
    // ... more mappings
  };

  return errorMessages[error.code] || 'An unexpected error occurred.';
};
```

---

## Testing Strategy

### 1. Unit Tests
- Test utility functions (validators, helpers)
- Test grade calculation logic
- Test data transformation functions

### 2. Integration Tests
- Test authentication flow
- Test Firestore operations
- Test file upload/download

### 3. E2E Tests
- Test complete user flows (login → create student → logout)
- Test data synchronization between apps

---

## Deployment Architecture

### Development Environment
```
Developer Machine
    │
    ├─► Admin App (dev build)
    ├─► Student App (dev build)
    │
    └─► Firebase Project (dev)
        ├─ Auth (dev)
        ├─ Firestore (dev)
        └─ Storage (dev)
```

### Production Environment
```
App Stores
    │
    ├─► Admin App (production)
    │   ├─ iOS App Store
    │   └─ Google Play Store
    │
    ├─► Student App (production)
    │   ├─ iOS App Store
    │   └─ Google Play Store
    │
    └─► Firebase Project (production)
        ├─ Auth (production)
        ├─ Firestore (production)
        ├─ Storage (production)
        └─ Analytics
```

---

## Monitoring & Analytics

### Firebase Analytics Events
- `login_success` / `login_failure`
- `student_created`
- `syllabus_uploaded`
- `homework_created`
- `test_score_entered`
- `file_downloaded`

### Performance Monitoring
- App startup time
- Screen load time
- Firebase query performance
- File upload/download speed

---

## Future Scalability (Phase 2-4)

### Phase 2 Extensions
- Payment gateway integration (Razorpay)
- Attendance tracking system
- Transport management

### Phase 3 Extensions
- Analytics engine for performance
- Automated notifications
- Email generation system

### Phase 4 Extensions
- AI tutor integration
- GPT concept maps
- Live bus tracking with GPS

---

## Development Guidelines

### Code Style
- Use ESLint for linting
- Use Prettier for formatting
- Follow Airbnb JavaScript Style Guide
- Use meaningful variable names
- Add JSDoc comments for complex functions

### Git Workflow
- Feature branches: `feature/student-profile`
- Bug fixes: `fix/login-error`
- Hotfixes: `hotfix/critical-bug`
- Commit message format: `type(scope): description`

### Code Review Checklist
- Security: No hardcoded credentials
- Performance: No unnecessary re-renders
- Error handling: All async operations have try-catch
- Accessibility: Proper labels and hints
- Testing: Unit tests for new features

---

## Conclusion

This architecture provides a solid foundation for Phase 1 of the dual-app ecosystem. The design emphasizes:

1. **Security**: Role-based access control with Firebase Security Rules
2. **Real-time Sync**: Automatic updates between Admin and Student apps
3. **Scalability**: Modular design ready for Phase 2-4 features
4. **Maintainability**: Shared code library reduces duplication
5. **Performance**: Optimized queries and caching strategies

The system is designed to scale from Phase 1 (MVP) through Phase 4 (AI integration) without major architectural changes.
