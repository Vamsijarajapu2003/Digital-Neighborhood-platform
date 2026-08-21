// ==========================================
// MERA ILAKA - EMERGENCY MODEL
// ==========================================

const mongoose = require("mongoose");


// ==========================================
// EMERGENCY SCHEMA
// ==========================================

const emergencySchema = new mongoose.Schema(

    {

        // ==========================================
        // PERSON WHO REPORTED THE EMERGENCY
        // ==========================================

        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },


        // ==========================================
        // EMERGENCY TYPE
        // ==========================================

        type: {
            type: String,
            enum: [
                "medical",
                "fire",
                "police",
                "accident",
                "security",
                "natural_disaster",
                "missing_person",
                "utility",
                "other"
            ],
            required: [true, "Emergency type is required"]
        },


        // ==========================================
        // EMERGENCY TITLE
        // ==========================================

        title: {
            type: String,
            required: [true, "Emergency title is required"],
            trim: true,
            maxlength: 200
        },


        // ==========================================
        // EMERGENCY DESCRIPTION
        // ==========================================

        description: {
            type: String,
            required: [true, "Emergency description is required"],
            trim: true,
            maxlength: 3000
        },


        // ==========================================
        // SEVERITY
        // ==========================================

        severity: {
            type: String,
            enum: [
                "low",
                "medium",
                "high",
                "critical"
            ],
            default: "high"
        },


        // ==========================================
        // EMERGENCY LOCATION
        // ==========================================

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


        // ==========================================
        // CONTACT INFORMATION
        // ==========================================

        contactName: {
            type: String,
            trim: true
        },


        contactPhone: {
            type: String,
            trim: true
        },


        // ==========================================
        // EMERGENCY IMAGES
        // ==========================================

        images: [
            {
                type: String
            }
        ],


        // ==========================================
        // EMERGENCY STATUS
        // ==========================================

        status: {
            type: String,
            enum: [
                "reported",
                "acknowledged",
                "responding",
                "resolved",
                "cancelled"
            ],
            default: "reported"
        },


        // ==========================================
        // RESPONDING AUTHORITY
        // ==========================================

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },


        // ==========================================
        // AUTHORITY / SERVICE INFORMATION
        // ==========================================

        responseTeam: {
            type: String,
            trim: true,
            default: ""
        },


        // ==========================================
        // EMERGENCY SERVICE NUMBER
        // ==========================================

        emergencyNumber: {
            type: String,
            trim: true,
            default: ""
        },


        // ==========================================
        // RESPONSE DETAILS
        // ==========================================

        responseNotes: {
            type: String,
            trim: true,
            maxlength: 2000,
            default: ""
        },


        // ==========================================
        // RESOLUTION DETAILS
        // ==========================================

        resolution: {
            type: String,
            trim: true,
            maxlength: 2000,
            default: ""
        },


        // ==========================================
        // IMPORTANT DATES
        // ==========================================

        acknowledgedAt: {
            type: Date,
            default: null
        },


        respondingAt: {
            type: Date,
            default: null
        },


        resolvedAt: {
            type: Date,
            default: null
        },


        // ==========================================
        // EMERGENCY REFERENCE NUMBER
        // ==========================================

        emergencyNumberId: {
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

emergencySchema.index({
    title: "text",
    description: "text"
});

emergencySchema.index({
    type: 1,
    severity: 1,
    status: 1
});

emergencySchema.index({
    "location.city": 1,
    "location.locality": 1
});

emergencySchema.index({
    createdAt: -1
});


// ==========================================
// GENERATE EMERGENCY REFERENCE NUMBER
// ==========================================

emergencySchema.pre("save", function(next) {

    if (!this.emergencyNumberId) {

        const timestamp = Date.now();

        const randomNumber =
            Math.floor(1000 + Math.random() * 9000);

        this.emergencyNumberId =
            `EM-${timestamp}-${randomNumber}`;

    }

    next();

});


// ==========================================
// CHECK WHETHER EMERGENCY IS ACTIVE
// ==========================================

emergencySchema.methods.isActive = function() {

    return [
        "reported",
        "acknowledged",
        "responding"
    ].includes(this.status);

};


// ==========================================
// EXPORT MODEL
// ==========================================

const Emergency = mongoose.model(
    "Emergency",
    emergencySchema
);

module.exports = Emergency;