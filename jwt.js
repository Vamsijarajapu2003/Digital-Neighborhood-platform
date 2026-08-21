// ==========================================
// MERA ILAKA - JWT AUTHENTICATION
// ==========================================

const jwt = require("jsonwebtoken");


// ==========================================
// GET JWT SECRET
// ==========================================

const getJWTSecret = () => {

    const secret = process.env.JWT_SECRET;

    if (!secret) {

        throw new Error(
            "JWT_SECRET is not defined in the .env file"
        );

    }

    return secret;
};


// ==========================================
// CREATE JWT TOKEN
// ==========================================

const generateToken = (user) => {

    const payload = {

        id: user._id || user.id,

        email: user.email,

        role: user.role || "resident"

    };


    const token = jwt.sign(

        payload,

        getJWTSecret(),

        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d"
        }

    );


    return token;
};


// ==========================================
// VERIFY JWT TOKEN
// ==========================================

const verifyToken = (token) => {

    try {

        return jwt.verify(
            token,
            getJWTSecret()
        );

    } catch (error) {

        return null;

    }

};


// ==========================================
// DECODE JWT TOKEN
// ==========================================

const decodeToken = (token) => {

    try {

        return jwt.decode(token);

    } catch (error) {

        return null;

    }

};


// ==========================================
// EXPORT FUNCTIONS
// ==========================================

module.exports = {

    generateToken,

    verifyToken,

    decodeToken

};