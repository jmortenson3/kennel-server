const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const appointmentRoutes = require('./appointments');
const locationRoutes = require('./locations');
const organizationRoutes = require('./organizations');
const petRoutes = require('./pets');

/*

=== AUTH ===
POST /api/auth/login
POST /api/auth/signup
POST /api/auth/recall

=== APPOINTMENTS ===
POST /api/appts { loc_id: '123' }
GET /api/appts?loc_id='123'
GET /api/appts?org_id='123'
GET /api/appts?user_id='123'
GET /api/appts/:id
PUT /api/appts/:id

=== LOCATIONS ===
POST /api/loc  { org_id: '123' }
GET /api/loc?org_id='123'
PUT /api/loc/:id
GET /api/loc/:id

=== ORGANIZATIONS ===
POST /api/orgs
GET /api/orgs
GET /api/orgs/:id
PUT /api/orgs/:id

=== USERS ===  (created with post /api/auth/signup)
GET /api/users
GET /api/users/:id
PUT /api/users/:id
GET /api/users?org_id='123'

=== PETS ===
GET /api/pets
GET /api/pets?user_id='123'
POST /api/pets
PUT /api/pets/:id
DELETE /api/pets/:id

*/

router.use('/api/auth', authRoutes);
router.use('/api/appts', appointmentRoutes);
router.use('/api/loc', locationRoutes);
router.use('/api/org', organizationRoutes);
router.use('/api/pets', petRoutes);
