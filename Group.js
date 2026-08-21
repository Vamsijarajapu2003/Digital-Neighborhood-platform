// ==========================================
// MERA ILAKA - GROUP MODEL
// ==========================================

const mongoose = require("mongoose");


// ==========================================
// GROUP SCHEMA
// ==========================================

const groupSchema = new mongoose.Schema(

    {

        // ==========================================
        // GROUP CREATOR
        // ==========================================

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        // ==========================================
        // GROUP NAME
        // ==========================================

        name: {
            type: String,
            required: [true, "Group name is required"],
            trim: true,
            maxlength: 150
        },


        // ==========================================
        // GROUP DESCRIPTION
        // ==========================================

        description: {
            type: String,
            required: [true, "Group description is required"],
            trim: true,
            maxlength: 2000
        },


        // ==========================================
        // GROUP CATEGORY
        // ==========================================

        category: {
            type: String,
            enum: [
                "residents",
                "community",
                "sports",
                "education",
                "cultural",
                "hobby",
                "business",
                "social",
                "volunteer",
                "other"
            ],
            default: "community"
        },


        // ==========================================
        // GROUP IMAGE
        // ==========================================

        image: {
            type: String,
            default: ""
        },


        // ==========================================
        // GROUP COVER IMAGE
        // ==========================================

        coverImage: {
            type: String,
            default: ""
        },


        // ==========================================
        // GROUP LOCATION
        // ==========================================

        locality: {
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
        },


        // ==========================================
        // GROUP MEMBERS
        // ==========================================

        members: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },

                joinedAt: {
                    type: Date,
                    default: Date.now
                },

                role: {
                    type: String,
                    enum: [
                        "member",
                        "moderator",
                        "admin"
                    ],
                    default: "member"
                }
            }
        ],


        // ==========================================
        // MEMBER COUNT
        // ==========================================

        memberCount: {
            type: Number,
            default: 0,
            min: 0
        },


        // ==========================================
        // MAXIMUM MEMBERS
        // ==========================================

        maxMembers: {
            type: Number,
            default: 500,
            min: 1
        },


        // ==========================================
        // GROUP PRIVACY
        // ==========================================

        privacy: {
            type: String,
            enum: [
                "public",
                "private"
            ],
            default: "public"
        },


        // ==========================================
        // JOIN APPROVAL
        // ==========================================

        requireApproval: {
            type: Boolean,
            default: false
        },


        // ==========================================
        // GROUP STATUS
        // ==========================================

        status: {
            type: String,
            enum: [
                "active",
                "inactive",
                "blocked"
            ],
            default: "active"
        },


        // ==========================================
        // GROUP VERIFICATION
        // ==========================================

        verificationStatus: {
            type: String,
            enum: [
                "pending",
                "verified",
                "rejected"
            ],
            default: "pending"
        },


        // ==========================================
        // GROUP FEATURES
        // ==========================================

        allowPosts: {
            type: Boolean,
            default: true
        },


        allowComments: {
            type: Boolean,
            default: true
        },


        allowEvents: {
            type: Boolean,
            default: true
        },


        // ==========================================
        // FEATURED GROUP
        // ==========================================

        isFeatured: {
            type: Boolean,
            default: false
        },


        // ==========================================
        // GROUP VIEWS
        // ==========================================

        views: {
            type: Number,
            default: 0,
            min: 0
        }

    },

    {

        timestamps: true

    }

);


// ==========================================
// INDEXES
// ==========================================

groupSchema.index({
    name: "text",
    description: "text",
    category: "text"
});

groupSchema.index({
    city: 1,
    locality: 1
});

groupSchema.index({
    category: 1,
    status: 1
});

groupSchema.index({
    createdAt: -1
});


// ==========================================
// CHECK WHETHER GROUP IS FULL
// ==========================================

groupSchema.methods.isFull = function () {

    return this.memberCount >= this.maxMembers;

};


// ==========================================
// CHECK WHETHER USER IS A MEMBER
// ==========================================

groupSchema.methods.isMember = function (userId) {

    return this.members.some(

        member =>
            member.user.toString() === userId.toString()

    );

};


// ==========================================
// ADD MEMBER
// ==========================================

groupSchema.methods.addMember = function (userId) {

    if (this.isFull()) {
        throw new Error("Group is full");
    }

    if (this.isMember(userId)) {
        throw new Error("User is already a member");
    }

    this.members.push({
        user: userId,
        role: "member"
    });

    this.memberCount = this.members.length;

};


// ==========================================
// REMOVE MEMBER
// ==========================================

groupSchema.methods.removeMember = function (userId) {

    this.members = this.members.filter(

        member =>
            member.user.toString() !== userId.toString()

    );

    this.memberCount = this.members.length;

};


// ==========================================
// EXPORT MODEL
// ==========================================

const Group = mongoose.model(
    "Group",
    groupSchema
);

module.exports = Group;