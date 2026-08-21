// services/paymentService.js

const Razorpay = require("razorpay");
const crypto = require("crypto");

// Create Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

/**
 * Create a new payment order
 *
 * @param {Number} amount - Amount in INR
 * @param {String} receipt - Unique receipt ID
 * @returns {Object} Razorpay order
 */
const createPaymentOrder = async (amount, receipt) => {
    try {
        if (!amount || amount <= 0) {
            throw new Error("Invalid payment amount");
        }

        const options = {
            amount: Math.round(amount * 100), // INR to paise
            currency: "INR",
            receipt: receipt,
            payment_capture: 1
        };

        const order = await razorpay.orders.create(options);

        return {
            success: true,
            order
        };

    } catch (error) {
        console.error("Payment order creation error:", error);

        return {
            success: false,
            message: "Unable to create payment order",
            error: error.message
        };
    }
};


/**
 * Verify Razorpay payment
 *
 * @param {String} orderId
 * @param {String} paymentId
 * @param {String} signature
 * @returns {Boolean}
 */
const verifyPayment = (orderId, paymentId, signature) => {
    try {
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${orderId}|${paymentId}`)
            .digest("hex");

        return generatedSignature === signature;

    } catch (error) {
        console.error("Payment verification error:", error);
        return false;
    }
};


/**
 * Fetch payment details
 *
 * @param {String} paymentId
 * @returns {Object}
 */
const getPaymentDetails = async (paymentId) => {
    try {
        const payment = await razorpay.payments.fetch(paymentId);

        return {
            success: true,
            payment
        };

    } catch (error) {
        console.error("Payment details error:", error);

        return {
            success: false,
            message: "Unable to fetch payment details",
            error: error.message
        };
    }
};


/**
 * Refund a payment
 *
 * @param {String} paymentId
 * @param {Number} amount - Refund amount in INR
 * @returns {Object}
 */
const refundPayment = async (paymentId, amount) => {
    try {
        const refund = await razorpay.payments.refund(paymentId, {
            amount: Math.round(amount * 100)
        });

        return {
            success: true,
            refund
        };

    } catch (error) {
        console.error("Payment refund error:", error);

        return {
            success: false,
            message: "Unable to process refund",
            error: error.message
        };
    }
};


/**
 * Check payment status
 *
 * @param {String} paymentId
 * @returns {String}
 */
const checkPaymentStatus = async (paymentId) => {
    try {
        const payment = await razorpay.payments.fetch(paymentId);

        return {
            success: true,
            status: payment.status,
            payment
        };

    } catch (error) {
        console.error("Payment status error:", error);

        return {
            success: false,
            message: "Unable to check payment status",
            error: error.message
        };
    }
};


module.exports = {
    createPaymentOrder,
    verifyPayment,
    getPaymentDetails,
    refundPayment,
    checkPaymentStatus
};