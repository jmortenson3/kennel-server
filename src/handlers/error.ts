import { Request, Response, NextFunction } from 'express';
import { IError } from '../interfaces/IError';

const errorHandler = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message, statusCode } = err;
  console.log(`Handling a ${statusCode} error: ${message}`);
  return res.status(statusCode || 500).json({
    error: message || 'Oops, something went wrong :( ',
  });
};

export default errorHandler;
