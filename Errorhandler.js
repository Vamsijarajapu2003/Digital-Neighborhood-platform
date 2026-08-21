// ==========================================
// MERA ILAKA - GLOBAL ERROR HANDLER
// ==========================================

const errorHandler = (err, req, res, next) => {

    // --------------------------------------
    // Log error in backend console
    // --------------------------------------

    console.error("================================");
    console.error("ERROR:", err.message);
    console.error("STACK:", err.stack);
    console.error("================================");


    // --------------------------------------
    // Default error values
    // --------------------------------------

    let statusCode = err.statusCode || 500;

    let message =
        err.message ||
        "Internal Server Error";


    // --------------------------------------
    // Mongoose Validation Error
    // --------------------------------------

    if (err.name === "ValidationError") {

        statusCode = 400;

        const errors = Object.values(
            err.errors
        ).map(
            error => error.message
        );

        return res.status(statusCode).json({

            success: false,

            message:
                "Validation failed.",

            errors: errors

        });

    }


    // --------------------------------------
    // Mongoose Cast Error
    // --------------------------------------

    if (err.name === "CastError") {

        statusCode = 400;

        return res.status(statusCode).json({

            success: false,

            message:
                "Invalid ID or data format."

        });

    }


    // --------------------------------------
    // MongoDB Duplicate Key Error
    // --------------------------------------

    if (err.code === 11000) {

        statusCode = 409;

        const duplicateField =
            Object.keys(
                err.keyValue || {}
            )[0];

        return res.status(statusCode).json({

            success: false,

            message:
                `${duplicateField || "Field"} already exists.`

        });

    }


    // --------------------------------------
    // JWT Error
    // --------------------------------------

    if (
        err.name === "JsonWebTokenError"
    ) {

        statusCode = 401;

        return res.status(statusCode).json({

            success: false,

            message:
                "Invalid authentication token."

        });

    }


    // --------------------------------------
    // JWT Expired Error
    // --------------------------------------

    if (
        err.name === "TokenExpiredError"
    ) {

        statusCode = 401;

        return res.status(statusCode).json({

            success: false,

            message:
                "Authentication token has expired."

        });

    }


    // --------------------------------------
    // Multer File Size Error
    // --------------------------------------

    if (
        err.code === "LIMIT_FILE_SIZE"
    ) {

        statusCode = 400;

        return res.status(statusCode).json({

            success: false,

            message:
                "File size is too large. Maximum size is 5 MB."

        });

    }


    // --------------------------------------
    // Multer File Count Error
    // --------------------------------------

    if (
        err.code === "LIMIT_UNEXPECTED_FILE"
    ) {

        statusCode = 400;

        return res.status(statusCode).json({

            success: false,

            message:
                "Unexpected file uploaded."

        });

    }


    // --------------------------------------
    // Return General Error
    // --------------------------------------

    return res.status(statusCode).json({

        success: false,

        message: message

    });

};


// ==========================================
// EXPORT
// ==========================================

module.exports = errorHandler;