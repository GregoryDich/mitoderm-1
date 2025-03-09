export const combinedArray = (arr: Array<any>) =>
  arr
    .map((_, index, array) => {
      if (index % 2 === 0) {
        return [array[index], array[index + 1]];
      }
      return null;
    })
    .filter((item): item is [any, any] => item !== null && item !== undefined);

/**
 * Convert a kebab-case string to camelCase
 * @param str String in kebab-case format
 * @returns String in camelCase format
 */
export const kebabToCamel = (str: string) => {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

/**
 * Generate a unique ID with an optional prefix
 * @param prefix Optional prefix for the ID
 * @returns Unique ID string
 */
export const generateId = (prefix = 'id'): string => {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Format a phone number for display
 * @param phone Phone number as string
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Handle different phone number lengths
  if (cleaned.length < 10) {
    return cleaned;
  }
  
  // Format as (XXX) XXX-XXXX for US/CA numbers
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
  }
  
  // Handle international numbers
  return `+${cleaned.substring(0, cleaned.length - 10)} (${cleaned.substring(cleaned.length - 10, cleaned.length - 7)}) ${cleaned.substring(cleaned.length - 7, cleaned.length - 4)}-${cleaned.substring(cleaned.length - 4)}`;
};

/**
 * Debounce a function call
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>): void => {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
};
