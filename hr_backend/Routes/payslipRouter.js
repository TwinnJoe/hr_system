import express from 'express';
import { sendPayslip } from '../controllers/payslipController.js';

const router = express.Router();

router.post('/send', sendPayslip);

export default router;
