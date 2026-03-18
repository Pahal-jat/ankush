# Ankush - School Management System

A dual-app ecosystem for school management built with React Native and Firebase, featuring separate applications for Admin and Student users.

## Overview

Ankush is a comprehensive school management system designed to streamline communication and data management between school administration and students. The system consists of two mobile applications:

- **Admin App**: For school administrators to manage students, syllabus, homework, and test scores
- **Student App**: For students to view their profile, syllabus, homework, and test scores

## Features (Phase 1 - MVP)

### Authentication
- ✅ Secure email/password login for Admin
- ✅ Email or Admission Number login for Students
- ✅ Password reset functionality
- ✅ Role-based access control

### Profile Management
- ✅ Admin can create and manage student records
- ✅ Students can view their complete profile including Admission Number
- ✅ Real-time profile synchronization

### Static Academics
- ✅ Admin can upload Syllabus documents (PDF, DOC, DOCX)
- ✅ Admin can create Homework assignments with attachments
- ✅ Students can view and download syllabus and homework

### Test Scores
- ✅ Admin can create tests and enter marks
- ✅ Students can view their test scores with grades
- ✅ Automatic grade calculation based on percentage

## Technology Stack

- **Frontend**: React Native (iOS & Android)
- **Backend**: Firebase
  - Authentication: Firebase Auth
  - Database: Cloud Firestore
  - Storage: Firebase Storage
  - Security: Firestore & Storage Security Rules

## Project Structure

```
ankush/
├── shared/                          # Shared library for both apps
│   ├── src/
│   │   ├── config/                  # Firebase config & constants
│   │   ├── services/                # Auth, Firestore, Storage services
│   │   ├── utils/                   # Validators, helpers, grade calculator
│   │   └── index.js                 # Library exports
│   └── package.json
│
├── admin-app/                       # Admin application (to be created)
├── student-app/                     # Student application (to be created)
│
├── PHASE1_DATABASE_SCHEMA.md       # Database schema documentation
├── PHASE1_SYSTEM_ARCHITECTURE.md   # System architecture documentation
├── firestore.rules                  # Firestore security rules
├── storage.rules                    # Storage security rules
└── README.md                        # This file
```

## Database Schema

The system uses Firebase Firestore with the following collections:

- **users**: Authentication and basic user information
- **students**: Comprehensive student profiles
- **syllabus**: Syllabus documents for classes
- **homework**: Homework assignments
- **tests**: Test/exam information
- **test_scores**: Individual student test scores
- **admin_activity_log**: Admin action audit trail

For detailed schema information, see [PHASE1_DATABASE_SCHEMA.md](PHASE1_DATABASE_SCHEMA.md)

## System Architecture

The system follows a real-time synchronization architecture where:

1. Admin makes changes in the Admin App
2. Changes are saved to Firebase (Firestore/Storage)
3. Student App automatically receives updates via real-time listeners

For detailed architecture information, see [PHASE1_SYSTEM_ARCHITECTURE.md](PHASE1_SYSTEM_ARCHITECTURE.md)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- React Native development environment
- Firebase project with:
  - Authentication enabled
  - Firestore database created
  - Storage bucket configured

### Setup Instructions

#### 1. Clone the Repository

```bash
git clone https://github.com/Pahal-jat/ankush.git
cd ankush
```

#### 2. Set Up Firebase Project

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Create a Storage bucket
5. Download configuration files:
   - For Android: `google-services.json`
   - For iOS: `GoogleService-Info.plist`

#### 3. Deploy Security Rules

Deploy the Firestore security rules:
```bash
firebase deploy --only firestore:rules
```

Deploy the Storage security rules:
```bash
firebase deploy --only storage
```

#### 4. Set Up Shared Library

```bash
cd shared
npm install
```

Update `shared/src/config/firebase.config.js` with your Firebase credentials.

#### 5. Set Up Admin App (Coming Soon)

Instructions will be added once the Admin app is initialized.

#### 6. Set Up Student App (Coming Soon)

Instructions will be added once the Student app is initialized.

## Security

### Role-Based Access Control

- **Admin**: Full access to all data (create, read, update, delete)
- **Student**: Read-only access to their own data and published content

### Security Rules

The system implements comprehensive security rules:

- **Firestore Rules**: Control data access at the document level
- **Storage Rules**: Control file access and upload permissions
- **Authentication**: Email/password with account activation status

See `firestore.rules` and `storage.rules` for detailed security configurations.

## Shared Library

The shared library (`@ankush/shared`) provides common functionality used by both apps:

### Services

- **AuthService**: Authentication operations
- **FirestoreService**: Database operations
- **StorageService**: File upload/download operations

### Utilities

- **Validators**: Input validation functions
- **Helpers**: General utility functions
- **Grade Calculator**: Grade and percentage calculations

### Constants

All app-wide constants including:
- User roles
- Collection names
- Error messages
- File size limits
- Grade thresholds

## Data Flow

### Student Creation Flow
```
Admin App → Firebase Auth (create user)
          → users collection (create user doc)
          → students collection (create student profile)
          → Student App (auto-sync via real-time listener)
```

### Content Upload Flow
```
Admin App → Firebase Storage (upload file)
          → Firestore (create document with file URL)
          → Student App (real-time listener updates)
```

## Future Phases

### Phase 2: Operational & Financial
- Payment integration (Razorpay)
- Attendance tracking
- Transport management

### Phase 3: Analytics & Logic
- Attendance automation
- Performance analysis
- Email generation

### Phase 4: Advanced AI & Hardware Integration
- Private AI tutor
- GPT concept maps
- Live bus tracking

## Development Guidelines

### Code Style
- Use ESLint for linting
- Use Prettier for formatting
- Follow Airbnb JavaScript Style Guide
- Add JSDoc comments for complex functions

### Git Workflow
- Feature branches: `feature/feature-name`
- Bug fixes: `fix/bug-description`
- Commit format: `type(scope): description`

## Testing

Testing infrastructure will be added in future updates:
- Unit tests for shared utilities
- Integration tests for services
- E2E tests for critical user flows

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or contributions, please open an issue on GitHub.

## Acknowledgments

- React Native community
- Firebase team
- All contributors to this project

---

**Version**: 1.0.0 (Phase 1 - MVP)
**Last Updated**: March 2026
**Status**: In Development
