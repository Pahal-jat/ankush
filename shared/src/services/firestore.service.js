/**
 * Firestore Service
 * Handles all Firestore database operations
 */

import firestore from '@react-native-firebase/firestore';
import { COLLECTIONS, ERROR_MESSAGES } from '../config/constants';
import AuthService from './auth.service';

class FirestoreService {
  /**
   * Generic create operation
   * @param {string} collection - Collection name
   * @param {Object} data - Data to create
   * @param {string} docId - Optional document ID
   * @returns {Promise<Object>} Created document
   */
  async create(collection, data, docId = null) {
    try {
      const timestamp = firestore.FieldValue.serverTimestamp();
      const documentData = {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      let docRef;
      if (docId) {
        docRef = firestore().collection(collection).doc(docId);
        await docRef.set(documentData);
      } else {
        docRef = await firestore().collection(collection).add(documentData);
      }

      return {
        id: docRef.id,
        ...documentData,
      };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Generic read operation
   * @param {string} collection - Collection name
   * @param {string} docId - Document ID
   * @returns {Promise<Object>} Document data
   */
  async read(collection, docId) {
    try {
      const doc = await firestore().collection(collection).doc(docId).get();

      if (!doc.exists) {
        throw new Error(ERROR_MESSAGES.NOT_FOUND);
      }

      return {
        id: doc.id,
        ...doc.data(),
      };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Generic update operation
   * @param {string} collection - Collection name
   * @param {string} docId - Document ID
   * @param {Object} data - Data to update
   * @returns {Promise<void>}
   */
  async update(collection, docId, data) {
    try {
      await firestore()
        .collection(collection)
        .doc(docId)
        .update({
          ...data,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Generic delete operation
   * @param {string} collection - Collection name
   * @param {string} docId - Document ID
   * @returns {Promise<void>}
   */
  async delete(collection, docId) {
    try {
      await firestore().collection(collection).doc(docId).delete();
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Generic query operation
   * @param {string} collection - Collection name
   * @param {Array} filters - Array of filter objects [{ field, operator, value }]
   * @param {Object} orderBy - Order by object { field, direction }
   * @param {number} limit - Limit number of results
   * @returns {Promise<Array>} Array of documents
   */
  async query(collection, filters = [], orderBy = null, limit = null) {
    try {
      let query = firestore().collection(collection);

      // Apply filters
      filters.forEach(filter => {
        query = query.where(filter.field, filter.operator, filter.value);
      });

      // Apply ordering
      if (orderBy) {
        query = query.orderBy(orderBy.field, orderBy.direction || 'asc');
      }

      // Apply limit
      if (limit) {
        query = query.limit(limit);
      }

      const snapshot = await query.get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // ==================== Student Operations ====================

  /**
   * Create a new student profile
   * @param {Object} studentData - Student data
   * @param {Object} authCredentials - Auth credentials (email, password)
   * @returns {Promise<Object>} Created student
   */
  async createStudent(studentData, authCredentials) {
    try {
      const { email, password, admissionNo } = authCredentials;

      // Check if admission number already exists
      const existingStudent = await this.getStudentByAdmissionNo(admissionNo);
      if (existingStudent) {
        throw new Error('Admission number already exists');
      }

      // Create user account
      const user = await AuthService.createUser({
        email,
        password,
        role: 'student',
        admissionNo: admissionNo.toUpperCase(),
      });

      // Create student profile
      const studentProfile = await this.create(COLLECTIONS.STUDENTS, {
        ...studentData,
        userId: user.uid,
        admissionNo: admissionNo.toUpperCase(),
        createdBy: AuthService.getCurrentUser()?.uid,
        lastModifiedBy: AuthService.getCurrentUser()?.uid,
      });

      // Update user document with studentId
      await AuthService.updateUserData(user.uid, {
        studentId: studentProfile.id,
      });

      // Log activity
      await this._logAdminActivity('create_student', 'student', studentProfile.id, {
        admissionNo: admissionNo.toUpperCase(),
        email,
      });

      return studentProfile;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get student by admission number
   * @param {string} admissionNo - Admission number
   * @returns {Promise<Object|null>} Student data or null
   */
  async getStudentByAdmissionNo(admissionNo) {
    try {
      const students = await this.query(COLLECTIONS.STUDENTS, [
        { field: 'admissionNo', operator: '==', value: admissionNo.toUpperCase() }
      ], null, 1);

      return students.length > 0 ? students[0] : null;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get student by user ID
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} Student data or null
   */
  async getStudentByUserId(userId) {
    try {
      const students = await this.query(COLLECTIONS.STUDENTS, [
        { field: 'userId', operator: '==', value: userId }
      ], null, 1);

      return students.length > 0 ? students[0] : null;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get students by class and section
   * @param {string} className - Class name
   * @param {string} section - Section (optional)
   * @returns {Promise<Array>} Array of students
   */
  async getStudentsByClass(className, section = null) {
    try {
      const filters = [
        { field: 'class', operator: '==', value: className }
      ];

      if (section) {
        filters.push({ field: 'section', operator: '==', value: section });
      }

      return await this.query(COLLECTIONS.STUDENTS, filters, { field: 'rollNo', direction: 'asc' });
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Update student profile
   * @param {string} studentId - Student ID
   * @param {Object} data - Data to update
   * @returns {Promise<void>}
   */
  async updateStudent(studentId, data) {
    try {
      await this.update(COLLECTIONS.STUDENTS, studentId, {
        ...data,
        lastModifiedBy: AuthService.getCurrentUser()?.uid,
      });

      // Log activity
      await this._logAdminActivity('update_student', 'student', studentId, data);
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // ==================== Syllabus Operations ====================

  /**
   * Create syllabus entry
   * @param {Object} syllabusData - Syllabus data
   * @returns {Promise<Object>} Created syllabus
   */
  async createSyllabus(syllabusData) {
    try {
      const syllabus = await this.create(COLLECTIONS.SYLLABUS, {
        ...syllabusData,
        uploadedBy: AuthService.getCurrentUser()?.uid,
        isActive: true,
      });

      // Log activity
      await this._logAdminActivity('upload_syllabus', 'syllabus', syllabus.id, {
        class: syllabusData.class,
        subject: syllabusData.subject,
      });

      return syllabus;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get syllabus by class and subject
   * @param {string} className - Class name
   * @param {string} subject - Subject (optional)
   * @returns {Promise<Array>} Array of syllabus documents
   */
  async getSyllabusByClass(className, subject = null) {
    try {
      const filters = [
        { field: 'class', operator: '==', value: className },
        { field: 'isActive', operator: '==', value: true }
      ];

      if (subject) {
        filters.push({ field: 'subject', operator: '==', value: subject });
      }

      return await this.query(COLLECTIONS.SYLLABUS, filters, { field: 'uploadedAt', direction: 'desc' });
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // ==================== Homework Operations ====================

  /**
   * Create homework assignment
   * @param {Object} homeworkData - Homework data
   * @returns {Promise<Object>} Created homework
   */
  async createHomework(homeworkData) {
    try {
      const homework = await this.create(COLLECTIONS.HOMEWORK, {
        ...homeworkData,
        assignedBy: AuthService.getCurrentUser()?.uid,
        isActive: true,
      });

      // Log activity
      await this._logAdminActivity('create_homework', 'homework', homework.id, {
        class: homeworkData.class,
        subject: homeworkData.subject,
      });

      return homework;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get homework by class and section
   * @param {string} className - Class name
   * @param {string} section - Section
   * @returns {Promise<Array>} Array of homework assignments
   */
  async getHomeworkByClass(className, section) {
    try {
      const filters = [
        { field: 'class', operator: '==', value: className },
        { field: 'isActive', operator: '==', value: true }
      ];

      // Add section filter (homework can be for "all" sections or specific section)
      const allHomework = await this.query(COLLECTIONS.HOMEWORK, filters, { field: 'dueDate', direction: 'asc' });

      // Filter for section or "all"
      return allHomework.filter(hw => hw.section === 'all' || hw.section === section);
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // ==================== Test Operations ====================

  /**
   * Create test
   * @param {Object} testData - Test data
   * @returns {Promise<Object>} Created test
   */
  async createTest(testData) {
    try {
      const test = await this.create(COLLECTIONS.TESTS, {
        ...testData,
        createdBy: AuthService.getCurrentUser()?.uid,
        isPublished: false,
      });

      // Log activity
      await this._logAdminActivity('create_test', 'test', test.id, {
        class: testData.class,
        subject: testData.subject,
      });

      return test;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Enter test score for a student
   * @param {Object} scoreData - Score data
   * @returns {Promise<Object>} Created score
   */
  async enterTestScore(scoreData) {
    try {
      const score = await this.create(COLLECTIONS.TEST_SCORES, {
        ...scoreData,
        enteredBy: AuthService.getCurrentUser()?.uid,
      });

      // Log activity
      await this._logAdminActivity('enter_test_score', 'test_score', score.id, {
        testId: scoreData.testId,
        studentId: scoreData.studentId,
      });

      return score;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get test scores for a student
   * @param {string} studentId - Student ID
   * @param {boolean} publishedOnly - Only get published scores
   * @returns {Promise<Array>} Array of test scores
   */
  async getTestScoresByStudent(studentId, publishedOnly = true) {
    try {
      const filters = [
        { field: 'studentId', operator: '==', value: studentId }
      ];

      if (publishedOnly) {
        filters.push({ field: 'isPublished', operator: '==', value: true });
      }

      return await this.query(COLLECTIONS.TEST_SCORES, filters, { field: 'enteredAt', direction: 'desc' });
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // ==================== Real-time Listeners ====================

  /**
   * Subscribe to collection changes
   * @param {string} collection - Collection name
   * @param {Array} filters - Array of filter objects
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  subscribeToCollection(collection, filters = [], callback) {
    let query = firestore().collection(collection);

    // Apply filters
    filters.forEach(filter => {
      query = query.where(filter.field, filter.operator, filter.value);
    });

    return query.onSnapshot(
      (snapshot) => {
        const documents = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(documents);
      },
      (error) => {
        console.error(`Error in ${collection} listener:`, error);
        callback(null, error);
      }
    );
  }

  /**
   * Subscribe to document changes
   * @param {string} collection - Collection name
   * @param {string} docId - Document ID
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  subscribeToDocument(collection, docId, callback) {
    return firestore()
      .collection(collection)
      .doc(docId)
      .onSnapshot(
        (doc) => {
          if (doc.exists) {
            callback({
              id: doc.id,
              ...doc.data(),
            });
          } else {
            callback(null, new Error(ERROR_MESSAGES.NOT_FOUND));
          }
        },
        (error) => {
          console.error(`Error in ${collection}/${docId} listener:`, error);
          callback(null, error);
        }
      );
  }

  // ==================== Private Helper Methods ====================

  /**
   * Log admin activity
   * @private
   */
  async _logAdminActivity(action, entityType, entityId, metadata) {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) return;

      const userData = await AuthService.getUserData(currentUser.uid);
      if (userData.role !== 'admin') return;

      await this.create(COLLECTIONS.ADMIN_ACTIVITY_LOG, {
        adminId: currentUser.uid,
        adminEmail: currentUser.email,
        action,
        entityType,
        entityId,
        description: `${action} - ${entityType}`,
        metadata,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('Error logging admin activity:', error);
      // Don't throw error, just log it
    }
  }

  /**
   * Handle Firestore errors
   * @private
   */
  _handleError(error) {
    const errorCode = error.code;
    const errorMessages = {
      'permission-denied': ERROR_MESSAGES.PERMISSION_DENIED,
      'not-found': ERROR_MESSAGES.NOT_FOUND,
      'unavailable': ERROR_MESSAGES.NETWORK_ERROR,
    };

    const message = errorMessages[errorCode] || error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
    const newError = new Error(message);
    newError.code = errorCode;
    return newError;
  }
}

export default new FirestoreService();
