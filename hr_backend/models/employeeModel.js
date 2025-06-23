// 📁 models/employeeModel.js
import pool from '../config/config.js';

const AllEmployees = async () => {
  const [rows] = await pool.query('SELECT * FROM employees');
  return rows;
};

const Employee = async (employeeId) => {
  const [rows] = await pool.query('SELECT * FROM employees WHERE employeeId = ?', [employeeId]);
  return rows[0];
};

const addEmployee = async (name, position, salary, contact, department, employmentHistory) => {
  await pool.query(
    'INSERT INTO employees (name, position, salary, contact, department, employmentHistory) VALUES (?, ?, ?, ?, ?, ?)',
    [name, position, salary, contact, department, employmentHistory]
  );
};

const updateEmployee = async (name, position, salary, contact, department, employeeId, employmentHistory) => {
  await pool.query(
    'UPDATE employees SET name = ?, position = ?, salary = ?, contact = ?, department = ?, employmentHistory = ? WHERE employeeId = ?',
    [name, position, salary, contact, department, employmentHistory, employeeId]
  );
};

const deleteEmployee = async (employeeId) => {
  await pool.query('DELETE FROM employees WHERE employeeId = ?', [employeeId]);
};

export { AllEmployees, Employee, addEmployee, updateEmployee, deleteEmployee };