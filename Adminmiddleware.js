// ==========================================
// MERA ILAKA - ADMIN AUTHORIZATION MIDDLEWARE
// ==========================================

const adminMiddleware = (req, res, next) => {

    try {

        // --------------------------------------
        // Check whether authenticated user exists
        // --------------------------------------

        if (!req.user) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required. Please login first."

            });

        }


        // --------------------------------------
        // Check user's role
        // --------------------------------------

        if (req.user.role !== "admin") {

            return res.status(403).json({

                success: false,

                message:
                    "Access denied. Admin privileges are required."

            });

        }


        // --------------------------------------
        // User is an admin
        // Continue to controller
        // --------------------------------------

        next();

    } catch (error) {

        console.error(
            "Admin Authorization Error:",
            error.message
        );

        return res.status(500).json({

            success: false,

            message:
                "Admin authorization failed.",

            error:
                error.message

        });

    }

};


// ==========================================
// EXPORT MIDDLEWARE
// ==========================================

module.exports = adminMiddleware;