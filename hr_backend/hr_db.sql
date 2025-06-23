
-- Create Database
CREATE DATABASE IF NOT EXISTS hr_db;
USE hr_db;

-- Drop tables if they exist
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS leave_requests;
DROP TABLE IF EXISTS payroll;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS admin;

-- Create Tables

CREATE TABLE admin (
    adminId INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fullName VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    role ENUM('HR Admin', 'Manager') DEFAULT 'HR Admin'
);

CREATE TABLE employees (
    employeeId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    position VARCHAR(100),
    department VARCHAR(100),
    salary DECIMAL(10,2),
    employmentHistory TEXT,
    contact VARCHAR(100),
    adminId INT,
    FOREIGN KEY (adminId) REFERENCES admin(adminId)
);

CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employeeId INT,
    date DATE,
    status ENUM('Present', 'Absent'),
    FOREIGN KEY (employeeId) REFERENCES employees(employeeId)
);

CREATE TABLE leave_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employeeId INT,
    date DATE,
    reason VARCHAR(255),
    status ENUM('Approved', 'Pending', 'Denied'),
    FOREIGN KEY (employeeId) REFERENCES employees(employeeId)
);

CREATE TABLE payroll (
    employeeId INT PRIMARY KEY,
    hoursWorked INT,
    leaveDeductions INT,
    salary DECIMAL(10,2),
    performance VARCHAR(50),
    FOREIGN KEY (employeeId) REFERENCES employees(employeeId)
);

INSERT INTO admin (username, password, fullName, email, role)
VALUES 
  ('Admin', '$2b$10$C.qjt7QDWKi62/R6Yx/Qze7HUSGiYAoeQcDTr42Q0mw0TYQ3MQFmy', 'Nomusa Zulu', 'nomusa.zulu@hrmanagement.com', 'HR Admin'),
  ('Manager', '$2b$10$jKQfxqcBzVguDGPyfyweYu.hRxhyAFW9K03i0jUG5mkPG0OQcMMA2', 'Xolani Mthethwa', 'xolani.mthethwa@hrmanagement.com', 'Manager');


INSERT INTO employees (name, position, department, salary, employmentHistory, contact, adminId)
VALUES 
    ('Sibongile Nkosi', 'Software Engineer', 'Development', 70000, 'Joined in 2015, promoted to Senior in 2018', 'sibongile.nkosi@hrmanagement.com', 1),
    ('Lungile Moyo', 'HR Manager', 'HR', 80000, 'Joined in 2013, promoted to Manager in 2017', 'lungile.moyo@hrmanagement.com', 2),
    ('Thabo Molefe', 'Quality Analyst', 'QA', 55000, 'Joined in 2018', 'thabo.molefe@hrmanagement.com', 1),
    ('Keshav Naidoo', 'Sales Representative', 'Sales', 60000, 'Joined in 2020', 'keshav.naidoo@hrmanagement.com', 2),
    ('Zanele Khumalo', 'Marketing Specialist', 'Marketing', 58000, 'Joined in 2019', 'zanele.khumalo@hrmanagement.com', 2),
    ('Sipho Zulu', 'UI/UX Designer', 'Design', 65000, 'Joined in 2016', 'sipho.zulu@hrmanagement.com', 1),
    ('Naledi Moeketsi', 'DevOps Engineer', 'IT', 72000, 'Joined in 2017', 'naledi.moeketsi@hrmanagement.com', 1),
    ('Farai Gumbo', 'Content Strategist', 'Marketing', 56000, 'Joined in 2021', 'farai.gumbo@hrmanagement.com', 2),
    ('Karabo Dlamini', 'Accountant', 'Finance', 62000, 'Joined in 2018', 'karabo.dlamini@hrmanagement.com', 2),
    ('Fatima Patel', 'Customer Support Lead', 'Support', 58000, 'Joined in 2016', 'fatima.patel@hrmanagement.com', 1),
    ('Tshepo Baloyi', 'Backend Developer', 'Development', 69000, 'Joined in 2022', 'tshepo.baloyi@hrmanagement.com', 1),
    ('Lerato Mthembu', 'Recruitment Officer', 'HR', 50000, 'Joined in 2020', 'lerato.mthembu@hrmanagement.com', 2),
    ('Mohamed Ismail', 'IT Support Technician', 'IT', 53000, 'Joined in 2019', 'mohamed.ismail@hrmanagement.com', 1),
    ('Nomvula Shabalala', 'Project Manager', 'Operations', 85000, 'Joined in 2014, promoted in 2019', 'nomvula.shabalala@hrmanagement.com', 2),
    ('Andile Sithole', 'Front-end Developer', 'Development', 67000, 'Joined in 2021', 'andile.sithole@hrmanagement.com', 1),
    ('Boitumelo Radebe', 'Graphic Designer', 'Design', 60000, 'Joined in 2017', 'boitumelo.radebe@hrmanagement.com', 1),
    ('Dineo Mahlangu', 'Business Analyst', 'Operations', 73000, 'Joined in 2016', 'dineo.mahlangu@hrmanagement.com', 2),
    ('Mfundo Dube', 'Data Scientist', 'Development', 88000, 'Joined in 2020', 'mfundo.dube@hrmanagement.com', 1),
    ('Yandiswa Jacobs', 'Finance Analyst', 'Finance', 61000, 'Joined in 2018', 'yandiswa.jacobs@hrmanagement.com', 2),
    ('Jabulani Maseko', 'Sales Manager', 'Sales', 78000, 'Joined in 2015, promoted in 2021', 'jabulani.maseko@hrmanagement.com', 2);



INSERT INTO attendance (employeeId, date, status) 
VALUES 

    (1, '2024-11-25', 'Present'),
    (1, '2024-11-26', 'Absent'),
    (1, '2024-11-27', 'Present'),
    (1, '2024-11-28', 'Present'),
    (1, '2024-11-29', 'Present'),
    (2, '2024-11-25', 'Present'),
    (2, '2024-11-26', 'Present'),
    (2, '2024-11-27', 'Absent'),
    (2, '2024-11-28', 'Present'),
    (2, '2024-11-29', 'Present'),
    (3, '2024-11-25', 'Present'),
    (3, '2024-11-26', 'Present'),
    (3, '2024-11-27', 'Present'),
    (3, '2024-11-28', 'Absent'),
    (3, '2024-11-29', 'Present'),
    (4, '2024-11-25', 'Absent'),
    (4, '2024-11-26', 'Present'),
    (4, '2024-11-27', 'Present'),
    (4, '2024-11-28', 'Present'),
    (4, '2024-11-29', 'Present'),
    (5, '2024-11-25', 'Present'),
    (5, '2024-11-26', 'Present'),
    (5, '2024-11-27', 'Absent'),
    (5, '2024-11-28', 'Present'),
    (5, '2024-11-29', 'Present'),
    (6, '2024-11-25', 'Present'),
    (6, '2024-11-26', 'Present'),
    (6, '2024-11-27', 'Absent'),
    (6, '2024-11-28', 'Present'),
    (6, '2024-11-29', 'Present'),
    (7, '2024-11-25', 'Present'),
    (7, '2024-11-26', 'Present'),
    (7, '2024-11-27', 'Present'),
    (7, '2024-11-28', 'Absent'),
    (7, '2024-11-29', 'Present'),
    (8, '2024-11-25', 'Present'),
    (8, '2024-11-26', 'Absent'),
    (8, '2024-11-27', 'Present'),
    (8, '2024-11-28', 'Present'),
    (8, '2024-11-29', 'Present'),
    (9, '2024-11-25', 'Present'),
    (9, '2024-11-26', 'Present'),
    (9, '2024-11-27', 'Present'),
    (9, '2024-11-28', 'Absent'),
    (9, '2024-11-29', 'Present'),
    (10, '2024-11-25', 'Present'),
    (10, '2024-11-26', 'Present'),
    (10, '2024-11-27', 'Absent'),
    (10, '2024-11-28', 'Present'),
    (10, '2024-11-29', 'Present'),
    (11, '2024-11-25', 'Present'),
    (11, '2024-11-26', 'Present'),
    (11, '2024-11-27', 'Present'),
    (11, '2024-11-28', 'Absent'),
    (11, '2024-11-29', 'Present'),
    (12, '2024-11-25', 'Absent'),
    (12, '2024-11-26', 'Present'),
    (12, '2024-11-27', 'Present'),
    (12, '2024-11-28', 'Present'),
    (12, '2024-11-29', 'Present'),
    (13, '2024-11-25', 'Present'),
    (13, '2024-11-26', 'Present'),
    (13, '2024-11-27', 'Absent'),
    (13, '2024-11-28', 'Present'),
    (13, '2024-11-29', 'Present'),
    (14, '2024-11-25', 'Absent'),
    (14, '2024-11-26', 'Absent'),
    (14, '2024-11-27', 'Present'),
    (14, '2024-11-28', 'Present'),
    (14, '2024-11-29', 'Present'),
    (15, '2024-11-25', 'Present'),
    (15, '2024-11-26', 'Present'),
    (15, '2024-11-27', 'Absent'),
    (15, '2024-11-28', 'Absent'),
    (15, '2024-11-29', 'Present'),
    (16, '2024-11-25', 'Present'),
    (16, '2024-11-26', 'Present'),
    (16, '2024-11-27', 'Present'),
    (16, '2024-11-28', 'Present'),
    (16, '2024-11-29', 'Absent'),
    (17, '2024-11-25', 'Absent'),
    (17, '2024-11-26', 'Present'),
    (17, '2024-11-27', 'Present'),
    (17, '2024-11-28', 'Present'),
    (17, '2024-11-29', 'Present'),
    (18, '2024-11-25', 'Present'),
    (18, '2024-11-26', 'Absent'),
    (18, '2024-11-27', 'Present'),
    (18, '2024-11-28', 'Absent'),
    (18, '2024-11-29', 'Present'),
    (19, '2024-11-25', 'Present'),
    (19, '2024-11-26', 'Present'),
    (19, '2024-11-27', 'Absent'),
    (19, '2024-11-28', 'Present'),
    (19, '2024-11-29', 'Present'),
    (20, '2024-11-25', 'Absent'),
    (20, '2024-11-26', 'Present'),
    (20, '2024-11-27', 'Present'),
    (20, '2024-11-28', 'Present'),
    (20, '2024-11-29', 'Present');

INSERT INTO leave_requests (employeeId, date, reason, status) 
VALUES 

    (1, '2024-11-22', 'Sick Leave', 'Approved'),
    (1, '2024-12-01', 'Personal', 'Pending'),
    (2, '2024-11-15', 'Family Responsibility', 'Denied'),
    (2, '2024-12-02', 'Vacation', 'Approved'),
    (3, '2024-11-10', 'Medical Appointment', 'Approved'),
    (3, '2024-12-05', 'Personal', 'Pending'),
    (4, '2024-11-20', 'Bereavement', 'Approved'),
    (5, '2024-12-01', 'Childcare', 'Pending'),
    (6, '2024-11-18', 'Sick Leave', 'Approved'),
    (7, '2024-11-22', 'Vacation', 'Pending'),
    (8, '2024-12-02', 'Medical Appointment', 'Approved'),
    (9, '2024-11-19', 'Childcare', 'Denied'),
    (10, '2024-12-03', 'Vacation', 'Pending'),
    (11, '2024-11-30', 'Sick Leave', 'Pending'),
    (12, '2024-11-24', 'Family Emergency', 'Approved'),
    (13, '2024-12-02', 'Medical', 'Pending'),
    (14, '2024-11-23', 'Conference', 'Approved'),
    (15, '2024-11-27', 'Mental Health Day', 'Approved'),
    (16, '2024-12-04', 'Leave for Study', 'Pending'),
    (17, '2024-11-20', 'Vacation', 'Approved'),
    (18, '2024-11-26', 'Conference Travel', 'Approved'),
    (19, '2024-12-01', 'Childcare', 'Pending'),
    (20, '2024-11-22', 'Leadership Seminar', 'Approved');


INSERT INTO payroll (employeeId, hoursWorked, leaveDeductions, salary, performance)
VALUES 
    (1, 160, 8, 70000, 'Excellent'), 
    (2, 150, 10, 80000, 'Excellent'),
    (3, 170, 4, 55000, 'Excellent'),
    (4, 165, 6, 60000, 'Bad'),
    (5, 158, 5, 50000, 'Bad'),
    (6, 168, 2, 65000, 'Average'),
    (7, 175, 3, 72000, 'Average'),
    (8, 160, 0, 56000, 'Average'),
    (9, 155, 5, 62000, 'Average'),
    (10, 162, 4, 58000, 'Excellent'),
    (11, 159, 2, 69000, 'Excellent'),
    (12, 150, 5, 50000, 'Average'), 
    (13, 160, 3, 53000, 'Excellent'),
    (14, 170, 5, 85000, 'Excellent'),
    (15, 158, 6, 67000, 'Excellent'),
    (16, 160, 4, 60000, 'Excellent'),
    (17, 168, 3, 73000, 'Excellent'),
    (18, 165, 2, 88000, 'Excellent'),
    (19, 155, 4, 61000, 'Average'),
    (20, 162, 3, 78000, 'Excellent');
