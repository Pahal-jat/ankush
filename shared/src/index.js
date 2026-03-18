/**
 * Shared Library Index
 * Export all services, utilities, and constants
 */

// Config
export { default as firebase } from './config/firebase.config';
export * from './config/constants';

// Services
export { default as AuthService } from './services/auth.service';
export { default as FirestoreService } from './services/firestore.service';
export { default as StorageService } from './services/storage.service';

// Utilities
export * from './utils/validators';
export * from './utils/helpers';
export * from './utils/grade-calculator';
