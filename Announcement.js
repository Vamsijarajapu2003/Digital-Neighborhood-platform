// ==========================================
// MERA ILAKA - ANNOUNCEMENT MODEL
// ==========================================

const mongoose = require("mongoose");


// ==========================================
// ANNOUNCEMENT SCHEMA
// ==========================================

const announcementSchema = new mongoose.Schema(

    {

        // Person/Admin who created the announcement
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        // Announcement title
        title: {
            type: String,
            required: [true, "Announcement title is required"],
            trim: true,
            maxlength: 200
        },


        // Announcement content
        content: {
            type: String,
            required: [true, "Announcement content is required"],
            trim: true,
            maxlength: 5000
        },


        // Announcement category
        category: {
            type: String,
            enum: [
                "general",
                "important",
                "maintenance",
                "community",
                "safety",
                "event",
                "emergency",
                "notice"
            ],
            default: "general"
        },


        // Announcement image
        image: {
            type: String,
            default: ""
        },


        // Additional images
        images: [
            {
                type: String
            }
        ],


        // Target audience
        audience: {
            type: String,
            enum: [
                "all",
                "residents",
                "businesses",
                "service_providers",
                "specific_locality"
            ],
            default: "all"
        },


        // Specific locality if required
        locality: {
            type: String,
            trim: true,
            default: ""
        },


        // Publication date
        publishedAt: {
            type: Date,
            default: Date.now
        },


        // Expiration date
        expiresAt: {
            type: Date,
            default: null
        },


        // Whether announcement is currently active
        status: {
            type: String,
            enum: [
                "draft",
                "published",
                "expired",
                "archived"
            ],
            default: "published"
        },


        // Priority
        priority: {
            type: String,
            enum: [
                "low",
                "normal",
                "high",
                "urgent"
            ],
            default: "normal"
        },


        // Featured announcement
        isFeatured: {
            type: Boolean,
            default: false
        },


        // Number of views
        views: {
            type: Number,
            default: 0,
            min: 0
        },


        // Number of likes
        likes: {
            type: Number,
            default: 0,
            min: 0
        },


        // Allow comments
        allowComments: {
            type: Boolean,
            default: true
        }

    },

    {
        timestamps: true
    }

);


// ==========================================
// INDEXES
// ==========================================

announcementSchema.index({
    title: "text",
    content: "text"
});

announcementSchema.index({
    category: 1,
    status: 1
});

announcementSchema.index({
    publishedAt: -1
});

announcementSchema.index({
    locality: 1
});


// ==========================================
// AUTOMATIC EXPIRATION CHECK
// ==========================================

announcementSchema.methods.isExpired = function () {

    if (!this.expiresAt) {
        return false;
    }

    return new Date() > this.expiresAt;

};


// ==========================================
// EXPORT MODEL
// ==========================================

const Announcement = mongoose.model(
    "Announcement",
    announcementSchema
);

module.exports = Announcement;