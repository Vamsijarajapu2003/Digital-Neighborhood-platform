// ==========================================
// MERA ILAKA - COMPLAINT MODEL
// ==========================================

const mongoose = require("mongoose");


// ==========================================
// COMPLAINT SCHEMA
// ==========================================

const complaintSchema = new mongoose.Schema(

    {

        // User who submitted the complaint
        submittedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        // Complaint title
        title: {
            type: String,
            required: [true, "Complaint title is required"],
            trim: true,
            maxlength: 200
        },


        // Detailed complaint description
        description: {
            type: String,
            required: [true, "Complaint description is required"],
            trim: true,
            maxlength: 3000
        },


        // Complaint category
        category: {
            type: String,
            enum: [
                "roads",
                "water",
                "electricity",
                "garbage",
                "drainage",
                "street_lights",
                "noise",
                "security",
                "parking",
                "public_property",
                "sanitation",
                "other"
            ],
            default: "other"
        },


        // Complaint priority
        priority: {
            type: String,
            enum: [
                "low",
                "medium",
                "high",
                "urgent"
            ],
            default: "medium"
        },


        // Complaint images
        images: [
            {
                type: String
            }
        ],


        // Complaint location
        location: {

            address: {
                type: String,
                trim: true
            },

            locality: {
                type: String,
                trim: true
            },

            city: {
                type: String,
                trim: true
            },

            state: {
                type: String,
                trim: true
            },

            pincode: {
                type: String,
                trim: true
            },

            latitude: {
                type: Number
            },

            longitude: {
                type: Number
            }

        },


        // Complaint status
        status: {
            type: String,
            enum: [
                "submitted",
                "under_review",
                "assigned",
                "in_progress",
                "resolved",
                "rejected",
                "closed"
            ],
            default: "submitted"
        },


        // Admin/authority assigned to handle complaint
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },


        // Admin response
        adminResponse: {
            type: String,
            trim: true,
            maxlength: 2000,
            default: ""
        },


        // Resolution details
        resolution: {
            type: String,
            trim: true,
            maxlength: 2000,
            default: ""
        },


        // Date when complaint was resolved
        resolvedAt: {
            type: Date,
            default: null
        },


        // Date when complaint was closed
        closedAt: {
            type: Date,
            default: null
        },


        // Number of comments
        commentCount: {
            type: Number,
            default: 0,
            min: 0
        },


        // Complaint reference number
        complaintNumber: {
            type: String,
            unique: true,
            sparse: true,
            trim: true
        }


    },

    {

        timestamps: true

    }

);


// ==========================================
// INDEXES
// ==========================================

complaintSchema.index({
    title: "text",
    description: "text"
});

complaintSchema.index({
    category: 1,
    status: 1
});

complaintSchema.index({
    submittedBy: 1
});

complaintSchema.index({
    createdAt: -1
});


// ==========================================
// GENERATE COMPLAINT NUMBER
// ==========================================

complaintSchema.pre("save", function (next) {

    if (!this.complaintNumber) {

        const timestamp = Date.now();

        const randomNumber =
            Math.floor(1000 + Math.random() * 9000);

        this.complaintNumber =
            `MI-${timestamp}-${randomNumber}`;

    }

    next();

});


// ==========================================
// EXPORT MODEL
// ==========================================

const Complaint = mongoose.model(
    "Complaint",
    complaintSchema
);

module.exports = Complaint;