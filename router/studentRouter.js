const express = require('express');
const { checkAuth } = require('../middleware/checkAuth');
const { addStudent, editStudent, deleteStudent, getStudentById, getAllStudents } = require('../controllers/studentController');

const router = express.Router();

router.get('/', checkAuth, getAllStudents);
router.get('/:id', checkAuth, getStudentById);
router.post('/add', checkAuth, addStudent);
router.put('/:id', checkAuth, editStudent);
router.delete('/:id', checkAuth, deleteStudent);


module.exports = router;
