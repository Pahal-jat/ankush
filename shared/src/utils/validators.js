/**
 * Input Validators
 * Validation functions for user inputs
 */

import { VALIDATION_REGEX } from '../config/constants';

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const validateEmail = (email) => {
  return VALIDATION_REGEX.EMAIL.test(email);
};

/**
 * Validate phone number (Indian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export const validatePhone = (phone) => {
  return VALIDATION_REGEX.PHONE.test(phone);
};

/**
 * Validate pincode (Indian format)
 * @param {string} pincode - Pincode to validate
 * @returns {boolean} True if valid
 */
export const validatePincode = (pincode) => {
  return VALIDATION_REGEX.PINCODE.test(pincode);
};

/**
 * Validate admission number
 * @param {string} admissionNo - Admission number to validate
 * @returns {boolean} True if valid
 */
export const validateAdmissionNo = (admissionNo) => {
  return VALIDATION_REGEX.ADMISSION_NO.test(admissionNo);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result { isValid, message }
 */
export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return {
      isValid: false,
      message: 'Password must be at least 6 characters long',
    };
  }

  if (password.length < 8) {
    return {
      isValid: true,
      message: 'Password is weak. Consider using 8+ characters',
    };
  }

  const hasNumber = /\d/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strengthChecks = [hasNumber, hasUpperCase, hasLowerCase, hasSpecialChar];
  const strength = strengthChecks.filter(Boolean).length;

  if (strength < 2) {
    return {
      isValid: true,
      message: 'Password is weak. Consider adding numbers, uppercase, and special characters',
    };
  }

  if (strength < 3) {
    return {
      isValid: true,
      message: 'Password is moderate',
    };
  }

  return {
    isValid: true,
    message: 'Password is strong',
  };
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @returns {boolean} True if not empty
 */
export const validateRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

/**
 * Validate date (not in future)
 * @param {Date} date - Date to validate
 * @returns {boolean} True if valid
 */
export const validateDateNotFuture = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date <= today;
};

/**
 * Validate date (not in past)
 * @param {Date} date - Date to validate
 * @returns {boolean} True if valid
 */
export const validateDateNotPast = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

/**
 * Validate date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {boolean} True if valid
 */
export const validateDateRange = (startDate, endDate) => {
  return startDate <= endDate;
};

/**
 * Validate number range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} True if valid
 */
export const validateNumberRange = (value, min, max) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Validate marks
 * @param {number} marksObtained - Marks obtained
 * @param {number} maxMarks - Maximum marks
 * @returns {Object} Validation result { isValid, message }
 */
export const validateMarks = (marksObtained, maxMarks) => {
  if (isNaN(marksObtained) || isNaN(maxMarks)) {
    return {
      isValid: false,
      message: 'Marks must be numbers',
    };
  }

  if (marksObtained < 0) {
    return {
      isValid: false,
      message: 'Marks cannot be negative',
    };
  }

  if (marksObtained > maxMarks) {
    return {
      isValid: false,
      message: 'Marks obtained cannot exceed maximum marks',
    };
  }

  return {
    isValid: true,
    message: 'Valid',
  };
};

/**
 * Validate file type
 * @param {string} fileName - File name
 * @param {Array<string>} allowedTypes - Allowed MIME types
 * @returns {boolean} True if valid
 */
export const validateFileType = (fileName, allowedTypes) => {
  const extension = fileName.split('.').pop().toLowerCase();
  const mimeTypeMap = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
  };

  const mimeType = mimeTypeMap[extension];
  return mimeType && allowedTypes.includes(mimeType);
};

/**
 * Validate form data
 * @param {Object} formData - Form data to validate
 * @param {Object} validationRules - Validation rules
 * @returns {Object} Validation result { isValid, errors }
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};

  Object.keys(validationRules).forEach((field) => {
    const rules = validationRules[field];
    const value = formData[field];

    if (rules.required && !validateRequired(value)) {
      errors[field] = `${field} is required`;
      return;
    }

    if (rules.email && !validateEmail(value)) {
      errors[field] = 'Invalid email address';
      return;
    }

    if (rules.phone && !validatePhone(value)) {
      errors[field] = 'Invalid phone number';
      return;
    }

    if (rules.minLength && value.length < rules.minLength) {
      errors[field] = `${field} must be at least ${rules.minLength} characters`;
      return;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      errors[field] = `${field} must not exceed ${rules.maxLength} characters`;
      return;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      errors[field] = rules.patternMessage || `Invalid ${field} format`;
      return;
    }

    if (rules.custom) {
      const customResult = rules.custom(value, formData);
      if (!customResult.isValid) {
        errors[field] = customResult.message;
        return;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
