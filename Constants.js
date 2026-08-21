// utils/constants.js

// ===============================
// APPLICATION CONSTANTS
// ===============================

const APP_NAME = "Mera Ilaka";

const APP_VERSION = "1.0.0";

const NODE_ENV = process.env.NODE_ENV || "development";


// ===============================
// USER ROLES
// ===============================

const USER_ROLES = {
    RESIDENT: "resident",
    ADMIN: "admin",
    SUPER_ADMIN: "super_admin",
    BUSINESS_OWNER: "business_owner",
    SERVICE_PROVIDER: "service_provider"
};


// ===============================
// USER STATUS
// ===============================

const USER_STATUS = {
    ACTIVE: "active",
    INACTIVE: "inactive",
    BLOCKED: "blocked",
    PENDING: "pending",
    SUSPENDED: "suspended"
};


// ===============================
// GENDER
// ===============================

const GENDER = {
    MALE: "male",
    FEMALE: "female",
    OTHER: "other"
};


// ===============================
// ACCOUNT STATUS
// ===============================

const ACCOUNT_STATUS = {
    ACTIVE: "active",
    INACTIVE: "inactive",
    DELETED: "deleted"
};


// ===============================
// ANNOUNCEMENT STATUS
// ===============================

const ANNOUNCEMENT_STATUS = {
    DRAFT: "draft",
    PUBLISHED: "published",
    ARCHIVED: "archived"
};


// ===============================
// ANNOUNCEMENT PRIORITY
// ===============================

const ANNOUNCEMENT_PRIORITY = {
    LOW: "low",
    NORMAL: "normal",
    HIGH: "high",
    URGENT: "urgent"
};


// ===============================
// EVENT STATUS
// ===============================

const EVENT_STATUS = {
    UPCOMING: "upcoming",
    ONGOING: "ongoing",
    COMPLETED: "completed",
    CANCELLED: "cancelled"
};


// ===============================
// COMPLAINT STATUS
// ===============================

const COMPLAINT_STATUS = {
    OPEN: "open",
    IN_PROGRESS: "in_progress",
    RESOLVED: "resolved",
    CLOSED: "closed",
    REJECTED: "rejected"
};


// ===============================
// COMPLAINT PRIORITY
// ===============================

const COMPLAINT_PRIORITY = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
    CRITICAL: "critical"
};


// ===============================
// SERVICE STATUS
// ===============================

const SERVICE_STATUS = {
    ACTIVE: "active",
    INACTIVE: "inactive",
    PENDING: "pending",
    SUSPENDED: "suspended"
};


// ===============================
// BUSINESS STATUS
// ===============================

const BUSINESS_STATUS = {
    ACTIVE: "active",
    INACTIVE: "inactive",
    PENDING: "pending",
    VERIFIED: "verified",
    REJECTED: "rejected"
};


// ===============================
// MARKETPLACE PRODUCT STATUS
// ===============================

const PRODUCT_STATUS = {
    AVAILABLE: "available",
    OUT_OF_STOCK: "out_of_stock",
    SOLD: "sold",
    INACTIVE: "inactive",
    PENDING: "pending"
};


// ===============================
// ORDER STATUS
// ===============================

const ORDER_STATUS = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    PROCESSING: "processing",
    SHIPPED: "shipped",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
    RETURNED: "returned"
};


// ===============================
// PAYMENT STATUS
// ===============================

const PAYMENT_STATUS = {
    CREATED: "created",
    PENDING: "pending",
    SUCCESS: "success",
    FAILED: "failed",
    CANCELLED: "cancelled",
    REFUNDED: "refunded"
};


// ===============================
// PAYMENT METHODS
// ===============================

const PAYMENT_METHODS = {
    UPI: "upi",
    CARD: "card",
    NET_BANKING: "netbanking",
    WALLET: "wallet",
    CASH: "cash"
};


// ===============================
// BOOKING STATUS
// ===============================

const BOOKING_STATUS = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
    REJECTED: "rejected"
};


// ===============================
// NOTIFICATION TYPES
// ===============================

const NOTIFICATION_TYPES = {
    GENERAL: "general",
    ANNOUNCEMENT: "announcement",
    EVENT: "event",
    COMPLAINT: "complaint",
    PAYMENT: "payment",
    BOOKING: "booking",
    MARKETPLACE: "marketplace",
    EMERGENCY: "emergency",
    SYSTEM: "system"
};


// ===============================
// NOTIFICATION CHANNELS
// ===============================

const NOTIFICATION_CHANNELS = {
    EMAIL: "email",
    SMS: "sms",
    PUSH: "push",
    IN_APP: "in_app"
};


// ===============================
// EMERGENCY TYPES
// ===============================

const EMERGENCY_TYPES = {
    MEDICAL: "medical",
    FIRE: "fire",
    POLICE: "police",
    ACCIDENT: "accident",
    SECURITY: "security",
    OTHER: "other"
};


// ===============================
// EMERGENCY STATUS
// ===============================

const EMERGENCY_STATUS = {
    ACTIVE: "active",
    RESPONDED: "responded",
    RESOLVED: "resolved",
    CANCELLED: "cancelled"
};


// ===============================
// GROUP STATUS
// ===============================

const GROUP_STATUS = {
    ACTIVE: "active",
    INACTIVE: "inactive",
    ARCHIVED: "archived"
};


// ===============================
// GROUP MEMBER ROLES
// ===============================

const GROUP_MEMBER_ROLES = {
    ADMIN: "admin",
    MODERATOR: "moderator",
    MEMBER: "member"
};


// ===============================
// FEEDBACK TYPES
// ===============================

const FEEDBACK_TYPES = {
    GENERAL: "general",
    SERVICE: "service",
    BUSINESS: "business",
    EVENT: "event",
    MARKETPLACE: "marketplace",
    WEBSITE: "website"
};


// ===============================
// API RESPONSE MESSAGES
// ===============================

const MESSAGES = {

    SUCCESS: {
        CREATED: "Created successfully",
        UPDATED: "Updated successfully",
        DELETED: "Deleted successfully",
        FETCHED: "Data fetched successfully",
        LOGIN: "Login successful",
        LOGOUT: "Logout successful",
        REGISTERED: "Registration successful",
        PASSWORD_CHANGED: "Password changed successfully",
        EMAIL_VERIFIED: "Email verified successfully"
    },

    ERROR: {
        INTERNAL_SERVER: "Internal server error",
        INVALID_REQUEST: "Invalid request",
        UNAUTHORIZED: "Unauthorized access",
        FORBIDDEN: "Access denied",
        NOT_FOUND: "Resource not found",
        VALIDATION: "Validation failed",
        INVALID_CREDENTIALS: "Invalid email or password",
        USER_EXISTS: "User already exists",
        USER_NOT_FOUND: "User not found",
        TOKEN_REQUIRED: "Authentication token is required",
        INVALID_TOKEN: "Invalid or expired token",
        PAYMENT_FAILED: "Payment failed",
        FILE_UPLOAD_FAILED: "File upload failed"
    }
};


// ===============================
// PAGINATION
// ===============================

const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
};


// ===============================
// FILE UPLOAD LIMITS
// ===============================

const FILE_LIMITS = {
    MAX_IMAGE_SIZE: 5 * 1024 * 1024,      // 5 MB
    MAX_DOCUMENT_SIZE: 10 * 1024 * 1024,  // 10 MB
    MAX_VIDEO_SIZE: 50 * 1024 * 1024      // 50 MB
};


// ===============================
// ALLOWED FILE TYPES
// ===============================

const ALLOWED_FILE_TYPES = {
    IMAGES: [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ],

    DOCUMENTS: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ],

    VIDEOS: [
        "video/mp4",
        "video/mpeg",
        "video/webm"
    ]
};


// ===============================
// OTP SETTINGS
// ===============================

const OTP = {
    LENGTH: 6,
    EXPIRY_MINUTES: 10,
    MAX_ATTEMPTS: 5
};


// ===============================
// JWT SETTINGS
// ===============================

const JWT = {
    ACCESS_TOKEN_EXPIRY: "1d",
    REFRESH_TOKEN_EXPIRY: "7d"
};


// ===============================
// PASSWORD SETTINGS
// ===============================

const PASSWORD = {
    MIN_LENGTH: 6,
    MAX_LENGTH: 50
};


// ===============================
// API STATUS CODES
// ===============================

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
};


// ===============================
// EXPORT CONSTANTS
// ===============================

module.exports = {

    APP_NAME,
    APP_VERSION,
    NODE_ENV,

    USER_ROLES,
    USER_STATUS,
    GENDER,
    ACCOUNT_STATUS,

    ANNOUNCEMENT_STATUS,
    ANNOUNCEMENT_PRIORITY,

    EVENT_STATUS,

    COMPLAINT_STATUS,
    COMPLAINT_PRIORITY,

    SERVICE_STATUS,
    BUSINESS_STATUS,

    PRODUCT_STATUS,
    ORDER_STATUS,

    PAYMENT_STATUS,
    PAYMENT_METHODS,

    BOOKING_STATUS,

    NOTIFICATION_TYPES,
    NOTIFICATION_CHANNELS,

    EMERGENCY_TYPES,
    EMERGENCY_STATUS,

    GROUP_STATUS,
    GROUP_MEMBER_ROLES,

    FEEDBACK_TYPES,

    MESSAGES,

    PAGINATION,

    FILE_LIMITS,
    ALLOWED_FILE_TYPES,

    OTP,
    JWT,
    PASSWORD,

    HTTP_STATUS
};