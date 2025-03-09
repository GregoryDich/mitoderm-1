'use server';
import nodemailer from 'nodemailer';
import type { MainFormDataType, EmailApiResponse } from '@/types';

// Объявление типов для переменных окружения
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_EMAIL_USERNAME: string;
      NEXT_PUBLIC_EMAIL_PASSWORD: string;
      NEXT_PUBLIC_PERSONAL_EMAIL: string;
    }
  }
}

// Get email credentials from environment variables
const emailUsername = process.env.NEXT_PUBLIC_EMAIL_USERNAME;
const emailPassword = process.env.NEXT_PUBLIC_EMAIL_PASSWORD;
const myEmail = process.env.NEXT_PUBLIC_PERSONAL_EMAIL;

/**
 * Sends form data via email
 * @param formData - The validated form data
 * @returns Promise with standardized API response
 */
export async function sendDataOnMail(formData: MainFormDataType): Promise<EmailApiResponse> {
  // Validate environment variables
  if (!emailUsername || !emailPassword || !myEmail) {
    console.error('Email credentials not properly configured');
    return {
      success: false,
      message: 'Email configuration error',
    };
  }

  const { name, email, phone, profession } = {
    name: formData.name.value,
    email: formData.email.value,
    phone: formData.phone.value,
    profession: formData.profession.value,
  };

  // Create email transport
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: emailUsername,
      pass: emailPassword,
    },
  });

  try {
    // Send email
    const mail = await transporter.sendMail({
      from: emailUsername,
      to: myEmail,
      subject: `New form submission from ${name}`,
      html: `
      <h2>New Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone number:</strong> ${phone}</p>
      <p><strong>Profession:</strong> ${profession}</p>
      <p><em>Sent from MitoDerm website on ${new Date().toLocaleString()}</em></p>
      `,
    });

    // Return success response
    return {
      success: true,
      message: 'Email sent successfully',
      data: {
        messageId: mail.messageId,
      },
    };
  } catch (error) {
    // Handle error
    const err = error as Error;
    console.error('Email sending error:', err);
    
    return {
      success: false,
      message: `Email error: ${err.message || 'Unknown error'}`,
    };
  }
}
