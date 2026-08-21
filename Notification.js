// ==========================================
// MERA ILAKA - NOTIFICATION MODEL
// ==========================================

const mongoose = require("mongoose");


// ==========================================
// NOTIFICATION SCHEMA
// ==========================================

const notificationSchema = new mongoose.Schema(

    {

        // ==========================================
        // USER WHO RECEIVES THE NOTIFICATION
        // ==========================================

        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        // ==========================================
        // USER WHO CREATED/SENT THE NOTIFICATION
        // ==========================================

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },


        // ==========================================
        // NOTIFICATION TITLE
        // ==========================================

        title: {
            type: String,
            required: [true, "Notification title is required"],
            trim: true,
            maxlength: 200
        },


        // ==========================================
        // NOTIFICATION MESSAGE
        // ==========================================

        message: {
            type: String,
            required: [true, "Notification message is required"],
            trim: true,
            maxlength: 2000
        },


        // ==========================================
        // NOTIFICATION TYPE
        // ==========================================

        type: {
            type: String,
            enum: [
                "general",
                "announcement",
                "event",
                "complaint",
                "emergency",
                "booking",
                "marketplace",
                "group",
                "service",
                "account",
                "system"
            ],
            default: "general"
        },


        // ==========================================
        // NOTIFICATION PRIORITY
        // ==========================================

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


        // ==========================================
        // NOTIFICATION ICON
        // ==========================================

        icon: {
            type: String,
            default: "fa-bell"
        },


        // ==========================================
        // RELATED DATA
        // ==========================================

        relatedModel: {
            type: String,
            enum: [
                "Announcement",
                "Event",
                "Complaint",
                "Emergency",
                "Booking",
                "Product",
                "Group",
                "Service",
                "User",
                null
            ],
            default: null
        },


        // ID of related document
        relatedId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },


        // ==========================================
        // READ STATUS
        // ==========================================

        isRead: {
            type: Boolean,
            default: false
        },


        // Date notification was read
        readAt: {
            type: Date,
            default: null
        },


        // ==========================================
        // DELIVERY STATUS
        // ==========================================

        deliveryStatus: {
            type: String,
            enum: [
                "pending",
                "sent",
                "delivered",
                "failed"
            ],
            default: "pending"
        },


        // ==========================================
        // DELIVERY CHANNEL
        // ==========================================

        channel: {
            type: String,
            enum: [
                "in_app",
                "email",
                "sms",
                "push"
            ],
            default: "in_app"
        },


        // ==========================================
        // NOTIFICATION EXPIRATION
        // ==========================================

        expiresAt: {
            type: Date,
            default: null
        },


        // ==========================================
        // ACTION URL
        // ==========================================

        actionUrl: {
            type: String,
            trim: true,
            default: ""
        },


        // ==========================================
        // ADDITIONAL DATA
        // ==========================================

        data: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }

    },

    {
        timestamps: true
    }

);


// ==========================================
// INDEXES
// ==========================================

// Quickly find notifications for a user
notificationSchema.index({
    recipient: 1,
    createdAt: -1
});


// Find unread notifications
notificationSchema.index({
    recipient: 1,
    isRead: 1
});


// Filter notifications by type
notificationSchema.index({
    type: 1,
    createdAt: -1
});


// ==========================================
// MARK NOTIFICATION AS READ
// ==========================================

notificationSchema.methods.markAsRead = function() {

    this.isRead = true;

    this.readAt = new Date();

};


// ==========================================
// CHECK WHETHER NOTIFICATION IS EXPIRED
// ==========================================

notificationSchema.methods.isExpired = function() {

    if (!this.expiresAt) {
        return false;
    }

    return new Date() > this.expiresAt;

};


// ==========================================
// EXPORT MODEL
// ==========================================

const Notification = mongoose.model(
    "Notification",
    notificationSchema
);

module.exports = Notification;