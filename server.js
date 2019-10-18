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
const {
  getOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} = require('./handlers/organizations');
const {
  createAppointment,
  deleteAppointment,
  getAppointment,
  getAppointments,
  getAppointmentsByBranch,
  getAppointmentsByOrganization,
  updateAppointment,
} = require('./handlers/appointments');
const {
  createMembership,
  deleteMembership,
  getMembership,
  updateMembership,
} = require('./handlers/organizationMemberships');
const { login, signup, recallUser, logout } = require('./handlers/auth');

const app = express();
app.use(express.json());

//
// Data Hierarchy
//
// Organizations - one to many with Branches
// Branches - one to many with Appointments
// Appointments - on to many with Pets (as long as same owner)
// Owner - one to many with Appointments
// Owner - one to many with Pets

// auth
app.post('/api/auth/login', login);
app.post('/api/auth/signup', signup);
app.post('/api/auth/recall', recallUser);
app.get('/api/auth/logout', logout);

// appointments
app.post('/api/branches/:branch_id/appointments', createAppointment);
app.get('/api/appointments', getAppointments);
app.get('/api/appointments/:appointment_id', getAppointment);
app.get('/api/branches/:branch_id/appointments', getAppointmentsByBranch);
app.get(
  '/api/organizations/:organization_id/appointments',
  getAppointmentsByOrganization
);
app.put('/api/appointments/:appointment_id', updateAppointment);
app.delete('/apit/appointments/:appointment_id', deleteAppointment);

// memberships
app.get('/api/organizations/:organization_id/users', getMembership);
app.post('/api/organizations/:organization_id/users', createMembership);
app.put('/api/organizations/:organization_id/users', updateMembership);
app.delete('/api/organizations/:organization_id/users', deleteMembership);

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
app.post('/api/organizations/:organization_id/branches', createBranch);
app.put('/api/branches/:branch_id', updateBranch);
app.delete('/api/branches/:branch_id', deleteBranch);

// organizations
app.get('/api/organizations/:organization_id', getOrganization);
app.post('/api/organizations', createOrganization);
app.put('/api/organizations/:organization_id', updateOrganization);
app.delete('/api/organizations/:organization_id', deleteOrganization);

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
