function globalErrorHandler(err, req, res, next) {
  console.error("Global Error:", err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message: message
  });
}

module.exports = globalErrorHandler;
