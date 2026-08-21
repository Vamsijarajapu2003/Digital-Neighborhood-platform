// ==========================================
// MERA ILAKA - BOOKING MODEL
// ==========================================

const mongoose = require("mongoose");


// ==========================================
// BOOKING SCHEMA
// ==========================================

const bookingSchema = new mongoose.Schema(

    {

        // ==========================================
        // CUSTOMER / RESIDENT
        // ==========================================

        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        // ==========================================
        // SERVICE PROVIDER
        // ==========================================

        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        // ==========================================
        // SERVICE BEING BOOKED
        // ==========================================

        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true
        },


        // ==========================================
        // BOOKING REFERENCE NUMBER
        // ==========================================

        bookingNumber: {
            type: String,
            unique: true,
            sparse: true,
            trim: true
        },


        // ==========================================
        // BOOKING DATE
        // ==========================================

        bookingDate: {
            type: Date,
            required: [true, "Booking date is required"]
        },


        // ==========================================
        // BOOKING TIME
        // ==========================================

        bookingTime: {
            type: String,
            required: [true, "Booking time is required"],
            trim: true
        },


        // ==========================================
        // CUSTOMER MESSAGE
        // ==========================================

        message: {
            type: String,
            trim: true,
            maxlength: 2000,
            default: ""
        },


        // ==========================================
        // CUSTOMER CONTACT DETAILS
        // ==========================================

        contactName: {
            type: String,
            required: true,
            trim: true
        },


        contactPhone: {
            type: String,
            required: true,
            trim: true
        },


        contactEmail: {
            type: String,
            lowercase: true,
            trim: true
        },


        // ==========================================
        // SERVICE LOCATION
        // ==========================================

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


        // ==========================================
        // BOOKING STATUS
        // ==========================================

        status: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "accepted",
                "rejected",
                "in_progress",
                "completed",
                "cancelled"
            ],
            default: "pending"
        },


        // ==========================================
        // PAYMENT INFORMATION
        // ==========================================

        paymentMethod: {
            type: String,
            enum: [
                "cash",
                "upi",
                "card",
                "online",
                "not_required"
            ],
            default: "cash"
        },


        paymentStatus: {
            type: String,
            enum: [
                "pending",
                "paid",
                "failed",
                "refunded",
                "not_required"
            ],
            default: "pending"
        },


        // ==========================================
        // AMOUNT
        // ==========================================

        amount: {
            type: Number,
            min: 0,
            default: 0
        },


        currency: {
            type: String,
            default: "INR"
        },


        // ==========================================
        // PROVIDER RESPONSE
        // ==========================================

        providerMessage: {
            type: String,
            trim: true,
            maxlength: 2000,
            default: ""
        },


        // ==========================================
        // CANCELLATION DETAILS
        // ==========================================

        cancellationReason: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: ""
        },


        cancelledBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },


        cancelledAt: {
            type: Date,
            default: null
        },


        // ==========================================
        // COMPLETION DETAILS
        // ==========================================

        completedAt: {
            type: Date,
            default: null
        },


        // ==========================================
        // CUSTOMER RATING
        // ==========================================

        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: null
        },


        // ==========================================
        // CUSTOMER REVIEW
        // ==========================================

        review: {
            type: String,
            trim: true,
            maxlength: 2000,
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

bookingSchema.index({
    customer: 1,
    createdAt: -1
});

bookingSchema.index({
    provider: 1,
    bookingDate: 1
});

bookingSchema.index({
    service: 1,
    bookingDate: 1
});

bookingSchema.index({
    status: 1
});

bookingSchema.index({
    bookingDate: 1
});


// ==========================================
// GENERATE BOOKING NUMBER
// ==========================================

bookingSchema.pre("save", function(next) {

    if (!this.bookingNumber) {

        const timestamp = Date.now();

        const randomNumber =
            Math.floor(1000 + Math.random() * 9000);

        this.bookingNumber =
            `BK-${timestamp}-${randomNumber}`;

    }

    next();

});


// ==========================================
// CHECK WHETHER BOOKING IS ACTIVE
// ==========================================

bookingSchema.methods.isActive = function() {

    return [
        "pending",
        "confirmed",
        "accepted",
        "in_progress"
    ].includes(this.status);

};


// ==========================================
// CHECK WHETHER BOOKING IS COMPLETED
// ==========================================

bookingSchema.methods.isCompleted = function() {

    return this.status === "completed";

};


// ==========================================
// CANCEL BOOKING
// ==========================================

bookingSchema.methods.cancelBooking = function(
    userId,
    reason = ""
) {

    if (
        this.status === "completed" ||
        this.status === "cancelled"
    ) {
        throw new Error(
            "This booking cannot be cancelled."
        );
    }


    this.status = "cancelled";

    this.cancelledBy = userId;

    this.cancellationReason = reason;

    this.cancelledAt = new Date();

};


// ==========================================
// COMPLETE BOOKING
// ==========================================

bookingSchema.methods.completeBooking = function() {

    if (this.status !== "in_progress") {

        throw new Error(
            "Only an in-progress booking can be completed."
        );

    }


    this.status = "completed";

    this.completedAt = new Date();

};


// ==========================================
// EXPORT MODEL
// ==========================================

const Booking = mongoose.model(
    "Booking",
    bookingSchema
);

module.exports = Booking;