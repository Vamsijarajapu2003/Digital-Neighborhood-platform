// ==========================================
// MERA ILAKA - USER MODEL
// ==========================================

const mongoose = require("mongoose");


// ==========================================
// USER SCHEMA
// ==========================================

const userSchema = new mongoose.Schema(

    {

        // User's full name
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: 2,
            maxlength: 100
        },


        // User email
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true
        },


        // Password
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false
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


        // User role
        role: {
            type: String,
            enum: [
                "resident",
                "business",
                "service_provider",
                "admin"
            ],
            default: "resident"
        },


        // Account status
        status: {
            type: String,
            enum: [
                "active",
                "inactive",
                "blocked"
            ],
            default: "active"
        },


        // Address
        address: {
            street: {
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


        // Neighborhood / locality
        locality: {
            type: String,
            trim: true
        },


        // Last login
        lastLogin: {
            type: Date,
            default: null
        }

    },

    {

        timestamps: true

    }

);


// ==========================================
// REMOVE PASSWORD FROM JSON RESPONSE
// ==========================================

userSchema.methods.toJSON = function () {

    const user = this.toObject();

    delete user.password;

    return user;

};


// ==========================================
// EXPORT MODEL
// ==========================================

const User = mongoose.model("User", userSchema);

module.exports = User;