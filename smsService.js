// ==========================================
// MERA ILAKA - SMS SERVICE
// ==========================================

const twilio = require("twilio");


// ==========================================
// TWILIO CONFIGURATION
// ==========================================

const accountSid =
    process.env.TWILIO_ACCOUNT_SID;

const authToken =
    process.env.TWILIO_AUTH_TOKEN;

const twilioPhoneNumber =
    process.env.TWILIO_PHONE_NUMBER;


// ==========================================
// CREATE TWILIO CLIENT
// ==========================================

let client = null;

if (accountSid && authToken) {

    client = twilio(
        accountSid,
        authToken
    );

}


// ==========================================
// SEND SMS
// ==========================================

const sendSMS = async (
    phoneNumber,
    message
) => {

    try {

        // --------------------------------------
        // Check required data
        // --------------------------------------

        if (!phoneNumber) {

            throw new Error(
                "Phone number is required."
            );

        }

        if (!message) {

            throw new Error(
                "SMS message is required."
            );

        }


        // --------------------------------------
        // Check Twilio configuration
        // --------------------------------------

        if (
            !client ||
            !twilioPhoneNumber
        ) {

            throw new Error(
                "Twilio SMS service is not configured."
            );

        }


        // --------------------------------------
        // Send SMS
        // --------------------------------------

        const sms =
            await client.messages.create({

                body: message,

                from:
                    twilioPhoneNumber,

                to:
                    phoneNumber

            });


        console.log(
            "SMS sent successfully:",
            sms.sid
        );


        return {

            success: true,

            message:
                "SMS sent successfully.",

            messageId:
                sms.sid

        };

    } catch (error) {

        console.error(
            "SMS sending failed:",
            error.message
        );


        return {

            success: false,

            message:
                "Failed to send SMS.",

            error:
                error.message

        };

    }

};


// ==========================================
// SEND WELCOME SMS
// ==========================================

const sendWelcomeSMS = async (
    phoneNumber,
    userName
) => {

    const message =
        `Hello ${userName}, welcome to Mera Ilaka! Your account has been created successfully.`;

    return await sendSMS(
        phoneNumber,
        message
    );

};


// ==========================================
// SEND OTP SMS
// ==========================================

const sendOTPSMS = async (
    phoneNumber,
    otp
) => {

    const message =
        `Your Mera Ilaka verification OTP is ${otp}. Please do not share this OTP with anyone.`;

    return await sendSMS(
        phoneNumber,
        message
    );

};


// ==========================================
// SEND COMPLAINT STATUS SMS
// ==========================================

const sendComplaintStatusSMS = async (
    phoneNumber,
    complaintId,
    status
) => {

    const message =
        `Mera Ilaka: Your complaint ${complaintId} status has been updated to ${status}.`;

    return await sendSMS(
        phoneNumber,
        message
    );

};


// ==========================================
// SEND EMERGENCY ALERT SMS
// ==========================================

const sendEmergencyAlertSMS = async (
    phoneNumber,
    emergencyType
) => {

    const message =
        `Mera Ilaka Emergency Alert: ${emergencyType}. Please check your Mera Ilaka account for more details.`;

    return await sendSMS(
        phoneNumber,
        message
    );

};


// ==========================================
// SEND EVENT REMINDER SMS
// ==========================================

const sendEventReminderSMS = async (
    phoneNumber,
    eventName,
    eventDate
) => {

    const message =
        `Mera Ilaka Event Reminder: ${eventName} is scheduled for ${eventDate}.`;

    return await sendSMS(
        phoneNumber,
        message
    );

};


// ==========================================
// EXPORT SMS FUNCTIONS
// ==========================================

module.exports = {

    sendSMS,

    sendWelcomeSMS,

    sendOTPSMS,

    sendComplaintStatusSMS,

    sendEmergencyAlertSMS,

    sendEventReminderSMS

};