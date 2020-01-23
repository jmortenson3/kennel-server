import { Request, Response, NextFunction } from 'express';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Handling an error: ' + err.error);
  return res.status(err.status || 500).json({
    error: err.error || 'Oops, something went wrong :( ',
  });
};

export default errorHandler;
