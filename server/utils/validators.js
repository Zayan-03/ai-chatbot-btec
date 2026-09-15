const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  // At least 8 characters
  return password.length >= 8;
};

const validateUsername = (username) => {
  // Alphanumeric and underscores only, 3-30 chars
  const re = /^[a-zA-Z0-9_]{3,30}$/;
  return re.test(username);
};

const validateFileSize = (size, maxSize = 10 * 1024 * 1024) => {
  return size <= maxSize;
};

const validateFileType = (mimetype, allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain']) => {
  return allowedTypes.includes(mimetype);
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUsername,
  validateFileSize,
  validateFileType
};
