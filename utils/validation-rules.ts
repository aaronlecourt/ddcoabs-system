export const isFirstNameValid = (firstName: string): boolean => {
  return firstName.length >= 2
}

export const isLastNameValid = (lastName: string): boolean => {
  return lastName.length >= 2
}

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

  const currentDate = new Date().setHours(0,0,0,0)
  const birthDate = new Date(dateOfBirth).setHours(0,0,0,0)

  return dateRegex.test(dateOfBirth) && birthDate < currentDate;
};

export const isPasswordValid = (password: string): boolean => {
  // Password must contain at least 8 characters, 1 uppercase letter, and 1 special character
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+={}[\]:;'"<>,.?/\\|~-]).{8,}$/;
  return passwordRegex.test(password);
};

export const isInput50Chars = (input: string): boolean => {
  return input.length <= 50;
  //true or false output
}

export const isInput25Chars = (input: string): boolean => {
  return input.length <= 25;
  //true or false output
}

export const atLeast5Chars = (input: string): boolean => {
  return input.length >= 5;
  //true or false output
}