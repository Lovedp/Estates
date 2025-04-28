export const errorHandler = (err, req, res, next) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Ensure we have a proper error object
  if (!err || typeof err !== 'object') {
    err = {
      message: String(err),
      statusCode: 500
    };
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const stack = isDevelopment && err.stack ? err.stack : undefined;
  const path = req?.originalUrl || req?.url || 'unknown';

  // Enhanced error logging
  console.error(`[${new Date().toISOString()}] ${req.method} ${path} - Error:`, {
    statusCode,
    message,
    stack: isDevelopment ? stack : 'hidden',
    ...(err.details && { details: err.details }),
    ...(err.code && { code: err.code })
  });

  // Client response
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    path,
    ...(isDevelopment && { stack }),
    ...(err.details && { details: err.details }),
    ...(err.code && { code: err.code }),
    timestamp: new Date().toISOString()
  });
};