// ==========================================
// MERA ILAKA - ANNOUNCEMENT ROUTES
// ==========================================

const express = require("express");

const router = express.Router();


// ==========================================
// CONTROLLER
// ==========================================

const {
    createAnnouncement,
    getAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement
} = require("../controllers/announcementController");


// ==========================================
// MIDDLEWARE
// ==========================================

const authMiddleware =
    require("../middleware/authMiddleware");


// ==========================================
// PUBLIC / AUTHENTICATED ROUTES
// ==========================================

// Get all announcements
// GET /api/announcements
router.get(
    "/",
    authMiddleware,
    getAnnouncements
);


// Get one announcement
// GET /api/announcements/:id
router.get(
    "/:id",
    authMiddleware,
    getAnnouncementById
);


// ==========================================
// CREATE ANNOUNCEMENT
// ==========================================

// Create announcement
// POST /api/announcements
router.post(
    "/",
    authMiddleware,
    createAnnouncement
);


// ==========================================
// UPDATE ANNOUNCEMENT
// ==========================================

// Update announcement
// PUT /api/announcements/:id
router.put(
    "/:id",
    authMiddleware,
    updateAnnouncement
);


// ==========================================
// DELETE ANNOUNCEMENT
// ==========================================

// Delete announcement
// DELETE /api/announcements/:id
router.delete(
    "/:id",
    authMiddleware,
    deleteAnnouncement
);


// ==========================================
// TEST ROUTE
// ==========================================

router.get(
    "/test/check",
    (req, res) => {

        res.status(200).json({

            success: true,

            message:
                "Mera Ilaka announcement routes are working correctly."

        });

    }
);

// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;