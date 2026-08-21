// ==========================================
// MERA ILAKA - EVENT MODEL
// ==========================================

const mongoose = require("mongoose");


// ==========================================
// EVENT SCHEMA
// ==========================================

const eventSchema = new mongoose.Schema(

    {

        // User/Admin who created the event
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        // Event title
        title: {
            type: String,
            required: [true, "Event title is required"],
            trim: true,
            maxlength: 200
        },


        // Event description
        description: {
            type: String,
            required: [true, "Event description is required"],
            trim: true,
            maxlength: 3000
        },


        // Event category
        category: {
            type: String,
            enum: [
                "community",
                "cultural",
                "sports",
                "education",
                "workshop",
                "meeting",
                "festival",
                "charity",
                "entertainment",
                "other"
            ],
            default: "community"
        },


        // Event image
        image: {
            type: String,
            default: ""
        },


        // Additional event images
        images: [
            {
                type: String
            }
        ],


        // Event date
        eventDate: {
            type: Date,
            required: [true, "Event date is required"]
        },


        // Event start time
        startTime: {
            type: String,
            required: [true, "Event start time is required"],
            trim: true
        },


        // Event end time
        endTime: {
            type: String,
            trim: true
        },


        // Event venue
        venue: {
            type: String,
            required: [true, "Event venue is required"],
            trim: true
        },


        // Event address
        address: {

            street: {
                type: String,
                trim: true
            },

            locality: {
                type: String,
                required: true,
                trim: true
            },

            city: {
                type: String,
                required: true,
                trim: true
            },

            state: {
                type: String,
                required: true,
                trim: true
            },

            pincode: {
                type: String,
                required: true,
                trim: true
            }

        },


        // Location coordinates
        location: {

            latitude: {
                type: Number
            },

            longitude: {
                type: Number
            }

        },


        // Maximum number of participants
        capacity: {
            type: Number,
            min: 1,
            default: 100
        },


        // Number of registered participants
        registeredParticipants: {
            type: Number,
            min: 0,
            default: 0
        },


        // Event registration required
        registrationRequired: {
            type: Boolean,
            default: false
        },


        // Registration deadline
        registrationDeadline: {
            type: Date,
            default: null
        },


        // Entry fee
        entryFee: {
            type: Number,
            min: 0,
            default: 0
        },


        // Contact details
        contactName: {
            type: String,
            trim: true
        },

        contactPhone: {
            type: String,
            trim: true
        },

        contactEmail: {
            type: String,
            lowercase: true,
            trim: true
        },


        // Event status
        status: {
            type: String,
            enum: [
                "draft",
                "upcoming",
                "ongoing",
                "completed",
                "cancelled"
            ],
            default: "upcoming"
        },


        // Event visibility
        visibility: {
            type: String,
            enum: [
                "public",
                "residents_only",
                "private"
            ],
            default: "public"
        },


        // Featured event
        isFeatured: {
            type: Boolean,
            default: false
        },


        // Number of views
        views: {
            type: Number,
            min: 0,
            default: 0
        }

    },

    {
        timestamps: true
    }

);


// ==========================================
// INDEXES
// ==========================================

eventSchema.index({
    title: "text",
    description: "text",
    category: "text"
});

eventSchema.index({
    eventDate: 1
});

eventSchema.index({
    "address.city": 1,
    "address.locality": 1
});


// ==========================================
// CHECK EVENT CAPACITY
// ==========================================

eventSchema.methods.isFull = function () {

    return this.registeredParticipants >= this.capacity;

};


// ==========================================
// CHECK REGISTRATION AVAILABILITY
// ==========================================

eventSchema.methods.canRegister = function () {

    if (this.status !== "upcoming") {
        return false;
    }

    if (!this.registrationRequired) {
        return false;
    }

    if (this.isFull()) {
        return false;
    }

    if (
        this.registrationDeadline &&
        new Date() > this.registrationDeadline
    ) {
        return false;
    }

    return true;

};


// ==========================================
// EXPORT MODEL
// ==========================================

const Event = mongoose.model(
    "Event",
    eventSchema
);

module.exports = Event;