const mongoose = require(`mongoose`);

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, lowercase: true, trim: true },
    email: {
        type: String, required: true, unique: true, lowercase: true, trim: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },
    password: {
        type: String, required: true, select: false,
        match: [(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-!@#$%&*()^+]).{12,}$/),
            `Password must be at least 12 characters long and include uppercase,
            lowercase, number, and special character` ]
    },
    phoneNum: { type: String, unique: true, sparse: true },
    dateOfBirth: Date,
    tokenVersion: { type: Number, default: 0 },
    role: {
        type: String, default: `user`,
        enum: [`user`, `admin`, `seller`, `delivery`, `support`, `manager`]
    },
    emailVerifiedToken: { type: String, select: false },
    isEmailVerified: { type: Boolean, default: false },
    emailVerifyExp: { type: Date },
}, { timestamps: true });

userSchema.index({ emailVerifiedToken: 1 }, { sparse: true })

const User = mongoose.model(`User`, userSchema);

module.exports = User;
