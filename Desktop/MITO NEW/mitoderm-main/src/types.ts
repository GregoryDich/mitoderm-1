export type LanguageType = 'en-US' | 'he-IL' | 'ru-RU';
export type LocaleType = 'en' | 'he' | 'ru';

export interface NavItem {
  text: string;
  scrollId?: ScrollItems;
  url?: string;
  form?: 'main' | 'event';
}

export interface HowToUseItem {
  imagePath: string;
  text: string;
}

export interface AboutBulletItem {
  data: string;
  text: string;
}

export interface LanguageSwitchItem {
  imageUrl: string;
  url: string;
}

export interface SolutionItem {
  imageUrl: string;
  title: string;
  text: string[];
}

export type NameTypeMain = 'name' | 'email' | 'phone' | 'profession';
export type NameTypeEvent = 'name' | 'email' | 'phone' | 'idNumber';

// Base field type with validation status
export interface FormFieldType {
  value: string;
  isValid: boolean;
}

// Basic form data with common fields
export interface FormDataType {
  name: FormFieldType;
  email: FormFieldType;
  phone: FormFieldType;
}

export interface MainFormDataType extends FormDataType {
  profession: FormFieldType;
}

export interface EventFormDataType extends FormDataType {
  idNumber: FormFieldType;
  totalPrice?: string;
  discount?: boolean;
  quantity?: string | number;
  lang?: LocaleType;
}

export enum ScrollItems {
  gallery = 'gallery',
  solution = 'solution',
  mission = 'mission',
  about = 'about',
  agenda = 'agenda',
}

export type ModalType = 'privatePolicy' | 'accessibility';

export interface ReviewType {
  name: string;
  rating: number;
  text: string;
}

export interface EventBulletItem {
  imagePath: string;
  text: string;
}

// API response types
export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface EmailApiResponse extends ApiResponse {
  data?: {
    messageId?: string;
  };
}

export interface CRMApiResponse extends ApiResponse {
  data?: {
    id?: string;
    status?: string;
  };
}

// Validation functions types
export type ValidationFunction = (value: string, t: TranslationFunction) => string;
export type TranslationFunction = (key: string) => string;

// Store state types
export interface AppStoreState {
  isModalOpen: boolean;
  activeModal: ModalType | null;
  introPage: number;
  setModalOpen: (isOpen: boolean) => void;
  setActiveModal: (modal: ModalType | null) => void;
  setIntroPage: (page: number) => void;
}

// SEO and metadata types
export interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
}

// Event handler types for form components
export type FormChangeHandler = (
  data: string,
  name: NameTypeMain | NameTypeEvent,
  isValid: boolean
) => void;
