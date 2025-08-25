import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import employeeRouter from "./routes/employeeRouter.js";
import attendanceRouter from "./routes/attendanceRouter.js";
import payrollRouter from "./routes/payrollRouter.js";
import leaveRequestRoutes from "./routes/leaveRequestRoutes.js";
import payslipRouter from "./routes/payslipRouter.js";
import adminRouter from "./routes/adminRouter.js";

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(cors({
  origin: FRONTEND_URL,      // allow only your frontend
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  credentials: true           // needed if you use cookies/auth headers
}));

// Handle preflight requests
app.options("*", cors({
  origin: FRONTEND_URL,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  credentials: true
}));

app.use(bodyParser.json());
app.use(express.json());

// Routers
app.use("/api/employees", employeeRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/payroll", payrollRouter);
app.use("/api/leave_requests", leaveRequestRoutes);
app.use('/api/payslip', payslipRouter);
app.use("/api/admin", adminRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
