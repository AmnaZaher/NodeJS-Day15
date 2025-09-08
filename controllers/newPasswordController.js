const { otpData } = require('../models/otp');
const { usersData } = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

module.exports = { newPassword };
