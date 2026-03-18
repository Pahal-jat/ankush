# Phase 1 Implementation Guide

## Overview

This guide provides step-by-step instructions for setting up and running the Ankush dual-app ecosystem (Admin + Student apps).

---

## Prerequisites

Before starting, ensure you have the following installed:

### Required Software

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version` and `npm --version`

2. **React Native CLI**
   ```bash
   npm install -g react-native-cli
   ```

3. **For iOS Development** (Mac only):
   - Xcode (latest version from App Store)
   - CocoaPods: `sudo gem install cocoapods`

4. **For Android Development**:
   - Android Studio
   - Android SDK (API level 28 or higher)
   - Java Development Kit (JDK 11)

5. **Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

6. **Git**
   - Download from: https://git-scm.com/

---

## Part 1: Firebase Project Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `ankush` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication

1. In Firebase Console, go to **Build > Authentication**
2. Click "Get started"
3. Enable **Email/Password** sign-in method
4. Click "Save"

### Step 3: Create Firestore Database

1. Go to **Build > Firestore Database**
2. Click "Create database"
3. Select **Start in test mode** (we'll deploy security rules later)
4. Choose a location (closest to your users)
5. Click "Enable"

### Step 4: Set Up Firebase Storage

1. Go to **Build > Storage**
2. Click "Get started"
3. Select **Start in test mode**
4. Click "Next" and "Done"

### Step 5: Get Firebase Configuration

#### For Android:
1. Click the Android icon to add an Android app
2. Enter package name: `com.ankush.admin` (for Admin app)
3. Download `google-services.json`
4. Repeat for Student app: `com.ankush.student`

#### For iOS:
1. Click the iOS icon to add an iOS app
2. Enter bundle ID: `com.ankush.admin` (for Admin app)
3. Download `GoogleService-Info.plist`
4. Repeat for Student app: `com.ankush.student`

### Step 6: Get Web Configuration

1. Click the Web icon (</>) to add a web app
2. Register app with nickname: "Ankush Web"
3. Copy the Firebase configuration object:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### Step 7: Deploy Security Rules

1. Initialize Firebase in your project:
   ```bash
   cd /path/to/ankush
   firebase login
   firebase init
   ```

2. Select:
   - Firestore
   - Storage

3. Choose existing project: `ankush`

4. For Firestore rules, use: `firestore.rules`
5. For Storage rules, use: `storage.rules`

6. Deploy rules:
   ```bash
   firebase deploy --only firestore:rules
   firebase deploy --only storage
   ```

---

## Part 2: Repository Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/Pahal-jat/ankush.git
cd ankush
```

### Step 2: Update Firebase Configuration

Edit `shared/src/config/firebase.config.js`:

```javascript
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};
```

### Step 3: Install Shared Library Dependencies

```bash
cd shared
npm install
cd ..
```

---

## Part 3: Initialize React Native Apps

Since the Admin and Student apps haven't been initialized yet, here's how to set them up:

### Option A: Initialize with React Native CLI

#### Admin App

```bash
# Initialize new React Native app
npx react-native init AdminApp --directory admin-app

# Navigate to app directory
cd admin-app

# Install dependencies
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore @react-native-firebase/storage
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install react-native-gesture-handler react-native-reanimated
npm install react-native-vector-icons
npm install react-native-document-picker
npm install react-native-image-picker

# Link the shared library
npm install ../shared
```

#### Student App

```bash
# Initialize new React Native app
npx react-native init StudentApp --directory student-app

# Navigate to app directory
cd student-app

# Install dependencies
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore @react-native-firebase/storage
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install react-native-gesture-handler react-native-reanimated
npm install react-native-vector-icons
npm install react-native-document-picker

# Link the shared library
npm install ../shared
```

### Option B: Initialize with Expo (Recommended for Faster Setup)

#### Admin App

```bash
# Initialize new Expo app
npx create-expo-app admin-app
cd admin-app

# Install dependencies
npx expo install firebase
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context
npx expo install react-native-gesture-handler react-native-reanimated
npx expo install expo-document-picker
npx expo install expo-image-picker

# Link the shared library
npm install ../shared
```

#### Student App

```bash
# Initialize new Expo app
npx create-expo-app student-app
cd student-app

# Install dependencies
npx expo install firebase
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context
npx expo install react-native-gesture-handler react-native-reanimated
npx expo install expo-document-picker

# Link the shared library
npm install ../shared
```

---

## Part 4: Configure Firebase in Apps

### For React Native CLI Apps

#### Android Configuration

1. Copy `google-services.json` to:
   - Admin: `admin-app/android/app/google-services.json`
   - Student: `student-app/android/app/google-services.json`

2. Edit `android/build.gradle`:
```gradle
buildscript {
  dependencies {
    classpath 'com.google.gms:google-services:4.3.15'
  }
}
```

3. Edit `android/app/build.gradle`:
```gradle
apply plugin: 'com.google.gms.google-services'
```

#### iOS Configuration

1. Copy `GoogleService-Info.plist` to:
   - Admin: `admin-app/ios/AdminApp/`
   - Student: `student-app/ios/StudentApp/`

2. Install pods:
```bash
cd admin-app/ios && pod install && cd ../..
cd student-app/ios && pod install && cd ../..
```

### For Expo Apps

Update `app.json` with Firebase configuration:

```json
{
  "expo": {
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist"
    },
    "android": {
      "googleServicesFile": "./google-services.json"
    }
  }
}
```

---

## Part 5: Create Initial Admin User

You need to manually create the first admin user in Firebase Console:

1. Go to **Firebase Console > Authentication**
2. Click "Add user"
3. Enter email: `admin@yourschool.com`
4. Enter password: `SecurePassword123`
5. Click "Add user"

6. Go to **Firestore Database**
7. Click "Start collection"
8. Collection ID: `users`
9. Document ID: (copy the UID from Authentication)
10. Add fields:
```
uid: [copied UID]
email: admin@yourschool.com
role: admin
isActive: true
admissionNo: null
studentId: null
createdAt: [timestamp]
updatedAt: [timestamp]
```

---

## Part 6: Running the Apps

### React Native CLI

#### Admin App

```bash
# iOS
cd admin-app
npx react-native run-ios

# Android
cd admin-app
npx react-native run-android
```

#### Student App

```bash
# iOS
cd student-app
npx react-native run-ios

# Android
cd student-app
npx react-native run-android
```

### Expo

#### Admin App

```bash
cd admin-app
npx expo start

# Press 'i' for iOS simulator
# Press 'a' for Android emulator
# Scan QR code with Expo Go app for physical device
```

#### Student App

```bash
cd student-app
npx expo start
```

---

## Part 7: Testing the Setup

### Test Admin Login

1. Open Admin app
2. Login with: `admin@yourschool.com` / `SecurePassword123`
3. You should be redirected to the dashboard

### Test Student Creation (via Admin App)

1. Navigate to "Create Student" screen
2. Fill in student details:
   - Admission No: `STU001`
   - Email: `student1@test.com`
   - Password: `Student123`
   - Name, class, section, etc.
3. Submit form
4. Student should be created in Firebase

### Test Student Login

1. Open Student app
2. Login with:
   - Admission No: `STU001` or Email: `student1@test.com`
   - Password: `Student123`
3. You should see the student dashboard with profile

---

## Part 8: Development Workflow

### File Structure After Setup

```
ankush/
├── shared/                    # Shared library (completed)
├── admin-app/                 # Admin React Native app
│   ├── android/
│   ├── ios/
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── navigation/
│   │   └── App.js
│   └── package.json
├── student-app/               # Student React Native app
│   ├── android/
│   ├── ios/
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── navigation/
│   │   └── App.js
│   └── package.json
└── firebase.json             # Firebase configuration
```

### Hot Reload

Both apps support hot reload during development:
- Make changes to code
- Save file
- App automatically reloads with changes

### Debugging

- **React Native Debugger**: Press `Cmd+D` (iOS) or `Cmd+M` (Android)
- **Chrome DevTools**: Enable remote debugging
- **Console logs**: Check terminal for logs

---

## Part 9: Building for Production

### Android APK

```bash
cd admin-app/android
./gradlew assembleRelease

# APK location: android/app/build/outputs/apk/release/app-release.apk
```

### iOS IPA

1. Open Xcode: `open ios/AdminApp.xcworkspace`
2. Select "Product > Archive"
3. Follow App Store submission process

---

## Troubleshooting

### Common Issues

1. **Metro bundler issues**:
   ```bash
   npx react-native start --reset-cache
   ```

2. **Pod install issues**:
   ```bash
   cd ios
   pod deintegrate
   pod install
   ```

3. **Build failures**:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npx react-native run-android
   ```

4. **Firebase not initialized**:
   - Check `google-services.json` and `GoogleService-Info.plist` are in correct locations
   - Verify Firebase configuration in `shared/src/config/firebase.config.js`

5. **Permission errors in Firestore**:
   - Verify security rules are deployed: `firebase deploy --only firestore:rules`
   - Check user role in Firestore console

---

## Next Steps

Once the basic setup is complete:

1. **Implement UI screens** for Admin and Student apps
2. **Add navigation** between screens
3. **Implement features**:
   - Student profile management
   - Syllabus upload/view
   - Homework creation/view
   - Test score entry/view
4. **Add styling** and branding
5. **Test thoroughly** on both platforms
6. **Deploy** to App Store and Play Store

---

## Support

If you encounter issues:

1. Check Firebase Console for errors
2. Review logs in terminal/console
3. Verify all dependencies are installed
4. Check React Native documentation: https://reactnative.dev/
5. Check Firebase documentation: https://firebase.google.com/docs

---

## Security Best Practices

1. **Never commit Firebase credentials** to version control
2. **Use environment variables** for sensitive data
3. **Test security rules** before production
4. **Enable 2FA** for admin accounts
5. **Regular backups** of Firestore data
6. **Monitor Firebase usage** to prevent abuse
7. **Use HTTPS** for all API calls
8. **Implement rate limiting** on sensitive operations

---

**Last Updated**: March 2026
**Version**: Phase 1 - MVP
