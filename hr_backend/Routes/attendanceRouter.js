import express from 'express';
import {
  AllAttendancesCon,
  AttendanceCon,
  addAttendanceCon,
  updateAttendanceCon,
  deleteAttendanceCon,
} from '../controllers/attendanceController.js';

const router = express.Router();

router.get('/', AllAttendancesCon);
router.get('/:id', AttendanceCon);
router.post('/', addAttendanceCon);
router.patch('/:employeeId', updateAttendanceCon);
router.delete('/:id', deleteAttendanceCon);

export default router;
