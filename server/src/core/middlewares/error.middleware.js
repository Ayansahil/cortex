export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message),
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry',
      field: Object.keys(err.keyPattern)[0],
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';

  if (statusCode === 429 && typeof message === 'string' && message.includes('quota')) {
    message = 'AI service quota exceeded. Please contact the administrator or try again later.';
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};
