import { emailRegex } from '@/constants';

// Define proper type for the translator function
type TranslatorFunction = (key: string) => string;

/**
 * Validates a name field
 * @param data - The name to validate
 * @param t - Translation function
 * @returns Error message if invalid, empty string if valid
 */
export const validateName = (data: string, t: TranslatorFunction): string => {
  if (!data.length) {
    return t('form.errors.name_required');
  }
  
  if (data.trim().length < 3) {
    return t('form.errors.name_length');
  }
  
  return '';
};

/**
 * Validates an email field
 * @param data - The email to validate
 * @param t - Translation function
 * @returns Error message if invalid, empty string if valid
 */
export const validateEmail = (data: string, t: TranslatorFunction): string => {
  if (!data.length) {
    return t('form.errors.email_required');
  }
  
  if (!emailRegex.test(data)) {
    return t('form.errors.email_invalid');
  }
  
  return '';
};

/**
 * Validates a phone field
 * @param data - The phone to validate
 * @param t - Translation function
 * @returns Error message if invalid, empty string if valid
 */
export const validatePhone = (data: string, t: TranslatorFunction): string => {
  if (!data.length) {
    return t('form.errors.phone_required');
  }
  
  if (data.trim().length < 9) {
    return t('form.errors.phone_length');
  }
  
  return '';
};

/**
 * Validates a profession field
 * @param data - The profession to validate
 * @param t - Translation function
 * @returns Error message if invalid, empty string if valid
 */
export const validateProfession = (data: string, t: TranslatorFunction): string => {
  if (!data.length) {
    return t('form.errors.profession_required');
  }
  
  if (data.trim().length < 3) {
    return t('form.errors.profession_length');
  }
  
  return '';
};

/**
 * Validates an ID field
 * @param data - The ID to validate
 * @param t - Translation function
 * @returns Error message if invalid, empty string if valid
 */
export const validateId = (data: string, t: TranslatorFunction): string => {
  if (!data.length) {
    return t('form.errors.id_required');
  }
  
  if (data.trim().length < 9) {
    return t('form.errors.id_length');
  }
  
  return '';
};
