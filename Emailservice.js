// ==========================================
// MERA ILAKA - EMAIL SERVICE
// ==========================================

const nodemailer = require("nodemailer");


// ==========================================
// CREATE EMAIL TRANSPORTER
// ==========================================

const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }

});


// ==========================================
// VERIFY EMAIL CONNECTION
// ==========================================

const verifyEmailConnection = async () => {

    try {

        await transporter.verify();

        console.log(
            "Email service connected successfully."
        );

        return true;

    } catch (error) {

        console.error(
            "Email service connection failed:",
            error.message
        );

        return false;

    }

};


// ==========================================
// SEND EMAIL
// ==========================================

const sendEmail = async ({
    to,
    subject,
    text,
    html
}) => {

    try {

        if (!to) {

            throw new Error(
                "Recipient email address is required."
            );

        }


        const mailOptions = {

            from: `"Mera Ilaka" <${process.env.EMAIL_USER}>`,

            to: to,

            subject: subject || "Mera Ilaka Notification",

            text: text || "",

            html: html || undefined

        };


        const info =
            await transporter.sendMail(
                mailOptions
            );


        console.log(
            "Email sent successfully:",
            info.messageId
        );


        return {

            success: true,

            message:
                "Email sent successfully.",

            messageId:
                info.messageId

        };

    } catch (error) {

        console.error(
            "Email sending failed:",
            error.message
        );


        return {

            success: false,

            message:
                "Failed to send email.",

            error:
                error.message

        };

    }

};


// ==========================================
// SEND WELCOME EMAIL
// ==========================================

const sendWelcomeEmail = async (
    userEmail,
    userName
) => {

    return await sendEmail({

        to: userEmail,

        subject:
            "Welcome to Mera Ilaka!",

        text:
            `Hello ${userName},

Welcome to Mera Ilaka.

Your account has been created successfully.

Thank you for joining our digital neighborhood platform.

Regards,
Mera Ilaka Team`,

        html: `
            <div style="font-family: Arial, sans-serif;">

                <h2>Welcome to Mera Ilaka!</h2>

                <p>
                    Hello <strong>${userName}</strong>,
                </p>

                <p>
                    Your Mera Ilaka account has been
                    created successfully.
                </p>

                <p>
                    You can now connect with residents,
                    businesses, services and community
                    activities in your neighborhood.
                </p>

                <p>
                    Regards,<br>
                    <strong>Mera Ilaka Team</strong>
                </p>

            </div>
        `

    });

};


// ==========================================
// SEND PASSWORD RESET EMAIL
// ==========================================

const sendPasswordResetEmail = async (
    userEmail,
    resetLink
) => {

    return await sendEmail({

        to: userEmail,

        subject:
            "Mera Ilaka - Password Reset",

        text:
            `You requested a password reset.

Please use the following link to reset your password:

${resetLink}

If you did not request this, please ignore this email.`,

        html: `
            <div style="font-family: Arial, sans-serif;">

                <h2>Password Reset</h2>

                <p>
                    You requested a password reset
                    for your Mera Ilaka account.
                </p>

                <p>
                    Click the button below to reset
                    your password:
                </p>

                <a
                    href="${resetLink}"
                    style="
                        display:inline-block;
                        padding:12px 20px;
                        background:#2563eb;
                        color:white;
                        text-decoration:none;
                        border-radius:6px;
                    "
                >
                    Reset Password
                </a>

                <p>
                    If you did not request this,
                    please ignore this email.
                </p>

            </div>
        `

    });

};


// ==========================================
// SEND COMPLAINT STATUS EMAIL
// ==========================================

const sendComplaintStatusEmail = async (
    userEmail,
    userName,
    complaintId,
    status
) => {

    return await sendEmail({

        to: userEmail,

        subject:
            "Mera Ilaka - Complaint Status Updated",

        text:
            `Hello ${userName},

Your complaint (${complaintId}) status has been updated.

Current Status: ${status}

Regards,
Mera Ilaka Team`,

        html: `
            <div style="font-family: Arial, sans-serif;">

                <h2>Complaint Status Updated</h2>

                <p>
                    Hello <strong>${userName}</strong>,
                </p>

                <p>
                    Your complaint
                    <strong>${complaintId}</strong>
                    has been updated.
                </p>

                <p>
                    Current Status:
                    <strong>${status}</strong>
                </p>

                <p>
                    Regards,<br>
                    <strong>Mera Ilaka Team</strong>
                </p>

            </div>
        `

    });

};


// ==========================================
// SEND EVENT NOTIFICATION EMAIL
// ==========================================

const sendEventNotificationEmail = async (
    userEmail,
    userName,
    eventName,
    eventDate
) => {

    return await sendEmail({

        to: userEmail,

        subject:
            `Mera Ilaka - ${eventName}`,

        text:
            `Hello ${userName},

You have a new community event notification.

Event: ${eventName}
Date: ${eventDate}

Regards,
Mera Ilaka Team`,

        html: `
            <div style="font-family: Arial, sans-serif;">

                <h2>Community Event</h2>

                <p>
                    Hello <strong>${userName}</strong>,
                </p>

                <p>
                    A new community event has been
                    announced.
                </p>

                <p>
                    <strong>Event:</strong>
                    ${eventName}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${eventDate}
                </p>

                <p>
                    Regards,<br>
                    <strong>Mera Ilaka Team</strong>
                </p>

            </div>
        `

    });

};


// ==========================================
// EXPORT SERVICES
// ==========================================

module.exports = {

    transporter,

    verifyEmailConnection,

    sendEmail,

    sendWelcomeEmail,

    sendPasswordResetEmail,

    sendComplaintStatusEmail,

    sendEventNotificationEmail

};