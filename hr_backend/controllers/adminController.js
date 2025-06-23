// 📁 controllers/adminController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AllAdmins, Admin, addAdmin, updateAdmin, deleteAdmin, getAdminByUsername } from '../models/adminModel.js';

const JWT_SECRET = 'b09468ec194ad88321d71c83d4ff51844a52b288c932c23ad0fe9470859ccc62c244b12cce0b188fd27da28422530db787e99919ae754b031b104a26638281ae';

const AllAdminsCon = async (req, res) => {
  try {
    res.json(await AllAdmins());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch admins' });
  }
};

const AdminCon = async (req, res) => {
  try {
    res.json(await Admin(req.params.adminId));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch admin' });
  }
};

const addAdminCon = async (req, res) => {
  let { username, password, fullName, email, role } = req.body;
  try {
    // hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    await addAdmin(username, hashedPassword, fullName, email, role);
    res.json({ message: 'Admin added successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to add admin' });
  }
};

const deleteAdminCon = async (req, res) => {
  try {
    await deleteAdmin(req.params.adminId);
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to delete admin' });
  }
};

const updateAdminCon = async (req, res) => {
  let { username, password, fullName, email, role, adminId } = req.body;
  try {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    await updateAdmin(username, hashedPassword, fullName, email, role, adminId);
    res.json({ message: 'Admin updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to update admin' });
  }
};

// LOGIN CONTROLLER
const loginAdminCon = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await getAdminByUsername(username);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { adminId: admin.adminId, username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token, user: { username: admin.username, role: admin.role } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export {
  AllAdminsCon,
  AdminCon,
  addAdminCon,
  deleteAdminCon,
  updateAdminCon,
  loginAdminCon
};
