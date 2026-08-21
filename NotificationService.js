// ==========================================
// MERA ILAKA - NOTIFICATION SERVICE
// ==========================================

const Notification = require("../models/Notification");


// ==========================================
// CREATE NOTIFICATION
// ==========================================

const createNotification = async ({
    userId,
    title,
    message,
    type = "general",
    relatedId = null,
    relatedModel = null
}) => {

    try {

        if (!userId) {
            throw new Error("User ID is required.");
        }

        if (!title) {
            throw new Error("Notification title is required.");
        }

        if (!message) {
            throw new Error("Notification message is required.");
        }


        const notification =
            await Notification.create({

                user: userId,

                title: title,

                message: message,

                type: type,

                relatedId: relatedId,

                relatedModel: relatedModel,

                isRead: false

            });


        console.log(
            "Notification created:",
            notification._id
        );


        return {

            success: true,

            message:
                "Notification created successfully.",

            notification

        };

    } catch (error) {

        console.error(
            "Notification creation failed:",
            error.message
        );


        return {

            success: false,

            message:
                "Failed to create notification.",

            error:
                error.message

        };

    }

};


// ==========================================
// GET USER NOTIFICATIONS
// ==========================================

const getUserNotifications = async (
    userId
) => {

    try {

        const notifications =
            await Notification.find({
                user: userId
            })
            .sort({
                createdAt: -1
            });


        return {

            success: true,

            notifications

        };

    } catch (error) {

        console.error(
            "Getting notifications failed:",
            error.message
        );


        return {

            success: false,

            message:
                "Failed to get notifications.",

            error:
                error.message

        };

    }

};


// ==========================================
// GET UNREAD NOTIFICATIONS
// ==========================================

const getUnreadNotifications = async (
    userId
) => {

    try {

        const notifications =
            await Notification.find({

                user: userId,

                isRead: false

            })
            .sort({
                createdAt: -1
            });


        return {

            success: true,

            count:
                notifications.length,

            notifications

        };

    } catch (error) {

        console.error(
            "Getting unread notifications failed:",
            error.message
        );


        return {

            success: false,

            message:
                "Failed to get unread notifications.",

            error:
                error.message

        };

    }

};


// ==========================================
// MARK NOTIFICATION AS READ
// ==========================================

const markAsRead = async (
    notificationId,
    userId
) => {

    try {

        const notification =
            await Notification.findOneAndUpdate(

                {
                    _id: notificationId,

                    user: userId

                },

                {
                    isRead: true
                },

                {
                    new: true
                }

            );


        if (!notification) {

            return {

                success: false,

                message:
                    "Notification not found."

            };

        }


        return {

            success: true,

            message:
                "Notification marked as read.",

            notification

        };

    } catch (error) {

        console.error(
            "Mark notification as read failed:",
            error.message
        );


        return {

            success: false,

            message:
                "Failed to update notification.",

            error:
                error.message

        };

    }

};


// ==========================================
// MARK ALL NOTIFICATIONS AS READ
// ==========================================

const markAllAsRead = async (
    userId
) => {

    try {

        const result =
            await Notification.updateMany(

                {
                    user: userId,

                    isRead: false
                },

                {
                    isRead: true
                }

            );


        return {

            success: true,

            message:
                "All notifications marked as read.",

            modifiedCount:
                result.modifiedCount

        };

    } catch (error) {

        console.error(
            "Mark all notifications failed:",
            error.message
        );


        return {

            success: false,

            message:
                "Failed to update notifications.",

            error:
                error.message

        };

    }

};


// ==========================================
// DELETE NOTIFICATION
// ==========================================

const deleteNotification = async (
    notificationId,
    userId
) => {

    try {

        const notification =
            await Notification.findOneAndDelete({

                _id: notificationId,

                user: userId

            });


        if (!notification) {

            return {

                success: false,

                message:
                    "Notification not found."

            };

        }


        return {

            success: true,

            message:
                "Notification deleted successfully."

        };

    } catch (error) {

        console.error(
            "Delete notification failed:",
            error.message
        );


        return {

            success: false,

            message:
                "Failed to delete notification.",

            error:
                error.message

        };

    }

};


// ==========================================
// COMPLAINT NOTIFICATION
// ==========================================

const notifyComplaintStatus = async ({
    userId,
    complaintId,
    status
}) => {

    return await createNotification({

        userId: userId,

        title:
            "Complaint Status Updated",

        message:
            `Your complaint status has been updated to ${status}.`,

        type:
            "complaint",

        relatedId:
            complaintId,

        relatedModel:
            "Complaint"

    });

};


// ==========================================
// EVENT NOTIFICATION
// ==========================================

const notifyEvent = async ({
    userId,
    eventId,
    eventName
}) => {

    return await createNotification({

        userId: userId,

        title:
            "New Community Event",

        message:
            `A new event "${eventName}" has been added to your neighborhood.`,

        type:
            "event",

        relatedId:
            eventId,

        relatedModel:
            "Event"

    });

};


// ==========================================
// MARKETPLACE NOTIFICATION
// ==========================================

const notifyMarketplace = async ({
    userId,
    productId,
    productName
}) => {

    return await createNotification({

        userId: userId,

        title:
            "Marketplace Update",

        message:
            `Marketplace product "${productName}" has been updated.`,

        type:
            "marketplace",

        relatedId:
            productId,

        relatedModel:
            "Product"

    });

};


// ==========================================
// BUSINESS NOTIFICATION
// ==========================================

const notifyBusiness = async ({
    userId,
    businessId,
    businessName
}) => {

    return await createNotification({

        userId: userId,

        title:
            "Business Update",

        message:
            `Business "${businessName}" has a new update.`,

        type:
            "business",

        relatedId:
            businessId,

        relatedModel:
            "Business"

    });

};


// ==========================================
// EMERGENCY NOTIFICATION
// ==========================================

const notifyEmergency = async ({
    userId,
    emergencyId,
    emergencyType
}) => {

    return await createNotification({

        userId: userId,

        title:
            "Emergency Alert",

        message:
            `Emergency alert: ${emergencyType}. Please check Mera Ilaka for more information.`,

        type:
            "emergency",

        relatedId:
            emergencyId,

        relatedModel:
            "Emergency"

    });

};


// ==========================================
// ADMIN NOTIFICATION
// ==========================================

const notifyAdmin = async ({
    adminId,
    title,
    message,
    type = "admin",
    relatedId = null,
    relatedModel = null
}) => {

    return await createNotification({

        userId:
            adminId,

        title:
            title,

        message:
            message,

        type:
            type,

        relatedId:
            relatedId,

        relatedModel:
            relatedModel

    });

};


// ==========================================
// EXPORT ALL FUNCTIONS
// ==========================================

module.exports = {

    createNotification,

    getUserNotifications,

    getUnreadNotifications,

    markAsRead,

    markAllAsRead,

    deleteNotification,

    notifyComplaintStatus,

    notifyEvent,

    notifyMarketplace,

    notifyBusiness,

    notifyEmergency,

    notifyAdmin

};