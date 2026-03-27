const express = require('express');
const { authMiddleware } = require('./authRoutes');
const Attendance = require('../models/Attendance');
const Subject = require('../models/Subject');
const Timetable = require('../models/Timetable');
const router = express.Router();

// Get Attendance
router.get('/attendance', authMiddleware, async (req, res) => {
  try {
    const attendance = await Attendance.find({ studentId: req.user.id }).populate('subjectId');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get Subjets Overview
router.get('/subjects', authMiddleware, async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get Timetable (Today)
router.get('/timetable', authMiddleware, async (req, res) => {
  try {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    
    const timetable = await Timetable.find({ dayOfWeek: today }).populate('subjectId').sort('startTime');
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
