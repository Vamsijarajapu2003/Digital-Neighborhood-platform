// ==========================================
// MERA ILAKA - SERVICE ROUTES
// ==========================================

const express = require("express");

const router = express.Router();


// ==========================================
// CONTROLLER
// ==========================================

const {
    createService,
    getServices,
    getServiceById,
    updateService,
    deleteService,
    getMyServices
} = require("../controllers/serviceController");


// ==========================================
// MIDDLEWARE
// ==========================================

const authMiddleware =
    require("../middleware/authMiddleware");


// ==========================================
// TEST ROUTE
// ==========================================

// GET /api/services/test/check
router.get(
    "/test/check",
    (req, res) => {

        res.status(200).json({

            success: true,

            message:
                "Mera Ilaka service routes are working correctly."

        });

    }
);


// ==========================================
// GET ALL SERVICES
// ==========================================

// GET /api/services
router.get(
    "/",
    authMiddleware,
    getServices
);


// ==========================================
// GET MY SERVICES
// ==========================================

// GET /api/services/my-services
router.get(
    "/my-services",
    authMiddleware,
    getMyServices
);


// ==========================================
// GET SERVICE BY ID
// ==========================================

// GET /api/services/:id
router.get(
    "/:id",
    authMiddleware,
    getServiceById
);


// ==========================================
// CREATE SERVICE
// ==========================================

// POST /api/services
router.post(
    "/",
    authMiddleware,
    createService
);


// ==========================================
// UPDATE SERVICE
// ==========================================

// PUT /api/services/:id
router.put(
    "/:id",
    authMiddleware,
    updateService
);


// ==========================================
// DELETE SERVICE
// ==========================================

// DELETE /api/services/:id
router.delete(
    "/:id",
    authMiddleware,
    deleteService
);


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;