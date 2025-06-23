<template>
  <header>
    <Navbar />
  </header>
  <div class="container">
    <!-- Notification Toast -->
    <div v-if="notification.visible" :class="['toast', notification.type]">
      <p>{{ notification.message }}</p>
    </div>

    <h1>Payroll</h1>

    <div class="action-row">
      <button class="btn-add" @click="showAddModal = true">Add Payroll</button>
    </div>

    <div class="grid-container">
      <div class="grid-item" v-for="employee in combinedData" :key="employee.employeeId">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title">{{ employee.name }}</h3>
            <p class="card-text">Employee ID: {{ employee.employeeId }}</p>
            <p>Work-Hours: {{ employee.hoursWorked }}</p>
            <p>Leave-Deduction: {{ employee.leaveDeductions }}%</p>
            <p>Salary: {{ formatCurrency(employee.salary) }}</p>
            <p>Performance: {{ employee.performance }}</p>
            <button class="btn btn--primary" @click="showPayslip(employee)">
              Process Payslip
            </button>
            <div class="card-button">
              <button class="btn btn--success" @click="editPayroll(employee)">Edit</button>
              <button class="btn btn--danger" @click="deletePayroll(employee.employeeId)">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Process Payslip Modal -->
    <div class="modal modal--process" v-if="showPayslipModal && selectedEmployee">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title"><strong>{{ selectedEmployee.employeeId }}</strong></h2>
          </div>
          <div class="modal-body">
            <div class="payslip">
              <ul class="list-group">
                <li class="list-group-item"><strong>Employee:</strong> {{ selectedEmployee.name }}</li>
                <li class="list-group-item"><strong>Position:</strong> {{ selectedEmployee.department }}</li>
                <li class="list-group-item"><strong>Base Salary:</strong> {{ formatCurrency(selectedEmployee.salary) }}
                </li>
                <li class="list-group-item" v-if="calculateOvertimePay(selectedEmployee) > 0">
                  <strong>Overtime Pay ({{ selectedEmployee.hoursWorked - 160 }} hrs × {{ formatCurrency(hourlyRate)
                    }}):</strong>
                  {{ formatCurrency(calculateOvertimePay(selectedEmployee)) }}
                </li>
                <li class="list-group-item" v-if="calculatePerformanceBonus(selectedEmployee) > 0">
                  <strong>Performance Bonus ({{ selectedEmployee.performance }}):</strong>
                  {{ formatCurrency(calculatePerformanceBonus(selectedEmployee)) }}
                </li>
                <li class="list-group-item text-success">
                  <strong>Gross Monthly Salary:</strong>
                  {{ formatCurrency(calculateMonthlySalary(selectedEmployee)) }}
                </li>
                <li class="list-group-item text-danger">
                  <strong>Leave Deductions ({{ selectedEmployee.leaveDeductions }}%):</strong>
                  -{{ formatCurrency((selectedEmployee.leaveDeductions / 100) *
                    calculateMonthlySalary(selectedEmployee)) }}
                </li>
                <li class="list-group-item text-primary">
                  <strong>Net Salary After Deductions:</strong>
                  {{ formatCurrency(salaryAfterDeduction(selectedEmployee)) }}
                </li>
                <li class="list-group-item">
                  <strong>Annual Salary:</strong>
                  {{ formatCurrency(calculateAnnualSalary(selectedEmployee)) }}
                </li>
              </ul>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn--success" @click="sendPayslipByEmail(selectedEmployee)">Send to Email</button>
            <button class="btn btn--secondary" @click="closeModals">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Payroll Modal -->
    <div class="modal modal--add" v-if="showAddModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">Add Payroll</h2>
            <button @click="showAddModal = false" class="close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addPayroll">
              <div class="form-group">
                <label for="employee">Select Employee</label>
                <select id="employee" v-model="newPayroll.employeeId" required>
                  <option value="" disabled>Select an employee</option>
                  <option v-for="emp in allEmployees" :key="emp.employeeId" :value="emp.employeeId">
                    {{ emp.name }} (ID: {{ emp.employeeId }})
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label for="hours">Hours Worked</label>
                <input type="number" id="hours" v-model="newPayroll.hoursWorked" required>
              </div>
              <div class="form-group">
                <label for="salary">Salary</label>
                <input type="number" id="salary" v-model="newPayroll.salary" readonly>
              </div>
              <div class="form-group">
                <label for="deductions">Deductions</label>
                <input type="number" id="deductions" v-model="newPayroll.leaveDeductions">
              </div>
              <div class="form-group">
                <div class="radio-group">
                  <label>Performance</label>
                  <div>
                    <label>
                      <input type="radio" value="Excellent" v-model="newPayroll.performance" />
                      Excellent
                    </label>
                  </div>
                  <div>
                    <label>
                      <input type="radio" value="Average" v-model="newPayroll.performance" />
                      Average
                    </label>
                  </div>
                  <div>
                    <label>
                      <input type="radio" value="Bad" v-model="newPayroll.performance" />
                      Bad
                    </label>
                  </div>
                </div>
              </div>
              <div class="form-actions">
                <button type="submit" class="btn btn--success">Add Payroll</button>
                <button type="button" class="btn btn--secondary" @click="showAddModal = false">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Payroll Modal -->
    <div class="modal modal--edit" v-if="showEditModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">Edit Payroll</h2>
            <button @click="showEditModal = false" class="close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updatePayroll">
              <div class="form-group">
                <label>Hours Worked</label>
                <input type="number" v-model.number="editPayrollData.hoursWorked" required />
              </div>
              <div class="form-group">
                <label>Leave Deductions (%)</label>
                <input type="number" v-model.number="editPayrollData.leaveDeductions" required />
              </div>
              <div class="form-group">
                <label>Performance</label>
                <div class="radio-group">
                  <label><input type="radio" value="Excellent" v-model="editPayrollData.performance" />
                    Excellent</label>
                  <label><input type="radio" value="Average" v-model="editPayrollData.performance" /> Average</label>
                  <label><input type="radio" value="Bad" v-model="editPayrollData.performance" /> Bad</label>
                </div>
              </div>
              <div class="form-actions">
                <button type="submit" class="btn btn--success">Update Payroll</button>
                <button type="button" class="btn btn--secondary" @click="showEditModal = false">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import Navbar from "@/components/NavBar.vue";
import { mapGetters } from "vuex";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  name: "FinanceView",
  components: { Navbar },
  data() {
    return {
      selectedEmployee: null,
      showAddModal: false,
      showEditModal: false,
      showPayslipModal: false,
      newPayroll: {
        employeeId: "",
        hours: 0,
        salary: 0,
        deductions: 0,
        performance: "Average",
      },
      editPayrollData: {
        employeeId: null,
        hoursWorked: 0,
        leaveDeductions: 0,
        performance: "Average",
      },
      hourlyRate: 300,
      notification: {
        visible: false,
        message: '',
        type: 'success' // 'success' | 'error' | 'info'
      }
    };
  },
  computed: {
    ...mapGetters(["allPayroll", "allEmployees"]),
    combinedData() {
      if (!this.allPayroll || !this.allEmployees) return [];

      return this.allPayroll.map((payroll) => {
        const employee = this.allEmployees.find(
          (emp) => emp.employeeId === payroll.employeeId
        );

        return {
          ...payroll,
          name: employee ? employee.name : "Unknown",
          department: employee ? employee.department : "N/A",
          email: employee ? employee.contact : null,
        };
      });
    },
  },
  created() {
    this.$store.dispatch("AllPayroll");
    this.$store.dispatch("AllEmployees");
  },
  methods: {
    async addPayroll() {
      try {
        await this.$store.dispatch("addPayroll", this.newPayroll);
        this.resetForm();
        this.showAddModal = false;
        this.showNotification("Payroll Added Successfully");
      } catch (error) {
        this.showNotification('Failed to Add Payroll', 'error');
      }
    },
    resetForm() {
      this.newPayroll = {
        employeeId: "",
        hoursWorked: 0,
        salary: 0,
        leaveDeductions: 0,
        performance: "Average",
      };
    },

    editPayroll(employee) {
      this.editPayrollData = { ...employee };
      this.showEditModal = true;
    },
    async updatePayroll() {
      try {
        await this.$store.dispatch("updatePayroll", this.editPayrollData);
        this.showEditModal = false;
        this.showNotification('Payroll Updated Successfully');
      } catch (error) {
        console.error(error);
        this.showNotification('Failed to Update Payroll', 'error');
      }
    },
    async deletePayroll(employeeId) {
      try {
        await this.$store.dispatch("deletePayroll", employeeId);
        this.showNotification('Payroll Deleted Successfully');
      } catch (error) {
        console.error(error);
        this.showNotification('Failed to Delete Payroll', 'error');
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
    closeModals() {
      this.showAddModal = false;
      this.showEditModal = false;
      this.showPayslipModal = false;
      this.selectedEmployee = null;
    },

    async sendPayslipByEmail(employee) {
      const payload = {
        name: employee.name,
        email: employee.email,
        payslip: {
          baseSalary: employee.salary ?? 0,
          overtimePay: this.calculateOvertimePay(employee) ?? 0,
          performanceBonus: this.calculatePerformanceBonus(employee) ?? 0,
          grossSalary: this.calculateMonthlySalary(employee) ?? 0,
          leaveDeductions: employee.leaveDeductions ?? 0,
          netSalary: this.salaryAfterDeduction(employee) ?? 0,
          annualSalary: this.calculateAnnualSalary(employee) ?? 0,
        },
      };

      try {
        await this.$store.dispatch("sendPayslip", payload);
        this.showNotification(`Payslip sent to ${employee.email}`);
      } catch (error) {
        this.showNotification("Failed to send payslip", "error");
      }
    },

    formatCurrency(value) {
      if (typeof value !== "number") {
        value = Number(value) || 0; // Convert to number if it isn't
      }
      return (
        "R" +
        value.toLocaleString("en-ZA", {
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        })
      );
    },

    calculateOvertimePay(employee) {
      const overtimeHours = Math.max(0, employee.hoursWorked - 160);
      return overtimeHours * (this.hourlyRate || 300);
    },

    calculatePerformanceBonus(employee) {
      return employee.performance === "Excellent" ? employee.salary * 0.05 : 0;
    },

    calculateMonthlySalary(employee) {
      return (
        employee.salary +
        this.calculateOvertimePay(employee) +
        this.calculatePerformanceBonus(employee)
      );
    },

    calculateAnnualSalary(employee) {
      return this.calculateMonthlySalary(employee) * 12;
    },

    salaryAfterDeduction(employee) {
      return this.calculateMonthlySalary(employee) * (1 - employee.leaveDeductions / 100);
    },

    showPayslip(employee) {
      this.selectedEmployee = employee;
      this.showPayslipModal = true;
    },

    downloadPayslip(employee) {
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text(`${employee.name}'s Payslip`, 105, 15, { align: "center" });
      doc.setFontSize(12);

      doc.text(`Employee ID: ${employee.employeeId}`, 14, 25);
      doc.text(`Department: ${employee.department}`, 14, 32);
      doc.text(`Period: ${new Date().toLocaleDateString()}`, 14, 39);

      const data = [["Description", "Amount"], ["Base Salary", this.formatCurrency(employee.salary)]];

      const overtimePay = this.calculateOvertimePay(employee);
      if (overtimePay > 0) {
        data.push([`Overtime (${employee.hoursWorked - 160} hrs)`, this.formatCurrency(overtimePay)]);
      }

      const performanceBonus = this.calculatePerformanceBonus(employee);
      if (performanceBonus > 0) {
        data.push([`Performance Bonus (${employee.performance})`, this.formatCurrency(performanceBonus)]);
      }

      data.push(
        ["Gross Salary", this.formatCurrency(this.calculateMonthlySalary(employee))],
        ["", ""]
      );

      data.push(
        [
          `Leave Deductions (${employee.leaveDeductions}%)`,
          `-${this.formatCurrency((employee.leaveDeductions / 100) * this.calculateMonthlySalary(employee))}`,
        ],
        ["", ""]
      );

      data.push(
        ["NET SALARY", this.formatCurrency(this.salaryAfterDeduction(employee))],
        ["", ""],
        ["ANNUAL SALARY", this.formatCurrency(this.calculateAnnualSalary(employee))]
      );

      doc.autoTable({
        startY: 50,
        head: [data[0]],
        body: data.slice(1),
        theme: "grid",
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
        },
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        columnStyles: {
          0: { cellWidth: "auto", fontStyle: "bold" },
          1: { cellWidth: "auto", halign: "right" },
        },
        didDrawCell: (data) => {
          if (data.section === "body" && data.row.index === data.table.body.length - 3) {
            doc.setFillColor(230, 230, 230);
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, "F");
          }
        },
      });

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("Generated by HR_System", 105, doc.internal.pageSize.height - 10, { align: "center" });

      doc.save(`${employee.name.replace(" ", "_")}_Payslip_${new Date().getFullYear()}.pdf`);
    },
  },
  watch: {
    'newPayroll.employeeId'(newId) {
      const selected = this.allEmployees.find(emp => emp.employeeId == newId);
      if (selected) {
        this.newPayroll.salary = selected.salary;
      } else {
        this.newPayroll.salary = 0;
      }
    }
  }
};
</script>


<style scoped>
/* Base Styles */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

h1 {
  text-align: center;
  font-weight: 700;
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 0;
}

/* Toast Notification */
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  font-size: 0.95rem;
  animation: fadeSlideIn 0.3s ease-out;
  color: white;
}

.toast.success {
  background-color: #4caf50;
}

.toast.error {
  background-color: #f44336;
}

.toast.info {
  background-color: #2196f3;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Action Row */
.action-row {
  display: flex;
  justify-content: flex-end;
  padding: 0 16px;
}

/* Card Grid */
.grid-container {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  padding: 0 16px;
}

.card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
  padding: 24px 20px;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.card:hover {
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  transform: translateY(-6px);
}

.card-body {
  text-align: left;
  padding: 20px;
  color: #444;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e2a38;
  margin-bottom: 12px;
}

.card-text,
.card-body p {
  font-size: 1rem;
  margin: 6px 0;
  color: #555;
}

.card-button {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 12px;
}

/* Buttons */
.btn {
  cursor: pointer;
  font-weight: 600;
  border-radius: 6px;
  width: 100%;
  padding: 10px 22px;
  transition: background-color 0.25s ease;
  border: none;
  color: white;
}


.btn-add {
  background-color: #4169e1;
  color: white;
  padding: 15px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.btn--primary {
  background-color: #4169e1;
}

.btn--primary:hover {
  background-color: #2f66f6;
}

.btn--success {
  background-color: #28a745;
}

.btn--success:hover {
  background-color: #1e7e34;
}

.btn--danger {
  background-color: #8a8a8a;
}

.btn--danger:hover {
  background-color: #333;
}

.btn--secondary {
  background-color: #6c757d;
}

.btn--secondary:hover {
  background-color: #5a6268;
}

/* Modal Base Styles */
.modal {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  z-index: 1100;
  overflow-y: auto;
  box-sizing: border-box;
}

.modal-dialog {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
}

.modal-content {
  display: flex;
  flex-direction: column;
}

.modal-header {
  background-color: #4169e1;
  color: white;
  padding: 18px 24px;
  font-weight: 700;
  font-size: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 28px;
  color: white;
  cursor: pointer;
  font-weight: 700;
  line-height: 1;
  padding: 0;
  margin-left: 8px;
}

.modal-body {
  padding: 24px;
  color: #333;
  font-size: 1rem;
}

.modal-footer {
  background: #f8f9fa;
  padding: 16px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Form Styles */
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
}

.form-group input,
.form-group select {
  padding: 10px 12px;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #007bff;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
}

.radio-group {
  display: flex;
  gap: 20px;
  align-items: center;
}

.radio-group label {
  display: flex;
  align-items: center;
  font-size: 0.95rem;
}

.radio-group input[type="radio"] {
  margin-right: 6px;
}

/* Payslip Specific Styles */
.list-group {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-group-item {
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  color: #444;
  font-weight: 500;
}

.list-group-item strong {
  color: #007bff;
}

.text-success {
  color: #28a745;
  font-weight: 700;
}

.text-danger {
  color: #dc3545;
  font-weight: 700;
}

.text-primary {
  color: #007bff;
  font-weight: 700;
}

/* Responsive */
@media (max-width: 1023px) and (min-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .grid-container {
    grid-template-columns: 1fr;
  }

  .action-row {
    justify-content: center;
  }

  .modal-dialog {
    max-width: 95%;
  }
}
</style>