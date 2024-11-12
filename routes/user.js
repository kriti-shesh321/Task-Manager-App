import express from 'express';
import authenticate from '../middleware/authMiddleware.js';
import { signUp, login, userDetail, updateUser, deleteUser } from '../controllers/userControllers.js';

const router = express.Router();

// unprotected routes
router.post('/signup', signUp);
router.post('/login', login);

// protected routes
// get logged in user details
router.get('/user-detail', authenticate, userDetail,);
// update logged in user details
router.put('/user-detail', authenticate, updateUser);
// delete user
router.delete('/user-detail', authenticate, deleteUser);

export default router;