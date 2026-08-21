// ==========================================
// MERA ILAKA - COMPLAINT CONTROLLER
// ==========================================

const Complaint = require("../models/Complaint");


// ==========================================
// CREATE COMPLAINT
// POST /api/complaints
// ==========================================

exports.createComplaint = async (req, res) => {
    try {

        const {
            title,
            description,
            category,
            priority,
            location,
            address,
            city,
            state,
            pincode,
            images
        } = req.body;


        // ------------------------------------------
        // VALIDATE REQUIRED FIELDS
        // ------------------------------------------

        if (!title || !description || !category) {

            return res.status(400).json({
                success: false,
                message:
                    "Title, description and category are required."
            });

        }


        // ------------------------------------------
        // VALIDATE PRIORITY
        // ------------------------------------------

        const allowedPriorities = [
            "low",
            "medium",
            "high",
            "urgent"
        ];

        const complaintPriority =
            priority || "medium";


        if (
            !allowedPriorities.includes(
                complaintPriority
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid complaint priority."
            });

        }


        // ------------------------------------------
        // CREATE COMPLAINT
        // ------------------------------------------

        const complaint =
            await Complaint.create({

                complainant: req.user.id,

                title: title.trim(),

                description:
                    description.trim(),

                category,

                priority:
                    complaintPriority,

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

                images:
                    Array.isArray(images)
                        ? images
                        : [],

                status: "pending"

            });


        return res.status(201).json({

            success: true,

            message:
                "Complaint submitted successfully.",

            complaint

        });

    } catch (error) {

        console.error(
            "Create Complaint Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to submit complaint."

        });

    }
};


// ==========================================
// GET ALL COMPLAINTS
// ADMIN
// GET /api/complaints
// ==========================================

exports.getComplaints = async (req, res) => {
    try {

        const {
            category,
            status,
            priority,
            city,
            keyword,
            page = 1,
            limit = 20
        } = req.query;


        // ------------------------------------------
        // FILTER
        // ------------------------------------------

        const filter = {};


        if (category) {

            filter.category =
                category;

        }


        if (status) {

            filter.status =
                status;

        }


        if (priority) {

            filter.priority =
                priority;

        }


        if (city) {

            filter.city = {

                $regex: city,

                $options: "i"

            };

        }


        // ------------------------------------------
        // KEYWORD SEARCH
        // ------------------------------------------

        if (keyword) {

            filter.$or = [

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
                    category: {

                        $regex: keyword,

                        $options: "i"

                    }
                },

                {
                    complaintNumber: {

                        $regex: keyword,

                        $options: "i"

                    }
                }

            ];

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
        // GET COMPLAINTS
        // ------------------------------------------

        const complaints =
            await Complaint.find(filter)

                .populate(
                    "complainant",
                    "name email phone"
                )

                .populate(
                    "assignedTo",
                    "name email phone"
                )

                .sort({

                    createdAt: -1

                })

                .skip(skip)

                .limit(limitNumber);


        const total =
            await Complaint.countDocuments(
                filter
            );


        return res.status(200).json({

            success: true,

            count:
                complaints.length,

            total,

            page:
                pageNumber,

            pages:
                Math.ceil(
                    total / limitNumber
                ),

            complaints

        });

    } catch (error) {

        console.error(
            "Get Complaints Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve complaints."

        });

    }
};


// ==========================================
// GET MY COMPLAINTS
// GET /api/complaints/my-complaints
// ==========================================

exports.getMyComplaints = async (req, res) => {
    try {

        const {
            status,
            page = 1,
            limit = 20
        } = req.query;


        const filter = {

            complainant:
                req.user.id

        };


        if (status) {

            filter.status =
                status;

        }


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


        const complaints =
            await Complaint.find(filter)

                .populate(
                    "assignedTo",
                    "name email phone"
                )

                .sort({

                    createdAt: -1

                })

                .skip(skip)

                .limit(limitNumber);


        const total =
            await Complaint.countDocuments(
                filter
            );


        return res.status(200).json({

            success: true,

            count:
                complaints.length,

            total,

            page:
                pageNumber,

            pages:
                Math.ceil(
                    total / limitNumber
                ),

            complaints

        });

    } catch (error) {

        console.error(
            "Get My Complaints Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve your complaints."

        });

    }
};


// ==========================================
// GET COMPLAINT BY ID
// GET /api/complaints/:id
// ==========================================

exports.getComplaintById = async (req, res) => {
    try {

        const complaint =
            await Complaint.findById(
                req.params.id
            )

            .populate(
                "complainant",
                "name email phone"
            )

            .populate(
                "assignedTo",
                "name email phone"
            )

            .populate(
                "comments.user",
                "name email"
            );


        if (!complaint) {

            return res.status(404).json({

                success: false,

                message:
                    "Complaint not found."

            });

        }


        // ------------------------------------------
        // SECURITY CHECK
        // ------------------------------------------

        const isOwner =
            complaint.complainant &&
            complaint.complainant._id.toString() ===
            req.user.id.toString();


        const isAdmin =
            req.user.role === "admin";


        if (!isOwner && !isAdmin) {

            return res.status(403).json({

                success: false,

                message:
                    "You are not authorized to view this complaint."

            });

        }


        return res.status(200).json({

            success: true,

            complaint

        });

    } catch (error) {

        console.error(
            "Get Complaint Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve complaint."

        });

    }
};


// ==========================================
// UPDATE COMPLAINT
// PUT /api/complaints/:id
// ==========================================

exports.updateComplaint = async (req, res) => {
    try {

        const {
            title,
            description,
            category,
            priority,
            location,
            address,
            city,
            state,
            pincode,
            images
        } = req.body;


        const complaint =
            await Complaint.findById(
                req.params.id
            );


        if (!complaint) {

            return res.status(404).json({

                success: false,

                message:
                    "Complaint not found."

            });

        }


        // ------------------------------------------
        // CHECK OWNER
        // ------------------------------------------

        if (
            complaint.complainant.toString() !==
            req.user.id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You can update only your own complaint."

            });

        }


        // ------------------------------------------
        // ONLY PENDING COMPLAINT CAN BE EDITED
        // ------------------------------------------

        if (
            complaint.status !==
            "pending"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Only pending complaints can be edited."

            });

        }


        if (title !== undefined) {

            complaint.title =
                title.trim();

        }


        if (description !== undefined) {

            complaint.description =
                description.trim();

        }


        if (category !== undefined) {

            complaint.category =
                category;

        }


        if (priority !== undefined) {

            const allowedPriorities = [

                "low",
                "medium",
                "high",
                "urgent"

            ];


            if (
                !allowedPriorities.includes(
                    priority
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid complaint priority."

                });

            }


            complaint.priority =
                priority;

        }


        if (location !== undefined) {

            complaint.location =
                location.trim();

        }


        if (address !== undefined) {

            complaint.address =
                address.trim();

        }


        if (city !== undefined) {

            complaint.city =
                city.trim();

        }


        if (state !== undefined) {

            complaint.state =
                state.trim();

        }


        if (pincode !== undefined) {

            complaint.pincode =
                pincode.trim();

        }


        if (images !== undefined) {

            complaint.images =
                Array.isArray(images)
                    ? images
                    : [];

        }


        await complaint.save();


        return res.status(200).json({

            success: true,

            message:
                "Complaint updated successfully.",

            complaint

        });

    } catch (error) {

        console.error(
            "Update Complaint Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to update complaint."

        });

    }
};


// ==========================================
// DELETE / WITHDRAW COMPLAINT
// DELETE /api/complaints/:id
// ==========================================

exports.deleteComplaint = async (req, res) => {
    try {

        const complaint =
            await Complaint.findById(
                req.params.id
            );


        if (!complaint) {

            return res.status(404).json({

                success: false,

                message:
                    "Complaint not found."

            });

        }


        // ------------------------------------------
        // CHECK OWNER
        // ------------------------------------------

        if (
            complaint.complainant.toString() !==
            req.user.id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You can withdraw only your own complaint."

            });

        }


        // ------------------------------------------
        // ONLY PENDING COMPLAINT
        // ------------------------------------------

        if (
            complaint.status !==
            "pending"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Only pending complaints can be withdrawn."

            });

        }


        complaint.status =
            "withdrawn";


        await complaint.save();


        return res.status(200).json({

            success: true,

            message:
                "Complaint withdrawn successfully."

        });

    } catch (error) {

        console.error(
            "Delete Complaint Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to withdraw complaint."

        });

    }
};


// ==========================================
// UPDATE COMPLAINT STATUS
// ADMIN
// PATCH /api/complaints/:id/status
// ==========================================

exports.updateComplaintStatus = async (req, res) => {
    try {

        const {
            status,
            remarks
        } = req.body;


        const allowedStatuses = [

            "pending",
            "in-progress",
            "resolved",
            "rejected",
            "closed",
            "withdrawn"

        ];


        if (
            !allowedStatuses.includes(
                status
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid complaint status."

            });

        }


        const complaint =
            await Complaint.findById(
                req.params.id
            );


        if (!complaint) {

            return res.status(404).json({

                success: false,

                message:
                    "Complaint not found."

            });

        }


        complaint.status =
            status;


        if (remarks) {

            complaint.adminRemarks =
                remarks.trim();

        }


        if (
            status ===
            "resolved"
        ) {

            complaint.resolvedAt =
                new Date();

        }


        if (
            status ===
            "closed"
        ) {

            complaint.closedAt =
                new Date();

        }


        await complaint.save();


        return res.status(200).json({

            success: true,

            message:
                "Complaint status updated successfully.",

            complaint

        });

    } catch (error) {

        console.error(
            "Update Complaint Status Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to update complaint status."

        });

    }
};


// ==========================================
// ASSIGN COMPLAINT
// ADMIN
// PATCH /api/complaints/:id/assign
// ==========================================

exports.assignComplaint = async (req, res) => {
    try {

        const {
            assignedTo
        } = req.body;


        if (!assignedTo) {

            return res.status(400).json({

                success: false,

                message:
                    "Assigned user ID is required."

            });

        }


        const complaint =
            await Complaint.findById(
                req.params.id
            );


        if (!complaint) {

            return res.status(404).json({

                success: false,

                message:
                    "Complaint not found."

            });

        }


        complaint.assignedTo =
            assignedTo;


        if (
            complaint.status ===
            "pending"
        ) {

            complaint.status =
                "in-progress";

        }


        await complaint.save();


        const updatedComplaint =
            await Complaint.findById(
                complaint._id
            )

            .populate(
                "assignedTo",
                "name email phone"
            );


        return res.status(200).json({

            success: true,

            message:
                "Complaint assigned successfully.",

            complaint:
                updatedComplaint

        });

    } catch (error) {

        console.error(
            "Assign Complaint Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to assign complaint."

        });

    }
};


// ==========================================
// ADD COMMENT / REMARK
// POST /api/complaints/:id/comments
// ==========================================

exports.addComment = async (req, res) => {
    try {

        const {
            comment
        } = req.body;


        if (!comment || !comment.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Comment cannot be empty."

            });

        }


        const complaint =
            await Complaint.findById(
                req.params.id
            );


        if (!complaint) {

            return res.status(404).json({

                success: false,

                message:
                    "Complaint not found."

            });

        }


        // ------------------------------------------
        // CHECK OWNER OR ADMIN
        // ------------------------------------------

        const isOwner =
            complaint.complainant.toString() ===
            req.user.id.toString();


        const isAdmin =
            req.user.role === "admin";


        if (!isOwner && !isAdmin) {

            return res.status(403).json({

                success: false,

                message:
                    "You are not authorized to comment on this complaint."

            });

        }


        // ------------------------------------------
        // ADD COMMENT
        // ------------------------------------------

        if (!Array.isArray(
            complaint.comments
        )) {

            complaint.comments = [];

        }


        complaint.comments.push({

            user:
                req.user.id,

            comment:
                comment.trim(),

            createdAt:
                new Date()

        });


        await complaint.save();


        const updatedComplaint =
            await Complaint.findById(
                complaint._id
            )

            .populate(
                "comments.user",
                "name email"
            );


        return res.status(200).json({

            success: true,

            message:
                "Comment added successfully.",

            comments:
                updatedComplaint.comments

        });

    } catch (error) {

        console.error(
            "Add Comment Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to add comment."

        });

    }
};


// ==========================================
// GET PENDING COMPLAINTS
// ADMIN
// GET /api/complaints/admin/pending
// ==========================================

exports.getPendingComplaints = async (req, res) => {
    try {

        const complaints =
            await Complaint.find({

                status: "pending"

            })

            .populate(
                "complainant",
                "name email phone"
            )

            .sort({

                priority: -1,

                createdAt: -1

            });


        return res.status(200).json({

            success: true,

            count:
                complaints.length,

            complaints

        });

    } catch (error) {

        console.error(
            "Get Pending Complaints Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve pending complaints."

        });

    }
};


// ==========================================
// GET COMPLAINT STATISTICS
// ADMIN
// GET /api/complaints/admin/statistics
// ==========================================

exports.getComplaintStatistics = async (req, res) => {
    try {

        const totalComplaints =
            await Complaint.countDocuments();


        const pendingComplaints =
            await Complaint.countDocuments({

                status: "pending"

            });


        const inProgressComplaints =
            await Complaint.countDocuments({

                status: "in-progress"

            });


        const resolvedComplaints =
            await Complaint.countDocuments({

                status: "resolved"

            });


        const rejectedComplaints =
            await Complaint.countDocuments({

                status: "rejected"

            });


        const closedComplaints =
            await Complaint.countDocuments({

                status: "closed"

            });


        const urgentComplaints =
            await Complaint.countDocuments({

                priority: "urgent",

                status: {
                    $nin: [
                        "resolved",
                        "closed"
                    ]
                }

            });


        return res.status(200).json({

            success: true,

            statistics: {

                totalComplaints,

                pendingComplaints,

                inProgressComplaints,

                resolvedComplaints,

                rejectedComplaints,

                closedComplaints,

                urgentComplaints

            }

        });

    } catch (error) {

        console.error(
            "Complaint Statistics Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve complaint statistics."

        });

    }
};


// ==========================================
// SEARCH COMPLAINTS
// ADMIN
// GET /api/complaints/search?keyword=water
// ==========================================

exports.searchComplaints = async (req, res) => {
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


        const complaints =
            await Complaint.find({

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
                        category: {

                            $regex: keyword,

                            $options: "i"

                        }
                    },

                    {
                        complaintNumber: {

                            $regex: keyword,

                            $options: "i"

                        }
                    },

                    {
                        city: {

                            $regex: keyword,

                            $options: "i"

                        }
                    }

                ]

            })

            .populate(
                "complainant",
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
                complaints.length,

            complaints

        });

    } catch (error) {

        console.error(
            "Search Complaints Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to search complaints."

        });

    }
};