// 📁 routes/employeeRoutes.js
import express from 'express';
import { AllEmployeesCon, EmployeeCon, addEmployeeCon, deleteEmployeeCon, updateEmployeeCon } from '../controllers/employeeController.js';

const router = express.Router();

router.get('/', AllEmployeesCon);
router.get('/:employeeId', EmployeeCon);
router.post('/', addEmployeeCon);
router.patch('/:employeeId', updateEmployeeCon);
router.delete('/:employeeId', deleteEmployeeCon);

export default router;