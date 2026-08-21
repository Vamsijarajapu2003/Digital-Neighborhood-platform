// ==========================================
// MERA ILAKA - ANNOUNCEMENT CONTROLLER
// ==========================================

const Announcement = require("../models/Announcement");


// ==========================================
// CREATE ANNOUNCEMENT
// POST /api/announcements
// ==========================================

exports.createAnnouncement = async (req, res) => {
    try {

        const {
            title,
            content,
            category,
            priority,
            targetAudience,
            location,
            image,
            publishDate,
            expiryDate
        } = req.body;


        // ------------------------------------------
        // VALIDATE REQUIRED FIELDS
        // ------------------------------------------

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required."
            });
        }


        // ------------------------------------------
        // CREATE ANNOUNCEMENT
        // ------------------------------------------

        const announcement = await Announcement.create({

            title: title.trim(),

            content: content.trim(),

            category: category || "general",

            priority: priority || "normal",

            targetAudience: targetAudience || "all",

            location: location || {},

            image: image || "",

            publishDate: publishDate || new Date(),

            expiryDate: expiryDate || null,

            createdBy: req.user.id

        });


        return res.status(201).json({

            success: true,

            message: "Announcement created successfully.",

            announcement

        });

    } catch (error) {

        console.error(
            "Create Announcement Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Unable to create announcement."

        });

    }
};


// ==========================================
// GET ALL ANNOUNCEMENTS
// GET /api/announcements
// ==========================================

exports.getAllAnnouncements = async (req, res) => {
    try {

        const {
            category,
            priority,
            status,
            page = 1,
            limit = 20
        } = req.query;


        const filter = {};


        // ------------------------------------------
        // CATEGORY FILTER
        // ------------------------------------------

        if (category) {
            filter.category = category;
        }


        // ------------------------------------------
        // PRIORITY FILTER
        // ------------------------------------------

        if (priority) {
            filter.priority = priority;
        }


        // ------------------------------------------
        // STATUS FILTER
        // ------------------------------------------

        if (status) {
            filter.status = status;
        }


        // ------------------------------------------
        // PAGINATION
        // ------------------------------------------

        const pageNumber = Math.max(
            parseInt(page),
            1
        );

        const limitNumber = Math.min(
            Math.max(parseInt(limit), 1),
            100
        );

        const skip =
            (pageNumber - 1) * limitNumber;


        // ------------------------------------------
        // GET ANNOUNCEMENTS
        // ------------------------------------------

        const announcements =
            await Announcement.find(filter)

                .populate(
                    "createdBy",
                    "name email role"
                )

                .sort({
                    createdAt: -1
                })

                .skip(skip)

                .limit(limitNumber);


        const total =
            await Announcement.countDocuments(filter);


        return res.status(200).json({

            success: true,

            count: announcements.length,

            total,

            page: pageNumber,

            pages: Math.ceil(
                total / limitNumber
            ),

            announcements

        });

    } catch (error) {

        console.error(
            "Get Announcements Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve announcements."

        });

    }
};


// ==========================================
// GET PUBLISHED ANNOUNCEMENTS
// GET /api/announcements/published
// ==========================================

exports.getPublishedAnnouncements = async (req, res) => {
    try {

        const now = new Date();


        const announcements =
            await Announcement.find({

                status: "published",

                publishDate: {
                    $lte: now
                },

                $or: [

                    {
                        expiryDate: null
                    },

                    {
                        expiryDate: {
                            $gte: now
                        }
                    }

                ]

            })

            .populate(
                "createdBy",
                "name role"
            )

            .sort({

                priority: -1,

                createdAt: -1

            });


        return res.status(200).json({

            success: true,

            count: announcements.length,

            announcements

        });

    } catch (error) {

        console.error(
            "Get Published Announcements Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve published announcements."

        });

    }
};


// ==========================================
// GET ANNOUNCEMENT BY ID
// GET /api/announcements/:id
// ==========================================

exports.getAnnouncementById = async (req, res) => {
    try {

        const announcement =
            await Announcement.findById(
                req.params.id
            )

            .populate(
                "createdBy",
                "name email role"
            );


        if (!announcement) {

            return res.status(404).json({

                success: false,

                message:
                    "Announcement not found."

            });

        }


        // ------------------------------------------
        // INCREASE VIEW COUNT
        // ------------------------------------------

        announcement.views =
            (announcement.views || 0) + 1;


        await announcement.save();


        return res.status(200).json({

            success: true,

            announcement

        });

    } catch (error) {

        console.error(
            "Get Announcement Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve announcement."

        });

    }
};


// ==========================================
// UPDATE ANNOUNCEMENT
// PUT /api/announcements/:id
// ==========================================

exports.updateAnnouncement = async (req, res) => {
    try {

        const {
            title,
            content,
            category,
            priority,
            targetAudience,
            location,
            image,
            publishDate,
            expiryDate,
            status
        } = req.body;


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


        // ------------------------------------------
        // UPDATE FIELDS
        // ------------------------------------------

        if (title !== undefined) {
            announcement.title =
                title.trim();
        }


        if (content !== undefined) {
            announcement.content =
                content.trim();
        }


        if (category !== undefined) {
            announcement.category =
                category;
        }


        if (priority !== undefined) {
            announcement.priority =
                priority;
        }


        if (targetAudience !== undefined) {
            announcement.targetAudience =
                targetAudience;
        }


        if (location !== undefined) {
            announcement.location =
                location;
        }


        if (image !== undefined) {
            announcement.image =
                image;
        }


        if (publishDate !== undefined) {
            announcement.publishDate =
                publishDate;
        }


        if (expiryDate !== undefined) {
            announcement.expiryDate =
                expiryDate;
        }


        if (status !== undefined) {
            announcement.status =
                status;
        }


        await announcement.save();


        return res.status(200).json({

            success: true,

            message:
                "Announcement updated successfully.",

            announcement

        });

    } catch (error) {

        console.error(
            "Update Announcement Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to update announcement."

        });

    }
};


// ==========================================
// PUBLISH ANNOUNCEMENT
// PATCH /api/announcements/:id/publish
// ==========================================

exports.publishAnnouncement = async (req, res) => {
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


        announcement.status =
            "published";


        announcement.publishDate =
            new Date();


        await announcement.save();


        return res.status(200).json({

            success: true,

            message:
                "Announcement published successfully.",

            announcement

        });

    } catch (error) {

        console.error(
            "Publish Announcement Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to publish announcement."

        });

    }
};


// ==========================================
// DELETE ANNOUNCEMENT
// DELETE /api/announcements/:id
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
// SEARCH ANNOUNCEMENTS
// GET /api/announcements/search?keyword=water
// ==========================================

exports.searchAnnouncements = async (req, res) => {
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


        const announcements =
            await Announcement.find({

                $or: [

                    {
                        title: {
                            $regex: keyword,
                            $options: "i"
                        }
                    },

                    {
                        content: {
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

                ]

            })

            .populate(
                "createdBy",
                "name role"
            )

            .sort({
                createdAt: -1
            })

            .limit(50);


        return res.status(200).json({

            success: true,

            count: announcements.length,

            announcements

        });

    } catch (error) {

        console.error(
            "Search Announcement Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to search announcements."

        });

    }
};