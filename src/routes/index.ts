import express from 'express';

import { authenticatedRoute } from '../middleware/auth';

const router = express.Router();

router.use('/api/auth', require('./auth'));
router.use('/api/appts', authenticatedRoute, require('./appointments'));
router.use('/api/loc', authenticatedRoute, require('./locations'));
router.use('/api/org', authenticatedRoute, require('./organizations'));
router.use('/api/pets', authenticatedRoute, require('./pets'));
router.use('/api/users', authenticatedRoute, require('./users'));

export default router;
