const User = require(`../models/User`);
const crypto = require(`crypto`);

const { transporter, sendEmail } = require(`../config/mail`);

const normalizeEmail = (email) => email.trim().toLowerCase();

const register = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        const exist = await User.findOne({ email: normalizeEmail(email) });
        if (exist) {
            return res.status(400).json({
                message: `User with email ${normalizeEmail(email)} already exists`
            })
        }
        const emailVerifiedToken = crypto.randomBytes(32).toString(`hex`);
        const user = new User({
            userName,
            email: normalizeEmail(email),
            password,
            emailVerifiedToken,
            emailVerifyExp: new Date(Date.now() + 5*60*60*1000)
        })
        await sendEmail(
            normalizeEmail(email),
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
        const verifyLink = `${process.env.URL}/verify-email?token=${emailVerifiedToken}`;
        await sendEmail(
            normalizeEmail(email),
            `Verify Your Email`,
            `Hello ${userName},
             Thank you for registering on our E-commerce platform! To complete your registration,
             please verify your email address by clicking the link below:
             ${verifyLink}
             If you did not create an account, please ignore this email.`
        )
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ message: `Server Error` });
    }
}

const emailVerification = async(req, res)=>{
    try{
        const { token } = req.query;
        if(!token){
            return res.status(400).json({
                message:`Verification token is missing`
            })
        }

        const user = await User.findOne({
            emailVerifiedToken: token,
            emailVerifyExp:{$gt: Date.now()}
        })
        if(!user){
            return res.status(400).json({
                message:`Invalid or expired verification token`
            })
        }
        user.isEmailVerified = true;
        user.emailVerifiedToken = undefined;
        user.emailVerifyExp = undefined;

        await user.save();
        res.status(200).json({
            message: `Email verified successfully`
        })


    } catch(error){
        console.error(`Error: ${error.message}`);
        res.status(500).json({message: `Server Error`})
    }
}

const reSendVerificationEmail = async(req, res)=>{
    try{
        const { email } = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message: `User with email ${email} not found`
            })
        }
        if(user.isEmailVerified){
            return res.status(400).json({
                message: `Email is already verified`
            })
        }
        const emailVerifiedToken = crypto.randomBytes(32).toString(`hex`);

        user.emailVerifiedToken = emailVerifiedToken;
        user.emailVerifyExp = new Date(Date.now() + 5*60*1000);

        await user.save();

        const verifyLink = `${process.env.URL}/verify-email?token=${emailVerifiedToken}`;
        await sendEmail(
            normalizeEmail(email),
            `Verify Your Email`,
            `Hello ${user.userName},
             We received a request to resend the verification email for your account
            on our E-commerce platform. To complete your registration,
            This link will expire in 5 minutes.
            please verify your email address by clicking the link below:
            ${verifyLink}
            If you did not request this, please ignore this email.`
        );
        return res.status(200).json({
            message:`Verification email resent successfully`
        })

    }catch(error){
        console.error(`Error: ${error.message}`);
        res.status(500).json({
            message:`Server Error`
        })
    }
}

const login = async(req,res)=>{
    try{
        const {email, password } = req.body;
        const user = await User.findOne({
            email: normalizeEmail(email)
        }).select(`+password`);
        if(!user || !user.isEmailVerified){
            return res.status(400).json({
                message:`no user or email not verified`
            })
        }
        if(password !== user.password){
            return res.status(400).json({
                message:`invalid password`
            })
        }
       
        await sendEmail(
            normalizeEmail(email),
            `Login Alert`,
            `Hello ${user.userName},
            We noticed a login to your account on our E-commerce platform.
            If this was you, you can safely ignore this email.
            Otherwise, we recommend changing your password immediately 
            and reviewing your account activity for any unauthorized access.`
        )
         res.status(200).json({
            message:`login successful`,
            userData: {
                user: user._id, 
                userName: user.userName, 
                email: user.email 
            }
        })

    } catch(error){
        console.error(`Error: ${error.message}`);
        res.status(500).json({
            message:`Server Error`
        })
    }
}

module.exports = {
    register,
    emailVerification,
    reSendVerificationEmail,
    login
}