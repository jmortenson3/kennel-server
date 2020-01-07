const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');
const https = require('https');
const port = process.env.PORT || 3001;
const { errorHandler } = require('./handlers/error');
const routes = require('./routes');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));
app.use(routes);
app.use(errorHandler);

app.use((req, res, next) => {
  res.status(404).json({ message: "there's nothing here :(" });
});

https
  .createServer(
    {
      key: fs.readFileSync('server.key'),
      cert: fs.readFileSync('server.cert'),
    },
    app
  )
  .listen(port, () => {
    console.log(`App running securely on port ${port}`);
  });
