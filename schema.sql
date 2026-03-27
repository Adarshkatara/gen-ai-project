DROP TABLE IF EXISTS Notifications;
DROP TABLE IF EXISTS ActivityLogs;
DROP TABLE IF EXISTS Documents;
DROP TABLE IF EXISTS Messages;
DROP TABLE IF EXISTS Materials;
DROP TABLE IF EXISTS Marks;
DROP TABLE IF EXISTS Attendance;
DROP TABLE IF EXISTS Enrollments;
DROP TABLE IF EXISTS Submissions;
DROP TABLE IF EXISTS Leaves;
DROP TABLE IF EXISTS Assignments;
DROP TABLE IF EXISTS Fees;
DROP TABLE IF EXISTS Leads;
DROP TABLE IF EXISTS Courses;
DROP TABLE IF EXISTS Departments;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role VARCHAR(20) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    profile_pic TEXT
);

CREATE TABLE Departments ( id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100) NOT NULL );

CREATE TABLE Courses ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    department_id INTEGER, 
    faculty_id INTEGER,
    code VARCHAR(20),
    title VARCHAR(100) NOT NULL, 
    credits INTEGER DEFAULT 3,
    FOREIGN KEY (department_id) REFERENCES Departments(id),
    FOREIGN KEY (faculty_id) REFERENCES Users(id)
);

CREATE TABLE Enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    course_id INTEGER,
    FOREIGN KEY (student_id) REFERENCES Users(id),
    FOREIGN KEY (course_id) REFERENCES Courses(id)
);

CREATE TABLE Attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER,
    student_id INTEGER,
    date DATE NOT NULL,
    status VARCHAR(20), -- 'Present', 'Absent'
    FOREIGN KEY (course_id) REFERENCES Courses(id),
    FOREIGN KEY (student_id) REFERENCES Users(id)
);

CREATE TABLE Marks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    course_id INTEGER,
    exam_type VARCHAR(50), -- 'Quiz', 'Midterm', 'Final'
    marks DECIMAL(5, 2),
    max_marks DECIMAL(5, 2),
    FOREIGN KEY (student_id) REFERENCES Users(id),
    FOREIGN KEY (course_id) REFERENCES Courses(id)
);

CREATE TABLE Materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER,
    title VARCHAR(200),
    description TEXT,
    file_url TEXT,
    upload_date DATE,
    FOREIGN KEY (course_id) REFERENCES Courses(id)
);

CREATE TABLE Messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER,
    course_id INTEGER,
    target_audience VARCHAR(50) DEFAULT 'Course', -- 'Course', 'All', 'Students', 'Faculty'
    message TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES Users(id),
    FOREIGN KEY (course_id) REFERENCES Courses(id)
);

CREATE TABLE Leads ( id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100), email VARCHAR(100), phone VARCHAR(20), dob DATE, gpa DECIMAL(3, 2), major VARCHAR(100), status VARCHAR(20) DEFAULT 'New' );
CREATE TABLE Fees ( id INTEGER PRIMARY KEY AUTOINCREMENT, student_id INTEGER, amount DECIMAL(10, 2), status VARCHAR(20) DEFAULT 'Pending', FOREIGN KEY (student_id) REFERENCES Users(id) );
CREATE TABLE Assignments ( id INTEGER PRIMARY KEY AUTOINCREMENT, course_id INTEGER, title VARCHAR(100), description TEXT, due_date DATE, FOREIGN KEY (course_id) REFERENCES Courses(id) );
CREATE TABLE Leaves ( id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, reason TEXT, status VARCHAR(20) DEFAULT 'Pending', FOREIGN KEY (user_id) REFERENCES Users(id) );

CREATE TABLE Documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200),
    file_url TEXT,
    target_audience VARCHAR(50), -- 'All', 'Students', 'Faculty'
    upload_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE ActivityLogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER,
    action TEXT,
    module VARCHAR(100),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES Users(id)
);

CREATE TABLE Notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER DEFAULT 0,
    role_target VARCHAR(50), -- 'Admin', 'Faculty', 'Student', 'All'
    title VARCHAR(100),
    message TEXT,
    type VARCHAR(20) DEFAULT 'Info', -- 'Info', 'Success', 'Warning', 'Error'
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Dummy Data Insertion Scripts
INSERT INTO Users (role, email, password, full_name) VALUES 
('Admin', 'admin@college.com', 'admin123', 'Super Admin'), 
('Faculty', 'faculty@college.com', 'fac123', 'John Faculty'), 
('Faculty', 'sarah@college.com', 'fac123', 'Dr. Sarah Connor'),
('Student', 'student@college.com', 'stu123', 'Alice Student'),
('Student', 'bob@college.com', 'stu123', 'Bob Marley'),
('Student', 'charlie@college.com', 'stu123', 'Charlie Brown');

INSERT INTO Departments (name) VALUES ('Computer Science'), ('Mechanical Engineering');

INSERT INTO Courses (department_id, faculty_id, code, title, credits) VALUES 
(1, 2, 'CS201', 'Data Structures', 4), 
(1, 3, 'CS202', 'Operating Systems', 3),
(2, 2, 'ME301', 'Thermodynamics', 3);

INSERT INTO Enrollments (student_id, course_id) VALUES 
(4, 1), (4, 2), (4, 3), 
(5, 1), (5, 2), 
(6, 1), (6, 3);

INSERT INTO Attendance (course_id, student_id, date, status) VALUES 
(1, 4, '2024-11-01', 'Present'), (1, 5, '2024-11-01', 'Present'), (1, 6, '2024-11-01', 'Absent'),
(1, 4, '2024-11-02', 'Present'), (1, 5, '2024-11-02', 'Absent'), (1, 6, '2024-11-02', 'Present');

INSERT INTO Marks (student_id, course_id, exam_type, marks, max_marks) VALUES 
(4, 1, 'Midterm', 85, 100), (5, 1, 'Midterm', 70, 100), (6, 1, 'Midterm', 92, 100),
(4, 2, 'Midterm', 88, 100), (5, 2, 'Midterm', 65, 100);

INSERT INTO Materials (course_id, title, description, file_url, upload_date) VALUES 
(1, 'Week 1: Arrays vs Linked Lists', 'Intro to linear structures', '/materials/week1.pdf', '2024-11-01'),
(1, 'Week 2: Trees', 'Binary Search Trees basics', '/materials/week2.pdf', '2024-11-08');

INSERT INTO Messages (sender_id, course_id, target_audience, message) VALUES 
(2, 1, 'Course', 'Welcome to Data Structures! Bring your laptops tomorrow.'),
(1, NULL, 'All', 'The college will remain closed on Friday for maintenance.');

INSERT INTO Leads (name, email, status) VALUES ('Bob Applicant', 'bob@test.com', 'New'), ('Sarah Tech', 'sarah@test.com', 'Contacted');
INSERT INTO Fees (student_id, amount, status) VALUES (4, 1500.00, 'Pending'), (5, 2000.00, 'Paid'), (6, 1750.00, 'Pending');
INSERT INTO Assignments (course_id, title, description, due_date) VALUES 
(1, 'Advanced Binary Trees Assignment', 'Implement an AVL tree.', '2024-11-20'), 
(2, 'OS Scheduling Algorithms', 'Write a C program for Round Robin.', '2024-11-25');
INSERT INTO Leaves (user_id, reason, status) VALUES (2, 'Medical Leave', 'Pending');

INSERT INTO Documents (title, file_url, target_audience) VALUES 
('Updated Academic Calendar', '/docs/calendar2025.pdf', 'All'),
('Faculty Handbook v2', '/docs/faculty_handbook.pdf', 'Faculty');

INSERT INTO ActivityLogs (admin_id, action, module) VALUES 
(1, 'Updated fee schedule for Fall Semester', 'Fees'),
(1, 'Registered new faculty user: Dr. Sarah Connor', 'Users');
