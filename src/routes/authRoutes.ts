import { Router } from 'express';
import { register } from '../controllers/authController.js';

const router = Router();

// POST /api/v1/iam/auth/register
router.post('/register', register);

export default router;
