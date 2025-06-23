import pool from '../config/config.js';

export const AllAttendances = async () => {
  const [rows] = await pool.query('SELECT * FROM attendance');
  return rows;
};

export const Attendance = async (attendanceId) => {
  const [rows] = await pool.query('SELECT * FROM attendance WHERE attendanceId = ?', [attendanceId]);
  return rows[0];
};

export const addAttendance = async (employeeId, date, status) => {
  await pool.query(
    'INSERT INTO attendance (employeeId, date, status) VALUES (?, ?, ?)',
    [employeeId, date, status]
  );
};

export const updateAttendance = async (employeeId, date, status, id) => {
  const sql = `
    UPDATE attendance
    SET status = ?, date = ?
    WHERE id = ? AND employeeId = ?
  `;
  await pool.query(sql,[status, date, id, employeeId]);
};

export const deleteAttendance = async (id) => {
  await pool.query('DELETE FROM attendance WHERE attendanceId = ?', [id]);
};
