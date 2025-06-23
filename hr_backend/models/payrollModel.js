import pool from '../config/config.js';

const AllPayrolls = async () => {
  const [rows] = await pool.query('SELECT * FROM payroll');
  return rows;
};

const Payroll = async (employeeId) => {
  const [rows] = await pool.query('SELECT * FROM payroll WHERE employeeId = ?', [employeeId]);
  return rows[0];
};

const addPayroll = async (employeeId, hoursWorked, leaveDeductions, salary, performance) => {
  await pool.query(
    'INSERT INTO payroll (employeeId, hoursWorked, leaveDeductions, salary, performance) VALUES (?, ?, ?, ?, ?)',
    [employeeId, hoursWorked, leaveDeductions, salary, performance]
  );
};

const updatePayroll = async (employeeId, hoursWorked, leaveDeductions, salary, performance) => {
  await pool.query(
    'UPDATE payroll SET hoursWorked = ?, leaveDeductions = ?, salary = ?, performance = ? WHERE employeeId = ?',
    [hoursWorked, leaveDeductions, salary, performance, employeeId]
  );
};

const deletePayroll = async (employeeId) => {
  await pool.query('DELETE FROM payroll WHERE employeeId = ?', [employeeId]);
};

export { AllPayrolls, Payroll, addPayroll, updatePayroll, deletePayroll };