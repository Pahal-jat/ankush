/**
 * Authentication Service
 * Handles all authentication operations for both Admin and Student apps
 */

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { COLLECTIONS, USER_ROLES, ERROR_MESSAGES } from '../config/constants';

class AuthService {
  /**
   * Sign in with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} expectedRole - Expected user role (admin or student)
   * @returns {Promise<Object>} User object with role
   */
  async signInWithEmail(email, password, expectedRole = null) {
    try {
      // Sign in with Firebase Auth
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const { user } = userCredential;

      // Get user role from Firestore
      const userDoc = await firestore()
        .collection(COLLECTIONS.USERS)
        .doc(user.uid)
        .get();

      if (!userDoc.exists) {
        await auth().signOut();
        throw new Error(ERROR_MESSAGES.AUTH_USER_NOT_FOUND);
      }

      const userData = userDoc.data();

      // Check if user has expected role
      if (expectedRole && userData.role !== expectedRole) {
        await auth().signOut();
        throw new Error(`Access denied. This app is for ${expectedRole}s only.`);
      }

      // Check if account is active
      if (!userData.isActive) {
        await auth().signOut();
        throw new Error('Your account has been deactivated. Please contact admin.');
      }

      return {
        uid: user.uid,
        email: user.email,
        role: userData.role,
        ...userData,
      };
    } catch (error) {
      throw this._handleAuthError(error);
    }
  }

  /**
   * Sign in with admission number (for students)
   * Converts admission number to email and then signs in
   * @param {string} admissionNo - Student admission number
   * @param {string} password - User password
   * @returns {Promise<Object>} User object with role
   */
  async signInWithAdmissionNo(admissionNo, password) {
    try {
      // Query users collection to find user with this admission number
      const usersQuery = await firestore()
        .collection(COLLECTIONS.USERS)
        .where('admissionNo', '==', admissionNo.toUpperCase())
        .where('role', '==', USER_ROLES.STUDENT)
        .limit(1)
        .get();

      if (usersQuery.empty) {
        throw new Error(ERROR_MESSAGES.INVALID_ADMISSION_NO);
      }

      const userDoc = usersQuery.docs[0];
      const userData = userDoc.data();

      // Sign in with email
      return await this.signInWithEmail(userData.email, password, USER_ROLES.STUDENT);
    } catch (error) {
      throw this._handleAuthError(error);
    }
  }

  /**
   * Create a new user account
   * @param {Object} userData - User data including email, password, role
   * @returns {Promise<Object>} Created user object
   */
  async createUser(userData) {
    try {
      const { email, password, role, admissionNo, ...otherData } = userData;

      // Create Firebase Auth user
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const { user } = userCredential;

      // Create user document in Firestore
      const userDocData = {
        uid: user.uid,
        email: user.email,
        role: role || USER_ROLES.STUDENT,
        admissionNo: admissionNo ? admissionNo.toUpperCase() : null,
        studentId: null, // Will be updated after creating student profile
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
        isActive: true,
        ...otherData,
      };

      await firestore()
        .collection(COLLECTIONS.USERS)
        .doc(user.uid)
        .set(userDocData);

      return {
        uid: user.uid,
        email: user.email,
        ...userDocData,
      };
    } catch (error) {
      throw this._handleAuthError(error);
    }
  }

  /**
   * Sign out current user
   * @returns {Promise<void>}
   */
  async signOut() {
    try {
      await auth().signOut();
    } catch (error) {
      throw this._handleAuthError(error);
    }
  }

  /**
   * Send password reset email
   * @param {string} email - User email
   * @returns {Promise<void>}
   */
  async resetPassword(email) {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error) {
      throw this._handleAuthError(error);
    }
  }

  /**
   * Get current authenticated user
   * @returns {Object|null} Current user or null
   */
  getCurrentUser() {
    return auth().currentUser;
  }

  /**
   * Get user role from Firestore
   * @param {string} uid - User ID
   * @returns {Promise<string>} User role
   */
  async getUserRole(uid) {
    try {
      const userDoc = await firestore()
        .collection(COLLECTIONS.USERS)
        .doc(uid)
        .get();

      if (!userDoc.exists) {
        return null;
      }

      return userDoc.data().role;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  }

  /**
   * Get user data from Firestore
   * @param {string} uid - User ID
   * @returns {Promise<Object>} User data
   */
  async getUserData(uid) {
    try {
      const userDoc = await firestore()
        .collection(COLLECTIONS.USERS)
        .doc(uid)
        .get();

      if (!userDoc.exists) {
        throw new Error(ERROR_MESSAGES.NOT_FOUND);
      }

      return {
        uid: userDoc.id,
        ...userDoc.data(),
      };
    } catch (error) {
      throw this._handleAuthError(error);
    }
  }

  /**
   * Update user data
   * @param {string} uid - User ID
   * @param {Object} data - Data to update
   * @returns {Promise<void>}
   */
  async updateUserData(uid, data) {
    try {
      await firestore()
        .collection(COLLECTIONS.USERS)
        .doc(uid)
        .update({
          ...data,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      throw this._handleAuthError(error);
    }
  }

  /**
   * Listen to authentication state changes
   * @param {Function} callback - Callback function to handle auth state changes
   * @returns {Function} Unsubscribe function
   */
  onAuthStateChanged(callback) {
    return auth().onAuthStateChanged(callback);
  }

  /**
   * Handle authentication errors
   * @private
   * @param {Error} error - Error object
   * @returns {Error} Formatted error
   */
  _handleAuthError(error) {
    const errorCode = error.code;
    const errorMessages = {
      'auth/user-not-found': ERROR_MESSAGES.AUTH_USER_NOT_FOUND,
      'auth/wrong-password': ERROR_MESSAGES.AUTH_WRONG_PASSWORD,
      'auth/invalid-email': ERROR_MESSAGES.AUTH_INVALID_EMAIL,
      'auth/email-already-in-use': ERROR_MESSAGES.AUTH_EMAIL_ALREADY_IN_USE,
      'auth/weak-password': ERROR_MESSAGES.AUTH_WEAK_PASSWORD,
      'auth/network-request-failed': ERROR_MESSAGES.NETWORK_ERROR,
    };

    const message = errorMessages[errorCode] || error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
    const newError = new Error(message);
    newError.code = errorCode;
    return newError;
  }
}

export default new AuthService();
