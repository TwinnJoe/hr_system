import { createStore } from "vuex";
import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL;

export default createStore({
  state: {
    employees: null,
    attendance: null,
    payroll: null,
    leaveRequests: null,
    admins: null,
    token: localStorage.getItem("token") || null,
    user: null,
  },
  getters: {
    allEmployees: (state) => state.employees,
    allAttendance: (state) => state.attendance,
    allPayroll: (state) => state.payroll,
    allLeaveRequests: (state) => state.leaveRequests,
    allAdmins: (state) => state.admins,
  },
  mutations: {
    setEmployees: (state, data) => (state.employees = data),
    setAttendance: (state, data) => (state.attendance = data),
    setPayroll: (state, data) => (state.payroll = data),
    setLeaveRequests: (state, data) => (state.leaveRequests = data),
    setAdmins: (state, data) => (state.admins = data),
    setUser: (state, user) => (state.user = user),
    setToken: (state, token) => (state.token = token),
  },
  actions: {
    // EMPLOYEES
    async AllEmployees({ commit }) {
      try {
        const res = await fetch("http://localhost:3000/api/employees");
        if (!res.ok) throw new Error("Failed to fetch employees");
        commit("setEmployees", await res.json());
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    },
    async getEmployee(_, employeeId) {
      try {
        const res = await fetch(`http://localhost:3000/api/employees/${employeeId}`);
        if (!res.ok) throw new Error("Failed to fetch employee");
        return await res.json();
      } catch (error) {
        console.error("Error fetching employee:", error);
        throw error;
      }
    },
    async addEmployee({ dispatch }, payload) {
      try {
        await fetch("http://localhost:3000/api/employees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        dispatch("AllEmployees");
      } catch (error) {
        console.error("Error adding employee:", error);
      }
    },
    async updateEmployee({ dispatch }, payload) {
      try {
        await fetch(`http://localhost:3000/api/employees/${payload.employeeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        dispatch("AllEmployees");
      } catch (error) {
        console.error("Error updating employee:", error);
      }
    },
    async deleteEmployee({ dispatch }, employeeId) {
      try {
        await fetch(`http://localhost:3000/api/employees/${employeeId}`, {
          method: "DELETE",
        });
        dispatch("AllEmployees");
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    },

    // ATTENDANCE
    async AllAttendance({ commit }) {
      try {
        const res = await fetch("http://localhost:3000/api/attendance");
        if (!res.ok) throw new Error("Failed to fetch attendance");
        commit("setAttendance", await res.json());
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    },
    async getAttendance(_, employeeId) {
      try {
        const res = await fetch(`http://localhost:3000/api/attendance/${employeeId}`);
        if (!res.ok) throw new Error("Failed to fetch attendance record");
        return await res.json();
      } catch (error) {
        console.error("Error fetching attendance:", error);
        throw error;
      }
    },
    async addAttendance({ dispatch }, payload) {
      try {
        await fetch("http://localhost:3000/api/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        dispatch("AllAttendance");
      } catch (error) {
        console.error("Error adding attendance:", error);
      }
    },
    async updateAttendance({ dispatch }, payload) {
      try {
        // Format the date before sending
    const formattedPayload = {
      ...payload,
      date: new Date(payload.date).toISOString().slice(0, 10), // 'YYYY-MM-DD'
    };
        await fetch(`http://localhost:3000/api/attendance/${payload.employeeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedPayload),
        });
        dispatch("AllAttendance");
      } catch (error) {
        console.error("Error updating attendance:", error);
      }
    },
    async deleteAttendance({ dispatch }, employeeId) {
      try {
        await fetch(`http://localhost:3000/api/attendance/${employeeId}`, {
          method: "DELETE",
        });
        dispatch("AllAttendance");
      } catch (error) {
        console.error("Error deleting attendance:", error);
      }
    },

    // PAYROLL
    async AllPayroll({ commit }) {
      try {
        const res = await fetch("http://localhost:3000/api/payroll");
        if (!res.ok) throw new Error("Failed to fetch payroll");
        commit("setPayroll", await res.json());
      } catch (error) {
        console.error("Error fetching payroll:", error);
      }
    },
    async getPayroll(_, employeeId) {
      try {
        const res = await fetch(`http://localhost:3000/api/payroll/${employeeId}`);
        if (!res.ok) throw new Error("Failed to fetch payroll record");
        return await res.json();
      } catch (error) {
        console.error("Error fetching payroll:", error);
        throw error;
      }
    },
    async addPayroll({ dispatch }, payload) {
      try {
        await fetch("http://localhost:3000/api/payroll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        dispatch("AllPayroll");
      } catch (error) {
        console.error("Error adding payroll:", error);
      }
    },
    async updatePayroll({ dispatch }, payload) {
      try {
        await fetch(`http://localhost:3000/api/payroll/${payload.employeeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        dispatch("AllPayroll");
      } catch (error) {
        console.error("Error updating payroll:", error);
      }
    },
    async deletePayroll({ dispatch }, employeeId) {
      try {
        await fetch(`http://localhost:3000/api/payroll/${employeeId}`, {
          method: "DELETE",
        });
        dispatch("AllPayroll");
      } catch (error) {
        console.error("Error deleting payroll:", error);
      }
    },
    async sendPayslip(_, payload) {
  try {
    const res = await axios.post("http://localhost:3000/api/payslip/send", payload);
    return res.data;
  } catch (error) {
    console.error("Error sending payslip:", error);
    throw error;
  }
},

    // LEAVE REQUESTS
    async AllLeaveRequests({ commit }) {
      try {
        const res = await fetch("http://localhost:3000/api/leave_requests");
        if (!res.ok) throw new Error("Failed to fetch leave requests");
        commit("setLeaveRequests", await res.json());
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      }
    },
    async getLeaveRequest(_, id) {
      try {
        const res = await fetch(`http://localhost:3000/api/leave_requests/${id}`);
        if (!res.ok) throw new Error("Failed to fetch leave request");
        return await res.json();
      } catch (error) {
        console.error("Error fetching leave request:", error);
        throw error;
      }
    },
    async addLeaveRequest({ dispatch }, payload) {
      try {
        await fetch("http://localhost:3000/api/leave_requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        dispatch("AllLeaveRequests");
      } catch (error) {
        console.error("Error adding leave request:", error);
      }
    },
    async updateLeaveRequest({ dispatch }, payload) {
      try {
         // Format the date before sending
    const formattedPayload = {
      ...payload,
      date: new Date(payload.date).toISOString().slice(0, 10), // 'YYYY-MM-DD'
    };
        await fetch(`http://localhost:3000/api/leave_requests/${payload.employeeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedPayload),
        });
        dispatch("AllLeaveRequests");
      } catch (error) {
        console.error("Error updating leave request:", error);
      }
    },
    async deleteLeaveRequest({ dispatch }, id) {
      try {
        await fetch(`http://localhost:3000/leave_requests/${id}`, {
          method: "DELETE",
        });
        dispatch("AllLeaveRequests");
      } catch (error) {
        console.error("Error deleting leave request:", error);
      }
    },

    // ADMINS
    async AllAdmins({ commit }) {
      try {
        const res = await fetch("http://localhost:3000/api/admin");
        if (!res.ok) throw new Error("Failed to fetch admins");
        commit("setAdmins", await res.json());
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    },
    async getAdmin(_, adminId) {
      try {
        const res = await fetch(`http://localhost:3000/api/admin/${adminId}`);
        if (!res.ok) throw new Error("Failed to fetch admin");
        return await res.json();
      } catch (error) {
        console.error("Error fetching admin:", error);
        throw error;
      }
    },
    async addAdmin({ dispatch }, payload) {
      try {
        await fetch("http://localhost:3000/api/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        dispatch("AllAdmins");
      } catch (error) {
        console.error("Error adding admin:", error);
      }
    },
    async updateAdmin({ dispatch }, payload) {
      try {
        await fetch(`http://localhost:3000/api/admin/${payload.adminId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        dispatch("AllAdmins");
      } catch (error) {
        console.error("Error updating admin:", error);
      }
    },
    async deleteAdmin({ dispatch }, adminId) {
      try {
        await fetch(`http://localhost:3000/api/admin/${adminId}`, {
          method: "DELETE",
        });
        dispatch("AllAdmins");
      } catch (error) {
        console.error("Error deleting admin:", error);
      }
    },

    // AUTH
    async loginUser({ commit }, credentials) {
      try {
        const res = await axios.post("http://localhost:3000/api/admin/login", credentials);
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        commit("setToken", token);
        commit("setUser", user);
      } catch (error) {
        console.error("Error logging in", error);
        throw new Error("Invalid credentials");
      }
    },
    logoutUser({ commit }) {
      localStorage.removeItem("token");
      commit("setToken", null);
      commit("setUser", null);
    },
  },
  modules: {},
});
