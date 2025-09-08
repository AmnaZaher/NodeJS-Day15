const express = require('express');
const { checkAuth } = require('../middleware/checkAuth');
const { addUser, editUser, deleteUser, getUserById, getAllUsers} = require('../controllers/userController');

const router = express.Router();

router.get('/', checkAuth, getAllUsers);
router.get('/:id', checkAuth, getUserById);
router.post('/', checkAuth, addUser);
router.put('/:id', checkAuth, editUser);
router.delete('/:id', checkAuth, deleteUser);

module.exports = router;
