// ==========================================
// MERA ILAKA - BUSINESS ROUTES
// ==========================================

const express = require("express");

const router = express.Router();


// ==========================================
// CONTROLLER
// ==========================================

const {
    createBusiness,
    getBusinesses,
    getBusinessById,
    updateBusiness,
    deleteBusiness,
    getMyBusinesses
} = require("../controllers/businessController");


// ==========================================
// MIDDLEWARE
// ==========================================

const authMiddleware =
    require("../middleware/authMiddleware");


// ==========================================
// GET ALL BUSINESSES
// ==========================================

// GET /api/businesses
router.get(
    "/",
    authMiddleware,
    getBusinesses
);


// ==========================================
// GET MY BUSINESSES
// ==========================================

// GET /api/businesses/my-businesses
router.get(
    "/my-businesses",
    authMiddleware,
    getMyBusinesses
);


// ==========================================
// GET BUSINESS BY ID
// ==========================================

// GET /api/businesses/:id
router.get(
    "/:id",
    authMiddleware,
    getBusinessById
);


// ==========================================
// CREATE BUSINESS
// ==========================================

// POST /api/businesses
router.post(
    "/",
    authMiddleware,
    createBusiness
);


// ==========================================
// UPDATE BUSINESS
// ==========================================

// PUT /api/businesses/:id
router.put(
    "/:id",
    authMiddleware,
    updateBusiness
);


// ==========================================
// DELETE BUSINESS
// ==========================================

// DELETE /api/businesses/:id
router.delete(
    "/:id",
    authMiddleware,
    deleteBusiness
);


// ==========================================
// TEST ROUTE
// ==========================================

// GET /api/businesses/test/check
router.get(
    "/test/check",
    (req, res) => {

        res.status(200).json({

            success: true,

            message:
                "Mera Ilaka business routes are working correctly."

        });

    }
);


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;