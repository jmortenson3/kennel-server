const express = require('express');
const fs = require('fs');
const cors = require('cors');
const https = require('https');
const port = process.env.PORT || 3000;
const { errorHandler } = require('./handlers/error');
const {
  createPet,
  getPet,
  getOwnersPets,
  updatePet,
  deletePet,
} = require('./handlers/pets');
const {
  getBranch,
  getOrganizationsBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} = require('./handlers/branches');
const { login, signup, recallUser, logout } = require('./handlers/auth');

const app = express();
app.use(express.json());

// auth
app.post('/api/auth/login', login);
app.post('/api/auth/signup', signup);
app.post('/api/auth/recall', recallUser);
app.get('/api/auth/logout', logout);

// pets
app.get('/api/pets/:pet_id', getPet);
app.get('/api/users/:user_email/pets', getOwnersPets);
app.post('/api/pets', createPet);
app.put('/api/pets/:pet_id', updatePet);
app.delete('/api/pets/:pet_id', deletePet);

// branches
app.get('/api/branches/branch_id', getBranch);
app.get(
  '/api/organizations/:organization_id/branches',
  getOrganizationsBranches
);
app.post('/api/branches', createBranch);
app.put('/api/branches/:branch_id', updateBranch);
app.delete('/api/branches/:branch_id', deleteBranch);

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
