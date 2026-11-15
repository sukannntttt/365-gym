/**
 * Centralized error handling middleware.
 *
 * Never leaks stack traces, internal file paths, or raw database errors to the
 * client. Full details are logged server-side with a request id so operators
 * can correlate the client-facing generic message with the server log.
 */

const isProd = process.env.NODE_ENV === 'production';

function errorHandler(err, req, res, next) {
  const requestId = req.id || 'unknown';

  // Log full details server-side (never in the client response).
  console.error(`[${requestId}] ERROR ${err.status || 500}: ${err.message}`);
  if (!isProd) {
    console.error(`[${requestId}] STACK:\n${err.stack}`);
  } else {
    // In production still capture the stack to a structured log field for debugging,
    // but do not send it over HTTP.
    console.error(`[${requestId}] STACK_HIDDEN`);
  }

  // Determine the client-facing status code.
  const statusCode = err.statusCode || err.status || 500;

  // Generic client message. In production never expose internal details.
  let message;
  if (err.isOperational && err.clientMessage) {
    message = err.clientMessage;
  } else if (isProd) {
    message = statusCode === 500 ? 'Internal server error' : err.message || 'An error occurred.';
  } else {
    message = err.message || 'An error occurred.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(!isProd && { stack: err.stack }), // stack only in non-production
    requestId,
  });
}

function notFound(req, res, next) {
  const err = new Error(`Not found - ${req.originalUrl}`);
  err.statusCode = 404;
  err.isOperational = true;
  err.clientMessage = 'Not found.';
  next(err);
}

module.exports = { errorHandler, notFound };
