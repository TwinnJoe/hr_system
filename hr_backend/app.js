import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import employeeRouter from "./Routes/employeeRouter.js";
import attendanceRouter from "./Routes/attendanceRouter.js";
import payrollRouter from "./Routes/payrollRouter.js";
import leaveRequestRoutes from "./Routes/leaveRequestRoutes.js";
import payslipRouter from './Routes/payslipRouter.js';
import adminRouter from "./Routes/adminRouter.js";

const app = express();
app.use(express.static("public"));
// Enable CORS for Netlify frontend
const FRONTEND_URL = process.env.FRONTEND_URL || "*"; // for testing you can use "*"
app.use(cors({
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.json());

app.use("/api/employees", employeeRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/payroll", payrollRouter);
app.use("/api/leave_requests", leaveRequestRoutes);
app.use('/api/payslip', payslipRouter);
app.use("/api/admin", adminRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
