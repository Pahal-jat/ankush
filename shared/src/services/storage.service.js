/**
 * Storage Service
 * Handles Firebase Storage file upload/download operations
 */

import storage from '@react-native-firebase/storage';
import { STORAGE_PATHS, FILE_SIZE_LIMITS, ERROR_MESSAGES } from '../config/constants';

class StorageService {
  /**
   * Upload file to Firebase Storage
   * @param {string} path - Storage path
   * @param {string} fileUri - Local file URI
   * @param {Object} metadata - File metadata
   * @returns {Promise<string>} Download URL
   */
  async uploadFile(path, fileUri, metadata = {}) {
    try {
      const reference = storage().ref(path);

      // Upload file
      await reference.putFile(fileUri, metadata);

      // Get download URL
      const downloadURL = await reference.getDownloadURL();

      return downloadURL;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Upload file with progress tracking
   * @param {string} path - Storage path
   * @param {string} fileUri - Local file URI
   * @param {Function} onProgress - Progress callback (receives percentage)
   * @param {Object} metadata - File metadata
   * @returns {Promise<string>} Download URL
   */
  async uploadFileWithProgress(path, fileUri, onProgress, metadata = {}) {
    try {
      const reference = storage().ref(path);
      const task = reference.putFile(fileUri, metadata);

      // Monitor upload progress
      task.on('state_changed', (taskSnapshot) => {
        const progress = (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100;
        onProgress(progress);
      });

      // Wait for upload to complete
      await task;

      // Get download URL
      const downloadURL = await reference.getDownloadURL();

      return downloadURL;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Download file from Firebase Storage
   * @param {string} url - Download URL
   * @param {string} localPath - Local path to save file
   * @returns {Promise<string>} Local file path
   */
  async downloadFile(url, localPath) {
    try {
      const reference = storage().refFromURL(url);
      await reference.writeToFile(localPath);
      return localPath;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get download URL for a file
   * @param {string} path - Storage path
   * @returns {Promise<string>} Download URL
   */
  async getDownloadURL(path) {
    try {
      const reference = storage().ref(path);
      const url = await reference.getDownloadURL();
      return url;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Delete file from Firebase Storage
   * @param {string} path - Storage path
   * @returns {Promise<void>}
   */
  async deleteFile(path) {
    try {
      const reference = storage().ref(path);
      await reference.delete();
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get file metadata
   * @param {string} path - Storage path
   * @returns {Promise<Object>} File metadata
   */
  async getMetadata(path) {
    try {
      const reference = storage().ref(path);
      const metadata = await reference.getMetadata();
      return metadata;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // ==================== Helper Methods ====================

  /**
   * Generate storage path for syllabus
   * @param {string} className - Class name
   * @param {string} subject - Subject name
   * @param {string} fileName - File name
   * @returns {string} Storage path
   */
  getSyllabusPath(className, subject, fileName) {
    const timestamp = Date.now();
    const sanitizedFileName = this._sanitizeFileName(fileName);
    return `${STORAGE_PATHS.SYLLABUS(className, subject)}/${sanitizedFileName}_${timestamp}`;
  }

  /**
   * Generate storage path for homework
   * @param {string} className - Class name
   * @param {string} subject - Subject name
   * @param {string} fileName - File name
   * @returns {string} Storage path
   */
  getHomeworkPath(className, subject, fileName) {
    const timestamp = Date.now();
    const sanitizedFileName = this._sanitizeFileName(fileName);
    return `${STORAGE_PATHS.HOMEWORK(className, subject)}/${sanitizedFileName}_${timestamp}`;
  }

  /**
   * Generate storage path for profile image
   * @param {string} admissionNo - Student admission number
   * @param {string} fileName - File name
   * @returns {string} Storage path
   */
  getProfileImagePath(admissionNo, fileName) {
    const timestamp = Date.now();
    const extension = fileName.split('.').pop();
    return `${STORAGE_PATHS.PROFILE_IMAGES}/${admissionNo}_${timestamp}.${extension}`;
  }

  /**
   * Validate file size
   * @param {number} fileSize - File size in bytes
   * @param {string} fileType - File type ('homework', 'syllabus', 'profile_image')
   * @returns {boolean} True if valid
   */
  validateFileSize(fileSize, fileType) {
    const limits = {
      homework: FILE_SIZE_LIMITS.HOMEWORK,
      syllabus: FILE_SIZE_LIMITS.SYLLABUS,
      profile_image: FILE_SIZE_LIMITS.PROFILE_IMAGE,
    };

    const limit = limits[fileType] || FILE_SIZE_LIMITS.HOMEWORK;
    return fileSize <= limit;
  }

  /**
   * Get file extension from file name
   * @param {string} fileName - File name
   * @returns {string} File extension
   */
  getFileExtension(fileName) {
    return fileName.split('.').pop().toLowerCase();
  }

  /**
   * Get file name from file path
   * @param {string} filePath - File path
   * @returns {string} File name
   */
  getFileName(filePath) {
    return filePath.split('/').pop();
  }

  // ==================== Private Helper Methods ====================

  /**
   * Sanitize file name (remove special characters)
   * @private
   * @param {string} fileName - Original file name
   * @returns {string} Sanitized file name
   */
  _sanitizeFileName(fileName) {
    // Remove extension
    const parts = fileName.split('.');
    const extension = parts.pop();
    const name = parts.join('.');

    // Remove special characters and spaces
    const sanitized = name.replace(/[^a-zA-Z0-9_-]/g, '_');

    return `${sanitized}.${extension}`;
  }

  /**
   * Handle storage errors
   * @private
   * @param {Error} error - Error object
   * @returns {Error} Formatted error
   */
  _handleError(error) {
    const errorCode = error.code;
    const errorMessages = {
      'storage/object-not-found': 'File not found in storage.',
      'storage/unauthorized': ERROR_MESSAGES.PERMISSION_DENIED,
      'storage/canceled': 'Upload canceled.',
      'storage/unknown': ERROR_MESSAGES.UNKNOWN_ERROR,
    };

    const message = errorMessages[errorCode] || error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
    const newError = new Error(message);
    newError.code = errorCode;
    return newError;
  }
}

export default new StorageService();
