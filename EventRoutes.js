// ==========================================
// MERA ILAKA - EVENT ROUTES
// ==========================================

const express = require("express");

const router = express.Router();


// ==========================================
// CONTROLLER
// ==========================================

const {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getMyEvents,
    registerForEvent,
    cancelEventRegistration
} = require("../controllers/eventController");


// ==========================================
// MIDDLEWARE
// ==========================================

const authMiddleware =
    require("../middleware/authMiddleware");


// ==========================================
// TEST ROUTE
// ==========================================

// GET /api/events/test/check
router.get(
    "/test/check",
    (req, res) => {

        res.status(200).json({

            success: true,

            message:
                "Mera Ilaka event routes are working correctly."

        });

    }
);


// ==========================================
// GET ALL EVENTS
// ==========================================

// GET /api/events
router.get(
    "/",
    authMiddleware,
    getEvents
);


// ==========================================
// GET MY EVENTS
// ==========================================

// GET /api/events/my-events
router.get(
    "/my-events",
    authMiddleware,
    getMyEvents
);


// ==========================================
// GET EVENT BY ID
// ==========================================

// GET /api/events/:id
router.get(
    "/:id",
    authMiddleware,
    getEventById
);


// ==========================================
// CREATE EVENT
// ==========================================

// POST /api/events
router.post(
    "/",
    authMiddleware,
    createEvent
);


// ==========================================
// UPDATE EVENT
// ==========================================

// PUT /api/events/:id
router.put(
    "/:id",
    authMiddleware,
    updateEvent
);


// ==========================================
// DELETE EVENT
// ==========================================

// DELETE /api/events/:id
router.delete(
    "/:id",
    authMiddleware,
    deleteEvent
);


// ==========================================
// REGISTER FOR EVENT
// ==========================================

// POST /api/events/:id/register
router.post(
    "/:id/register",
    authMiddleware,
    registerForEvent
);


// ==========================================
// CANCEL EVENT REGISTRATION
// ==========================================

// DELETE /api/events/:id/register
router.delete(
    "/:id/register",
    authMiddleware,
    cancelEventRegistration
);


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;