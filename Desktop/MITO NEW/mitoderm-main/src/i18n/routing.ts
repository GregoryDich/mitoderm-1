import { defineRouting } from 'next-intl/routing';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import type { LocaleType } from '@/types';

// Define supported locales as a union type for type safety
export const SUPPORTED_LOCALES = ['en', 'he', 'ru'] as const;

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: SUPPORTED_LOCALES,

  // Used when no locale matches
  defaultLocale: 'en' as LocaleType,
});

/**
 * Lightweight wrappers around Next.js' navigation APIs
 * that will consider the routing configuration
 */
export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation(routing);

/**
 * Type guard to check if a string is a valid locale
 * @param locale - The locale to check
 * @returns True if the locale is supported
 */
export function isValidLocale(locale: string): locale is LocaleType {
  return SUPPORTED_LOCALES.includes(locale as LocaleType);
}
