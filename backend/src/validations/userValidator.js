const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,}$/;

export const validateRegisterUser = (data) => {
  const errors = [];

  if (!data.username || typeof data.username !== 'string') {
    errors.push('Username is required and must be a string.');
  }
  if (!data.email || typeof data.email !== 'string' || !emailRegex.test(data.email)) {
    errors.push('A valid email is required.');
  }
  if (
    !data.password ||
    typeof data.password !== 'string' ||
    data.password.length <7
    // !passwordRegex.test(data.password)
  ) {
    errors.push('Required Strong Password');
  }
  return errors;
};

export const validateAuthUser = (data) => {
  const errors = [];

  if (!data.email || typeof data.email !== 'string' || !emailRegex.test(data.email)) {
    errors.push('Invalid Email');
  }
  if (!data.password || typeof data.password !== 'string') {
    errors.push('Password is required.');
  }
  return errors;
};
