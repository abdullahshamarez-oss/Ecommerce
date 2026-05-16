const cron = require("node-cron");
const User = require("../models/User");
cron.schedule("0 0 * * *", async () => {
    try {
        const expiryTime =
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        await User.deleteMany({
            isEmailVerified: false,
            createdAt: { $lt: expiryTime }
        });
        console.log("Unverified users cleaned");
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = cron;