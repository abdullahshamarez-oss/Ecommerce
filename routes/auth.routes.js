const express = require(`express`);
const router = express.Router();

const register = require(`../controller/registerUser`);

router.post(`/register`, register);

module.exports = router;