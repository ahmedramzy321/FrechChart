/**
 * Validation helpers for FreshCart authentication and forms
 */

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).trim());
};

export const isValidEgyptianPhone = (phone) => {
  // Egyptian numbers start with 010, 011, 012, or 015 followed by 8 digits (11 digits total)
  const phoneRegex = /^01[0125][0-9]{8}$/;
  return phoneRegex.test(String(phone).trim());
};

export const isStrongPassword = (password) => {
  // At least 6 characters, includes at least one number, one uppercase, one lowercase
  if (!password || password.length < 6) return false;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasUpper && hasLower && hasNumber;
};

export const validateLogin = (values) => {
  const errors = {};
  if (!values.email || !values.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  }

  return errors;
};

export const validateRegister = (values) => {
  const errors = {};

  if (!values.name || !values.name.trim()) {
    errors.name = 'Full name is required';
  } else if (values.name.trim().length < 3) {
    errors.name = 'Name must be at least 3 characters long';
  }

  if (!values.email || !values.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  } else if (!isStrongPassword(values.password)) {
    errors.password = 'Password must contain uppercase, lowercase, and a number';
  }

  if (!values.rePassword) {
    errors.rePassword = 'Password confirmation is required';
  } else if (values.rePassword !== values.password) {
    errors.rePassword = 'Passwords do not match';
  }

  if (!values.phone || !values.phone.trim()) {
    errors.phone = 'Egyptian phone number is required';
  } else if (!isValidEgyptianPhone(values.phone)) {
    errors.phone = 'Must be a valid Egyptian phone number (e.g., 01012345678)';
  }

  return errors;
};

export const validateChangePassword = (values) => {
  const errors = {};

  if (!values.currentPassword) {
    errors.currentPassword = 'Current password is required';
  }

  if (!values.password) {
    errors.password = 'New password is required';
  } else if (values.password.length < 6) {
    errors.password = 'New password must be at least 6 characters';
  } else if (!isStrongPassword(values.password)) {
    errors.password = 'Password must include uppercase, lowercase, and a number';
  }

  if (!values.rePassword) {
    errors.rePassword = 'Confirm new password is required';
  } else if (values.rePassword !== values.password) {
    errors.rePassword = 'Passwords do not match';
  }

  return errors;
};

export const validateShippingAddress = (values) => {
  const errors = {};

  if (!values.details || !values.details.trim()) {
    errors.details = 'Street address and delivery details are required';
  } else if (values.details.trim().length < 5) {
    errors.details = 'Please provide a more descriptive address (at least 5 characters)';
  }

  if (!values.city || !values.city.trim()) {
    errors.city = 'City name is required';
  }

  if (!values.phone || !values.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!isValidEgyptianPhone(values.phone)) {
    errors.phone = 'Please enter a valid Egyptian phone number (e.g. 01012345678)';
  }

  return errors;
};
