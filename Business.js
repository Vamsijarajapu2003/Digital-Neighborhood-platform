// ==========================================
// MERA ILAKA - BUSINESS MODEL
// ==========================================

const mongoose = require("mongoose");


// ==========================================
// BUSINESS SCHEMA
// ==========================================

const businessSchema = new mongoose.Schema(

    {

        // Business owner / User account
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        // Business name
        businessName: {
            type: String,
            required: [true, "Business name is required"],
            trim: true,
            maxlength: 150
        },


        // Business category
        category: {
            type: String,
            required: [true, "Business category is required"],
            trim: true
        },


        // Business description
        description: {
            type: String,
            trim: true,
            maxlength: 1000
        },


        // Business logo
        logo: {
            type: String,
            default: ""
        },


        // Business images
        images: [
            {
                type: String
            }
        ],


        // Contact information
        phone: {
            type: String,
            trim: true
        },

        email: {
            type: String,
            lowercase: true,
            trim: true
        },


        // Website
        website: {
            type: String,
            trim: true
        },


        // Business address
        address: {

            houseNumber: {
                type: String,
                trim: true
            },

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


        // Opening and closing hours
        workingHours: {

            monday: {
                type: String,
                default: "09:00 AM - 09:00 PM"
            },

            tuesday: {
                type: String,
                default: "09:00 AM - 09:00 PM"
            },

            wednesday: {
                type: String,
                default: "09:00 AM - 09:00 PM"
            },

            thursday: {
                type: String,
                default: "09:00 AM - 09:00 PM"
            },

            friday: {
                type: String,
                default: "09:00 AM - 09:00 PM"
            },

            saturday: {
                type: String,
                default: "09:00 AM - 09:00 PM"
            },

            sunday: {
                type: String,
                default: "Closed"
            }

        },


        // Services offered by business
        services: [
            {
                type: String,
                trim: true
            }
        ],


        // Business verification
        verificationStatus: {
            type: String,
            enum: [
                "pending",
                "verified",
                "rejected"
            ],
            default: "pending"
        },


        // Business status
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


        // Featured business
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

businessSchema.index({
    businessName: "text",
    category: "text",
    description: "text"
});

businessSchema.index({
    "address.city": 1,
    "address.locality": 1
});


// ==========================================
// EXPORT MODEL
// ==========================================

const Business = mongoose.model(
    "Business",
    businessSchema
);

module.exports = Business;