const express = require('express');
const router = express.Router();

router.use('/api/auth', require('./auth'));
router.use('/api/appts', require('./appointments'));
router.use('/api/loc', require('./locations'));
router.use('/api/org', require('./organizations'));
router.use('/api/pets', require('./pets'));
router.use('/api/users', require('./users'));

module.exports = router;
