// ==========================================
// MERA ILAKA - GROUP CONTROLLER
// ==========================================

const Group = require("../models/Group");


// ==========================================
// CREATE GROUP
// POST /api/groups
// ==========================================

exports.createGroup = async (req, res) => {
    try {

        const {
            name,
            description,
            category,
            location,
            city,
            state,
            pincode,
            image,
            privacy,
            rules
        } = req.body;


        // ------------------------------------------
        // VALIDATE REQUIRED FIELDS
        // ------------------------------------------

        if (!name || !description || !category) {

            return res.status(400).json({
                success: false,
                message:
                    "Group name, description and category are required."
            });

        }


        // ------------------------------------------
        // CHECK DUPLICATE GROUP
        // ------------------------------------------

        const existingGroup =
            await Group.findOne({
                name: {
                    $regex: `^${name.trim()}$`,
                    $options: "i"
                }
            });


        if (existingGroup) {

            return res.status(409).json({
                success: false,
                message:
                    "A group with this name already exists."
            });

        }


        // ------------------------------------------
        // CREATE GROUP
        // ------------------------------------------

        const group =
            await Group.create({

                name: name.trim(),

                description:
                    description.trim(),

                category,

                location:
                    location
                        ? location.trim()
                        : "",

                city:
                    city
                        ? city.trim()
                        : "",

                state:
                    state
                        ? state.trim()
                        : "",

                pincode:
                    pincode
                        ? pincode.trim()
                        : "",

                image:
                    image || "",

                privacy:
                    privacy || "public",

                rules:
                    Array.isArray(rules)
                        ? rules
                        : [],

                owner:
                    req.user.id,

                members: [
                    req.user.id
                ],

                status: "pending"

            });


        return res.status(201).json({

            success: true,

            message:
                "Group created successfully and submitted for approval.",

            group

        });

    } catch (error) {

        console.error(
            "Create Group Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to create group."

        });

    }
};


// ==========================================
// GET ALL APPROVED GROUPS
// GET /api/groups
// ==========================================

exports.getGroups = async (req, res) => {
    try {

        const {
            category,
            city,
            state,
            privacy,
            keyword,
            page = 1,
            limit = 20
        } = req.query;


        // ------------------------------------------
        // BASE FILTER
        // ------------------------------------------

        const filter = {

            status: "approved"

        };


        // ------------------------------------------
        // CATEGORY
        // ------------------------------------------

        if (category) {

            filter.category =
                category;

        }


        // ------------------------------------------
        // CITY
        // ------------------------------------------

        if (city) {

            filter.city = {

                $regex: city,

                $options: "i"

            };

        }


        // ------------------------------------------
        // STATE
        // ------------------------------------------

        if (state) {

            filter.state = {

                $regex: state,

                $options: "i"

            };

        }


        // ------------------------------------------
        // PRIVACY
        // ------------------------------------------

        if (privacy) {

            filter.privacy =
                privacy;

        }


        // ------------------------------------------
        // KEYWORD SEARCH
        // ------------------------------------------

        if (keyword) {

            filter.$or = [

                {
                    name: {

                        $regex: keyword,

                        $options: "i"

                    }
                },

                {
                    description: {

                        $regex: keyword,

                        $options: "i"

                    }
                },

                {
                    category: {

                        $regex: keyword,

                        $options: "i"

                    }
                },

                {
                    city: {

                        $regex: keyword,

                        $options: "i"

                    }
                }

            ];

        }


        // ------------------------------------------
        // PAGINATION
        // ------------------------------------------

        const pageNumber =
            Math.max(
                parseInt(page),
                1
            );


        const limitNumber =
            Math.min(
                Math.max(
                    parseInt(limit),
                    1
                ),
                100
            );


        const skip =
            (pageNumber - 1) *
            limitNumber;


        // ------------------------------------------
        // GET GROUPS
        // ------------------------------------------

        const groups =
            await Group.find(filter)

                .populate(
                    "owner",
                    "name email phone"
                )

                .populate(
                    "members",
                    "name email"
                )

                .sort({

                    createdAt: -1

                })

                .skip(skip)

                .limit(limitNumber);


        const total =
            await Group.countDocuments(
                filter
            );


        return res.status(200).json({

            success: true,

            count:
                groups.length,

            total,

            page:
                pageNumber,

            pages:
                Math.ceil(
                    total / limitNumber
                ),

            groups

        });

    } catch (error) {

        console.error(
            "Get Groups Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve groups."

        });

    }
};


// ==========================================
// GET GROUP BY ID
// GET /api/groups/:id
// ==========================================

exports.getGroupById = async (req, res) => {
    try {

        const group =
            await Group.findById(
                req.params.id
            )

            .populate(
                "owner",
                "name email phone"
            )

            .populate(
                "members",
                "name email phone"
            );


        if (!group) {

            return res.status(404).json({

                success: false,

                message:
                    "Group not found."

            });

        }


        // ------------------------------------------
        // INCREASE VIEW COUNT
        // ------------------------------------------

        group.views =
            (group.views || 0) + 1;


        await group.save();


        return res.status(200).json({

            success: true,

            group

        });

    } catch (error) {

        console.error(
            "Get Group Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve group."

        });

    }
};


// ==========================================
// GET MY GROUPS
// GET /api/groups/my-groups
// ==========================================

exports.getMyGroups = async (req, res) => {
    try {

        const groups =
            await Group.find({

                $or: [

                    {
                        owner:
                            req.user.id
                    },

                    {
                        members:
                            req.user.id
                    }

                ]

            })

            .populate(
                "owner",
                "name email"
            )

            .sort({

                createdAt: -1

            });


        return res.status(200).json({

            success: true,

            count:
                groups.length,

            groups

        });

    } catch (error) {

        console.error(
            "Get My Groups Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve your groups."

        });

    }
};


// ==========================================
// UPDATE GROUP
// PUT /api/groups/:id
// ==========================================

exports.updateGroup = async (req, res) => {
    try {

        const {
            name,
            description,
            category,
            location,
            city,
            state,
            pincode,
            image,
            privacy,
            rules
        } = req.body;


        const group =
            await Group.findById(
                req.params.id
            );


        if (!group) {

            return res.status(404).json({

                success: false,

                message:
                    "Group not found."

            });

        }


        // ------------------------------------------
        // CHECK OWNER
        // ------------------------------------------

        if (
            group.owner.toString() !==
            req.user.id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Only the group owner can update this group."

            });

        }


        // ------------------------------------------
        // UPDATE FIELDS
        // ------------------------------------------

        if (name !== undefined) {

            group.name =
                name.trim();

        }


        if (description !== undefined) {

            group.description =
                description.trim();

        }


        if (category !== undefined) {

            group.category =
                category;

        }


        if (location !== undefined) {

            group.location =
                location.trim();

        }


        if (city !== undefined) {

            group.city =
                city.trim();

        }


        if (state !== undefined) {

            group.state =
                state.trim();

        }


        if (pincode !== undefined) {

            group.pincode =
                pincode.trim();

        }


        if (image !== undefined) {

            group.image =
                image;

        }


        if (privacy !== undefined) {

            group.privacy =
                privacy;

        }


        if (rules !== undefined) {

            group.rules =
                Array.isArray(rules)
                    ? rules
                    : [];

        }


        // ------------------------------------------
        // SEND FOR APPROVAL AGAIN
        // ------------------------------------------

        group.status =
            "pending";


        await group.save();


        return res.status(200).json({

            success: true,

            message:
                "Group updated and submitted for approval.",

            group

        });

    } catch (error) {

        console.error(
            "Update Group Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to update group."

        });

    }
};


// ==========================================
// DELETE GROUP
// DELETE /api/groups/:id
// ==========================================

exports.deleteGroup = async (req, res) => {
    try {

        const group =
            await Group.findById(
                req.params.id
            );


        if (!group) {

            return res.status(404).json({

                success: false,

                message:
                    "Group not found."

            });

        }


        // ------------------------------------------
        // CHECK OWNER
        // ------------------------------------------

        if (
            group.owner.toString() !==
            req.user.id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Only the group owner can delete this group."

            });

        }


        await Group.findByIdAndDelete(
            req.params.id
        );


        return res.status(200).json({

            success: true,

            message:
                "Group deleted successfully."

        });

    } catch (error) {

        console.error(
            "Delete Group Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to delete group."

        });

    }
};


// ==========================================
// SEARCH GROUPS
// GET /api/groups/search?keyword=sports
// ==========================================

exports.searchGroups = async (req, res) => {
    try {

        const keyword =
            req.query.keyword || "";


        if (!keyword.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Search keyword is required."

            });

        }


        const groups =
            await Group.find({

                status: "approved",

                $or: [

                    {
                        name: {

                            $regex: keyword,

                            $options: "i"

                        }
                    },

                    {
                        description: {

                            $regex: keyword,

                            $options: "i"

                        }
                    },

                    {
                        category: {

                            $regex: keyword,

                            $options: "i"

                        }
                    },

                    {
                        city: {

                            $regex: keyword,

                            $options: "i"

                        }
                    }

                ]

            })

            .populate(
                "owner",
                "name email phone"
            )

            .sort({

                createdAt: -1

            })

            .limit(50);


        return res.status(200).json({

            success: true,

            count:
                groups.length,

            groups

        });

    } catch (error) {

        console.error(
            "Search Groups Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to search groups."

        });

    }
};


// ==========================================
// JOIN GROUP
// POST /api/groups/:id/join
// ==========================================

exports.joinGroup = async (req, res) => {
    try {

        const group =
            await Group.findById(
                req.params.id
            );


        if (!group) {

            return res.status(404).json({

                success: false,

                message:
                    "Group not found."

            });

        }


        // ------------------------------------------
        // CHECK GROUP STATUS
        // ------------------------------------------

        if (
            group.status !==
            "approved"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "This group is not currently available."

            });

        }


        // ------------------------------------------
        // CHECK ALREADY MEMBER
        // ------------------------------------------

        const alreadyMember =
            group.members.some(

                memberId =>
                    memberId.toString() ===
                    req.user.id.toString()

            );


        if (alreadyMember) {

            return res.status(409).json({

                success: false,

                message:
                    "You are already a member of this group."

            });

        }


        // ------------------------------------------
        // PRIVATE GROUP
        // ------------------------------------------

        if (
            group.privacy ===
            "private"
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "This is a private group. Membership requires approval."

            });

        }


        // ------------------------------------------
        // ADD MEMBER
        // ------------------------------------------

        group.members.push(
            req.user.id
        );


        await group.save();


        return res.status(200).json({

            success: true,

            message:
                "You joined the group successfully.",

            memberCount:
                group.members.length

        });

    } catch (error) {

        console.error(
            "Join Group Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to join group."

        });

    }
};


// ==========================================
// LEAVE GROUP
// DELETE /api/groups/:id/leave
// ==========================================

exports.leaveGroup = async (req, res) => {
    try {

        const group =
            await Group.findById(
                req.params.id
            );


        if (!group) {

            return res.status(404).json({

                success: false,

                message:
                    "Group not found."

            });

        }


        // ------------------------------------------
        // OWNER CANNOT LEAVE
        // ------------------------------------------

        if (
            group.owner.toString() ===
            req.user.id.toString()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Group owner cannot leave the group. Delete the group or transfer ownership first."

            });

        }


        // ------------------------------------------
        // CHECK MEMBERSHIP
        // ------------------------------------------

        const isMember =
            group.members.some(

                memberId =>
                    memberId.toString() ===
                    req.user.id.toString()

            );


        if (!isMember) {

            return res.status(400).json({

                success: false,

                message:
                    "You are not a member of this group."

            });

        }


        // ------------------------------------------
        // REMOVE MEMBER
        // ------------------------------------------

        group.members =
            group.members.filter(

                memberId =>
                    memberId.toString() !==
                    req.user.id.toString()

            );


        await group.save();


        return res.status(200).json({

            success: true,

            message:
                "You left the group successfully.",

            memberCount:
                group.members.length

        });

    } catch (error) {

        console.error(
            "Leave Group Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to leave group."

        });

    }
};


// ==========================================
// GET GROUP MEMBERS
// GET /api/groups/:id/members
// ==========================================

exports.getGroupMembers = async (req, res) => {
    try {

        const group =
            await Group.findById(
                req.params.id
            )

            .populate(
                "members",
                "name email phone profileImage"
            );


        if (!group) {

            return res.status(404).json({

                success: false,

                message:
                    "Group not found."

            });

        }


        return res.status(200).json({

            success: true,

            count:
                group.members.length,

            members:
                group.members

        });

    } catch (error) {

        console.error(
            "Get Group Members Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve group members."

        });

    }
};


// ==========================================
// REMOVE MEMBER
// DELETE /api/groups/:id/members/:userId
// ==========================================

exports.removeMember = async (req, res) => {
    try {

        const group =
            await Group.findById(
                req.params.id
            );


        if (!group) {

            return res.status(404).json({

                success: false,

                message:
                    "Group not found."

            });

        }


        // ------------------------------------------
        // CHECK OWNER
        // ------------------------------------------

        if (
            group.owner.toString() !==
            req.user.id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Only the group owner can remove members."

            });

        }


        // ------------------------------------------
        // OWNER CANNOT REMOVE THEMSELVES
        // ------------------------------------------

        if (
            req.params.userId ===
            req.user.id.toString()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Group owner cannot remove themselves."

            });

        }


        // ------------------------------------------
        // CHECK MEMBER
        // ------------------------------------------

        const isMember =
            group.members.some(

                memberId =>
                    memberId.toString() ===
                    req.params.userId

            );


        if (!isMember) {

            return res.status(404).json({

                success: false,

                message:
                    "User is not a member of this group."

            });

        }


        // ------------------------------------------
        // REMOVE USER
        // ------------------------------------------

        group.members =
            group.members.filter(

                memberId =>
                    memberId.toString() !==
                    req.params.userId

            );


        await group.save();


        return res.status(200).json({

            success: true,

            message:
                "Member removed successfully.",

            memberCount:
                group.members.length

        });

    } catch (error) {

        console.error(
            "Remove Member Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to remove member."

        });

    }
};


// ==========================================
// GET PENDING GROUPS
// ADMIN
// GET /api/groups/admin/pending
// ==========================================

exports.getPendingGroups = async (req, res) => {
    try {

        const groups =
            await Group.find({

                status: "pending"

            })

            .populate(
                "owner",
                "name email phone"
            )

            .populate(
                "members",
                "name email"
            )

            .sort({

                createdAt: -1

            });


        return res.status(200).json({

            success: true,

            count:
                groups.length,

            groups

        });

    } catch (error) {

        console.error(
            "Get Pending Groups Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve pending groups."

        });

    }
};


// ==========================================
// APPROVE GROUP
// ADMIN
// PATCH /api/groups/:id/approve
// ==========================================

exports.approveGroup = async (req, res) => {
    try {

        const group =
            await Group.findById(
                req.params.id
            );


        if (!group) {

            return res.status(404).json({

                success: false,

                message:
                    "Group not found."

            });

        }


        group.status =
            "approved";


        group.approvedBy =
            req.user.id;


        group.approvedAt =
            new Date();


        await group.save();


        return res.status(200).json({

            success: true,

            message:
                "Group approved successfully.",

            group

        });

    } catch (error) {

        console.error(
            "Approve Group Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to approve group."

        });

    }
};


// ==========================================
// REJECT GROUP
// ADMIN
// PATCH /api/groups/:id/reject
// ==========================================

exports.rejectGroup = async (req, res) => {
    try {

        const {
            reason
        } = req.body;


        const group =
            await Group.findById(
                req.params.id
            );


        if (!group) {

            return res.status(404).json({

                success: false,

                message:
                    "Group not found."

            });

        }


        group.status =
            "rejected";


        group.rejectionReason =
            reason
                ? reason.trim()
                : "Group rejected by administrator.";


        group.rejectedBy =
            req.user.id;


        group.rejectedAt =
            new Date();


        await group.save();


        return res.status(200).json({

            success: true,

            message:
                "Group rejected successfully.",

            group

        });

    } catch (error) {

        console.error(
            "Reject Group Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to reject group."

        });

    }
};


// ==========================================
// UPDATE GROUP STATUS
// ADMIN
// PATCH /api/groups/:id/status
// ==========================================

exports.updateGroupStatus = async (req, res) => {
    try {

        const {
            status
        } = req.body;


        const allowedStatuses = [

            "pending",

            "approved",

            "rejected",

            "suspended",

            "inactive"

        ];


        if (
            !allowedStatuses.includes(status)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid group status."

            });

        }


        const group =
            await Group.findByIdAndUpdate(

                req.params.id,

                {
                    status
                },

                {
                    new: true,

                    runValidators: true

                }

            );


        if (!group) {

            return res.status(404).json({

                success: false,

                message:
                    "Group not found."

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Group status updated successfully.",

            group

        });

    } catch (error) {

        console.error(
            "Update Group Status Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to update group status."

        });

    }
};


// ==========================================
// GET GROUP STATISTICS
// ADMIN
// GET /api/groups/admin/statistics
// ==========================================

exports.getGroupStatistics = async (req, res) => {
    try {

        const totalGroups =
            await Group.countDocuments();


        const approvedGroups =
            await Group.countDocuments({

                status: "approved"

            });


        const pendingGroups =
            await Group.countDocuments({

                status: "pending"

            });


        const rejectedGroups =
            await Group.countDocuments({

                status: "rejected"

            });


        const suspendedGroups =
            await Group.countDocuments({

                status: "suspended"

            });


        return res.status(200).json({

            success: true,

            statistics: {

                totalGroups,

                approvedGroups,

                pendingGroups,

                rejectedGroups,

                suspendedGroups

            }

        });

    } catch (error) {

        console.error(
            "Group Statistics Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve group statistics."

        });

    }
};