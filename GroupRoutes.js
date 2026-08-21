// ==========================================
// MERA ILAKA - GROUP ROUTES
// ==========================================

const express = require("express");

const router = express.Router();


// ==========================================
// CONTROLLER
// ==========================================

const {
    createGroup,
    getGroups,
    getGroupById,
    updateGroup,
    deleteGroup,
    getMyGroups,
    joinGroup,
    leaveGroup
} = require("../controllers/groupController");


// ==========================================
// MIDDLEWARE
// ==========================================

const authMiddleware =
    require("../middleware/authMiddleware");


// ==========================================
// TEST ROUTE
// ==========================================

// GET /api/groups/test/check
router.get(
    "/test/check",
    (req, res) => {

        res.status(200).json({

            success: true,

            message:
                "Mera Ilaka group routes are working correctly."

        });

    }
);


// ==========================================
// GET ALL GROUPS
// ==========================================

// GET /api/groups
router.get(
    "/",
    authMiddleware,
    getGroups
);


// ==========================================
// GET MY GROUPS
// ==========================================

// GET /api/groups/my-groups
router.get(
    "/my-groups",
    authMiddleware,
    getMyGroups
);


// ==========================================
// GET GROUP BY ID
// ==========================================

// GET /api/groups/:id
router.get(
    "/:id",
    authMiddleware,
    getGroupById
);


// ==========================================
// CREATE GROUP
// ==========================================

// POST /api/groups
router.post(
    "/",
    authMiddleware,
    createGroup
);


// ==========================================
// UPDATE GROUP
// ==========================================

// PUT /api/groups/:id
router.put(
    "/:id",
    authMiddleware,
    updateGroup
);


// ==========================================
// DELETE GROUP
// ==========================================

// DELETE /api/groups/:id
router.delete(
    "/:id",
    authMiddleware,
    deleteGroup
);


// ==========================================
// JOIN GROUP
// ==========================================

// POST /api/groups/:id/join
router.post(
    "/:id/join",
    authMiddleware,
    joinGroup
);


// ==========================================
// LEAVE GROUP
// ==========================================

// DELETE /api/groups/:id/leave
router.delete(
    "/:id/leave",
    authMiddleware,
    leaveGroup
);


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;