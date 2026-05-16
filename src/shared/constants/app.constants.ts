/**
 * Application Constants
 * Centralized configuration values
 */

export const APP_CONSTANTS = {
  PROJECT: {
    MIN_DESCRIPTION_LENGTH: 10,
    MAX_DESCRIPTION_LENGTH: 5000,
    MAX_TAGS: 10,
  },
  SEARCH: {
    MIN_QUERY_LENGTH: 0,
    MAX_QUERY_LENGTH: 100,
  },
  ANIMATION: {
    DELAY_INCREMENT: 100,
    DURATION: 700,
  },
} as const;
