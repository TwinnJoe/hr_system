// 📁 models/adminModel.js
import pool from '../config/config.js';

const AllAdmins = async () => {
  const [data] = await pool.query('SELECT * FROM admin');
  return data;
};

const Admin = async (adminId) => {
  const [data] = await pool.query('SELECT * FROM admin WHERE adminId = ?', [adminId]);
  return data[0];
};

export const getAdminByUsername = async (username) => {
  const [data] = await pool.query('SELECT * FROM admin WHERE username = ?', [username]);
  return data[0];
};

const addAdmin = async (username, password, fullName, email, role) => {
  await pool.query(
    'INSERT INTO admin (username, password, fullName, email, role) VALUES (?, ?, ?, ?, ?)',
    [username, password, fullName, email, role]
  );
};

const updateAdmin = async (username, password, fullName, email, role, adminId) => {
  await pool.query(
    'UPDATE admin SET username = ?, password = ?, fullName = ?, email = ?, role = ? WHERE adminId = ?',
    [username, password, fullName, email, role, adminId]
  );
};

const deleteAdmin = async (adminId) => {
  await pool.query('DELETE FROM admin WHERE adminId = ?', [adminId]);
};

export { AllAdmins, Admin, addAdmin, updateAdmin, deleteAdmin };