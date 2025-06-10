import express from 'express';
import { getMilestones } from '../controllers/milestoneController';
import { isAuthenticated } from '../middlewares/isAuthenticated';

const router = express.Router();

router.get('/', isAuthenticated, getMilestones);

export default router;
