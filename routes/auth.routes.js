const express = require(`express`);
const router = express.Router();

const {
    register,
     emailVerification,
     reSendVerificationEmail,
     login
    } = require(`../controller/registerUser`);

router.post(`/register`, register);
router.get(`/verify-email`, emailVerification);
router.post(`/resend-verification-email`, reSendVerificationEmail);
router.post(`/login`, login);

module.exports = router;