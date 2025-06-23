import {
  AllLeaveRequests,
  LeaveRequest,
  addLeaveRequest,
  updateLeaveRequest,
  deleteLeaveRequest,
} from '../models/leaveRequestModel.js';

export const AllLeaveRequestsCon = async (req, res) => {
  try {
    const leaveRequests = await AllLeaveRequests();
    res.json(leaveRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch leave requests' });
  }
};

export const LeaveRequestCon = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest(req.params.requestId);
    res.json(leaveRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch leave request' });
  }
};

export const addLeaveRequestCon = async (req, res) => {
  const { employeeId, date, reason, status } = req.body;
  try {
    await addLeaveRequest(employeeId, date, reason, status);
    res.json({ message: 'Leave request added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add leave request' });
  }
};

export const updateLeaveRequestCon = async (req, res) => {
  const { date, reason, status, id } = req.body;
  const { employeeId } = req.params;
  try {
    await updateLeaveRequest(employeeId, date, reason, status, id);
    res.json({ message: 'Leave request updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update leave request' });
  }
};

export const deleteLeaveRequestCon = async (req, res) => {
  try {
    await deleteLeaveRequest(req.params.id);
    res.json({ message: 'Leave request deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete leave request' });
  }
};
