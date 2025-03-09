'use client';
import React, { FC } from 'react';
import styles from './ErrorMessage.module.scss';

interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'success' | 'info';
}

/**
 * Reusable component for displaying error, warning, and info messages
 * with appropriate styling and accessibility attributes
 */
const ErrorMessage: FC<ErrorMessageProps> = ({ message, type = 'error' }) => {
  if (!message) return null;
  
  return (
    <div className={`${styles.container} ${styles[type]}`} role="alert">
      {type === 'error' && <span className={styles.icon}>⚠️</span>}
      {type === 'success' && <span className={styles.icon}>✅</span>}
      {type === 'info' && <span className={styles.icon}>ℹ️</span>}
      <p className={styles.message}>{message}</p>
    </div>
  );
};

// Add display name for better debugging
ErrorMessage.displayName = 'ErrorMessage';

// Export component to prevent unnecessary re-renders
export default ErrorMessage; 