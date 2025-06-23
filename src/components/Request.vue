<template>
  <header>
    <Navbar />
  </header>

  <div class="employee-attendance">
    <h1>Employees</h1>
    <div class="overview">
      <!-- Attendance Section -->
      <div class="attendance-tracker">
        <h2>Attendance</h2>
        <div class="scrollable-table">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(entry, index) in attendanceList" :key="index" :class="{
                present: entry.status === 'Present',
                absent: entry.status === 'Absent'
              }">
                <td>{{ entry.employeeName }}</td>
                <td>{{ formatDate(entry.date) }}</td>
                <td>{{ entry.status }}
                  <span class="attendance-buttons">
                    <button v-if="entry.status !== 'Present'" @click="markPresent(entry)" class="present-btn"
                      :disabled="updatingAttendance" aria-label="Present">
                      {{ updatingAttendance ? 'Updating...' : 'Mark Present' }}
                    </button>
                    <button v-if="entry.status !== 'Absent'" @click="markAbsent(entry)" class="absent-btn"
                      :disabled="updatingAttendance" aria-label="Absent">
                      {{ updatingAttendance ? 'Updating...' : 'Mark Absent' }}
                    </button>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Leave Requests Section -->
      <div class="leave-requests">
        <h2>Leave Requests</h2>
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Dates</th>
                <th>Reason</th>
                <th>Status / Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(request, index) in leaveRequestsWithNames" :key="index">
                <td>{{ request.employeeName }}</td>
                <td>{{ formatDate(request.date) }}</td>
                <td>{{ request.reason }}</td>
                <td>
                  <template v-if="request.status === 'Pending'">
                    <button class="approve-btn" @click="handleLeaveUpdate(request, 'Approved')"
                      :disabled="updatingLeave">
                      {{ updatingLeave ? 'Processing...' : 'Approve' }}
                    </button>
                    <button class="deny-btn" @click="handleLeaveUpdate(request, 'Denied')" :disabled="updatingLeave">
                      {{ updatingLeave ? 'Processing...' : 'Deny' }}
                    </button>
                  </template>
                  <template v-else>
                    <span :class="{ present: request.status === 'Approved', absent: request.status === 'Denied' }">
                      {{ request.status }}
                    </span>
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/NavBar.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "RequestView",
  components: {
    Navbar,
  },
  data() {
    return {
      updatingAttendance: false,
      updatingLeave: false,
    };
  },
  computed: {
    // Use Vuex getters exactly as defined
    ...mapGetters({
      employees: "allEmployees",
      attendance: "allAttendance",
      leaveRequests: "allLeaveRequests",
    }),

    attendanceList() {
      if (!Array.isArray(this.attendance) || !Array.isArray(this.employees)) return [];
      return this.attendance.map((record) => {
        const emp = this.employees.find(
          (e) => String(e.employeeId) === String(record.employeeId)
        );
        return {
          ...record,
          employeeName: emp ? emp.name : "Unknown",
        };
      });
    },

    leaveRequestsWithNames() {
      if (!Array.isArray(this.leaveRequests) || !Array.isArray(this.employees)) return [];
      return this.leaveRequests.map((leave) => {
        const emp = this.employees.find(
          (e) => String(e.employeeId) === String(leave.employeeId)
        );
        return {
          ...leave,
          employeeName: emp ? emp.name : "Unknown",
        };
      });
    },
  },
  methods: {
    ...mapActions([
      "AllEmployees",
      "AllAttendance",
      "AllLeaveRequests",
      "updateAttendance",
      "updateLeaveRequest"
    ]),
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      });
    },
    async markPresent(entry) {
      try {
        this.updatingAttendance = true;
        const updatedEntry = {
          ...entry,
          status: "Present"
        };

        // Call Vuex action to update backend and state
        await this.updateAttendance(updatedEntry);

        // Show success message (optional)
        this.$toast?.success?.('Attendance marked as Present');
      } catch (error) {
        console.error('Error marking present:', error);
        this.$toast?.error?.('Failed to update attendance');
      } finally {
        this.updatingAttendance = false;
      }
    },

    async markAbsent(entry) {
      try {
        this.updatingAttendance = true;
        const updatedEntry = {
          ...entry,
          status: "Absent"
        };

        // Call Vuex action to update backend and state
        await this.updateAttendance(updatedEntry);

        // Show success message (optional)
        this.$toast?.success?.('Attendance marked as Absent');
      } catch (error) {
        console.error('Error marking absent:', error);
        this.$toast?.error?.('Failed to update attendance');
      } finally {
        this.updatingAttendance = false;
      }
    },

    async handleLeaveUpdate(request, status) {
      try {
        this.updatingLeave = true;
        const updatedRequest = {
          ...request,
          status
        };

        // Call Vuex action to update backend and state
        await this.updateLeaveRequest(updatedRequest);

        // Show success message (optional)
        this.$toast?.success?.(`Leave request ${status.toLowerCase()}`);
      } catch (error) {
        console.error('Error updating leave request:', error);
        this.$toast?.error?.('Failed to update leave request');
      } finally {
        this.updatingLeave = false;
      }
    },
  },
  async mounted() {
    try {
      // Load all data on component mount
      await Promise.all([
        this.AllEmployees(),
        this.AllAttendance(),
        this.AllLeaveRequests()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      this.$toast?.error?.('Failed to load employee data');
    }
  },
};
</script>

<style scoped>
/* Base Styles */
.employee-attendance {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.employee-attendance h1 {
  font-size: 2.2rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  font-weight: 600;
  text-align: center;
  position: relative;
  padding-bottom: 0.5rem;
}

.employee-attendance h1::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: #4169e1;
  border-radius: 3px;
}

.employee-attendance h2 {
  font-size: 1.5rem;
  margin-bottom: 1.2rem;
  color: #34495e;
  font-weight: 500;
  padding-left: 0.5rem;
  border-left: 4px solid #4169e1;
}

/* Overview Container */
.overview {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
}

/* Table Containers */
.attendance-tracker,
.leave-requests {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.attendance-tracker:hover,
.leave-requests:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.scrollable-table,
.table-scroll {
  max-height: 400px;
  overflow-y: auto;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  position: relative;
}

/* Table Styles */
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

th {
  position: sticky;
  top: 0;
  background: #f5f7fa;
  padding: 12px 15px;
  text-align: left;
  font-weight: 600;
  color: #4a5568;
  border-bottom: 2px solid #e2e8f0;
}

td {
  padding: 12px 15px;
  border-bottom: 1px solid #edf2f7;
  vertical-align: middle;
}

tr:last-child td {
  border-bottom: none;
}

/* Status Highlighting */
tr.present {
  background-color: #f0fff4;
}

tr.absent {
  background-color: #fff5f5;
}

tr.present td {
  color: #2f855a;
}

tr.absent td {
  color: #c53030;
}

/* Button Styles */
button {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.present-btn {
  background: #38a169;
  color: white;
}

.present-btn:hover:not(:disabled) {
  background: #2f855a;
  transform: translateY(-1px);
}

.absent-btn {
  background: #e53e3e;
  color: white;
}

.absent-btn:hover:not(:disabled) {
  background: #c53030;
  transform: translateY(-1px);
}

.approve-btn {
  background: #3182ce;
  color: white;
  margin-right: 8px;
}

.approve-btn:hover:not(:disabled) {
  background: #2c5282;
  transform: translateY(-1px);
}

.deny-btn {
  background: #718096;
  color: white;
}

.deny-btn:hover:not(:disabled) {
  background: #4a5568;
  transform: translateY(-1px);
}

/* Status Badges */
.present {
  color: #38a169;
  font-weight: 500;
}

.absent {
  color: #e53e3e;
  font-weight: 500;
}

/* Button Container */
.attendance-buttons {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .overview {
    padding: 1rem;
  }

  .attendance-tracker,
  .leave-requests {
    padding: 1rem;
  }

  th,
  td {
    padding: 10px 12px;
    font-size: 0.85rem;
  }

  button {
    padding: 6px 12px;
    min-width: auto;
  }

  .attendance-buttons {
    flex-direction: column;
    gap: 6px;
  }
}

@media (max-width: 480px) {
  .employee-attendance {
    padding: 1rem;
  }

  .employee-attendance h1 {
    font-size: 1.8rem;
  }

  .scrollable-table,
  .table-scroll {
    max-height: 300px;
  }
}
</style>
