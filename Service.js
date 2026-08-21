// ==========================================
// MERA ILAKA - SERVICE MODEL
// ==========================================

const mongoose = require("mongoose");


// ==========================================
// SERVICE SCHEMA
// ==========================================

const serviceSchema = new mongoose.Schema(

    {

        // Service provider / User account
        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        // Service name
        serviceName: {
            type: String,
            required: [true, "Service name is required"],
            trim: true,
            maxlength: 150
        },


        // Service category
        category: {
            type: String,
            required: [true, "Service category is required"],
            trim: true
        },


        // Service description
        description: {
            type: String,
            required: [true, "Service description is required"],
            trim: true,
            maxlength: 1000
        },


        // Service image
        image: {
            type: String,
            default: ""
        },


        // Multiple service images
        images: [
            {
                type: String
            }
        ],


        // Provider phone number
        phone: {
            type: String,
            trim: true
        },


        // Provider email
        email: {
            type: String,
            lowercase: true,
            trim: true
        },


        // Price information
        price: {
            type: Number,
            min: 0,
            default: 0
        },


        // Price unit
        priceUnit: {
            type: String,
            enum: [
                "hour",
                "day",
                "visit",
                "service",
                "fixed"
            ],
            default: "service"
        },


        // Service availability
        availability: {
            type: String,
            enum: [
                "available",
                "busy",
                "unavailable"
            ],
            default: "available"
        },


        // Service location
        address: {

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


        // Service coverage areas
        serviceAreas: [
            {
                type: String,
                trim: true
            }
        ],


        // Working hours
        workingHours: {

            monday: {
                type: String,
                default: "09:00 AM - 06:00 PM"
            },

            tuesday: {
                type: String,
                default: "09:00 AM - 06:00 PM"
            },

            wednesday: {
                type: String,
                default: "09:00 AM - 06:00 PM"
            },

            thursday: {
                type: String,
                default: "09:00 AM - 06:00 PM"
            },

            friday: {
                type: String,
                default: "09:00 AM - 06:00 PM"
            },

            saturday: {
                type: String,
                default: "09:00 AM - 06:00 PM"
            },

            sunday: {
                type: String,
                default: "Closed"
            }

        },


        // Verification status
        verificationStatus: {
            type: String,
            enum: [
                "pending",
                "verified",
                "rejected"
            ],
            default: "pending"
        },


        // Service status
        status: {
            type: String,
            enum: [
                "active",
                "inactive",
                "blocked"
            ],
            default: "active"
        },


        // Rating
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },


        // Number of reviews
        reviewCount: {
            type: Number,
            default: 0,
            min: 0
        },


        // Featured service
        isFeatured: {
            type: Boolean,
            default: false
        }

    },

    {
        timestamps: true
    }

);


// ==========================================
// INDEXES
// ==========================================

serviceSchema.index({
    serviceName: "text",
    category: "text",
    description: "text"
});

serviceSchema.index({
    "address.city": 1,
    "address.locality": 1
});


// ==========================================
// EXPORT MODEL
// ==========================================

const Service = mongoose.model(
    "Service",
    serviceSchema
);

module.exports = Service;