const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  dayOfWeek: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  roomNumber: { type: String, required: true },
  type: { type: String, enum: ['Lecture', 'Lab', 'Tutorial'], default: 'Lecture' }
});

module.exports = mongoose.model('Timetable', timetableSchema);
