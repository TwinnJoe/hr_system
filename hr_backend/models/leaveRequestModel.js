import pool from '../config/config.js';

export const AllLeaveRequests = async () => {
  const [rows] = await pool.query('SELECT * FROM leave_requests');
  return rows;
};

export const LeaveRequest = async (id) => {
  const [rows] = await pool.query('SELECT * FROM leave_requests WHERE id = ?', [id]);
  return rows[0];
};

export const addLeaveRequest = async (employeeId, date, reason, status) => {
  await pool.query(
    'INSERT INTO leave_requests (employeeId, date, reason, status) VALUES (?, ?, ?, ?)',
    [employeeId, date, reason, status]
  );
};

export const updateLeaveRequest = async (employeeId, date, reason, status, id) => {
  const sql = `
    UPDATE leave_requests SET status = ?, date = ?, reason = ? WHERE id = ? AND employeeId = ?
  `;
  await pool.query(sql,[status, date, reason, id, employeeId]);
};

export const deleteLeaveRequest = async (requestId) => {
  await pool.query('DELETE FROM leave_requests WHERE requestId = ?', [requestId]);
};
