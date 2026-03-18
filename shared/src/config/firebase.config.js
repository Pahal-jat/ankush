/**
 * Firebase Configuration
 * Initialize Firebase app with project credentials
 */

import { firebase } from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import '@react-native-firebase/storage';

// Firebase configuration
// Replace these values with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'your-api-key',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'your-project.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'your-project-id',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'your-project.appspot.com',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || 'your-sender-id',
  appId: process.env.FIREBASE_APP_ID || 'your-app-id',
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Enable offline persistence for Firestore
firebase.firestore().settings({
  persistence: true,
  cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
});

export default firebase;
