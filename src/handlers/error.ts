import { Request, Response, NextFunction } from 'express';
import { IError } from '../interfaces/IError';

const errorHandler = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Handling an error: ' + err.message);
  console.log(err);
  return res.status(err.statusCode || 500).json({
    error: err.message || 'Oops, something went wrong :( ',
  });
};

export default errorHandler;
