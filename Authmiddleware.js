// ==========================================
// MERA ILAKA - AUTHENTICATION MIDDLEWARE
// ==========================================

const jwt = require("jsonwebtoken");


// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================

const authMiddleware = (req, res, next) => {

    try {

        // --------------------------------------
        // Get Authorization Header
        // --------------------------------------

        const authHeader = req.headers.authorization;


        // --------------------------------------
        // Check if token exists
        // --------------------------------------

        if (!authHeader) {

            return res.status(401).json({

                success: false,

                message:
                    "Access denied. Please login first."

            });

        }


        // --------------------------------------
        // Check Bearer Token Format
        // --------------------------------------

        if (!authHeader.startsWith("Bearer ")) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid authorization format. Use Bearer token."

            });

        }


        // --------------------------------------
        // Extract Token
        // --------------------------------------

        const token =
            authHeader.split(" ")[1];


        // --------------------------------------
        // Check Token
        // --------------------------------------

        if (!token) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication token is missing."

            });

        }


        // --------------------------------------
        // Verify JWT Token
        // --------------------------------------

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // --------------------------------------
        // Store User Information
        // --------------------------------------

        req.user = decoded;


        // --------------------------------------
        // Continue Request
        // --------------------------------------

        next();

    } catch (error) {

        console.error(
            "Authentication Error:",
            error.message
        );


        // --------------------------------------
        // Invalid / Expired Token
        // --------------------------------------

        if (
            error.name === "TokenExpiredError"
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Your session has expired. Please login again."

            });

        }


        if (
            error.name === "JsonWebTokenError"
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid authentication token."

            });

        }


        // --------------------------------------
        // Other Errors
        // --------------------------------------

        return res.status(500).json({

            success: false,

            message:
                "Authentication failed.",

            error:
                error.message

        });

    }

};


// ==========================================
// EXPORT
// ==========================================

module.exports = authMiddleware;