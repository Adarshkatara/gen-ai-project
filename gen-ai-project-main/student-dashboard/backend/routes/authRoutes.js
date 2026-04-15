const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        program: user.program,
        semester: user.semester,
        section: user.section,
        rollNumber: user.rollNumber,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, rollNumber, role } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = await User.findOne({ rollNumber });
    if (user) return res.status(400).json({ message: 'Roll number already registered' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({
      name,
      email,
      password: hashedPassword,
      rollNumber,
      role: role || 'Student'
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        program: user.program,
        semester: user.semester,
        section: user.section,
        rollNumber: user.rollNumber,
        profilePic: user.profilePic
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// For authenticating routes
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = router;
module.exports.authMiddleware = authMiddleware;
