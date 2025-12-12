export function validateSignupData(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): { isValid: boolean; message?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "InisValid email format" };
  }
  if (!name || name.length < 3) {
    return {
      isValid: false,
      message: "Name must be at least 3 characters long",
    };
  }
  if (!password || password.length < 8 || password.length > 40) {
    return {
      isValid: false,
      message: "Password must be between 8 and 40 characters long",
    };
  }
  if (password !== confirmPassword) {
    return { isValid: false, message: "Passwords do not match" };
  }
  return { isValid: true, message: "" };
}

export function validateLoginData(
  email: string,
  password: string
): { isValid: boolean; message?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Invalid email format" };
  }
  if (!password || password.length < 8 || password.length > 40) {
    return {
      isValid: false,
      message: "Password must be between 8 and 40 characters long",
    };
  }
  return { isValid: true, message: "" };
}
