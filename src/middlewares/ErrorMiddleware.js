const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(`[ERROR] ${err.message}`); // Log interno para el desarrollador

  res.status(statusCode).json({
    status: "error",
    statusCode: statusCode,
    message: err.message || "Ocurrió un error inesperado en el servidor",
  });
}

export default errorHandler;