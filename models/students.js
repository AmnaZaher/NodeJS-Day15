const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  studentId: {  
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  age: {
    type: Number,
    min: 16
  },
  major: {      
    type: String,
    default: "General"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const studentsData = mongoose.model('students', studentSchema);

module.exports = { studentsData };
