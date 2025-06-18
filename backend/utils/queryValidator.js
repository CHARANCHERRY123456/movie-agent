export const validateQuery = (sql) => {
  if (!sql || typeof sql !== 'string') {
    return { isValid: false, error: 'Query is empty or not a string' };
  }

  const upperSQL = sql.toUpperCase().trim();
  
  // Check for dangerous operations
  const dangerousPatterns = [
    'DROP TABLE',
    'DROP DATABASE',
    'TRUNCATE',
    'ALTER TABLE',
    'CREATE TABLE',
    'CREATE DATABASE',
    'GRANT',
    'REVOKE'
  ];

  for (const pattern of dangerousPatterns) {
    if (upperSQL.includes(pattern)) {
      return { isValid: false, error: `Dangerous operation detected: ${pattern}` };
    }
  }

  // Check for valid SQL operations
  const validOperations = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'];
  const hasValidOperation = validOperations.some(op => upperSQL.startsWith(op));
  
  if (!hasValidOperation) {
    return { isValid: false, error: 'Query must start with SELECT, INSERT, UPDATE, or DELETE' };
  }

  // Basic SQL injection prevention
  const suspiciousPatterns = [
    /;\s*(DROP|DELETE|UPDATE|INSERT)/i,
    /UNION.*SELECT/i,
    /--.*$/m
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(sql)) {
      return { isValid: false, error: 'Potentially malicious SQL detected' };
    }
  }

  return { isValid: true };
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/['"]/g, '') // Remove quotes that could break SQL
    .trim();
};