import { Router } from 'express';
import { getMembershipOptions, createMembership, updateMembership, deleteMembership } from '../controllers/membershipController';

const router = Router();

// Route to get all membership options
router.get('/', getMembershipOptions);

// Route to create a new membership
router.post('/', createMembership);

// Route to update an existing membership
router.put('/:id', updateMembership);

// Route to delete a membership
router.delete('/:id', deleteMembership);

export default router;