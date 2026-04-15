const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Subject = require('./models/Subject');
const Attendance = require('./models/Attendance');
const Timetable = require('./models/Timetable');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB for seeding');

    // Clear existing
    await User.deleteMany({});
    await Subject.deleteMany({});
    await Attendance.deleteMany({});
    await Timetable.deleteMany({});

    // Create Admin
    const adminPass = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'System Admin',
      email: 'admin@university.edu',
      password: adminPass,
      rollNumber: 'ADMIN001',
      role: 'Admin'
    });

    // Create Student
    const studentPass = await bcrypt.hash('student123', 10);
    const student = await User.create({
      name: 'John Doe',
      email: 'student@university.edu',
      password: studentPass,
      rollNumber: '24CS1009',
      role: 'Student',
      program: 'B.Tech Computer Science',
      semester: 4,
      section: 'A',
      advisor: 'Dr. Alan Turing',
      profilePic: 'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff'
    });

    // Create Subjects
    const sub1 = await Subject.create({ code: 'CS201', name: 'Data Structures', facultyName: 'Dr. Smith', facultyImage: 'https://ui-avatars.com/api/?name=Dr+Smith' });
    const sub2 = await Subject.create({ code: 'CS202', name: 'Operating Systems', facultyName: 'Prof. Johnson', facultyImage: 'https://ui-avatars.com/api/?name=Prof+Johnson' });
    const sub3 = await Subject.create({ code: 'MA201', name: 'Discrete Math', facultyName: 'Dr. Williams', facultyImage: 'https://ui-avatars.com/api/?name=Dr+Williams' });

    // Create Attendance
    await Attendance.create({ studentId: student._id, subjectId: sub1._id, totalClasses: 40, attendedClasses: 35 });
    await Attendance.create({ studentId: student._id, subjectId: sub2._id, totalClasses: 38, attendedClasses: 20 }); // Red zone
    await Attendance.create({ studentId: student._id, subjectId: sub3._id, totalClasses: 42, attendedClasses: 28 }); // Yellow zone

    // Create Timetable (For the current day to always show something, let's just seed all weekdays)
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    for (const day of days) {
      await Timetable.create({ subjectId: sub1._id, dayOfWeek: day, startTime: '09:00', endTime: '10:00', roomNumber: 'L-101', type: 'Lecture' });
      await Timetable.create({ subjectId: sub2._id, dayOfWeek: day, startTime: '10:00', endTime: '11:00', roomNumber: 'L-102', type: 'Lecture' });
      await Timetable.create({ subjectId: sub3._id, dayOfWeek: day, startTime: '11:00', endTime: '13:00', roomNumber: 'Lab-3', type: 'Lab' });
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
