<template>
  <div class="dashboard">
    <div v-if="notification.visible" :class="['toast', notification.type]">
      <p>{{ notification.message }}</p>
    </div>
    <div class="wrapper">
      <header>
        <Navbar />
      </header>

      <main :class="{ 'main-expanded': !navVisible }">
        <section class="stats-cards">
          <div class="card" v-for="(stat, index) in stats" :key="index">
            <h3>{{ stat.title }}</h3>
            <p>{{ stat.value }}</p>
            <p class="growth" :class="getGrowthClass(stat.growth)">
              {{ stat.growth }}
            </p>
          </div>
        </section>

        <section class="job-statistics">
          <h2>Job Statistics</h2>
          <div class="chart">
            <canvas id="jobStatsChart"></canvas>
          </div>
        </section>

        <section class="employee-status">
          <div class="section-header">
            <h2>Employee Data</h2>
            <button class="btn-add" @click="openAddModal">Add Employee</button>
          </div>
          <div class="table-container">
            <table v-if="employees && employees.length > 0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Department</th>
                  <th>Salary</th>
                  <th>History</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="employee in employees" :key="employee.employeeId">
                  <td>{{ employee.employeeId }}</td>
                  <td>{{ employee.name }}</td>
                  <td>{{ employee.position }}</td>
                  <td>{{ employee.department }}</td>
                  <td>${{ formatSalary(employee.salary) }}</td>
                  <td>{{ employee.employmentHistory }}</td>
                  <td>{{ employee.contact }}</td>
                  <td class="actions">
                    <button class="btn-edit" @click="openEditModal(employee)">Update</button>
                    <button class="btn-delete" @click="removeEmployee(employee.employeeId)">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Modal -->
            <div v-if="showModal" class="modal-overlay">
              <div class="modal-content">
                <h3>{{ formMode === 'add' ? 'Add Employee' : 'Edit Employee' }}</h3>
                <form @submit.prevent="submitForm">
                  <div class="form-group">
                    <input v-model="employeeForm.name" placeholder="Name" required />
                  </div>
                  <div class="form-group">
                    <input v-model="employeeForm.position" placeholder="Position" required />
                  </div>
                  <div class="form-group">
                    <input v-model="employeeForm.department" placeholder="Department" required />
                  </div>
                  <div class="form-group">
                    <input v-model="employeeForm.salary" type="number" placeholder="Salary" required />
                  </div>
                  <div class="form-group">
                    <input v-model="employeeForm.employmentHistory" placeholder="Employment History" required />
                  </div>
                  <div class="form-group">
                    <input v-model="employeeForm.contact" placeholder="Contact" required />
                  </div>
                  <div class="form-actions">
                    <button type="submit" class="btn-submit">{{ formMode === 'add' ? 'Add' : 'Update' }}</button>
                    <button type="button" class="btn-cancel" @click="showModal = false">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section class="employee-composition">
          <h2>Employee Composition</h2>
          <div class="chart">
            <canvas id="employeeCompositionChart"></canvas>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/NavBar.vue";
import { mapActions, mapState } from 'vuex';
import Chart from "chart.js/auto";

export default {
  name: "DashboardComp",
  components: {
    Navbar,
  },
  data() {
    return {
      jobPosts: [50, 30, 40, 25, 15],
      navVisible: false,
      showModal: false,
      formMode: 'add',
      employeeForm: {
        name: '',
        position: '',
        department: '',
        salary: '',
        employmentHistory: '',
        contact: ''
      },
      notification: {
        visible: false,
        message: '',
        type: 'success' // 'success' | 'error' | 'info'
      }
    };
  },
  computed: {
    ...mapState(['employees', 'payroll']),
    stats() {
      const payroll = this.payroll || [];
      const total = this.payroll?.length;
      const performanceCounts = payroll.reduce((acc, curr) => {
        const key = (curr.performance || '').toLowerCase();
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      const statsArray = [
        { title: "Total Employees", value: total, growth: "100%" },
        ...Object.entries(performanceCounts).map(([key, count]) => ({
          title: `${key.charAt(0).toUpperCase() + key.slice(1)} Performance`,
          value: count,
          growth: total ? `${Math.round((count / total) * 100)}%` : "0%"
        })),
      ].sort((a, b) => b.value - a.value);

      return statsArray;
    },
  },
  methods: {
    ...mapActions(['AllEmployees', 'AllPayroll', 'addEmployee', 'updateEmployee', 'deleteEmployee']),

    formatSalary(value) {
      return new Intl.NumberFormat('en-US').format(value);
    },

    getGrowthClass(growth) {
      const value = parseFloat(growth);
      if (isNaN(value)) return '';
      if (value === 100) return 'total';
      if (value >= 50) return 'excellent';
      if (value >= 30) return 'good';
      return 'bad';
    },
    openAddModal() {
      this.formMode = 'add';
      this.employeeForm = {
        employeeId: '',
        name: '',
        position: '',
        department: '',
        salary: '',
        employmentHistory: '',
        contact: ''
      };
      this.showModal = true;
    },
    openEditModal(employee) {
      this.formMode = 'edit';
      this.employeeForm = { ...employee }; // copy values into form
      this.showModal = true;
    },
    removeEmployee(employeeId) {
      // Call Vuex action or axios API to delete from DB
      this.$store.dispatch('deleteEmployee', employeeId).then(() => {
        this.showNotification('Employee Deleted Successfully');
        this.AllEmployees(); // Refresh the list
      });
    },
    submitForm() {
      if (this.formMode === 'add') {
        this.$store.dispatch('addEmployee', this.employeeForm).then(() => {
          this.showModal = false;
          this.showNotification('Employee added Successfully');
          this.AllEmployees(); // Refresh the list
        });
      } else {
        this.$store.dispatch('updateEmployee', this.employeeForm).then(() => {
          this.showModal = false;
          this.showNotification('Employee Updated Successfully');
          this.AllEmployees(); // Refresh the list
        });
      }
    },
    showNotification(message, type = 'success') {
      this.notification.message = message;
      this.notification.type = type;
      this.notification.visible = true;
      setTimeout(() => {
        this.notification.visible = false;
      }, 2000);
    },

    handleKeydown(e) {
      if (e.key === "Escape" && this.navVisible) {
        this.closeNav();
      }
    },
  },
  created() {
    this.AllEmployees();
    this.AllPayroll();
  },
  mounted() {
    const total = this.jobPosts.reduce((sum, num) => sum + num, 0);
    const jobStatsCtx = document
      .getElementById("jobStatsChart")
      .getContext("2d");
    new Chart(jobStatsCtx, {
      type: "bar",
      data: {
        labels: ["Engineering", "Design", "Marketing", "Sales", "HR"],
        datasets: [
          {
            label: `Total Jobs Posted: ${total}`,
            data: this.jobPosts,
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
        },
      },
    });

    const employeeCompositionCtx = document
      .getElementById("employeeCompositionChart")
      .getContext("2d");
    new Chart(employeeCompositionCtx, {
      type: "pie",
      data: {
        labels: ["Engineering", "HR", "Design", "Marketing", "Sales"],
        datasets: [
          {
            label: "Employee Composition",
            data: [30, 10, 25, 20, 15],
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
        },
      },
    });
  },
};
</script>

<style scoped>
/* ========== BASE STYLES ========== */
.dashboard {
  min-height: 100vh;
  color: #2d3748;
}

.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ========== TOAST NOTIFICATIONS ========== */
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  font-size: 0.95rem;
  animation: fadeSlideIn 0.3s ease-out;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 90%;
}

.toast p {
  margin: 0;
  font-weight: 500;
}

.toast.success {
  background-color: #48bb78;
  color: white;
}

.toast.error {
  background-color: #f56565;
  color: white;
}

.toast.info {
  background-color: #4299e1;
  color: white;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

/* ========== MAIN CONTENT ========== */
main {
  flex-grow: 1;
  padding: 2rem;
  transition: margin-left 0.3s ease;
  box-sizing: border-box;
  max-width: 1200px;
  width: 100%;
}

.main-expanded {
  margin: 0 auto;
}

/* ========== SECTION HEADERS ========== */
section {
  margin-bottom: 2.5rem;
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.5rem;
}

h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background-color: #4299e1;
  border-radius: 3px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

/* ========== STATS CARDS ========== */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.card h3 {
  font-size: 1rem;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.card p {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0.5rem 0;
}

.card .growth {
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 0.5rem;
}

.card .growth.total {
  color: #4299e1;
}

.card .growth.excellent {
  color: #48bb78;
}

.card .growth.good {
  color: #f6ad55;
}

.card .growth.bad {
  color: #f56565;
}

/* ========== CHARTS ========== */
.chart {
  background: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  height: 400px;
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  margin-bottom: 1rem;
}

.chart canvas {
  width: 100% !important;
  height: 100% !important;
  max-height: 100% !important;
  object-fit: contain;
}

/* ========== BUTTONS ========== */
button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-add {
  background-color: #4169e1;
  color: white;
}

.btn-add:hover {
  background-color: #3182ce;
  transform: translateY(-1px);
}

.btn-edit {
  background-color: #28a745;
  color: white;
  margin-right: 0.5rem;
}

.btn-edit:hover {
  background-color: #48bb78;
}

.btn-delete {
  background-color: #8a8a8a;
  color: white;
}

.btn-delete:hover {
  background-color: #333;
}

.btn-submit {
  background-color: #28a745;
  color: white;
}

.btn-submit:hover {
  background-color: #48bb78;
}

.btn-cancel {
  background-color: #8a8a8a;
  color: white;
}

.btn-cancel:hover {
  background-color: #333;
}

/* ========== MODALS ========== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  backdrop-filter: blur(2px);
}

.modal-content {
  background-color: #fff;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-content h3 {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  color: #2d3748;
  text-align: center;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-group input {
  width: 100%;
  padding: 0.8rem 1rem;
  font-size: 0.95rem;
  border-radius: 6px;
  border: 1px solid #cbd5e0;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-top: 1.5rem;
}

/* ========== EMPLOYEE TABLE ========== */
.table-container {
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  background-color: #ffffff;
  margin-top: 1rem;
  position: relative;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  color: #4a5568;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

thead th {
  position: sticky;
  top: 0;
  background-color: #f7fafc;
  color: #2d3748;
  font-weight: 600;
  z-index: 1;
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.05);
}

tbody tr:nth-child(even) {
  background-color: #f8fafc;
}

tbody tr:hover {
  background-color: #ebf8ff;
}

.actions {
  white-space: nowrap;
}

/* ========== MEDIA QUERIES ========== */
@media (max-width: 1024px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  main {
    padding: 1.5rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .btn-add {
    width: 100%;
  }

  .modal-content {
    width: 95%;
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }

  .chart {
    height: 300px;
  }

  th, td {
    padding: 0.8rem 0.5rem;
    font-size: 0.85rem;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .btn-edit, .btn-delete {
    margin-right: 0;
    width: 100%;
  }
}
</style>