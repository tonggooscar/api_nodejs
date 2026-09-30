export interface FieldError {
  field: string;
  message: string;
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[0-9]{8,15}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
};

export const sanitizeString = (str: string): string => {
  return str.trim().replace(/<[^>]*>?/gm, '');
};
