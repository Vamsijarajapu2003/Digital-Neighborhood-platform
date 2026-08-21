// ==========================================
// MERA ILAKA - PRODUCT MODEL
// ==========================================

const mongoose = require("mongoose");


// ==========================================
// PRODUCT SCHEMA
// ==========================================

const productSchema = new mongoose.Schema(

    {

        // ==========================================
        // SELLER
        // ==========================================

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        // ==========================================
        // BUSINESS - OPTIONAL
        // ==========================================

        business: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Business",
            default: null
        },


        // ==========================================
        // PRODUCT INFORMATION
        // ==========================================

        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            maxlength: 200
        },


        description: {
            type: String,
            required: [true, "Product description is required"],
            trim: true,
            maxlength: 3000
        },


        // Product category
        category: {
            type: String,
            required: [true, "Product category is required"],
            trim: true
        },


        // Product sub-category
        subCategory: {
            type: String,
            trim: true,
            default: ""
        },


        // ==========================================
        // PRODUCT IMAGES
        // ==========================================

        mainImage: {
            type: String,
            default: ""
        },


        images: [
            {
                type: String
            }
        ],


        // ==========================================
        // PRICE
        // ==========================================

        price: {
            type: Number,
            required: [true, "Product price is required"],
            min: 0
        },


        // Original price
        originalPrice: {
            type: Number,
            min: 0,
            default: 0
        },


        // Currency
        currency: {
            type: String,
            default: "INR",
            trim: true
        },


        // ==========================================
        // PRODUCT CONDITION
        // ==========================================

        condition: {
            type: String,
            enum: [
                "new",
                "like_new",
                "good",
                "used",
                "refurbished"
            ],
            default: "good"
        },


        // ==========================================
        // INVENTORY
        // ==========================================

        quantity: {
            type: Number,
            min: 0,
            default: 1
        },


        // ==========================================
        // PRODUCT STATUS
        // ==========================================

        status: {
            type: String,
            enum: [
                "draft",
                "available",
                "sold",
                "reserved",
                "inactive",
                "rejected"
            ],
            default: "available"
        },


        // ==========================================
        // LOCATION
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
            }

        },


        // ==========================================
        // CONTACT INFORMATION
        // ==========================================

        contactPhone: {
            type: String,
            trim: true
        },


        contactEmail: {
            type: String,
            lowercase: true,
            trim: true
        },


        // ==========================================
        // DELIVERY / PICKUP
        // ==========================================

        deliveryAvailable: {
            type: Boolean,
            default: false
        },


        pickupAvailable: {
            type: Boolean,
            default: true
        },


        // ==========================================
        // MARKETPLACE INFORMATION
        // ==========================================

        isFeatured: {
            type: Boolean,
            default: false
        },


        views: {
            type: Number,
            min: 0,
            default: 0
        },


        favorites: {
            type: Number,
            min: 0,
            default: 0
        },


        // ==========================================
        // ADMIN APPROVAL
        // ==========================================

        approvalStatus: {
            type: String,
            enum: [
                "pending",
                "approved",
                "rejected"
            ],
            default: "pending"
        },


        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },


        approvedAt: {
            type: Date,
            default: null
        },


        // ==========================================
        // REJECTION REASON
        // ==========================================

        rejectionReason: {
            type: String,
            trim: true,
            default: ""
        }

    },

    {

        timestamps: true

    }

);


// ==========================================
// INDEXES
// ==========================================

// Search products by name, description and category
productSchema.index({
    name: "text",
    description: "text",
    category: "text",
    subCategory: "text"
});


// Search products by location
productSchema.index({
    "location.city": 1,
    "location.locality": 1
});


// Search products by category
productSchema.index({
    category: 1,
    status: 1
});


// Sort products by newest first
productSchema.index({
    createdAt: -1
});


// ==========================================
// PRODUCT METHODS
// ==========================================

// Check whether product is available
productSchema.methods.isAvailable = function () {

    return (
        this.status === "available" &&
        this.approvalStatus === "approved" &&
        this.quantity > 0
    );

};


// Check whether product is sold out
productSchema.methods.isSoldOut = function () {

    return this.quantity <= 0 ||
           this.status === "sold";

};


// ==========================================
// EXPORT MODEL
// ==========================================

const Product = mongoose.model(
    "Product",
    productSchema
);

module.exports = Product;