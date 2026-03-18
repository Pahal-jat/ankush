/**
 * Grade Calculator
 * Functions for calculating grades and percentages
 */

import { GRADES, GRADE_THRESHOLDS } from '../config/constants';

/**
 * Calculate percentage
 * @param {number} obtained - Marks obtained
 * @param {number} total - Total marks
 * @returns {number} Percentage (rounded to 2 decimal places)
 */
export const calculatePercentage = (obtained, total) => {
  if (total === 0) return 0;
  return Math.round((obtained / total) * 100 * 100) / 100;
};

/**
 * Calculate grade based on percentage
 * @param {number} percentage - Percentage value
 * @returns {string} Grade (A+, A, B+, B, C, D, F)
 */
export const calculateGrade = (percentage) => {
  if (percentage >= GRADE_THRESHOLDS.A_PLUS) return GRADES.A_PLUS;
  if (percentage >= GRADE_THRESHOLDS.A) return GRADES.A;
  if (percentage >= GRADE_THRESHOLDS.B_PLUS) return GRADES.B_PLUS;
  if (percentage >= GRADE_THRESHOLDS.B) return GRADES.B;
  if (percentage >= GRADE_THRESHOLDS.C) return GRADES.C;
  if (percentage >= GRADE_THRESHOLDS.D) return GRADES.D;
  return GRADES.F;
};

/**
 * Calculate grade from marks
 * @param {number} obtained - Marks obtained
 * @param {number} total - Total marks
 * @returns {Object} { percentage, grade }
 */
export const calculateGradeFromMarks = (obtained, total) => {
  const percentage = calculatePercentage(obtained, total);
  const grade = calculateGrade(percentage);
  return { percentage, grade };
};

/**
 * Get grade color (for UI display)
 * @param {string} grade - Grade value
 * @returns {string} Color hex code
 */
export const getGradeColor = (grade) => {
  const gradeColors = {
    [GRADES.A_PLUS]: '#2ecc71', // Green
    [GRADES.A]: '#27ae60',      // Dark Green
    [GRADES.B_PLUS]: '#3498db', // Blue
    [GRADES.B]: '#2980b9',      // Dark Blue
    [GRADES.C]: '#f39c12',      // Orange
    [GRADES.D]: '#e67e22',      // Dark Orange
    [GRADES.F]: '#e74c3c',      // Red
  };
  return gradeColors[grade] || '#95a5a6'; // Gray as default
};

/**
 * Get pass/fail status
 * @param {number} percentage - Percentage value
 * @param {number} passingPercentage - Passing threshold (default 40%)
 * @returns {boolean} True if passed
 */
export const isPassed = (percentage, passingPercentage = 40) => {
  return percentage >= passingPercentage;
};

/**
 * Get grade point (for GPA calculation)
 * @param {string} grade - Grade value
 * @returns {number} Grade point
 */
export const getGradePoint = (grade) => {
  const gradePoints = {
    [GRADES.A_PLUS]: 10,
    [GRADES.A]: 9,
    [GRADES.B_PLUS]: 8,
    [GRADES.B]: 7,
    [GRADES.C]: 6,
    [GRADES.D]: 5,
    [GRADES.F]: 0,
  };
  return gradePoints[grade] || 0;
};

/**
 * Calculate GPA from multiple grades
 * @param {Array<Object>} grades - Array of { grade, credits } objects
 * @returns {number} GPA (rounded to 2 decimal places)
 */
export const calculateGPA = (grades) => {
  if (grades.length === 0) return 0;

  let totalPoints = 0;
  let totalCredits = 0;

  grades.forEach(({ grade, credits = 1 }) => {
    const gradePoint = getGradePoint(grade);
    totalPoints += gradePoint * credits;
    totalCredits += credits;
  });

  if (totalCredits === 0) return 0;
  return Math.round((totalPoints / totalCredits) * 100) / 100;
};

/**
 * Calculate class average
 * @param {Array<number>} scores - Array of scores
 * @returns {number} Average (rounded to 2 decimal places)
 */
export const calculateAverage = (scores) => {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return Math.round((sum / scores.length) * 100) / 100;
};

/**
 * Calculate class rank
 * @param {number} studentScore - Student's score
 * @param {Array<number>} allScores - All students' scores
 * @returns {number} Rank (1-based)
 */
export const calculateRank = (studentScore, allScores) => {
  const sortedScores = [...allScores].sort((a, b) => b - a);
  return sortedScores.indexOf(studentScore) + 1;
};

/**
 * Get performance category
 * @param {number} percentage - Percentage value
 * @returns {string} Performance category
 */
export const getPerformanceCategory = (percentage) => {
  if (percentage >= 90) return 'Excellent';
  if (percentage >= 80) return 'Very Good';
  if (percentage >= 70) return 'Good';
  if (percentage >= 60) return 'Satisfactory';
  if (percentage >= 40) return 'Pass';
  return 'Needs Improvement';
};

/**
 * Format percentage for display
 * @param {number} percentage - Percentage value
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (percentage) => {
  return `${percentage.toFixed(2)}%`;
};

/**
 * Format marks for display
 * @param {number} obtained - Marks obtained
 * @param {number} total - Total marks
 * @returns {string} Formatted marks string (e.g., "85/100")
 */
export const formatMarks = (obtained, total) => {
  return `${obtained}/${total}`;
};
