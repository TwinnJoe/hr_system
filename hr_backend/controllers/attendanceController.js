import { AllAttendances, Attendance, addAttendance, updateAttendance, deleteAttendance } from '../models/attendanceModel.js';

export const AllAttendancesCon = async (req, res) => {
  try {
    const attendances = await AllAttendances();
    res.json(attendances);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
};

export const AttendanceCon = async (req, res) => {
  try {
    const attendance = await Attendance(req.params.attendanceId);
    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch attendance record' });
  }
};

export const addAttendanceCon = async (req, res) => {
  const { employeeId, date, status } = req.body;
  try {
    await addAttendance(employeeId, date, status);
    res.json({ message: 'Attendance added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add attendance record' });
  }
};

export const updateAttendanceCon = async (req, res) => {
  const { date, status, id } = req.body;
  const { employeeId } = req.params;
  
  try {
    await updateAttendance(employeeId, date, status, id);
    res.json({ message: 'Attendance updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update attendance record' });
  }
};

export const deleteAttendanceCon = async (req, res) => {
  try {
    await deleteAttendance(req.params.id);
    res.json({ message: 'Attendance deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete attendance record' });
  }
};
