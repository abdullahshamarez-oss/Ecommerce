const User = require(`../models/User`);
const { transporter, sendEmail } = require(`../config/mail`);
const register = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        const exist = await User.findOne({ email });
        if (exist) {
            return res.status(400).json({
                message: `User with email ${email} already exists`
            })
        }
        const user = new User({
            userName,
            email,
            password
        })
        await sendEmail(
            email,
            `Registration Successful`,
            `Hello ${userName},
            Welcome to our E-commerce platform!. Your account has been successfully created.
            We are excited to have you as part of our community. If you have any questions or need assistance,
            feel free to reach out to our support team.`
         );
        await user.save();
        res.status(201).json({
            message: `User Registered Successfully`,
            userData: { user: user._id, userName: user.userName, email: user.email }
        })
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ message: `Server Error` });
    }
}

module.exports = register;