// ==========================================
// MERA ILAKA - VALIDATION MIDDLEWARE
// ==========================================

const validationMiddleware = (schema) => {

    return (req, res, next) => {

        try {

            // --------------------------------------
            // Check if validation schema exists
            // --------------------------------------

            if (!schema) {

                return next();

            }


            // --------------------------------------
            // Validate request body
            // --------------------------------------

            const { error, value } =
                schema.validate(
                    req.body,
                    {
                        abortEarly: false,
                        stripUnknown: true
                    }
                );


            // --------------------------------------
            // Validation failed
            // --------------------------------------

            if (error) {

                const errors =
                    error.details.map(
                        (detail) => ({
                            field:
                                detail.path.join("."),

                            message:
                                detail.message
                        })
                    );


                return res.status(400).json({

                    success: false,

                    message:
                        "Validation failed.",

                    errors: errors

                });

            }


            // --------------------------------------
            // Replace body with validated data
            // --------------------------------------

            req.body = value;


            // --------------------------------------
            // Continue to controller
            // --------------------------------------

            next();

        } catch (error) {

            console.error(
                "Validation Error:",
                error.message
            );


            return res.status(500).json({

                success: false,

                message:
                    "Request validation failed.",

                error:
                    error.message

            });

        }

    };

};


// ==========================================
// SIMPLE REQUIRED-FIELD VALIDATOR
// ==========================================

const validateRequiredFields = (fields) => {

    return (req, res, next) => {

        const missingFields = [];


        fields.forEach((field) => {

            const value =
                req.body[field];


            if (
                value === undefined ||
                value === null ||
                String(value).trim() === ""
            ) {

                missingFields.push(field);

            }

        });


        // --------------------------------------
        // Required fields missing
        // --------------------------------------

        if (missingFields.length > 0) {

            return res.status(400).json({

                success: false,

                message:
                    "Required fields are missing.",

                missingFields:
                    missingFields

            });

        }


        next();

    };

};


// ==========================================
// EMAIL VALIDATION
// ==========================================

const validateEmail = (req, res, next) => {

    const { email } = req.body;


    if (!email) {

        return res.status(400).json({

            success: false,

            message:
                "Email address is required."

        });

    }


    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {

        return res.status(400).json({

            success: false,

            message:
                "Please provide a valid email address."

        });

    }


    next();

};


// ==========================================
// PASSWORD VALIDATION
// ==========================================

const validatePassword = (req, res, next) => {

    const { password } = req.body;


    if (!password) {

        return res.status(400).json({

            success: false,

            message:
                "Password is required."

        });

    }


    if (password.length < 6) {

        return res.status(400).json({

            success: false,

            message:
                "Password must contain at least 6 characters."

        });

    }


    next();

};


// ==========================================
// PHONE NUMBER VALIDATION
// ==========================================

const validatePhone = (req, res, next) => {

    const { phone } = req.body;


    if (!phone) {

        return res.status(400).json({

            success: false,

            message:
                "Phone number is required."

        });

    }


    const phonePattern =
        /^[6-9]\d{9}$/;


    if (!phonePattern.test(phone)) {

        return res.status(400).json({

            success: false,

            message:
                "Please provide a valid 10-digit Indian phone number."

        });

    }


    next();

};


// ==========================================
// EXPORT
// ==========================================

module.exports = {

    validationMiddleware,

    validateRequiredFields,

    validateEmail,

    validatePassword,

    validatePhone

};