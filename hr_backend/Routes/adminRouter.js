// 📁 routes/adminRoutes.js
import express from 'express';
import { AllAdminsCon, AdminCon, addAdminCon, deleteAdminCon, updateAdminCon, loginAdminCon } from '../controllers/adminController.js';

const router = express.Router();

router.get('/', AllAdminsCon);
router.get('/:adminId', AdminCon);
router.post('/', addAdminCon);
router.patch('/', updateAdminCon);
router.delete('/:adminId', deleteAdminCon);

// Login route
router.post('/login', loginAdminCon);

export default router;
