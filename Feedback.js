// ==========================================
// MERA ILAKA - FEEDBACK MODEL
// ==========================================

const mongoose = require("mongoose");


// ==========================================
// FEEDBACK SCHEMA
// ==========================================

const feedbackSchema = new mongoose.Schema(

    {

        // ==========================================
        // USER WHO SUBMITTED THE FEEDBACK
        // ==========================================

        submittedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        // ==========================================
        // FEEDBACK TYPE
        // ==========================================

        type: {
            type: String,
            enum: [
                "general",
                "business",
                "service",
                "event",
                "booking",
                "complaint",
                "marketplace",
                "platform"
            ],
            default: "general"
        },


        // ==========================================
        // RELATED ITEM
        // ==========================================

        relatedModel: {
            type: String,
            enum: [
                "Business",
                "Service",
                "Event",
                "Booking",
                "Complaint",
                "Product",
                "User",
                null
            ],
            default: null
        },


        // ID of the related item
        relatedId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },


        // ==========================================
        // RATING
        // ==========================================

        rating: {
            type: Number,
            required: [true, "Rating is required"],
            min: 1,
            max: 5
        },


        // ==========================================
        // FEEDBACK TITLE
        // ==========================================

        title: {
            type: String,
            trim: true,
            maxlength: 200,
            default: ""
        },


        // ==========================================
        // FEEDBACK MESSAGE
        // ==========================================

        message: {
            type: String,
            required: [true, "Feedback message is required"],
            trim: true,
            maxlength: 3000
        },


        // ==========================================
        // FEEDBACK IMAGES
        // ==========================================

        images: [
            {
                type: String
            }
        ],


        // ==========================================
        // ADMIN RESPONSE
        // ==========================================

        adminResponse: {
            type: String,
            trim: true,
            maxlength: 2000,
            default: ""
        },


        // ==========================================
        // ADMIN WHO RESPONDED
        // ==========================================

        respondedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },


        // ==========================================
        // RESPONSE DATE
        // ==========================================

        respondedAt: {
            type: Date,
            default: null
        },


        // ==========================================
        // FEEDBACK STATUS
        // ==========================================

        status: {
            type: String,
            enum: [
                "pending",
                "published",
                "hidden",
                "rejected"
            ],
            default: "pending"
        },


        // ==========================================
        // HELPFUL COUNT
        // ==========================================

        helpfulCount: {
            type: Number,
            min: 0,
            default: 0
        },


        // ==========================================
        // VERIFIED FEEDBACK
        // ==========================================

        isVerified: {
            type: Boolean,
            default: false
        },


        // ==========================================
        // FEATURED FEEDBACK
        // ==========================================

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

// Find feedback by user
feedbackSchema.index({
    submittedBy: 1,
    createdAt: -1
});


// Find feedback for a specific item
feedbackSchema.index({
    relatedModel: 1,
    relatedId: 1
});


// Find feedback by type
feedbackSchema.index({
    type: 1,
    status: 1
});


// Sort by latest feedback
feedbackSchema.index({
    createdAt: -1
});


// ==========================================
// CHECK RATING
// ==========================================

feedbackSchema.methods.isPositive = function() {

    return this.rating >= 4;

};


feedbackSchema.methods.isNegative = function() {

    return this.rating <= 2;

};


// ==========================================
// EXPORT MODEL
// ==========================================

const Feedback = mongoose.model(
    "Feedback",
    feedbackSchema
);

module.exports = Feedback;