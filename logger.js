// utils/logger.js

const winston = require("winston");
const path = require("path");

// ===============================
// LOG DIRECTORY
// ===============================

const logDirectory = path.join(__dirname, "../logs");


// ===============================
// LOG FORMAT
// ===============================

const logFormat = winston.format.combine(

    // Add timestamp
    winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss"
    }),

    // Format log message
    winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
);


// ===============================
// CREATE LOGGER
// ===============================

const logger = winston.createLogger({

    // Minimum level to record
    level: "info",

    // Log format
    format: logFormat,

    // Default metadata
    defaultMeta: {
        service: "mera-ilaka-backend"
    },

    // Log files
    transports: [

        // All information logs
        new winston.transports.File({
            filename: path.join(logDirectory, "application.log")
        }),

        // Error logs
        new winston.transports.File({
            filename: path.join(logDirectory, "error.log"),
            level: "error"
        }),

        // Console logs
        new winston.transports.Console()
    ]
});


// ===============================
// LOGGER FUNCTIONS
// ===============================

const logInfo = (message) => {
    logger.info(message);
};


const logError = (message) => {
    logger.error(message);
};


const logWarn = (message) => {
    logger.warn(message);
};


const logDebug = (message) => {
    logger.debug(message);
};


// ===============================
// EXPORT LOGGER
// ===============================

module.exports = {
    logger,
    logInfo,
    logError,
    logWarn,
    logDebug
};