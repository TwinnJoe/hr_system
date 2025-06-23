import { AllPayrolls, Payroll, addPayroll, updatePayroll, deletePayroll } from '../models/payrollModel.js';

export const AllPayrollsCon = async (req, res) => {
  try {
    const payrolls = await AllPayrolls();
    res.json(payrolls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch payrolls' });
  }
};

export const PayrollCon = async (req, res) => {
  try {
    const payroll = await Payroll(req.params.payrollId);
    res.json(payroll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch payroll' });
  }
};

export const addPayrollCon = async (req, res) => {
  const { employeeId, hoursWorked, leaveDeductions, salary, performance } = req.body;
  try {
    await addPayroll(employeeId, hoursWorked, leaveDeductions, salary, performance);
    res.json({ message: 'Payroll added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add payroll' });
  }
};

export const updatePayrollCon = async (req, res) => {
  const { employeeId } = req.params;
  const { hoursWorked, leaveDeductions, salary, performance } = req.body;
  try {
    await updatePayroll(employeeId, hoursWorked, leaveDeductions, salary, performance);
    res.json({ message: 'Payroll updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update payroll' });
  }
};

export const deletePayrollCon = async (req, res) => {
  try {
    await deletePayroll(req.params.employeeId);
    res.json({ message: 'Payroll deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete payroll' });
  }
};
