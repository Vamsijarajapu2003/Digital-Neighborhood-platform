// ==========================================
// MERA ILAKA - AUTHENTICATION ROUTES
// ==========================================

const express = require("express");

const router = express.Router();


// Import authentication controller
const {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    logout
} = require("../controllers/authController");


// Import authentication middleware
const authMiddleware = require("../middleware/authMiddleware");


// ==========================================
// PUBLIC ROUTES
// ==========================================

// Register new user
// POST /api/auth/register
router.post(
    "/register",
    register
);


// Login user
// POST /api/auth/login
router.post(
    "/login",
    login
);


// ==========================================
// PROTECTED ROUTES
// ==========================================

// Get currently logged-in user's profile
// GET /api/auth/profile
router.get(
    "/profile",
    authMiddleware,
    getProfile
);


// Update currently logged-in user's profile
// PUT /api/auth/profile
router.put(
    "/profile",
    authMiddleware,
    updateProfile
);


// Change password
// PUT /api/auth/change-password
router.put(
    "/change-password",
    authMiddleware,
    changePassword
);


// Logout
// POST /api/auth/logout
router.post(
    "/logout",
    authMiddleware,
    logout
);


// ==========================================
// TEST ROUTE
// ==========================================

router.get(
    "/test",
    (req, res) => {

        res.status(200).json({

            success: true,

            message:
                "Mera Ilaka authentication routes are working correctly."

        });

    }
);


// Export router
module.exports = router;