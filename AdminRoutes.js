// ==========================================
// MERA ILAKA - ADMIN ROUTES
// ==========================================

const express = require("express");

const router = express.Router();


// ==========================================
// CONTROLLER
// ==========================================

const {
    getDashboardStats,

    getUsers,
    getUserById,
    updateUserStatus,
    updateUserRole,
    deleteUser,

    getResidents,

    getBusinesses,
    updateBusinessStatus,
    deleteBusiness,

    getServices,
    updateServiceStatus,

    getEvents,
    updateEventStatus,
    deleteEvent,

    getMarketplaceProducts,
    updateProductStatus,
    deleteProduct,

    deleteAnnouncement,

    getComplaintReport,
    getUserReport,
    getBusinessReport,
    getEmergencyReport,
    getGroupReport,

    adminHealthCheck

} = require("../controllers/adminController");


// ==========================================
// MIDDLEWARE
// ==========================================

const authMiddleware =
    require("../middleware/authMiddleware");

const adminMiddleware =
    require("../middleware/adminMiddleware");


// ==========================================
// ADMIN SECURITY MIDDLEWARE
// ==========================================

// All routes below require:
// 1. User authentication
// 2. Admin privileges

router.use(
    authMiddleware,
    adminMiddleware
);


// ==========================================
// ADMIN HEALTH CHECK
// ==========================================

// GET /api/admin/health

router.get(
    "/health",
    adminHealthCheck
);


// ==========================================
// ADMIN DASHBOARD
// ==========================================

// GET /api/admin/dashboard

router.get(
    "/dashboard",
    getDashboardStats
);


// ==========================================
// USER MANAGEMENT
// ==========================================

// GET /api/admin/users

router.get(
    "/users",
    getUsers
);


// GET /api/admin/users/:id

router.get(
    "/users/:id",
    getUserById
);


// PATCH /api/admin/users/:id/status

router.patch(
    "/users/:id/status",
    updateUserStatus
);


// PATCH /api/admin/users/:id/role

router.patch(
    "/users/:id/role",
    updateUserRole
);


// DELETE /api/admin/users/:id

router.delete(
    "/users/:id",
    deleteUser
);


// ==========================================
// RESIDENT MANAGEMENT
// ==========================================

// GET /api/admin/residents

router.get(
    "/residents",
    getResidents
);


// ==========================================
// BUSINESS MANAGEMENT
// ==========================================

// GET /api/admin/businesses

router.get(
    "/businesses",
    getBusinesses
);


// PATCH /api/admin/businesses/:id/status

router.patch(
    "/businesses/:id/status",
    updateBusinessStatus
);


// DELETE /api/admin/businesses/:id

router.delete(
    "/businesses/:id",
    deleteBusiness
);


// ==========================================
// SERVICE MANAGEMENT
// ==========================================

// GET /api/admin/services

router.get(
    "/services",
    getServices
);


// PATCH /api/admin/services/:id/status

router.patch(
    "/services/:id/status",
    updateServiceStatus
);


// ==========================================
// EVENT MANAGEMENT
// ==========================================

// GET /api/admin/events

router.get(
    "/events",
    getEvents
);


// PATCH /api/admin/events/:id/status

router.patch(
    "/events/:id/status",
    updateEventStatus
);


// DELETE /api/admin/events/:id

router.delete(
    "/events/:id",
    deleteEvent
);


// ==========================================
// MARKETPLACE MANAGEMENT
// ==========================================

// GET /api/admin/marketplace

router.get(
    "/marketplace",
    getMarketplaceProducts
);


// PATCH /api/admin/marketplace/:id/status

router.patch(
    "/marketplace/:id/status",
    updateProductStatus
);


// DELETE /api/admin/marketplace/:id

router.delete(
    "/marketplace/:id",
    deleteProduct
);


// ==========================================
// ANNOUNCEMENT MANAGEMENT
// ==========================================

// DELETE /api/admin/announcements/:id

router.delete(
    "/announcements/:id",
    deleteAnnouncement
);


// ==========================================
// REPORTS
// ==========================================

// GET /api/admin/reports/users

router.get(
    "/reports/users",
    getUserReport
);


// GET /api/admin/reports/businesses

router.get(
    "/reports/businesses",
    getBusinessReport
);


// GET /api/admin/reports/complaints

router.get(
    "/reports/complaints",
    getComplaintReport
);


// GET /api/admin/reports/emergencies

router.get(
    "/reports/emergencies",
    getEmergencyReport
);


// GET /api/admin/reports/groups

router.get(
    "/reports/groups",
    getGroupReport
);


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;