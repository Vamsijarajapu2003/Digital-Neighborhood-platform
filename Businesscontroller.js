// ==========================================
// MERA ILAKA - BUSINESS CONTROLLER
// ==========================================

const Business = require("../models/Business");


// ==========================================
// CREATE BUSINESS
// POST /api/businesses
// ==========================================

exports.createBusiness = async (req, res) => {
    try {

        const {
            name,
            description,
            category,
            phone,
            email,
            website,
            address,
            city,
            state,
            pincode,
            openingTime,
            closingTime,
            workingDays,
            images,
            services
        } = req.body;


        // ------------------------------------------
        // VALIDATE REQUIRED FIELDS
        // ------------------------------------------

        if (!name || !category || !phone) {
            return res.status(400).json({
                success: false,
                message:
                    "Business name, category and phone are required."
            });
        }


        // ------------------------------------------
        // CHECK DUPLICATE BUSINESS
        // ------------------------------------------

        const existingBusiness =
            await Business.findOne({
                name: name.trim(),
                owner: req.user.id
            });


        if (existingBusiness) {
            return res.status(409).json({
                success: false,
                message:
                    "You have already registered this business."
            });
        }


        // ------------------------------------------
        // CREATE BUSINESS
        // ------------------------------------------

        const business = await Business.create({

            owner: req.user.id,

            name: name.trim(),

            description:
                description
                    ? description.trim()
                    : "",

            category,

            phone: phone.trim(),

            email:
                email
                    ? email.toLowerCase().trim()
                    : "",

            website:
                website
                    ? website.trim()
                    : "",

            address:
                address || "",

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

            openingTime:
                openingTime || "",

            closingTime:
                closingTime || "",

            workingDays:
                Array.isArray(workingDays)
                    ? workingDays
                    : [],

            images:
                Array.isArray(images)
                    ? images
                    : [],

            services:
                Array.isArray(services)
                    ? services
                    : [],

            status: "pending"

        });


        return res.status(201).json({

            success: true,

            message:
                "Business registered successfully and submitted for approval.",

            business

        });

    } catch (error) {

        console.error(
            "Create Business Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to register business."

        });
    }
};


// ==========================================
// GET ALL APPROVED BUSINESSES
// GET /api/businesses
// ==========================================

exports.getBusinesses = async (req, res) => {
    try {

        const {
            category,
            city,
            state,
            keyword,
            page = 1,
            limit = 20
        } = req.query;


        // ------------------------------------------
        // BASE FILTER
        // ------------------------------------------

        const filter = {
            status: "approved"
        };


        // ------------------------------------------
        // CATEGORY FILTER
        // ------------------------------------------

        if (category) {
            filter.category = category;
        }


        // ------------------------------------------
        // CITY FILTER
        // ------------------------------------------

        if (city) {
            filter.city = {
                $regex: city,
                $options: "i"
            };
        }


        // ------------------------------------------
        // STATE FILTER
        // ------------------------------------------

        if (state) {
            filter.state = {
                $regex: state,
                $options: "i"
            };
        }


        // ------------------------------------------
        // KEYWORD SEARCH
        // ------------------------------------------

        if (keyword) {

            filter.$or = [

                {
                    name: {
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
                }

            ];
        }


        // ------------------------------------------
        // PAGINATION
        // ------------------------------------------

        const pageNumber =
            Math.max(parseInt(page), 1);

        const limitNumber =
            Math.min(
                Math.max(parseInt(limit), 1),
                100
            );

        const skip =
            (pageNumber - 1) *
            limitNumber;


        // ------------------------------------------
        // GET BUSINESSES
        // ------------------------------------------

        const businesses =
            await Business.find(filter)

                .populate(
                    "owner",
                    "name email phone"
                )

                .sort({
                    createdAt: -1
                })

                .skip(skip)

                .limit(limitNumber);


        const total =
            await Business.countDocuments(filter);


        return res.status(200).json({

            success: true,

            count: businesses.length,

            total,

            page: pageNumber,

            pages:
                Math.ceil(
                    total / limitNumber
                ),

            businesses

        });

    } catch (error) {

        console.error(
            "Get Businesses Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve businesses."

        });
    }
};


// ==========================================
// GET BUSINESS BY ID
// GET /api/businesses/:id
// ==========================================

exports.getBusinessById = async (req, res) => {
    try {

        const business =
            await Business.findById(
                req.params.id
            )

            .populate(
                "owner",
                "name email phone"
            );


        if (!business) {

            return res.status(404).json({

                success: false,

                message:
                    "Business not found."

            });
        }


        // ------------------------------------------
        // INCREASE VIEW COUNT
        // ------------------------------------------

        business.views =
            (business.views || 0) + 1;

        await business.save();


        return res.status(200).json({

            success: true,

            business

        });

    } catch (error) {

        console.error(
            "Get Business Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve business."

        });
    }
};


// ==========================================
// GET MY BUSINESSES
// GET /api/businesses/my-businesses
// ==========================================

exports.getMyBusinesses = async (req, res) => {
    try {

        const businesses =
            await Business.find({

                owner: req.user.id

            })

            .sort({
                createdAt: -1
            });


        return res.status(200).json({

            success: true,

            count: businesses.length,

            businesses

        });

    } catch (error) {

        console.error(
            "Get My Businesses Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve your businesses."

        });
    }
};


// ==========================================
// UPDATE BUSINESS
// PUT /api/businesses/:id
// ==========================================

exports.updateBusiness = async (req, res) => {
    try {

        const {
            name,
            description,
            category,
            phone,
            email,
            website,
            address,
            city,
            state,
            pincode,
            openingTime,
            closingTime,
            workingDays,
            images,
            services
        } = req.body;


        const business =
            await Business.findById(
                req.params.id
            );


        if (!business) {

            return res.status(404).json({

                success: false,

                message:
                    "Business not found."

            });
        }


        // ------------------------------------------
        // CHECK OWNER
        // ------------------------------------------

        if (
            business.owner.toString() !==
            req.user.id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You can update only your own business."

            });
        }


        // ------------------------------------------
        // UPDATE FIELDS
        // ------------------------------------------

        if (name !== undefined) {
            business.name = name.trim();
        }

        if (description !== undefined) {
            business.description =
                description.trim();
        }

        if (category !== undefined) {
            business.category = category;
        }

        if (phone !== undefined) {
            business.phone = phone.trim();
        }

        if (email !== undefined) {
            business.email =
                email.toLowerCase().trim();
        }

        if (website !== undefined) {
            business.website =
                website.trim();
        }

        if (address !== undefined) {
            business.address =
                address.trim();
        }

        if (city !== undefined) {
            business.city =
                city.trim();
        }

        if (state !== undefined) {
            business.state =
                state.trim();
        }

        if (pincode !== undefined) {
            business.pincode =
                pincode.trim();
        }

        if (openingTime !== undefined) {
            business.openingTime =
                openingTime;
        }

        if (closingTime !== undefined) {
            business.closingTime =
                closingTime;
        }

        if (workingDays !== undefined) {
            business.workingDays =
                Array.isArray(workingDays)
                    ? workingDays
                    : [];
        }

        if (images !== undefined) {
            business.images =
                Array.isArray(images)
                    ? images
                    : [];
        }

        if (services !== undefined) {
            business.services =
                Array.isArray(services)
                    ? services
                    : [];
        }


        // ------------------------------------------
        // SEND BACK FOR APPROVAL
        // ------------------------------------------

        business.status = "pending";


        await business.save();


        return res.status(200).json({

            success: true,

            message:
                "Business updated and submitted for approval.",

            business

        });

    } catch (error) {

        console.error(
            "Update Business Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to update business."

        });
    }
};


// ==========================================
// DELETE BUSINESS
// DELETE /api/businesses/:id
// ==========================================

exports.deleteBusiness = async (req, res) => {
    try {

        const business =
            await Business.findById(
                req.params.id
            );


        if (!business) {

            return res.status(404).json({

                success: false,

                message:
                    "Business not found."

            });
        }


        // ------------------------------------------
        // CHECK OWNER
        // ------------------------------------------

        if (
            business.owner.toString() !==
            req.user.id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You can delete only your own business."

            });
        }


        await Business.findByIdAndDelete(
            req.params.id
        );


        return res.status(200).json({

            success: true,

            message:
                "Business deleted successfully."

        });

    } catch (error) {

        console.error(
            "Delete Business Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to delete business."

        });
    }
};


// ==========================================
// SEARCH BUSINESSES
// GET /api/businesses/search?keyword=restaurant
// ==========================================

exports.searchBusinesses = async (req, res) => {
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


        const businesses =
            await Business.find({

                status: "approved",

                $or: [

                    {
                        name: {
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
                        city: {
                            $regex: keyword,
                            $options: "i"
                        }
                    }

                ]

            })

            .populate(
                "owner",
                "name email phone"
            )

            .sort({
                createdAt: -1
            })

            .limit(50);


        return res.status(200).json({

            success: true,

            count: businesses.length,

            businesses

        });

    } catch (error) {

        console.error(
            "Search Businesses Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to search businesses."

        });
    }
};


// ==========================================
// GET PENDING BUSINESSES
// ADMIN
// GET /api/businesses/admin/pending
// ==========================================

exports.getPendingBusinesses = async (req, res) => {
    try {

        const businesses =
            await Business.find({

                status: "pending"

            })

            .populate(
                "owner",
                "name email phone"
            )

            .sort({
                createdAt: -1
            });


        return res.status(200).json({

            success: true,

            count: businesses.length,

            businesses

        });

    } catch (error) {

        console.error(
            "Get Pending Businesses Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve pending businesses."

        });
    }
};


// ==========================================
// APPROVE BUSINESS
// ADMIN
// PATCH /api/businesses/:id/approve
// ==========================================

exports.approveBusiness = async (req, res) => {
    try {

        const business =
            await Business.findById(
                req.params.id
            );


        if (!business) {

            return res.status(404).json({

                success: false,

                message:
                    "Business not found."

            });
        }


        business.status = "approved";

        business.approvedBy =
            req.user.id;

        business.approvedAt =
            new Date();


        await business.save();


        return res.status(200).json({

            success: true,

            message:
                "Business approved successfully.",

            business

        });

    } catch (error) {

        console.error(
            "Approve Business Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to approve business."

        });
    }
};


// ==========================================
// REJECT BUSINESS
// ADMIN
// PATCH /api/businesses/:id/reject
// ==========================================

exports.rejectBusiness = async (req, res) => {
    try {

        const {
            reason
        } = req.body;


        const business =
            await Business.findById(
                req.params.id
            );


        if (!business) {

            return res.status(404).json({

                success: false,

                message:
                    "Business not found."

            });
        }


        business.status = "rejected";

        business.rejectionReason =
            reason
                ? reason.trim()
                : "Business rejected by administrator.";

        business.rejectedBy =
            req.user.id;

        business.rejectedAt =
            new Date();


        await business.save();


        return res.status(200).json({

            success: true,

            message:
                "Business rejected successfully.",

            business

        });

    } catch (error) {

        console.error(
            "Reject Business Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to reject business."

        });
    }
};


// ==========================================
// UPDATE BUSINESS STATUS
// ADMIN
// PATCH /api/businesses/:id/status
// ==========================================

exports.updateBusinessStatus = async (req, res) => {
    try {

        const {
            status
        } = req.body;


        const allowedStatuses = [
            "pending",
            "approved",
            "rejected",
            "suspended",
            "closed"
        ];


        if (
            !allowedStatuses.includes(status)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid business status."

            });
        }


        const business =
            await Business.findByIdAndUpdate(

                req.params.id,

                {
                    status
                },

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!business) {

            return res.status(404).json({

                success: false,

                message:
                    "Business not found."

            });
        }


        return res.status(200).json({

            success: true,

            message:
                "Business status updated successfully.",

            business

        });

    } catch (error) {

        console.error(
            "Update Business Status Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to update business status."

        });
    }
};


// ==========================================
// GET BUSINESS STATISTICS
// ADMIN
// GET /api/businesses/admin/statistics
// ==========================================

exports.getBusinessStatistics = async (req, res) => {
    try {

        const totalBusinesses =
            await Business.countDocuments();


        const approvedBusinesses =
            await Business.countDocuments({
                status: "approved"
            });


        const pendingBusinesses =
            await Business.countDocuments({
                status: "pending"
            });


        const rejectedBusinesses =
            await Business.countDocuments({
                status: "rejected"
            });


        const suspendedBusinesses =
            await Business.countDocuments({
                status: "suspended"
            });


        return res.status(200).json({

            success: true,

            statistics: {

                totalBusinesses,

                approvedBusinesses,

                pendingBusinesses,

                rejectedBusinesses,

                suspendedBusinesses

            }

        });

    } catch (error) {

        console.error(
            "Business Statistics Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve business statistics."

        });
    }
};