export const isEmailValid = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isMobileNumberValid = (mobileNumber: string): boolean => {
  const mobileRegex = /^\d{11}$/;
  return mobileRegex.test(mobileNumber);
};

export const isDateOfBirthValid = (dateOfBirth: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(dateOfBirth);
};

export const isPasswordValid = (password: string): boolean => {
  // Password must contain at least 8 characters, 1 uppercase letter, and 1 special character
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+={}[\]:;'"<>,.?/\\|~-]).{8,}$/;
  return passwordRegex.test(password);
};