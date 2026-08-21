// ==========================================
// MERA ILAKA - EVENT CONTROLLER
// ==========================================

const Event = require("../models/Event");


// ==========================================
// CREATE EVENT
// POST /api/events
// ==========================================

exports.createEvent = async (req, res) => {
    try {

        const {
            title,
            description,
            category,
            date,
            startTime,
            endTime,
            venue,
            address,
            city,
            state,
            pincode,
            capacity,
            image,
            organizerName,
            organizerPhone,
            organizerEmail
        } = req.body;


        // ------------------------------------------
        // VALIDATE REQUIRED FIELDS
        // ------------------------------------------

        if (
            !title ||
            !description ||
            !category ||
            !date ||
            !venue
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Title, description, category, date and venue are required."
            });

        }


        // ------------------------------------------
        // VALIDATE DATE
        // ------------------------------------------

        const eventDate = new Date(date);

        if (isNaN(eventDate.getTime())) {

            return res.status(400).json({
                success: false,
                message: "Please provide a valid event date."
            });

        }


        // ------------------------------------------
        // VALIDATE CAPACITY
        // ------------------------------------------

        if (
            capacity !== undefined &&
            Number(capacity) < 1
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Event capacity must be at least 1."
            });

        }


        // ------------------------------------------
        // CREATE EVENT
        // ------------------------------------------

        const event = await Event.create({

            organizer: req.user.id,

            title: title.trim(),

            description: description.trim(),

            category,

            date: eventDate,

            startTime: startTime || "",

            endTime: endTime || "",

            venue: venue.trim(),

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

            capacity:
                capacity
                    ? Number(capacity)
                    : 0,

            image: image || "",

            organizerName:
                organizerName
                    ? organizerName.trim()
                    : "",

            organizerPhone:
                organizerPhone
                    ? organizerPhone.trim()
                    : "",

            organizerEmail:
                organizerEmail
                    ? organizerEmail.toLowerCase().trim()
                    : "",

            attendees: [],

            status: "pending"

        });


        return res.status(201).json({

            success: true,

            message:
                "Event created successfully and submitted for approval.",

            event

        });

    } catch (error) {

        console.error(
            "Create Event Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to create event."

        });

    }
};


// ==========================================
// GET ALL APPROVED EVENTS
// GET /api/events
// ==========================================

exports.getEvents = async (req, res) => {
    try {

        const {
            category,
            city,
            state,
            keyword,
            date,
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
        // DATE FILTER
        // ------------------------------------------

        if (date) {

            const selectedDate =
                new Date(date);


            if (!isNaN(selectedDate.getTime())) {

                const startOfDay =
                    new Date(selectedDate);

                startOfDay.setHours(
                    0,
                    0,
                    0,
                    0
                );


                const endOfDay =
                    new Date(selectedDate);

                endOfDay.setHours(
                    23,
                    59,
                    59,
                    999
                );


                filter.date = {

                    $gte: startOfDay,

                    $lte: endOfDay

                };

            }

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
                    venue: {

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
        // GET EVENTS
        // ------------------------------------------

        const events =
            await Event.find(filter)

                .populate(
                    "organizer",
                    "name email phone"
                )

                .sort({

                    date: 1,

                    createdAt: -1

                })

                .skip(skip)

                .limit(limitNumber);


        const total =
            await Event.countDocuments(
                filter
            );


        return res.status(200).json({

            success: true,

            count: events.length,

            total,

            page: pageNumber,

            pages:
                Math.ceil(
                    total / limitNumber
                ),

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
// GET UPCOMING EVENTS
// GET /api/events/upcoming
// ==========================================

exports.getUpcomingEvents = async (req, res) => {
    try {

        const today =
            new Date();


        today.setHours(
            0,
            0,
            0,
            0
        );


        const events =
            await Event.find({

                status: "approved",

                date: {
                    $gte: today
                }

            })

            .populate(
                "organizer",
                "name email phone"
            )

            .sort({

                date: 1

            })

            .limit(50);


        return res.status(200).json({

            success: true,

            count: events.length,

            events

        });

    } catch (error) {

        console.error(
            "Get Upcoming Events Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve upcoming events."

        });

    }
};


// ==========================================
// GET EVENT BY ID
// GET /api/events/:id
// ==========================================

exports.getEventById = async (req, res) => {
    try {

        const event =
            await Event.findById(
                req.params.id
            )

            .populate(
                "organizer",
                "name email phone"
            )

            .populate(
                "attendees",
                "name email phone"
            );


        if (!event) {

            return res.status(404).json({

                success: false,

                message:
                    "Event not found."

            });

        }


        // ------------------------------------------
        // INCREASE VIEW COUNT
        // ------------------------------------------

        event.views =
            (event.views || 0) + 1;


        await event.save();


        return res.status(200).json({

            success: true,

            event

        });

    } catch (error) {

        console.error(
            "Get Event Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve event."

        });

    }
};


// ==========================================
// GET MY EVENTS
// GET /api/events/my-events
// ==========================================

exports.getMyEvents = async (req, res) => {
    try {

        const events =
            await Event.find({

                organizer: req.user.id

            })

            .sort({

                date: -1

            });


        return res.status(200).json({

            success: true,

            count: events.length,

            events

        });

    } catch (error) {

        console.error(
            "Get My Events Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve your events."

        });

    }
};


// ==========================================
// UPDATE EVENT
// PUT /api/events/:id
// ==========================================

exports.updateEvent = async (req, res) => {
    try {

        const {
            title,
            description,
            category,
            date,
            startTime,
            endTime,
            venue,
            address,
            city,
            state,
            pincode,
            capacity,
            image,
            organizerName,
            organizerPhone,
            organizerEmail
        } = req.body;


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


        // ------------------------------------------
        // CHECK ORGANIZER
        // ------------------------------------------

        if (
            event.organizer.toString() !==
            req.user.id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You can update only your own events."

            });

        }


        // ------------------------------------------
        // UPDATE FIELDS
        // ------------------------------------------

        if (title !== undefined) {

            event.title =
                title.trim();

        }


        if (description !== undefined) {

            event.description =
                description.trim();

        }


        if (category !== undefined) {

            event.category =
                category;

        }


        if (date !== undefined) {

            const newDate =
                new Date(date);


            if (isNaN(newDate.getTime())) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please provide a valid event date."

                });

            }


            event.date =
                newDate;

        }


        if (startTime !== undefined) {

            event.startTime =
                startTime;

        }


        if (endTime !== undefined) {

            event.endTime =
                endTime;

        }


        if (venue !== undefined) {

            event.venue =
                venue.trim();

        }


        if (address !== undefined) {

            event.address =
                address.trim();

        }


        if (city !== undefined) {

            event.city =
                city.trim();

        }


        if (state !== undefined) {

            event.state =
                state.trim();

        }


        if (pincode !== undefined) {

            event.pincode =
                pincode.trim();

        }


        if (capacity !== undefined) {

            if (Number(capacity) < 1) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Capacity must be at least 1."

                });

            }


            event.capacity =
                Number(capacity);

        }


        if (image !== undefined) {

            event.image =
                image;

        }


        if (organizerName !== undefined) {

            event.organizerName =
                organizerName.trim();

        }


        if (organizerPhone !== undefined) {

            event.organizerPhone =
                organizerPhone.trim();

        }


        if (organizerEmail !== undefined) {

            event.organizerEmail =
                organizerEmail
                    .toLowerCase()
                    .trim();

        }


        // ------------------------------------------
        // SEND FOR APPROVAL AGAIN
        // ------------------------------------------

        event.status =
            "pending";


        await event.save();


        return res.status(200).json({

            success: true,

            message:
                "Event updated and submitted for approval.",

            event

        });

    } catch (error) {

        console.error(
            "Update Event Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to update event."

        });

    }
};


// ==========================================
// DELETE EVENT
// DELETE /api/events/:id
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


        // ------------------------------------------
        // CHECK ORGANIZER
        // ------------------------------------------

        if (
            event.organizer.toString() !==
            req.user.id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You can delete only your own events."

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
// SEARCH EVENTS
// GET /api/events/search?keyword=festival
// ==========================================

exports.searchEvents = async (req, res) => {
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


        const events =
            await Event.find({

                status: "approved",

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
                        venue: {

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
                "organizer",
                "name email phone"
            )

            .sort({

                date: 1

            })

            .limit(50);


        return res.status(200).json({

            success: true,

            count: events.length,

            events

        });

    } catch (error) {

        console.error(
            "Search Events Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to search events."

        });

    }
};


// ==========================================
// REGISTER FOR EVENT
// POST /api/events/:id/register
// ==========================================

exports.registerForEvent = async (req, res) => {
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


        // ------------------------------------------
        // CHECK EVENT STATUS
        // ------------------------------------------

        if (event.status !== "approved") {

            return res.status(400).json({

                success: false,

                message:
                    "This event is not currently available for registration."

            });

        }


        // ------------------------------------------
        // CHECK EVENT DATE
        // ------------------------------------------

        if (
            new Date(event.date) < new Date()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "This event has already taken place."

            });

        }


        // ------------------------------------------
        // CHECK DUPLICATE REGISTRATION
        // ------------------------------------------

        const alreadyRegistered =
            event.attendees.some(

                userId =>
                    userId.toString() ===
                    req.user.id.toString()

            );


        if (alreadyRegistered) {

            return res.status(409).json({

                success: false,

                message:
                    "You are already registered for this event."

            });

        }


        // ------------------------------------------
        // CHECK CAPACITY
        // ------------------------------------------

        if (
            event.capacity > 0 &&
            event.attendees.length >=
                event.capacity
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "This event has reached its maximum capacity."

            });

        }


        // ------------------------------------------
        // REGISTER USER
        // ------------------------------------------

        event.attendees.push(
            req.user.id
        );


        await event.save();


        return res.status(200).json({

            success: true,

            message:
                "Successfully registered for the event.",

            registeredUsers:
                event.attendees.length

        });

    } catch (error) {

        console.error(
            "Register Event Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to register for event."

        });

    }
};


// ==========================================
// CANCEL EVENT REGISTRATION
// DELETE /api/events/:id/register
// ==========================================

exports.cancelEventRegistration = async (req, res) => {
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


        // ------------------------------------------
        // CHECK REGISTRATION
        // ------------------------------------------

        const registered =
            event.attendees.some(

                userId =>
                    userId.toString() ===
                    req.user.id.toString()

            );


        if (!registered) {

            return res.status(400).json({

                success: false,

                message:
                    "You are not registered for this event."

            });

        }


        // ------------------------------------------
        // REMOVE USER
        // ------------------------------------------

        event.attendees =
            event.attendees.filter(

                userId =>
                    userId.toString() !==
                    req.user.id.toString()

            );


        await event.save();


        return res.status(200).json({

            success: true,

            message:
                "Event registration cancelled successfully."

        });

    } catch (error) {

        console.error(
            "Cancel Event Registration Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to cancel event registration."

        });

    }
};


// ==========================================
// GET PENDING EVENTS
// ADMIN
// GET /api/events/admin/pending
// ==========================================

exports.getPendingEvents = async (req, res) => {
    try {

        const events =
            await Event.find({

                status: "pending"

            })

            .populate(
                "organizer",
                "name email phone"
            )

            .sort({

                createdAt: -1

            });


        return res.status(200).json({

            success: true,

            count: events.length,

            events

        });

    } catch (error) {

        console.error(
            "Get Pending Events Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve pending events."

        });

    }
};


// ==========================================
// APPROVE EVENT
// ADMIN
// PATCH /api/events/:id/approve
// ==========================================

exports.approveEvent = async (req, res) => {
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


        event.status =
            "approved";


        event.approvedBy =
            req.user.id;


        event.approvedAt =
            new Date();


        await event.save();


        return res.status(200).json({

            success: true,

            message:
                "Event approved successfully.",

            event

        });

    } catch (error) {

        console.error(
            "Approve Event Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to approve event."

        });

    }
};


// ==========================================
// REJECT EVENT
// ADMIN
// PATCH /api/events/:id/reject
// ==========================================

exports.rejectEvent = async (req, res) => {
    try {

        const {
            reason
        } = req.body;


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
            "rejected";


        event.rejectionReason =
            reason
                ? reason.trim()
                : "Event rejected by administrator.";


        event.rejectedBy =
            req.user.id;


        event.rejectedAt =
            new Date();


        await event.save();


        return res.status(200).json({

            success: true,

            message:
                "Event rejected successfully.",

            event

        });

    } catch (error) {

        console.error(
            "Reject Event Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to reject event."

        });

    }
};


// ==========================================
// UPDATE EVENT STATUS
// ADMIN
// PATCH /api/events/:id/status
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
            !allowedStatuses.includes(status)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid event status."

            });

        }


        const event =
            await Event.findByIdAndUpdate(

                req.params.id,

                {
                    status
                },

                {
                    new: true,

                    runValidators: true

                }

            );


        if (!event) {

            return res.status(404).json({

                success: false,

                message:
                    "Event not found."

            });

        }


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
// GET EVENT STATISTICS
// ADMIN
// GET /api/events/admin/statistics
// ==========================================

exports.getEventStatistics = async (req, res) => {
    try {

        const totalEvents =
            await Event.countDocuments();


        const approvedEvents =
            await Event.countDocuments({

                status: "approved"

            });


        const pendingEvents =
            await Event.countDocuments({

                status: "pending"

            });


        const rejectedEvents =
            await Event.countDocuments({

                status: "rejected"

            });


        const cancelledEvents =
            await Event.countDocuments({

                status: "cancelled"

            });


        const completedEvents =
            await Event.countDocuments({

                status: "completed"

            });


        return res.status(200).json({

            success: true,

            statistics: {

                totalEvents,

                approvedEvents,

                pendingEvents,

                rejectedEvents,

                cancelledEvents,

                completedEvents

            }

        });

    } catch (error) {

        console.error(
            "Event Statistics Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve event statistics."

        });

    }
};