// ==========================================
// MERA ILAKA - ADMIN CONTROLLER
// ==========================================

const User = require("../models/User");
const Resident = require("../models/Resident");
const Business = require("../models/Business");
const Service = require("../models/Service");
const Announcement = require("../models/Announcement");
const Event = require("../models/Event");
const Complaint = require("../models/Complaint");
const Product = require("../models/Product");
const Group = require("../models/Group");
const Emergency = require("../models/Emergency");


// ==========================================
// ADMIN DASHBOARD STATISTICS
// GET /api/admin/dashboard
// ==========================================

exports.getDashboardStats = async (req, res) => {
    try {

        const [
            totalUsers,
            totalResidents,
            totalBusinesses,
            totalServices,
            totalAnnouncements,
            totalEvents,
            totalComplaints,
            totalProducts,
            totalGroups,
            totalEmergencies,

            pendingComplaints,
            activeEmergencies,
            pendingEvents,
            pendingBusinesses
        ] = await Promise.all([

            User.countDocuments(),

            Resident.countDocuments(),

            Business.countDocuments(),

            Service.countDocuments(),

            Announcement.countDocuments(),

            Event.countDocuments(),

            Complaint.countDocuments(),

            Product.countDocuments(),

            Group.countDocuments(),

            Emergency.countDocuments(),

            Complaint.countDocuments({
                status: "pending"
            }),

            Emergency.countDocuments({
                status: {
                    $in: [
                        "active",
                        "acknowledged",
                        "responding"
                    ]
                }
            }),

            Event.countDocuments({
                status: "pending"
            }),

            Business.countDocuments({
                status: "pending"
            })

        ]);


        return res.status(200).json({

            success: true,

            statistics: {

                totalUsers,

                totalResidents,

                totalBusinesses,

                totalServices,

                totalAnnouncements,

                totalEvents,

                totalComplaints,

                totalProducts,

                totalGroups,

                totalEmergencies,

                pendingComplaints,

                activeEmergencies,

                pendingEvents,

                pendingBusinesses

            }

        });

    } catch (error) {

        console.error(
            "Admin Dashboard Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to load admin dashboard."

        });

    }
};


// ==========================================
// GET ALL USERS
// GET /api/admin/users
// ==========================================

exports.getUsers = async (req, res) => {
    try {

        const {
            role,
            status,
            keyword,
            page = 1,
            limit = 20
        } = req.query;


        const filter = {};


        if (role) {

            filter.role = role;

        }


        if (status) {

            filter.status = status;

        }


        if (keyword) {

            filter.$or = [

                {
                    name: {
                        $regex: keyword,
                        $options: "i"
                    }
                },

                {
                    email: {
                        $regex: keyword,
                        $options: "i"
                    }
                },

                {
                    phone: {
                        $regex: keyword,
                        $options: "i"
                    }
                }

            ];

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


        const users =
            await User.find(filter)

                .select("-password")

                .sort({
                    createdAt: -1
                })

                .skip(skip)

                .limit(limitNumber);


        const total =
            await User.countDocuments(
                filter
            );


        return res.status(200).json({

            success: true,

            count:
                users.length,

            total,

            page:
                pageNumber,

            pages:
                Math.ceil(
                    total / limitNumber
                ),

            users

        });

    } catch (error) {

        console.error(
            "Get Users Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve users."

        });

    }
};


// ==========================================
// GET USER BY ID
// GET /api/admin/users/:id
// ==========================================

exports.getUserById = async (req, res) => {
    try {

        const user =
            await User.findById(
                req.params.id
            )

            .select("-password");


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found."

            });

        }


        return res.status(200).json({

            success: true,

            user

        });

    } catch (error) {

        console.error(
            "Get User Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve user."

        });

    }
};


// ==========================================
// UPDATE USER STATUS
// PATCH /api/admin/users/:id/status
// ==========================================

exports.updateUserStatus = async (req, res) => {
    try {

        const {
            status
        } = req.body;


        const allowedStatuses = [

            "active",
            "inactive",
            "suspended",
            "blocked"

        ];


        if (
            !allowedStatuses.includes(
                status
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid user status."

            });

        }


        const user =
            await User.findById(
                req.params.id
            );


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found."

            });

        }


        user.status =
            status;


        await user.save();


        return res.status(200).json({

            success: true,

            message:
                "User status updated successfully.",

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                status: user.status

            }

        });

    } catch (error) {

        console.error(
            "Update User Status Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to update user status."

        });

    }
};


// ==========================================
// UPDATE USER ROLE
// PATCH /api/admin/users/:id/role
// ==========================================

exports.updateUserRole = async (req, res) => {
    try {

        const {
            role
        } = req.body;


        const allowedRoles = [

            "resident",
            "business",
            "service_provider",
            "admin"

        ];


        if (
            !allowedRoles.includes(
                role
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid user role."

            });

        }


        const user =
            await User.findById(
                req.params.id
            );


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found."

            });

        }


        user.role =
            role;


        await user.save();


        return res.status(200).json({

            success: true,

            message:
                "User role updated successfully.",

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                role: user.role

            }

        });

    } catch (error) {

        console.error(
            "Update User Role Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to update user role."

        });

    }
};


// ==========================================
// DELETE USER
// DELETE /api/admin/users/:id
// ==========================================

exports.deleteUser = async (req, res) => {
    try {

        const user =
            await User.findById(
                req.params.id
            );


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found."

            });

        }


        if (
            user._id.toString() ===
            req.user.id.toString()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Admin cannot delete their own account."

            });

        }


        await User.findByIdAndDelete(
            req.params.id
        );


        return res.status(200).json({

            success: true,

            message:
                "User deleted successfully."

        });

    } catch (error) {

        console.error(
            "Delete User Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to delete user."

        });

    }
};


// ==========================================
// GET RESIDENTS
// GET /api/admin/residents
// ==========================================

exports.getResidents = async (req, res) => {
    try {

        const {
            status,
            city,
            keyword
        } = req.query;


        const filter = {};


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


        if (keyword) {

            filter.$or = [

                {
                    name: {
                        $regex: keyword,
                        $options: "i"
                    }
                },

                {
                    email: {
                        $regex: keyword,
                        $options: "i"
                    }
                },

                {
                    phone: {
                        $regex: keyword,
                        $options: "i"
                    }
                }

            ];

        }


        const residents =
            await Resident.find(filter)

                .populate(
                    "user",
                    "name email phone status"
                )

                .sort({
                    createdAt: -1
                });


        return res.status(200).json({

            success: true,

            count:
                residents.length,

            residents

        });

    } catch (error) {

        console.error(
            "Get Residents Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve residents."

        });

    }
};


// ==========================================
// GET BUSINESSES
// GET /api/admin/businesses
// ==========================================

exports.getBusinesses = async (req, res) => {
    try {

        const {
            status,
            category,
            city,
            keyword
        } = req.query;


        const filter = {};


        if (status) {

            filter.status =
                status;

        }


        if (category) {

            filter.category =
                category;

        }


        if (city) {

            filter.city = {

                $regex: city,

                $options: "i"

            };

        }


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
                    city: {
                        $regex: keyword,
                        $options: "i"
                    }
                }

            ];

        }


        const businesses =
            await Business.find(filter)

                .populate(
                    "owner",
                    "name email phone"
                )

                .sort({
                    createdAt: -1
                });


        return res.status(200).json({

            success: true,

            count:
                businesses.length,

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
// UPDATE BUSINESS STATUS
// PATCH /api/admin/businesses/:id/status
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
            "inactive"

        ];


        if (
            !allowedStatuses.includes(
                status
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid business status."

            });

        }


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


        business.status =
            status;


        await business.save();


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
// GET SERVICES
// GET /api/admin/services
// ==========================================

exports.getServices = async (req, res) => {
    try {

        const {
            status,
            category,
            city,
            keyword
        } = req.query;


        const filter = {};


        if (status) {

            filter.status =
                status;

        }


        if (category) {

            filter.category =
                category;

        }


        if (city) {

            filter.city = {

                $regex: city,

                $options: "i"

            };

        }


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
                }

            ];

        }


        const services =
            await Service.find(filter)

                .populate(
                    "provider",
                    "name email phone"
                )

                .sort({
                    createdAt: -1
                });


        return res.status(200).json({

            success: true,

            count:
                services.length,

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
// UPDATE SERVICE STATUS
// PATCH /api/admin/services/:id/status
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
            !allowedStatuses.includes(
                status
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid service status."

            });

        }


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


        service.status =
            status;


        await service.save();


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
// GET EVENTS
// GET /api/admin/events
// ==========================================

exports.getEvents = async (req, res) => {
    try {

        const {
            status,
            category,
            city,
            keyword
        } = req.query;


        const filter = {};


        if (status) {

            filter.status =
                status;

        }


        if (category) {

            filter.category =
                category;

        }


        if (city) {

            filter.city = {

                $regex: city,

                $options: "i"

            };

        }


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
                }

            ];

        }


        const events =
            await Event.find(filter)

                .populate(
                    "organizer",
                    "name email phone"
                )

                .sort({
                    createdAt: -1
                });


        return res.status(200).json({

            success: true,

            count:
                events.length,

            events

        });

    } catch (error) {

        console.error(
            "Get Events Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve events."

        });

    }
};


// ==========================================
// UPDATE EVENT STATUS
// PATCH /api/admin/events/:id/status
// ==========================================

exports.updateEventStatus = async (req, res) => {
    try {

        const {
            status
        } = req.body;


        const allowedStatuses = [

            "pending",
            "approved",
            "rejected",
            "cancelled",
            "completed"

        ];


        if (
            !allowedStatuses.includes(
                status
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid event status."

            });

        }


        const event =
            await Event.findById(
                req.params.id
            );


        if (!event) {

            return res.status(404).json({

                success: false,

                message:
                    "Event not found."

            });

        }


        event.status =
            status;


        await event.save();


        return res.status(200).json({

            success: true,

            message:
                "Event status updated successfully.",

            event

        });

    } catch (error) {

        console.error(
            "Update Event Status Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to update event status."

        });

    }
};


// ==========================================
// GET MARKETPLACE PRODUCTS
// GET /api/admin/marketplace
// ==========================================

exports.getMarketplaceProducts = async (req, res) => {
    try {

        const {
            status,
            category,
            keyword
        } = req.query;


        const filter = {};


        if (status) {

            filter.status =
                status;

        }


        if (category) {

            filter.category =
                category;

        }


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
                }

            ];

        }


        const products =
            await Product.find(filter)

                .populate(
                    "seller",
                    "name email phone"
                )

                .sort({
                    createdAt: -1
                });


        return res.status(200).json({

            success: true,

            count:
                products.length,

            products

        });

    } catch (error) {

        console.error(
            "Get Marketplace Products Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve marketplace products."

        });

    }
};


// ==========================================
// UPDATE PRODUCT STATUS
// PATCH /api/admin/marketplace/:id/status
// ==========================================

exports.updateProductStatus = async (req, res) => {
    try {

        const {
            status
        } = req.body;


        const allowedStatuses = [

            "pending",
            "approved",
            "rejected",
            "sold",
            "inactive"

        ];


        if (
            !allowedStatuses.includes(
                status
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid product status."

            });

        }


        const product =
            await Product.findById(
                req.params.id
            );


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found."

            });

        }


        product.status =
            status;


        await product.save();


        return res.status(200).json({

            success: true,

            message:
                "Product status updated successfully.",

            product

        });

    } catch (error) {

        console.error(
            "Update Product Status Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to update product status."

        });

    }
};


// ==========================================
// GET COMPLAINT REPORT
// GET /api/admin/reports/complaints
// ==========================================

exports.getComplaintReport = async (req, res) => {
    try {

        const [
            total,
            pending,
            inProgress,
            resolved,
            rejected,
            closed
        ] = await Promise.all([

            Complaint.countDocuments(),

            Complaint.countDocuments({
                status: "pending"
            }),

            Complaint.countDocuments({
                status: "in-progress"
            }),

            Complaint.countDocuments({
                status: "resolved"
            }),

            Complaint.countDocuments({
                status: "rejected"
            }),

            Complaint.countDocuments({
                status: "closed"
            })

        ]);


        return res.status(200).json({

            success: true,

            report: {

                total,

                pending,

                inProgress,

                resolved,

                rejected,

                closed

            }

        });

    } catch (error) {

        console.error(
            "Complaint Report Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to generate complaint report."

        });

    }
};


// ==========================================
// GET USER REPORT
// GET /api/admin/reports/users
// ==========================================

exports.getUserReport = async (req, res) => {
    try {

        const [
            total,
            admins,
            residents,
            businesses,
            serviceProviders,
            active,
            inactive,
            suspended
        ] = await Promise.all([

            User.countDocuments(),

            User.countDocuments({
                role: "admin"
            }),

            User.countDocuments({
                role: "resident"
            }),

            User.countDocuments({
                role: "business"
            }),

            User.countDocuments({
                role: "service_provider"
            }),

            User.countDocuments({
                status: "active"
            }),

            User.countDocuments({
                status: "inactive"
            }),

            User.countDocuments({
                status: "suspended"
            })

        ]);


        return res.status(200).json({

            success: true,

            report: {

                total,

                admins,

                residents,

                businesses,

                serviceProviders,

                active,

                inactive,

                suspended

            }

        });

    } catch (error) {

        console.error(
            "User Report Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to generate user report."

        });

    }
};


// ==========================================
// GET BUSINESS REPORT
// GET /api/admin/reports/businesses
// ==========================================

exports.getBusinessReport = async (req, res) => {
    try {

        const [
            total,
            pending,
            approved,
            rejected,
            suspended
        ] = await Promise.all([

            Business.countDocuments(),

            Business.countDocuments({
                status: "pending"
            }),

            Business.countDocuments({
                status: "approved"
            }),

            Business.countDocuments({
                status: "rejected"
            }),

            Business.countDocuments({
                status: "suspended"
            })

        ]);


        return res.status(200).json({

            success: true,

            report: {

                total,

                pending,

                approved,

                rejected,

                suspended

            }

        });

    } catch (error) {

        console.error(
            "Business Report Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to generate business report."

        });

    }
};


// ==========================================
// GET EMERGENCY REPORT
// GET /api/admin/reports/emergencies
// ==========================================

exports.getEmergencyReport = async (req, res) => {
    try {

        const [
            total,
            active,
            acknowledged,
            responding,
            resolved,
            cancelled,
            critical
        ] = await Promise.all([

            Emergency.countDocuments(),

            Emergency.countDocuments({
                status: "active"
            }),

            Emergency.countDocuments({
                status: "acknowledged"
            }),

            Emergency.countDocuments({
                status: "responding"
            }),

            Emergency.countDocuments({
                status: "resolved"
            }),

            Emergency.countDocuments({
                status: "cancelled"
            }),

            Emergency.countDocuments({
                severity: "critical"
            })

        ]);


        return res.status(200).json({

            success: true,

            report: {

                total,

                active,

                acknowledged,

                responding,

                resolved,

                cancelled,

                critical

            }

        });

    } catch (error) {

        console.error(
            "Emergency Report Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to generate emergency report."

        });

    }
};


// ==========================================
// DELETE ANNOUNCEMENT
// DELETE /api/admin/announcements/:id
// ==========================================

exports.deleteAnnouncement = async (req, res) => {
    try {

        const announcement =
            await Announcement.findById(
                req.params.id
            );


        if (!announcement) {

            return res.status(404).json({

                success: false,

                message:
                    "Announcement not found."

            });

        }


        await Announcement.findByIdAndDelete(
            req.params.id
        );


        return res.status(200).json({

            success: true,

            message:
                "Announcement deleted successfully."

        });

    } catch (error) {

        console.error(
            "Delete Announcement Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to delete announcement."

        });

    }
};


// ==========================================
// DELETE EVENT
// DELETE /api/admin/events/:id
// ==========================================

exports.deleteEvent = async (req, res) => {
    try {

        const event =
            await Event.findById(
                req.params.id
            );


        if (!event) {

            return res.status(404).json({

                success: false,

                message:
                    "Event not found."

            });

        }


        await Event.findByIdAndDelete(
            req.params.id
        );


        return res.status(200).json({

            success: true,

            message:
                "Event deleted successfully."

        });

    } catch (error) {

        console.error(
            "Delete Event Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to delete event."

        });

    }
};


// ==========================================
// DELETE BUSINESS
// DELETE /api/admin/businesses/:id
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
// DELETE PRODUCT
// DELETE /api/admin/marketplace/:id
// ==========================================

exports.deleteProduct = async (req, res) => {
    try {

        const product =
            await Product.findById(
                req.params.id
            );


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found."

            });

        }


        await Product.findByIdAndDelete(
            req.params.id
        );


        return res.status(200).json({

            success: true,

            message:
                "Marketplace product deleted successfully."

        });

    } catch (error) {

        console.error(
            "Delete Product Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to delete marketplace product."

        });

    }
};


// ==========================================
// GET GROUP REPORT
// GET /api/admin/reports/groups
// ==========================================

exports.getGroupReport = async (req, res) => {
    try {

        const [
            total,
            pending,
            approved,
            rejected,
            suspended
        ] = await Promise.all([

            Group.countDocuments(),

            Group.countDocuments({
                status: "pending"
            }),

            Group.countDocuments({
                status: "approved"
            }),

            Group.countDocuments({
                status: "rejected"
            }),

            Group.countDocuments({
                status: "suspended"
            })

        ]);


        return res.status(200).json({

            success: true,

            report: {

                total,

                pending,

                approved,

                rejected,

                suspended

            }

        });

    } catch (error) {

        console.error(
            "Group Report Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to generate group report."

        });

    }
};


// ==========================================
// ADMIN HEALTH CHECK
// GET /api/admin/health
// ==========================================

exports.adminHealthCheck = async (req, res) => {
    try {

        return res.status(200).json({

            success: true,

            message:
                "Mera Ilaka admin system is working correctly.",

            admin: {

                id:
                    req.user.id,

                name:
                    req.user.name,

                role:
                    req.user.role

            },

            timestamp:
                new Date()

        });

    } catch (error) {

        console.error(
            "Admin Health Check Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Admin system health check failed."

        });

    }
};