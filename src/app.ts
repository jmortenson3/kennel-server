import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import config from '../config';
import errorHandler from './handlers/error';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: [config.clientUrl] }));
app.use(routes);
app.use(errorHandler);

app.use((req, res, next) => {
  res.status(404).json({ message: "there's nothing here :(" });
});

export default app;
