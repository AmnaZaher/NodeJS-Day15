const { usersData } = require('../models/users');


const getAllUsers = async (req, res) => {
  try {
    const users = await usersData.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getUserById = async (req, res) => {
  try {
    const user = await usersData.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const addUser = async (req, res) => {
  try {
    const newUser = new usersData(req.body);
    await newUser.save();
    res.status(201).json({ message: "User added", user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const editUser = async (req, res) => {
  try {
    const updatedUser = await usersData.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const deleteUser = async (req, res) => {
  try {
    const deletedUser = await usersData.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {getAllUsers,getUserById,addUser,editUser,deleteUser};
