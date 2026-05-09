import express from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate, isOwnerOrAdmin } from '../middleware/auth.middleware';

const router = express.Router();

// GET user profile by ID (protected)
router.get('/:id', authenticate, async (req, res, next) => {
	await userController.getUserProfile(req, res);
});

// UPDATE user profile (owner or admin)
router.put('/:id', authenticate, isOwnerOrAdmin, async (req, res, next) => {
	await userController.updateUserProfile(req, res);
});

// Add a certification to user profile (owner or admin)
router.post('/:id/certifications', authenticate, isOwnerOrAdmin, async (req, res, next) => {
	await userController.addCertification(req, res);
});

// Change user password (owner or admin)
router.put('/:id/password', authenticate, isOwnerOrAdmin, async (req, res, next) => {
	await userController.changePassword(req, res);
});

export default router;