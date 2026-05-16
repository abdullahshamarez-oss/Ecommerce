const jwt = require(`jsonwebtoken`);

const hashToken = async(token)=> bcrypt.hash(token, 10);
const verifyHashToken = async(token, hash)=> bcrypt.compare(token, hash);

module.exports = {
    hashToken,
    verifyHashToken
}