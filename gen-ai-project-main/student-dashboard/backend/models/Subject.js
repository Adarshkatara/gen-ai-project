const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  facultyName: { type: String, required: true },
  facultyImage: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' },
  credits: { type: Number, default: 3 }
});

module.exports = mongoose.model('Subject', subjectSchema);
