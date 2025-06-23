// 📁 controllers/employeeController.js
import { AllEmployees, Employee, addEmployee, updateEmployee, deleteEmployee } from '../models/employeeModel.js';

const AllEmployeesCon = async (req, res) => {
  try {
    res.json(await AllEmployees());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch employees' });
  }
};

const EmployeeCon = async (req, res) => {
  try {
    res.json(await Employee(req.params.employeeId));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch employee' });
  }
};

const addEmployeeCon = async (req, res) => {
  let { name, position, salary, contact, department, employmentHistory } = req.body;
  try {
    await addEmployee(name, position, salary, contact, department, employmentHistory);
    res.json({ message: 'Employee added successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to add employee' });
  }
};

const deleteEmployeeCon = async (req, res) => {
  try {
    await deleteEmployee(req.params.employeeId);
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to delete employee' });
  }
};

const updateEmployeeCon = async (req, res) => {
  const { employeeId } = req.params;
  const { name, position, salary, contact, department, employmentHistory } = req.body;
  try {
    await updateEmployee(name, position, salary, contact, department, employeeId, employmentHistory);
    res.json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to update employee' });
  }
};

export { AllEmployeesCon, EmployeeCon, addEmployeeCon, deleteEmployeeCon, updateEmployeeCon };
