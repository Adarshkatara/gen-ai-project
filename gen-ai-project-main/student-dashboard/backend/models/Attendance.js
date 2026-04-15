const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  totalClasses: { type: Number, default: 0 },
  attendedClasses: { type: Number, default: 0 }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
