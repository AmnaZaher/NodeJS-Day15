const { usersData } = require('../models/users');
const { otpData } = require('../models/otp');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async(req,res) => {
    try {
        const {usernameOrEmail, password} = req.body;
        if (!usernameOrEmail || !password){
            return res.status(400).json({message : "All inputs are required"})
        }
        const getUser = await usersData.findOne({$or : [{email : usernameOrEmail}, {username : usernameOrEmail}]}) // {}
        if (!getUser){
            return res.status(400).json({message : "Invalid username or email"})
        }
        const comparePassword = await bcrypt.compare(password, getUser.password)// true or false
        if (!comparePassword){
            return res.status(400).json({message : "Invalid password"})
        }
        const token = jwt.sign({firstName : getUser.firstName, lastName :getUser.lastName, email: getUser.email, role : getUser.role},  process.env.JWT_SECRET, { expiresIn: "1m" });
        req.session.token = token;
        return res.json({message : 'login done'})
    } 
    catch (error) {
        console.log(error)
    }
    
}

const logout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: "Error logging out" });
            }
            return res.json({ message: "Logout successful" });
        });
    } catch (error) {
        return res.status(500).json({ message: "Error logging out", error: error.message });
    }
    
}




const newPassword = async (req, res) => {
    try {
        const { email, otp, newPassword, confirmPassword } = req.body;

        if (!email || !otp || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const checkEmail = await otpData.findOne({ email });
        if (!checkEmail) {
            return res.status(400).json({ message: "Email not found" });
        }

        if (checkEmail.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);

        
        const updatedUser = await usersData.findOneAndUpdate(
            { email },
            { password: hashPassword },
            { new: true }
        );

        
        await otpData.deleteOne({ email });

        
        const token = jwt.sign(
            {
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                role: updatedUser.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        
        req.session.token = token;

        return res.status(200).json({
            message: "Password updated successfully",
            token
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const register = async (req, res) => {
    try {
        const { firstName, lastName, username, email, password } = req.body;
        if (!firstName || !lastName || !username || !email || !password) {
            return res.status(400).json({ message: "All inputs are required" });
        }
        const checkUser = await usersData.findOne({ $or: [{ username: username }, { email: email }] }); // false
        if (checkUser) {
            if (checkUser.username === username) {
                return res.status(400).json({ message: "Username already exists" });
            } else if (checkUser.email === email) {
                return res.status(400).json({ message: "Email already exists" });
            }
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const addnewuser = new usersData({
            firstName,
            lastName,
            username,
            email,
            password: hashPassword,
        })
        await addnewuser.save();
        const token = jwt.sign({firstName, lastName, email, role : "user"},  process.env.JWT_SECRET, { expiresIn: "1m" });
        req.session.token = token;

        return res.status(201).json({ message: "User registered successfully" });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
    
}

const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email required" });
        }

        const getUser = await usersData.findOne({ email });
        if (!getUser) {
            return res.status(404).json({ message: "User not found" });
        }

        
        const checkOtp = await otpData.findOne({ email });
        if (checkOtp) {
            return res.status(400).json({ message: "OTP already sent, try again after 5 minutes" });
        }

        
        const randomSix = Math.floor(100000 + Math.random() * 900000);

        const addOtp = new otpData({
            email,
            otp: randomSix,
            createdAt: Date.now()
        });

        await addOtp.save();

        
        return res.json({ message: "OTP sent successfully", otp: randomSix });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



module.exports = {login, logout, newPassword, register, sendOtp};