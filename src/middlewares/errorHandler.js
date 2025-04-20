// const errorHandler = (err, req, res, next) => {
//   console.error('Error:', err.message);
//   res.status(err.status || 500).json({
//     status: err.status || 500,
//     message: err.message,
//     data: err.message,
//   });
// };

// export default errorHandler;

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message,
    data: null,
  });
};

export default errorHandler;
