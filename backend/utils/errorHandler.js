export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = { ...err };
  error.message = err.message;

  // PostgreSQL errors
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique violation
        error.message = 'Duplicate entry found';
        error.statusCode = 400;
        break;
      case '23503': // Foreign key violation
        error.message = 'Referenced record not found';
        error.statusCode = 400;
        break;
      case '42P01': // Undefined table
        error.message = 'Table not found';
        error.statusCode = 400;
        break;
      case '42703': // Undefined column
        error.message = 'Column not found';
        error.statusCode = 400;
        break;
      default:
        error.message = 'Database error occurred';
        error.statusCode = 500;
    }
  }

  // Gemini API errors
  if (err.message && err.message.includes('API key')) {
    error.message = 'AI service configuration error';
    error.statusCode = 500;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};