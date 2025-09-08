const { studentsData } = require('../models/students');


const getAllStudents = async (req, res) => {
  try {
    const students = await studentsData.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getStudentById = async (req, res) => {
  try {
    const student = await studentsData.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const addStudent = async (req, res) => {
  try {
    const newStudent = new studentsData(req.body);
    await newStudent.save();
    res.status(201).json({ message: "Student added", student: newStudent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const editStudent = async (req, res) => {
  try {
    const updatedStudent = await studentsData.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({ message: "Student updated", student: updatedStudent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const deleteStudent = async (req, res) => {
  try {
    const deletedStudent = await studentsData.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({ message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllStudents, getStudentById, addStudent, editStudent, deleteStudent };
