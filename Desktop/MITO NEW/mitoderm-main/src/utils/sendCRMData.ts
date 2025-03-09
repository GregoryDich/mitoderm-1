'use server';
import axios, { AxiosError } from 'axios';
import type { MainFormDataType, CRMApiResponse } from '@/types';

// Объявление типов для переменных окружения (исправление ошибки process.env)
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_CRM_USERNAME: string;
      NEXT_PUBLIC_CRM_ACCOUNT: string;
      NEXT_PUBLIC_CRM_PASSWORD: string;
    }
  }
}

// Get CRM credentials from environment variables
const crmUserName = process.env.NEXT_PUBLIC_CRM_USERNAME;
const crmAccount = process.env.NEXT_PUBLIC_CRM_ACCOUNT;
const crmPassword = process.env.NEXT_PUBLIC_CRM_PASSWORD;
const crmUrl = `https://${crmAccount}.senzey.com/extapi/pclient/add.php?username=${crmUserName}&password=${crmPassword}`;

/**
 * Sends form data to the CRM system
 * @param formData - The validated form data
 * @returns Promise with standardized API response
 */
export async function sendDataToCRM(formData: MainFormDataType): Promise<CRMApiResponse> {
  // Validate environment variables
  if (!crmUserName || !crmAccount || !crmPassword) {
    console.error('CRM credentials not properly configured');
    return {
      success: false,
      message: 'CRM configuration error',
    };
  }

  const data = {
    x_name: formData.name.value,
    x_email: formData.email.value,
    x_phone: formData.phone.value,
    x_comments: formData.profession.value,
  };

  try {
    const response = await axios.post(crmUrl, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      timeout: 10000, // 10 second timeout
    });

    // Handle successful response
    return {
      success: true,
      message: 'Data successfully sent to CRM',
      data: response.data,
    };
  } catch (err) {
    // Handle error response
    const error = err as Error | AxiosError;
    console.error('CRM submission error:', error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: `CRM error: ${error.message}`,
        data: error.response?.data,
      };
    }

    return {
      success: false,
      message: `CRM error: ${error.message || 'Unknown error'}`,
    };
  }
}
