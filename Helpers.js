// utils/helpers.js

/**
 * Generate a random string
 */
const generateRandomString = (length = 10) => {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let result = "";

    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }

    return result;
};


/**
 * Generate a unique ID
 */
const generateUniqueId = (prefix = "ID") => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);

    return `${prefix}_${timestamp}_${random}`;
};


/**
 * Check whether a value is empty
 */
const isEmpty = (value) => {
    return (
        value === undefined ||
        value === null ||
        value === "" ||
        (typeof value === "string" && value.trim() === "")
    );
};


/**
 * Check whether an email is valid
 */
const isValidEmail = (email) => {
    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
};


/**
 * Check whether a phone number is valid
 * Supports 10-digit Indian mobile numbers
 */
const isValidPhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;

    return phoneRegex.test(phone);
};


/**
 * Convert string to slug
 *
 * Example:
 * "Mera Ilaka Community" → "mera-ilaka-community"
 */
const createSlug = (text) => {
    if (!text) {
        return "";
    }

    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-");
};


/**
 * Capitalize first letter
 */
const capitalizeFirstLetter = (text) => {
    if (!text) {
        return "";
    }

    return text.charAt(0).toUpperCase() + text.slice(1);
};


/**
 * Convert entire sentence to title case
 *
 * Example:
 * "welcome to mera ilaka"
 * → "Welcome To Mera Ilaka"
 */
const titleCase = (text) => {
    if (!text) {
        return "";
    }

    return text
        .toLowerCase()
        .split(" ")
        .map(word => capitalizeFirstLetter(word))
        .join(" ");
};


/**
 * Remove extra spaces from text
 */
const removeExtraSpaces = (text) => {
    if (!text) {
        return "";
    }

    return text
        .trim()
        .replace(/\s+/g, " ");
};


/**
 * Format date as DD-MM-YYYY
 */
const formatDate = (date) => {
    const newDate = new Date(date);

    if (isNaN(newDate.getTime())) {
        return "";
    }

    const day = String(newDate.getDate()).padStart(2, "0");
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const year = newDate.getFullYear();

    return `${day}-${month}-${year}`;
};


/**
 * Format date and time
 */
const formatDateTime = (date) => {
    const newDate = new Date(date);

    if (isNaN(newDate.getTime())) {
        return "";
    }

    return newDate.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short"
    });
};


/**
 * Convert bytes to readable file size
 *
 * Example:
 * 1024 → 1 KB
 */
const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) {
        return "0 Bytes";
    }

    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB",
        "TB"
    ];

    const index = Math.floor(
        Math.log(bytes) / Math.log(1024)
    );

    return (
        parseFloat(
            (bytes / Math.pow(1024, index)).toFixed(2)
        ) +
        " " +
        units[index]
    );
};


/**
 * Convert amount to INR format
 *
 * Example:
 * 15000 → ₹15,000.00
 */
const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR"
    }).format(amount || 0);
};


/**
 * Generate pagination information
 */
const getPagination = (page = 1, limit = 10) => {
    page = parseInt(page);
    limit = parseInt(limit);

    if (page < 1) {
        page = 1;
    }

    if (limit < 1) {
        limit = 10;
    }

    const skip = (page - 1) * limit;

    return {
        page,
        limit,
        skip
    };
};


/**
 * Calculate total pages
 */
const getTotalPages = (totalItems, limit) => {
    return Math.ceil(totalItems / limit);
};


/**
 * Generate pagination response
 */
const paginationResponse = (
    data,
    totalItems,
    page,
    limit
) => {
    const totalPages = Math.ceil(totalItems / limit);

    return {
        data,
        pagination: {
            totalItems,
            totalPages,
            currentPage: page,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
        }
    };
};


/**
 * Pick selected fields from an object
 */
const pickFields = (object, fields) => {
    const result = {};

    fields.forEach(field => {
        if (object[field] !== undefined) {
            result[field] = object[field];
        }
    });

    return result;
};


/**
 * Remove sensitive information from user object
 */
const sanitizeUser = (user) => {
    if (!user) {
        return null;
    }

    const userObject = user.toObject
        ? user.toObject()
        : { ...user };

    delete userObject.password;
    delete userObject.refreshToken;
    delete userObject.resetPasswordToken;

    return userObject;
};


/**
 * Check whether an ID is a valid MongoDB ObjectId
 */
const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};


/**
 * Delay execution
 *
 * Useful for testing or retry operations
 */
const delay = (milliseconds) => {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
};


/**
 * Generate OTP
 */
const generateOTP = (length = 6) => {
    let otp = "";

    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10);
    }

    return otp;
};


/**
 * Check whether OTP has expired
 */
const isOTPExpired = (expiryTime) => {
    return new Date() > new Date(expiryTime);
};


/**
 * Export all helper functions
 */
module.exports = {
    generateRandomString,
    generateUniqueId,
    isEmpty,
    isValidEmail,
    isValidPhone,
    createSlug,
    capitalizeFirstLetter,
    titleCase,
    removeExtraSpaces,
    formatDate,
    formatDateTime,
    formatFileSize,
    formatCurrency,
    getPagination,
    getTotalPages,
    paginationResponse,
    pickFields,
    sanitizeUser,
    isValidObjectId,
    delay,
    generateOTP,
    isOTPExpired
};