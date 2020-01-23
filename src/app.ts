import express from 'express';
import fs from 'fs';
import cors from 'cors';
import https from 'https';
import cookieParser from 'cookie-parser';

import config from '../config';
import errorHandler from './handlers/error';
import routes from './routes';

const port = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: [config.clientUrl] }));
app.use(routes);
app.use(errorHandler);

app.use((req, res, next) => {
  res.status(404).json({ message: "there's nothing here :(" });
});

https
  .createServer(
    {
      key: fs.readFileSync(`server.key`),
      cert: fs.readFileSync(`server.cert`),
    },
    app
  )
  .listen(port, () => {
    console.log(`App running securely on port ${port}`);
  });
