// ==========================================
// MERA ILAKA - EMERGENCY ROUTES
// ==========================================

const express = require("express");

const router = express.Router();


// ==========================================
// CONTROLLER
// ==========================================

const {
    createEmergency,
    getEmergencies,
    getEmergencyById,
    updateEmergency,
    deleteEmergency,
    getMyEmergencies,
    updateEmergencyStatus
} = require("../controllers/emergencyController");


// ==========================================
// MIDDLEWARE
// ==========================================

const authMiddleware =
    require("../middleware/authMiddleware");


// ==========================================
// TEST ROUTE
// ==========================================

// GET /api/emergencies/test/check
router.get(
    "/test/check",
    (req, res) => {

        res.status(200).json({

            success: true,

            message:
                "Mera Ilaka emergency routes are working correctly."

        });

    }
);


// ==========================================
// GET ALL EMERGENCIES
// ==========================================

// GET /api/emergencies
router.get(
    "/",
    authMiddleware,
    getEmergencies
);


// ==========================================
// GET MY EMERGENCIES
// ==========================================

// GET /api/emergencies/my-emergencies
router.get(
    "/my-emergencies",
    authMiddleware,
    getMyEmergencies
);


// ==========================================
// GET EMERGENCY BY ID
// ==========================================

// GET /api/emergencies/:id
router.get(
    "/:id",
    authMiddleware,
    getEmergencyById
);


// ==========================================
// CREATE EMERGENCY
// ==========================================

// POST /api/emergencies
router.post(
    "/",
    authMiddleware,
    createEmergency
);


// ==========================================
// UPDATE EMERGENCY
// ==========================================

// PUT /api/emergencies/:id
router.put(
    "/:id",
    authMiddleware,
    updateEmergency
);


// ==========================================
// UPDATE EMERGENCY STATUS
// ==========================================

// PATCH /api/emergencies/:id/status
router.patch(
    "/:id/status",
    authMiddleware,
    updateEmergencyStatus
);


// ==========================================
// DELETE EMERGENCY
// ==========================================

// DELETE /api/emergencies/:id
router.delete(
    "/:id",
    authMiddleware,
    deleteEmergency
);


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;