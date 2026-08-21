// ==========================================
// MERA ILAKA - COMPLAINT ROUTES
// ==========================================

const express = require("express");

const router = express.Router();


// ==========================================
// CONTROLLER
// ==========================================

const {
    createComplaint,
    getComplaints,
    getComplaintById,
    updateComplaint,
    deleteComplaint,
    getMyComplaints,
    updateComplaintStatus
} = require("../controllers/complaintController");


// ==========================================
// MIDDLEWARE
// ==========================================

const authMiddleware =
    require("../middleware/authMiddleware");


// ==========================================
// TEST ROUTE
// ==========================================

// GET /api/complaints/test/check
router.get(
    "/test/check",
    (req, res) => {

        res.status(200).json({

            success: true,

            message:
                "Mera Ilaka complaint routes are working correctly."

        });

    }
);


// ==========================================
// GET ALL COMPLAINTS
// ==========================================

// GET /api/complaints
router.get(
    "/",
    authMiddleware,
    getComplaints
);


// ==========================================
// GET MY COMPLAINTS
// ==========================================

// GET /api/complaints/my-complaints
router.get(
    "/my-complaints",
    authMiddleware,
    getMyComplaints
);


// ==========================================
// GET COMPLAINT BY ID
// ==========================================

// GET /api/complaints/:id
router.get(
    "/:id",
    authMiddleware,
    getComplaintById
);


// ==========================================
// CREATE COMPLAINT
// ==========================================

// POST /api/complaints
router.post(
    "/",
    authMiddleware,
    createComplaint
);


// ==========================================
// UPDATE COMPLAINT
// ==========================================

// PUT /api/complaints/:id
router.put(
    "/:id",
    authMiddleware,
    updateComplaint
);


// ==========================================
// UPDATE COMPLAINT STATUS
// ==========================================

// PATCH /api/complaints/:id/status
router.patch(
    "/:id/status",
    authMiddleware,
    updateComplaintStatus
);


// ==========================================
// DELETE COMPLAINT
// ==========================================

// DELETE /api/complaints/:id
router.delete(
    "/:id",
    authMiddleware,
    deleteComplaint
);


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;