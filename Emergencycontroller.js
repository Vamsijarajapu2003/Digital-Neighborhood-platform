// ==========================================
// MERA ILAKA - EMERGENCY CONTROLLER
// ==========================================

const Emergency = require("../models/Emergency");


// ==========================================
// CREATE EMERGENCY ALERT
// POST /api/emergencies
// ==========================================

exports.createEmergency = async (req, res) => {
    try {

        const {
            type,
            title,
            description,
            location,
            address,
            city,
            state,
            pincode,
            latitude,
            longitude,
            severity,
            images,
            contactNumber
        } = req.body;


        // ------------------------------------------
        // VALIDATE REQUIRED FIELDS
        // ------------------------------------------

        if (!type || !title || !description) {

            return res.status(400).json({
                success: false,
                message:
                    "Emergency type, title and description are required."
            });

        }


        // ------------------------------------------
        // VALIDATE SEVERITY
        // ------------------------------------------

        const allowedSeverities = [
            "low",
            "medium",
            "high",
            "critical"
        ];

        const emergencySeverity =
            severity || "high";


        if (
            !allowedSeverities.includes(
                emergencySeverity
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid emergency severity."
            });

        }


        // ------------------------------------------
        // CREATE EMERGENCY
        // ------------------------------------------

        const emergency =
            await Emergency.create({

                reportedBy:
                    req.user.id,

                type,

                title:
                    title.trim(),

                description:
                    description.trim(),

                location:
                    location
                        ? location.trim()
                        : "",

                address:
                    address
                        ? address.trim()
                        : "",

                city:
                    city
                        ? city.trim()
                        : "",

                state:
                    state
                        ? state.trim()
                        : "",

                pincode:
                    pincode
                        ? pincode.trim()
                        : "",

                latitude:
                    latitude || null,

                longitude:
                    longitude || null,

                severity:
                    emergencySeverity,

                images:
                    Array.isArray(images)
                        ? images
                        : [],

                contactNumber:
                    contactNumber || "",

                status:
                    "active"

            });


        return res.status(201).json({

            success: true,

            message:
                "Emergency alert created successfully.",

            emergency

        });

    } catch (error) {

        console.error(
            "Create Emergency Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to create emergency alert."

        });

    }
};


// ==========================================
// GET ALL ACTIVE EMERGENCIES
// GET /api/emergencies
// ==========================================

exports.getEmergencies = async (req, res) => {
    try {

        const {
            type,
            severity,
            status,
            city,
            page = 1,
            limit = 20
        } = req.query;


        // ------------------------------------------
        // FILTER
        // ------------------------------------------

        const filter = {};


        if (type) {

            filter.type =
                type;

        }


        if (severity) {

            filter.severity =
                severity;

        }


        if (status) {

            filter.status =
                status;

        }


        if (city) {

            filter.city = {

                $regex: city,

                $options: "i"

            };

        }


        // ------------------------------------------
        // PAGINATION
        // ------------------------------------------

        const pageNumber =
            Math.max(
                parseInt(page),
                1
            );


        const limitNumber =
            Math.min(
                Math.max(
                    parseInt(limit),
                    1
                ),
                100
            );


        const skip =
            (pageNumber - 1) *
            limitNumber;


        // ------------------------------------------
        // GET EMERGENCIES
        // ------------------------------------------

        const emergencies =
            await Emergency.find(filter)

                .populate(
                    "reportedBy",
                    "name email phone"
                )

                .populate(
                    "assignedTo",
                    "name email phone"
                )

                .sort({

                    severity: -1,

                    createdAt: -1

                })

                .skip(skip)

                .limit(limitNumber);


        const total =
            await Emergency.countDocuments(
                filter
            );


        return res.status(200).json({

            success: true,

            count:
                emergencies.length,

            total,

            page:
                pageNumber,

            pages:
                Math.ceil(
                    total / limitNumber
                ),

            emergencies

        });

    } catch (error) {

        console.error(
            "Get Emergencies Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve emergency alerts."

        });

    }
};


// ==========================================
// GET MY EMERGENCIES
// GET /api/emergencies/my-emergencies
// ==========================================

exports.getMyEmergencies = async (req, res) => {
    try {

        const emergencies =
            await Emergency.find({

                reportedBy:
                    req.user.id

            })

            .populate(
                "assignedTo",
                "name email phone"
            )

            .sort({

                createdAt: -1

            });


        return res.status(200).json({

            success: true,

            count:
                emergencies.length,

            emergencies

        });

    } catch (error) {

        console.error(
            "Get My Emergencies Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve your emergency alerts."

        });

    }
};


// ==========================================
// GET EMERGENCY BY ID
// GET /api/emergencies/:id
// ==========================================

exports.getEmergencyById = async (req, res) => {
    try {

        const emergency =
            await Emergency.findById(
                req.params.id
            )

            .populate(
                "reportedBy",
                "name email phone"
            )

            .populate(
                "assignedTo",
                "name email phone"
            )

            .populate(
                "updates.user",
                "name email"
            );


        if (!emergency) {

            return res.status(404).json({

                success: false,

                message:
                    "Emergency alert not found."

            });

        }


        return res.status(200).json({

            success: true,

            emergency

        });

    } catch (error) {

        console.error(
            "Get Emergency Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve emergency alert."

        });

    }
};


// ==========================================
// UPDATE EMERGENCY
// PUT /api/emergencies/:id
// ==========================================

exports.updateEmergency = async (req, res) => {
    try {

        const {
            type,
            title,
            description,
            location,
            address,
            city,
            state,
            pincode,
            latitude,
            longitude,
            severity,
            images,
            contactNumber
        } = req.body;


        const emergency =
            await Emergency.findById(
                req.params.id
            );


        if (!emergency) {

            return res.status(404).json({

                success: false,

                message:
                    "Emergency alert not found."

            });

        }


        // ------------------------------------------
        // CHECK REPORTER
        // ------------------------------------------

        if (
            emergency.reportedBy.toString() !==
            req.user.id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You can update only your own emergency alert."

            });

        }


        // ------------------------------------------
        // DON'T EDIT CLOSED EMERGENCY
        // ------------------------------------------

        if (
            emergency.status ===
            "closed"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Closed emergency alerts cannot be edited."

            });

        }


        if (type !== undefined) {

            emergency.type =
                type;

        }


        if (title !== undefined) {

            emergency.title =
                title.trim();

        }


        if (description !== undefined) {

            emergency.description =
                description.trim();

        }


        if (location !== undefined) {

            emergency.location =
                location.trim();

        }


        if (address !== undefined) {

            emergency.address =
                address.trim();

        }


        if (city !== undefined) {

            emergency.city =
                city.trim();

        }


        if (state !== undefined) {

            emergency.state =
                state.trim();

        }


        if (pincode !== undefined) {

            emergency.pincode =
                pincode.trim();

        }


        if (latitude !== undefined) {

            emergency.latitude =
                latitude;

        }


        if (longitude !== undefined) {

            emergency.longitude =
                longitude;

        }


        if (severity !== undefined) {

            const allowedSeverities = [
                "low",
                "medium",
                "high",
                "critical"
            ];


            if (
                !allowedSeverities.includes(
                    severity
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid emergency severity."

                });

            }


            emergency.severity =
                severity;

        }


        if (images !== undefined) {

            emergency.images =
                Array.isArray(images)
                    ? images
                    : [];

        }


        if (contactNumber !== undefined) {

            emergency.contactNumber =
                contactNumber;

        }


        await emergency.save();


        return res.status(200).json({

            success: true,

            message:
                "Emergency alert updated successfully.",

            emergency

        });

    } catch (error) {

        console.error(
            "Update Emergency Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to update emergency alert."

        });

    }
};


// ==========================================
// UPDATE EMERGENCY STATUS
// ADMIN / RESPONDER
// PATCH /api/emergencies/:id/status
// ==========================================

exports.updateEmergencyStatus = async (req, res) => {
    try {

        const {
            status,
            remarks
        } = req.body;


        const allowedStatuses = [

            "active",
            "acknowledged",
            "responding",
            "resolved",
            "cancelled",
            "closed"

        ];


        if (
            !allowedStatuses.includes(
                status
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid emergency status."

            });

        }


        const emergency =
            await Emergency.findById(
                req.params.id
            );


        if (!emergency) {

            return res.status(404).json({

                success: false,

                message:
                    "Emergency alert not found."

            });

        }


        emergency.status =
            status;


        if (remarks) {

            emergency.adminRemarks =
                remarks.trim();

        }


        if (
            status ===
            "acknowledged"
        ) {

            emergency.acknowledgedAt =
                new Date();

        }


        if (
            status ===
            "responding"
        ) {

            emergency.respondingAt =
                new Date();

        }


        if (
            status ===
            "resolved"
        ) {

            emergency.resolvedAt =
                new Date();

        }


        if (
            status ===
            "closed"
        ) {

            emergency.closedAt =
                new Date();

        }


        await emergency.save();


        return res.status(200).json({

            success: true,

            message:
                "Emergency status updated successfully.",

            emergency

        });

    } catch (error) {

        console.error(
            "Update Emergency Status Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to update emergency status."

        });

    }
};


// ==========================================
// ASSIGN EMERGENCY
// ADMIN
// PATCH /api/emergencies/:id/assign
// ==========================================

exports.assignEmergency = async (req, res) => {
    try {

        const {
            assignedTo
        } = req.body;


        if (!assignedTo) {

            return res.status(400).json({

                success: false,

                message:
                    "Responder user ID is required."

            });

        }


        const emergency =
            await Emergency.findById(
                req.params.id
            );


        if (!emergency) {

            return res.status(404).json({

                success: false,

                message:
                    "Emergency alert not found."

            });

        }


        emergency.assignedTo =
            assignedTo;


        if (
            emergency.status ===
            "active"
        ) {

            emergency.status =
                "acknowledged";

            emergency.acknowledgedAt =
                new Date();

        }


        await emergency.save();


        const updatedEmergency =
            await Emergency.findById(
                emergency._id
            )

            .populate(
                "assignedTo",
                "name email phone"
            );


        return res.status(200).json({

            success: true,

            message:
                "Emergency responder assigned successfully.",

            emergency:
                updatedEmergency

        });

    } catch (error) {

        console.error(
            "Assign Emergency Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to assign emergency responder."

        });

    }
};


// ==========================================
// ADD EMERGENCY UPDATE
// POST /api/emergencies/:id/updates
// ==========================================

exports.addEmergencyUpdate = async (req, res) => {
    try {

        const {
            message
        } = req.body;


        if (
            !message ||
            !message.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Update message is required."

            });

        }


        const emergency =
            await Emergency.findById(
                req.params.id
            );


        if (!emergency) {

            return res.status(404).json({

                success: false,

                message:
                    "Emergency alert not found."

            });

        }


        if (
            !Array.isArray(
                emergency.updates
            )
        ) {

            emergency.updates = [];

        }


        emergency.updates.push({

            user:
                req.user.id,

            message:
                message.trim(),

            createdAt:
                new Date()

        });


        await emergency.save();


        const updatedEmergency =
            await Emergency.findById(
                emergency._id
            )

            .populate(
                "updates.user",
                "name email"
            );


        return res.status(200).json({

            success: true,

            message:
                "Emergency update added successfully.",

            updates:
                updatedEmergency.updates

        });

    } catch (error) {

        console.error(
            "Add Emergency Update Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to add emergency update."

        });

    }
};


// ==========================================
// CANCEL EMERGENCY
// PATCH /api/emergencies/:id/cancel
// ==========================================

exports.cancelEmergency = async (req, res) => {
    try {

        const emergency =
            await Emergency.findById(
                req.params.id
            );


        if (!emergency) {

            return res.status(404).json({

                success: false,

                message:
                    "Emergency alert not found."

            });

        }


        // ------------------------------------------
        // CHECK REPORTER
        // ------------------------------------------

        if (
            emergency.reportedBy.toString() !==
            req.user.id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Only the person who reported the emergency can cancel it."

            });

        }


        if (
            emergency.status ===
            "resolved" ||
            emergency.status ===
            "closed"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "This emergency has already been resolved."

            });

        }


        emergency.status =
            "cancelled";


        emergency.cancelledAt =
            new Date();


        await emergency.save();


        return res.status(200).json({

            success: true,

            message:
                "Emergency alert cancelled successfully.",

            emergency

        });

    } catch (error) {

        console.error(
            "Cancel Emergency Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to cancel emergency alert."

        });

    }
};


// ==========================================
// GET ACTIVE EMERGENCIES
// GET /api/emergencies/active
// ==========================================

exports.getActiveEmergencies = async (req, res) => {
    try {

        const emergencies =
            await Emergency.find({

                status: {

                    $in: [

                        "active",

                        "acknowledged",

                        "responding"

                    ]

                }

            })

            .populate(
                "reportedBy",
                "name phone"
            )

            .populate(
                "assignedTo",
                "name phone"
            )

            .sort({

                severity: -1,

                createdAt: -1

            });


        return res.status(200).json({

            success: true,

            count:
                emergencies.length,

            emergencies

        });

    } catch (error) {

        console.error(
            "Get Active Emergencies Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve active emergencies."

        });

    }
};


// ==========================================
// SEARCH EMERGENCIES
// GET /api/emergencies/search?keyword=fire
// ==========================================

exports.searchEmergencies = async (req, res) => {
    try {

        const keyword =
            req.query.keyword || "";


        if (!keyword.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Search keyword is required."

            });

        }


        const emergencies =
            await Emergency.find({

                $or: [

                    {
                        title: {

                            $regex: keyword,

                            $options: "i"

                        }
                    },

                    {
                        description: {

                            $regex: keyword,

                            $options: "i"

                        }
                    },

                    {
                        type: {

                            $regex: keyword,

                            $options: "i"

                        }
                    },

                    {
                        city: {

                            $regex: keyword,

                            $options: "i"

                        }
                    },

                    {
                        address: {

                            $regex: keyword,

                            $options: "i"

                        }
                    }

                ]

            })

            .populate(
                "reportedBy",
                "name email phone"
            )

            .populate(
                "assignedTo",
                "name email phone"
            )

            .sort({

                createdAt: -1

            })

            .limit(50);


        return res.status(200).json({

            success: true,

            count:
                emergencies.length,

            emergencies

        });

    } catch (error) {

        console.error(
            "Search Emergencies Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to search emergency alerts."

        });

    }
};


// ==========================================
// GET EMERGENCY STATISTICS
// ADMIN
// GET /api/emergencies/admin/statistics
// ==========================================

exports.getEmergencyStatistics = async (req, res) => {
    try {

        const totalEmergencies =
            await Emergency.countDocuments();


        const activeEmergencies =
            await Emergency.countDocuments({

                status: "active"

            });


        const acknowledgedEmergencies =
            await Emergency.countDocuments({

                status: "acknowledged"

            });


        const respondingEmergencies =
            await Emergency.countDocuments({

                status: "responding"

            });


        const resolvedEmergencies =
            await Emergency.countDocuments({

                status: "resolved"

            });


        const cancelledEmergencies =
            await Emergency.countDocuments({

                status: "cancelled"

            });


        const criticalEmergencies =
            await Emergency.countDocuments({

                severity: "critical",

                status: {

                    $nin: [

                        "resolved",

                        "cancelled",

                        "closed"

                    ]

                }

            });


        return res.status(200).json({

            success: true,

            statistics: {

                totalEmergencies,

                activeEmergencies,

                acknowledgedEmergencies,

                respondingEmergencies,

                resolvedEmergencies,

                cancelledEmergencies,

                criticalEmergencies

            }

        });

    } catch (error) {

        console.error(
            "Emergency Statistics Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve emergency statistics."

        });

    }
};


// ==========================================
// DELETE EMERGENCY
// ADMIN
// DELETE /api/emergencies/:id
// ==========================================

exports.deleteEmergency = async (req, res) => {
    try {

        const emergency =
            await Emergency.findById(
                req.params.id
            );


        if (!emergency) {

            return res.status(404).json({

                success: false,

                message:
                    "Emergency alert not found."

            });

        }


        await Emergency.findByIdAndDelete(
            req.params.id
        );


        return res.status(200).json({

            success: true,

            message:
                "Emergency alert deleted successfully."

        });

    } catch (error) {

        console.error(
            "Delete Emergency Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to delete emergency alert."

        });

    }
};