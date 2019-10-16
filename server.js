const express = require('express');
const fs = require('fs');
const cors = require('cors');
const https = require('https');
const port = process.env.PORT || 3000;
const { errorHandler } = require('./handlers/error');
const { login, signup, recallUser, logout } = require('./handlers/auth');

const app = express();
app.use(express.json());

// auth
app.post('/api/auth/login', login);
app.post('/api/auth/signup', signup);
app.post('/api/auth/recall', recallUser);
app.get('/api/auth/logout', logout);

// ==================
// === Catch 404s ===
// ==================
app.use((req, res, next) => {
  res.status(404).json({ message: "there's nothing here :(" });
});

app.use(errorHandler);

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
