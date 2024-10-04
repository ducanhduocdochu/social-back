import { Router } from 'express';
import testController from '../controllers/test.controller';
import asyncHandler from '../helpers/asyncHandler';

const router = Router();

// Register
router.get('/', asyncHandler(testController.test));

export default router;
