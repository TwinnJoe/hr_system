import express from 'express';
import {
  AllPayrollsCon,
  PayrollCon,
  addPayrollCon,
  updatePayrollCon,
  deletePayrollCon,
} from '../controllers/payrollController.js';

const router = express.Router();

router.get('/', AllPayrollsCon);
router.get('/:employeeId', PayrollCon);
router.post('/', addPayrollCon);
router.patch('/:employeeId', updatePayrollCon);
router.delete('/:employeeId', deletePayrollCon);

export default router;
