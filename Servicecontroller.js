// ==========================================
// MERA ILAKA - SERVICE CONTROLLER
// ==========================================

const Service = require("../models/Service");


// ==========================================
// CREATE SERVICE
// POST /api/services
// ==========================================

exports.createService = async (req, res) => {
    try {

        const {
            name,
            description,
            category,
            providerName,
            phone,
            email,
            price,
            pricingType,
            address,
            city,
            state,
            pincode,
            availability,
            workingDays,
            images
        } = req.body;


        // ------------------------------------------
        // VALIDATE REQUIRED FIELDS
        // ------------------------------------------

        if (!name || !description || !category || !phone) {

            return res.status(400).json({
                success: false,
                message:
                    "Service name, description, category and phone are required."
            });

        }


        // ------------------------------------------
        // VALIDATE PRICE
        // ------------------------------------------

        if (
            price !== undefined &&
            price !== null &&
            Number(price) < 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Service price cannot be negative."
            });

        }


        // ------------------------------------------
        // CREATE SERVICE
        // ------------------------------------------

        const service = await Service.create({

            provider: req.user.id,

            name: name.trim(),

            description: description.trim(),

            category,

            providerName:
                providerName
                    ? providerName.trim()
                    : "",

            phone: phone.trim(),

            email:
                email
                    ? email.toLowerCase().trim()
                    : "",

            price:
                price !== undefined
                    ? Number(price)
                    : 0,

            pricingType:
                pricingType || "fixed",

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

            availability:
                availability || "available",

            workingDays:
                Array.isArray(workingDays)
                    ? workingDays
                    : [],

            images:
                Array.isArray(images)
                    ? images
                    : [],

            status: "pending"

        });


        return res.status(201).json({

            success: true,

            message:
                "Service submitted successfully and is waiting for approval.",

            service

        });

    } catch (error) {

        console.error(
            "Create Service Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to create service."

        });
    }
};


// ==========================================
// GET ALL APPROVED SERVICES
// GET /api/services
// ==========================================

exports.getServices = async (req, res) => {
    try {

        const {
            category,
            city,
            state,
            availability,
            keyword,
            minPrice,
            maxPrice,
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
        // AVAILABILITY FILTER
        // ------------------------------------------

        if (availability) {

            filter.availability =
                availability;

        }


        // ------------------------------------------
        // PRICE FILTER
        // ------------------------------------------

        if (
            minPrice !== undefined ||
            maxPrice !== undefined
        ) {

            filter.price = {};

            if (minPrice !== undefined) {

                filter.price.$gte =
                    Number(minPrice);

            }

            if (maxPrice !== undefined) {

                filter.price.$lte =
                    Number(maxPrice);

            }

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
                },

                {
                    providerName: {
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
        // GET SERVICES
        // ------------------------------------------

        const services =
            await Service.find(filter)

                .populate(
                    "provider",
                    "name email phone"
                )

                .sort({
                    createdAt: -1
                })

                .skip(skip)

                .limit(limitNumber);


        const total =
            await Service.countDocuments(filter);


        return res.status(200).json({

            success: true,

            count: services.length,

            total,

            page: pageNumber,

            pages:
                Math.ceil(
                    total / limitNumber
                ),

            services

        });

    } catch (error) {

        console.error(
            "Get Services Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve services."

        });
    }
};


// ==========================================
// GET SERVICE BY ID
// GET /api/services/:id
// ==========================================

exports.getServiceById = async (req, res) => {
    try {

        const service =
            await Service.findById(
                req.params.id
            )

            .populate(
                "provider",
                "name email phone"
            );


        if (!service) {

            return res.status(404).json({

                success: false,

                message:
                    "Service not found."

            });

        }


        // ------------------------------------------
        // INCREASE VIEW COUNT
        // ------------------------------------------

        service.views =
            (service.views || 0) + 1;


        await service.save();


        return res.status(200).json({

            success: true,

            service

        });

    } catch (error) {

        console.error(
            "Get Service Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve service."

        });
    }
};


// ==========================================
// GET MY SERVICES
// GET /api/services/my-services
// ==========================================

exports.getMyServices = async (req, res) => {
    try {

        const services =
            await Service.find({

                provider: req.user.id

            })

            .sort({
                createdAt: -1
            });


        return res.status(200).json({

            success: true,

            count: services.length,

            services

        });

    } catch (error) {

        console.error(
            "Get My Services Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve your services."

        });
    }
};


// ==========================================
// UPDATE SERVICE
// PUT /api/services/:id
// ==========================================

exports.updateService = async (req, res) => {
    try {

        const {
            name,
            description,
            category,
            providerName,
            phone,
            email,
            price,
            pricingType,
            address,
            city,
            state,
            pincode,
            availability,
            workingDays,
            images
        } = req.body;


        const service =
            await Service.findById(
                req.params.id
            );


        if (!service) {

            return res.status(404).json({

                success: false,

                message:
                    "Service not found."

            });

        }


        // ------------------------------------------
        // CHECK SERVICE OWNER
        // ------------------------------------------

        if (
            service.provider.toString() !==
            req.user.id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You can update only your own service."

            });

        }


        // ------------------------------------------
        // UPDATE FIELDS
        // ------------------------------------------

        if (name !== undefined) {

            service.name =
                name.trim();

        }


        if (description !== undefined) {

            service.description =
                description.trim();

        }


        if (category !== undefined) {

            service.category =
                category;

        }


        if (providerName !== undefined) {

            service.providerName =
                providerName.trim();

        }


        if (phone !== undefined) {

            service.phone =
                phone.trim();

        }


        if (email !== undefined) {

            service.email =
                email.toLowerCase().trim();

        }


        if (price !== undefined) {

            if (Number(price) < 0) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Service price cannot be negative."

                });

            }

            service.price =
                Number(price);

        }


        if (pricingType !== undefined) {

            service.pricingType =
                pricingType;

        }


        if (address !== undefined) {

            service.address =
                address.trim();

        }


        if (city !== undefined) {

            service.city =
                city.trim();

        }


        if (state !== undefined) {

            service.state =
                state.trim();

        }


        if (pincode !== undefined) {

            service.pincode =
                pincode.trim();

        }


        if (availability !== undefined) {

            service.availability =
                availability;

        }


        if (workingDays !== undefined) {

            service.workingDays =
                Array.isArray(workingDays)
                    ? workingDays
                    : [];

        }


        if (images !== undefined) {

            service.images =
                Array.isArray(images)
                    ? images
                    : [];

        }


        // ------------------------------------------
        // SEND FOR ADMIN APPROVAL AGAIN
        // ------------------------------------------

        service.status = "pending";


        await service.save();


        return res.status(200).json({

            success: true,

            message:
                "Service updated and submitted for approval.",

            service

        });

    } catch (error) {

        console.error(
            "Update Service Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to update service."

        });
    }
};


// ==========================================
// DELETE SERVICE
// DELETE /api/services/:id
// ==========================================

exports.deleteService = async (req, res) => {
    try {

        const service =
            await Service.findById(
                req.params.id
            );


        if (!service) {

            return res.status(404).json({

                success: false,

                message:
                    "Service not found."

            });

        }


        // ------------------------------------------
        // CHECK OWNER
        // ------------------------------------------

        if (
            service.provider.toString() !==
            req.user.id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You can delete only your own service."

            });

        }


        await Service.findByIdAndDelete(
            req.params.id
        );


        return res.status(200).json({

            success: true,

            message:
                "Service deleted successfully."

        });

    } catch (error) {

        console.error(
            "Delete Service Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to delete service."

        });
    }
};


// ==========================================
// SEARCH SERVICES
// GET /api/services/search?keyword=plumber
// ==========================================

exports.searchServices = async (req, res) => {
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


        const services =
            await Service.find({

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
                        providerName: {
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
                "provider",
                "name email phone"
            )

            .sort({
                createdAt: -1
            })

            .limit(50);


        return res.status(200).json({

            success: true,

            count: services.length,

            services

        });

    } catch (error) {

        console.error(
            "Search Services Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to search services."

        });
    }
};


// ==========================================
// GET PENDING SERVICES
// ADMIN
// GET /api/services/admin/pending
// ==========================================

exports.getPendingServices = async (req, res) => {
    try {

        const services =
            await Service.find({

                status: "pending"

            })

            .populate(
                "provider",
                "name email phone"
            )

            .sort({
                createdAt: -1
            });


        return res.status(200).json({

            success: true,

            count: services.length,

            services

        });

    } catch (error) {

        console.error(
            "Get Pending Services Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve pending services."

        });
    }
};


// ==========================================
// APPROVE SERVICE
// ADMIN
// PATCH /api/services/:id/approve
// ==========================================

exports.approveService = async (req, res) => {
    try {

        const service =
            await Service.findById(
                req.params.id
            );


        if (!service) {

            return res.status(404).json({

                success: false,

                message:
                    "Service not found."

            });

        }


        service.status = "approved";

        service.approvedBy =
            req.user.id;

        service.approvedAt =
            new Date();


        await service.save();


        return res.status(200).json({

            success: true,

            message:
                "Service approved successfully.",

            service

        });

    } catch (error) {

        console.error(
            "Approve Service Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to approve service."

        });
    }
};


// ==========================================
// REJECT SERVICE
// ADMIN
// PATCH /api/services/:id/reject
// ==========================================

exports.rejectService = async (req, res) => {
    try {

        const {
            reason
        } = req.body;


        const service =
            await Service.findById(
                req.params.id
            );


        if (!service) {

            return res.status(404).json({

                success: false,

                message:
                    "Service not found."

            });

        }


        service.status = "rejected";


        service.rejectionReason =
            reason
                ? reason.trim()
                : "Service rejected by administrator.";


        service.rejectedBy =
            req.user.id;


        service.rejectedAt =
            new Date();


        await service.save();


        return res.status(200).json({

            success: true,

            message:
                "Service rejected successfully.",

            service

        });

    } catch (error) {

        console.error(
            "Reject Service Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to reject service."

        });
    }
};


// ==========================================
// UPDATE SERVICE STATUS
// ADMIN
// PATCH /api/services/:id/status
// ==========================================

exports.updateServiceStatus = async (req, res) => {
    try {

        const {
            status
        } = req.body;


        const allowedStatuses = [

            "pending",
            "approved",
            "rejected",
            "suspended",
            "inactive"

        ];


        if (
            !allowedStatuses.includes(status)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid service status."

            });

        }


        const service =
            await Service.findByIdAndUpdate(

                req.params.id,

                {
                    status
                },

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!service) {

            return res.status(404).json({

                success: false,

                message:
                    "Service not found."

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Service status updated successfully.",

            service

        });

    } catch (error) {

        console.error(
            "Update Service Status Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to update service status."

        });
    }
};


// ==========================================
// GET SERVICE STATISTICS
// ADMIN
// GET /api/services/admin/statistics
// ==========================================

exports.getServiceStatistics = async (req, res) => {
    try {

        const totalServices =
            await Service.countDocuments();


        const approvedServices =
            await Service.countDocuments({
                status: "approved"
            });


        const pendingServices =
            await Service.countDocuments({
                status: "pending"
            });


        const rejectedServices =
            await Service.countDocuments({
                status: "rejected"
            });


        const suspendedServices =
            await Service.countDocuments({
                status: "suspended"
            });


        return res.status(200).json({

            success: true,

            statistics: {

                totalServices,

                approvedServices,

                pendingServices,

                rejectedServices,

                suspendedServices

            }

        });

    } catch (error) {

        console.error(
            "Service Statistics Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve service statistics."

        });
    }
};