const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  role: { type: String, enum: ['Student', 'Admin'], default: 'Student' },
  program: { type: String, default: 'B.Tech Computer Science' },
  semester: { type: Number, default: 4 },
  section: { type: String, default: 'A' },
  advisor: { type: String, default: 'Dr. Alan Turing' },
  profilePic: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
