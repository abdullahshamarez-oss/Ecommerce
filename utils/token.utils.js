const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "your_access_token_secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "your_refresh_token_secret";
const ACC_TOKEN_EXP = process.env.ACC_TOKEN_EXP || "15M";
const REF_TOKEN_EXP = process.env.REF_TOKEN_EXP || "7D";

const jwt = require(`jsonwebtoken`);


const generateAccessToken = (user) => {
    return jwt.sign({
        userId: user._id, role: user.role, tokenVersion: user.tokenVersion
    }, ACCESS_TOKEN_SECRET,
        { expiresIn: ACC_TOKEN_EXP }
    )
};

const generateRefreshToken = (user, jti)=>{
    return jwt.sign({
        userId:user._id, jti, tokenVersion:user.tokenVersion
    }, REFRESH_TOKEN_SECRET,
        {expiresIn: REF_TOKEN_EXP}
    )
}

module.exports = {
    generateAccessToken,
    generateRefreshToken
}