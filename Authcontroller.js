// ==========================================
// MERA ILAKA - AUTHENTICATION CONTROLLER
// ==========================================

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");


// ==========================================
// GENERATE JWT TOKEN
// ==========================================

const generateToken = (userId) => {

    return jwt.sign(
        {
            id: userId
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d"
        }
    );

};


// ==========================================
// REGISTER USER
// POST /api/auth/register
// ==========================================

exports.register = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            phone,
            role
        } = req.body;


        // ------------------------------------------
        // VALIDATE REQUIRED FIELDS
        // ------------------------------------------

        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "Name, email and password are required."
            });

        }


        // ------------------------------------------
        // CHECK PASSWORD LENGTH
        // ------------------------------------------

        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters."
            });

        }


        // ------------------------------------------
        // CHECK WHETHER USER ALREADY EXISTS
        // ------------------------------------------

        const existingUser = await User.findOne({
            email: email.toLowerCase().trim()
        });


        if (existingUser) {

            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });

        }


        // ------------------------------------------
        // HASH PASSWORD
        // ------------------------------------------

        const hashedPassword = await bcrypt.hash(
            password,
            12
        );


        // ------------------------------------------
        // CREATE USER
        // ------------------------------------------

        const user = await User.create({

            name: name.trim(),

            email: email.toLowerCase().trim(),

            password: hashedPassword,

            phone: phone ? phone.trim() : "",

            role: role || "resident"

        });


        // ------------------------------------------
        // GENERATE TOKEN
        // ------------------------------------------

        const token = generateToken(user._id);


        // ------------------------------------------
        // RESPONSE
        // ------------------------------------------

        return res.status(201).json({

            success: true,

            message: "Registration successful.",

            token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                phone: user.phone,

                role: user.role

            }

        });

    }

    catch (error) {

        console.error(
            "Registration Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Unable to register user.",

            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined

        });

    }

};


// ==========================================
// LOGIN USER
// POST /api/auth/login
// ==========================================

exports.login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // ------------------------------------------
        // VALIDATE INPUT
        // ------------------------------------------

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message: "Email and password are required."

            });

        }


        // ------------------------------------------
        // FIND USER
        // ------------------------------------------

        const user = await User.findOne({

            email: email.toLowerCase().trim()

        }).select("+password");


        // ------------------------------------------
        // USER NOT FOUND
        // ------------------------------------------

        if (!user) {

            return res.status(401).json({

                success: false,

                message: "Invalid email or password."

            });

        }


        // ------------------------------------------
        // CHECK ACCOUNT STATUS
        // ------------------------------------------

        if (
            user.status &&
            user.status !== "active"
        ) {

            return res.status(403).json({

                success: false,

                message: "Your account is not active."

            });

        }


        // ------------------------------------------
        // COMPARE PASSWORD
        // ------------------------------------------

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isPasswordCorrect) {

            return res.status(401).json({

                success: false,

                message: "Invalid email or password."

            });

        }


        // ------------------------------------------
        // GENERATE JWT TOKEN
        // ------------------------------------------

        const token = generateToken(user._id);


        // ------------------------------------------
        // UPDATE LAST LOGIN
        // ------------------------------------------

        user.lastLogin = new Date();

        await user.save();


        // ------------------------------------------
        // SEND RESPONSE
        // ------------------------------------------

        return res.status(200).json({

            success: true,

            message: "Login successful.",

            token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                phone: user.phone,

                role: user.role

            }

        });

    }

    catch (error) {

        console.error(
            "Login Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Unable to login.",

            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined

        });

    }

};


// ==========================================
// GET CURRENT USER
// GET /api/auth/me
// ==========================================

exports.getMe = async (req, res) => {

    try {

        // authMiddleware should provide req.user

        const user = await User.findById(
            req.user.id
        ).select("-password");


        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }


        return res.status(200).json({

            success: true,

            user

        });

    }

    catch (error) {

        console.error(
            "Get User Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Unable to retrieve user."

        });

    }

};


// ==========================================
// UPDATE PROFILE
// PUT /api/auth/profile
// ==========================================

exports.updateProfile = async (req, res) => {

    try {

        const {
            name,
            phone
        } = req.body;


        const user = await User.findById(
            req.user.id
        );


        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }


        // ------------------------------------------
        // UPDATE NAME
        // ------------------------------------------

        if (name) {

            user.name = name.trim();

        }


        // ------------------------------------------
        // UPDATE PHONE
        // ------------------------------------------

        if (phone !== undefined) {

            user.phone = phone.trim();

        }


        await user.save();


        return res.status(200).json({

            success: true,

            message: "Profile updated successfully.",

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                phone: user.phone,

                role: user.role

            }

        });

    }

    catch (error) {

        console.error(
            "Profile Update Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Unable to update profile."

        });

    }

};


// ==========================================
// CHANGE PASSWORD
// PUT /api/auth/change-password
// ==========================================

exports.changePassword = async (req, res) => {

    try {

        const {
            currentPassword,
            newPassword
        } = req.body;


        // ------------------------------------------
        // VALIDATE INPUT
        // ------------------------------------------

        if (
            !currentPassword ||
            !newPassword
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Current password and new password are required."

            });

        }


        // ------------------------------------------
        // CHECK NEW PASSWORD LENGTH
        // ------------------------------------------

        if (newPassword.length < 6) {

            return res.status(400).json({

                success: false,

                message:
                    "New password must contain at least 6 characters."

            });

        }


        // ------------------------------------------
        // GET USER WITH PASSWORD
        // ------------------------------------------

        const user = await User.findById(
            req.user.id
        ).select("+password");


        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }


        // ------------------------------------------
        // CHECK CURRENT PASSWORD
        // ------------------------------------------

        const passwordMatches =
            await bcrypt.compare(
                currentPassword,
                user.password
            );


        if (!passwordMatches) {

            return res.status(401).json({

                success: false,

                message: "Current password is incorrect."

            });

        }


        // ------------------------------------------
        // HASH NEW PASSWORD
        // ------------------------------------------

        user.password =
            await bcrypt.hash(
                newPassword,
                12
            );


        await user.save();


        return res.status(200).json({

            success: true,

            message:
                "Password changed successfully."

        });

    }

    catch (error) {

        console.error(
            "Change Password Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Unable to change password."

        });

    }

};


// ==========================================
// LOGOUT
// POST /api/auth/logout
// ==========================================

exports.logout = async (req, res) => {

    try {

        return res.status(200).json({

            success: true,

            message: "Logout successful."

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Unable to logout."

        });

    }

};