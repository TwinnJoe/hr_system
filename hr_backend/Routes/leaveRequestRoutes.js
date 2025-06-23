import express from 'express';
import {
  AllLeaveRequestsCon,
  LeaveRequestCon,
  addLeaveRequestCon,
  updateLeaveRequestCon,
  deleteLeaveRequestCon,
} from '../controllers/leaveRequestController.js';

const router = express.Router();

router.get('/', AllLeaveRequestsCon);
router.get('/:requestId', LeaveRequestCon);
router.post('/', addLeaveRequestCon);
router.patch('/:employeeId', updateLeaveRequestCon);
router.delete('/:requestId', deleteLeaveRequestCon);

export default router;
