# Quick Start Guide

This is a quick start guide to get the Ankush School Management System up and running in under 30 minutes.

## Prerequisites Checklist

- [ ] Node.js v16+ installed
- [ ] npm or yarn installed
- [ ] Firebase account created
- [ ] Git installed
- [ ] (Optional) React Native development environment set up

## Quick Setup Steps

### 1. Create Firebase Project (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project named "ankush"
3. Enable **Authentication > Email/Password**
4. Create **Firestore Database** (test mode)
5. Set up **Storage** (test mode)
6. Get web configuration from Project Settings

### 2. Clone and Configure (2 minutes)

```bash
# Clone repository
git clone https://github.com/Pahal-jat/ankush.git
cd ankush

# Install shared library
cd shared
npm install
cd ..

# Update Firebase config
# Edit: shared/src/config/firebase.config.js
# Add your Firebase credentials
```

### 3. Deploy Security Rules (2 minutes)

```bash
# Initialize Firebase
firebase login
firebase init

# Select Firestore and Storage
# Use existing files: firestore.rules and storage.rules

# Deploy
firebase deploy --only firestore:rules
firebase deploy --only storage
```

### 4. Create First Admin User (3 minutes)

1. Firebase Console > **Authentication** > Add user
   - Email: `admin@yourschool.com`
   - Password: `YourSecurePassword123`

2. Firebase Console > **Firestore** > Create document in `users` collection:
```json
{
  "uid": "[copy UID from Authentication]",
  "email": "admin@yourschool.com",
  "role": "admin",
  "isActive": true,
  "admissionNo": null,
  "studentId": null,
  "createdAt": "[current timestamp]",
  "updatedAt": "[current timestamp]"
}
```

### 5. Initialize Apps (10 minutes)

#### Option A: Expo (Recommended for Quick Start)

```bash
# Admin App
npx create-expo-app admin-app
cd admin-app
npx expo install firebase
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context
npx expo install react-native-gesture-handler
npm install ../shared
cd ..

# Student App
npx create-expo-app student-app
cd student-app
npx expo install firebase
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context
npx expo install react-native-gesture-handler
npm install ../shared
cd ..
```

#### Option B: React Native CLI

```bash
# Admin App
npx react-native init AdminApp --directory admin-app
cd admin-app
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore @react-native-firebase/storage
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context react-native-gesture-handler
npm install ../shared
cd ..

# Student App
npx react-native init StudentApp --directory student-app
cd student-app
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore @react-native-firebase/storage
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context react-native-gesture-handler
npm install ../shared
cd ..
```

### 6. Run Apps (2 minutes)

#### Expo:
```bash
cd admin-app
npx expo start
# Press 'i' for iOS, 'a' for Android, or scan QR code
```

#### React Native CLI:
```bash
cd admin-app
npx react-native run-ios
# or
npx react-native run-android
```

## Verify Setup

### Test Checklist

- [ ] Admin app launches successfully
- [ ] Can login with admin credentials
- [ ] Student app launches successfully
- [ ] Firebase connection is working
- [ ] No console errors

## Next Steps

Now that your environment is set up, you can:

1. **Build UI Screens**: Create login, dashboard, and feature screens
2. **Import Shared Services**: Use AuthService, FirestoreService, etc.
3. **Add Navigation**: Set up React Navigation
4. **Implement Features**: Start with authentication and student management

## Minimal Working Example

### Admin App - Login Screen

```javascript
// admin-app/App.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { AuthService } from '@ankush/shared';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      const user = await AuthService.signInWithEmail(email, password, 'admin');
      setMessage(`Welcome ${user.email}!`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Admin Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <Button title="Login" onPress={handleLogin} />
      {message ? <Text style={{ marginTop: 10 }}>{message}</Text> : null}
    </View>
  );
}
```

### Student App - Login Screen

```javascript
// student-app/App.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { AuthService } from '@ankush/shared';

export default function App() {
  const [admissionNo, setAdmissionNo] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      const user = await AuthService.signInWithAdmissionNo(admissionNo, password);
      setMessage(`Welcome ${user.email}!`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Student Login</Text>
      <TextInput
        placeholder="Admission Number"
        value={admissionNo}
        onChangeText={setAdmissionNo}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <Button title="Login" onPress={handleLogin} />
      {message ? <Text style={{ marginTop: 10 }}>{message}</Text> : null}
    </View>
  );
}
```

## Common Issues

### Firebase Not Connected
- Check `shared/src/config/firebase.config.js` has correct credentials
- Verify security rules are deployed

### Module Not Found: @ankush/shared
- Run `npm install ../shared` in app directories
- Check `package.json` has the dependency

### Build Errors
- Clear cache: `npx react-native start --reset-cache`
- Clean build: `cd android && ./gradlew clean`

## Resources

- [Full Setup Guide](PHASE1_SETUP_GUIDE.md) - Detailed instructions
- [Database Schema](PHASE1_DATABASE_SCHEMA.md) - Database structure
- [System Architecture](PHASE1_SYSTEM_ARCHITECTURE.md) - Architecture overview
- [Shared Library README](shared/README.md) - API documentation

## Support

- GitHub Issues: https://github.com/Pahal-jat/ankush/issues
- Firebase Docs: https://firebase.google.com/docs
- React Native Docs: https://reactnative.dev/

---

**Time to Complete**: ~25 minutes
**Difficulty**: Intermediate
**Prerequisites**: Basic React Native knowledge
