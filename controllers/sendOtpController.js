const { usersData } = require('../models/users');
const { otpData } = require('../models/otp');

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

module.exports = { sendOtp };
