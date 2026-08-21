// ==========================================
// MERA ILAKA - MARKETPLACE ROUTES
// ==========================================

const express = require("express");

const router = express.Router();


// ==========================================
// CONTROLLER
// ==========================================

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getMyProducts
} = require("../controllers/marketplaceController");


// ==========================================
// MIDDLEWARE
// ==========================================

const authMiddleware =
    require("../middleware/authMiddleware");


// ==========================================
// GET ALL MARKETPLACE PRODUCTS
// ==========================================

// GET /api/marketplace
router.get(
    "/",
    authMiddleware,
    getProducts
);


// ==========================================
// GET MY PRODUCTS
// ==========================================

// GET /api/marketplace/my-products
router.get(
    "/my-products",
    authMiddleware,
    getMyProducts
);


// ==========================================
// GET PRODUCT BY ID
// ==========================================

// GET /api/marketplace/:id
router.get(
    "/:id",
    authMiddleware,
    getProductById
);


// ==========================================
// CREATE PRODUCT
// ==========================================

// POST /api/marketplace
router.post(
    "/",
    authMiddleware,
    createProduct
);


// ==========================================
// UPDATE PRODUCT
// ==========================================

// PUT /api/marketplace/:id
router.put(
    "/:id",
    authMiddleware,
    updateProduct
);


// ==========================================
// DELETE PRODUCT
// ==========================================

// DELETE /api/marketplace/:id
router.delete(
    "/:id",
    authMiddleware,
    deleteProduct
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
                "Mera Ilaka marketplace routes are working correctly."

        });

    }
);


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;