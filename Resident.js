// ==========================================
// MERA ILAKA - RESIDENT MODEL
// ==========================================

const mongoose = require("mongoose");


// ==========================================
// RESIDENT SCHEMA
// ==========================================

const residentSchema = new mongoose.Schema(

    {

        // Reference to User account
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },


        // Full name
        fullName: {
            type: String,
            required: [true, "Resident name is required"],
            trim: true
        },


        // Date of birth
        dateOfBirth: {
            type: Date
        },


        // Gender
        gender: {
            type: String,
            enum: [
                "male",
                "female",
                "other",
                "prefer_not_to_say"
            ],
            default: "prefer_not_to_say"
        },


        // Phone number
        phone: {
            type: String,
            trim: true
        },


        // Profile picture
        profileImage: {
            type: String,
            default: ""
        },


        // House / Flat information
        houseNumber: {
            type: String,
            trim: true
        },


        // Street name
        street: {
            type: String,
            trim: true
        },


        // Neighborhood
        locality: {
            type: String,
            required: true,
            trim: true
        },


        // City
        city: {
            type: String,
            required: true,
            trim: true
        },


        // State
        state: {
            type: String,
            required: true,
            trim: true
        },


        // PIN code
        pincode: {
            type: String,
            required: true,
            trim: true
        },


        // Occupation
        occupation: {
            type: String,
            trim: true
        },


        // Emergency contact
        emergencyContact: {

            name: {
                type: String,
                trim: true
            },

            relationship: {
                type: String,
                trim: true
            },

            phone: {
                type: String,
                trim: true
            }

        },


        // Resident verification status
        verificationStatus: {
            type: String,
            enum: [
                "pending",
                "verified",
                "rejected"
            ],
            default: "pending"
        },


        // Community participation
        joinedGroups: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Group"
            }
        ],


        // Notification preference
        notificationsEnabled: {
            type: Boolean,
            default: true
        },


        // Resident account status
        status: {
            type: String,
            enum: [
                "active",
                "inactive",
                "blocked"
            ],
            default: "active"
        }

    },

    {

        timestamps: true

    }

);


// ==========================================
// EXPORT MODEL
// ==========================================
 


const Resident = mongoose.model(
    "Resident",
    residentSchema
);


module.exports = Resident;