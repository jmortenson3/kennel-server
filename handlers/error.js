exports.errorHandler = (err, req, res, next) => {
  console.log('Handling an error: ' + err.error);
  return res.status(err.status || 500).json({
    error: err.error || 'Oops, something went wrong :( ',
  });
};
