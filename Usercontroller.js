// ==========================================
// MERA ILAKA - USER CONTROLLER
// ==========================================

const User = require("../models/User");


// ==========================================
// GET CURRENT USER PROFILE
// GET /api/users/profile
// ==========================================

exports.getProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        console.error("Get Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve profile."
        });
    }
};


// ==========================================
// GET USER BY ID
// GET /api/users/:id
// ==========================================

exports.getUserById = async (req, res) => {
    try {

        const user = await User.findById(req.params.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        console.error("Get User Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve user."
        });
    }
};


// ==========================================
// UPDATE CURRENT USER PROFILE
// PUT /api/users/profile
// ==========================================

exports.updateProfile = async (req, res) => {
    try {

        const {
            name,
            phone,
            address,
            city,
            state,
            pincode,
            profileImage
        } = req.body;


        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }


        // ------------------------------------------
        // UPDATE NAME
        // ------------------------------------------

        if (name !== undefined) {
            user.name = name.trim();
        }


        // ------------------------------------------
        // UPDATE PHONE
        // ------------------------------------------

        if (phone !== undefined) {
            user.phone = phone.trim();
        }


        // ------------------------------------------
        // UPDATE ADDRESS
        // ------------------------------------------

        if (address !== undefined) {
            user.address = address.trim();
        }


        // ------------------------------------------
        // UPDATE CITY
        // ------------------------------------------

        if (city !== undefined) {
            user.city = city.trim();
        }


        // ------------------------------------------
        // UPDATE STATE
        // ------------------------------------------

        if (state !== undefined) {
            user.state = state.trim();
        }


        // ------------------------------------------
        // UPDATE PINCODE
        // ------------------------------------------

        if (pincode !== undefined) {
            user.pincode = pincode.trim();
        }


        // ------------------------------------------
        // UPDATE PROFILE IMAGE
        // ------------------------------------------

        if (profileImage !== undefined) {
            user.profileImage = profileImage;
        }


        await user.save();


        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                address: user.address,
                city: user.city,
                state: user.state,
                pincode: user.pincode,
                profileImage: user.profileImage
            }
        });

    } catch (error) {

        console.error("Update Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update profile."
        });
    }
};


// ==========================================
// GET ALL USERS
// GET /api/users
// ==========================================

exports.getAllUsers = async (req, res) => {
    try {

        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });


        return res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {

        console.error("Get All Users Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve users."
        });
    }
};


// ==========================================
// SEARCH USERS
// GET /api/users/search?keyword=vamsi
// ==========================================

exports.searchUsers = async (req, res) => {
    try {

        const keyword = req.query.keyword || "";

        if (!keyword.trim()) {
            return res.status(400).json({
                success: false,
                message: "Search keyword is required."
            });
        }


        const users = await User.find({
            $or: [
                {
                    name: {
                        $regex: keyword,
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: keyword,
                        $options: "i"
                    }
                }
            ]
        })
        .select("-password")
        .limit(20);


        return res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {

        console.error("Search Users Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to search users."
        });
    }
};


// ==========================================
// UPDATE USER BY ADMIN
// PUT /api/users/:id
// ==========================================

exports.updateUser = async (req, res) => {
    try {

        const {
            name,
            phone,
            role,
            status
        } = req.body;


        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }


        if (name !== undefined) {
            user.name = name.trim();
        }

        if (phone !== undefined) {
            user.phone = phone.trim();
        }

        if (role !== undefined) {
            user.role = role;
        }

        if (status !== undefined) {
            user.status = status;
        }


        await user.save();


        return res.status(200).json({
            success: true,
            message: "User updated successfully.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status
            }
        });

    } catch (error) {

        console.error("Update User Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update user."
        });
    }
};


// ==========================================
// DELETE USER
// DELETE /api/users/:id
// ==========================================

exports.deleteUser = async (req, res) => {
    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }


        // ------------------------------------------
        // PREVENT SELF DELETION
        // ------------------------------------------

        if (
            user._id.toString() ===
            req.user.id.toString()
        ) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete your own account."
            });
        }


        await User.findByIdAndDelete(req.params.id);


        return res.status(200).json({
            success: true,
            message: "User deleted successfully."
        });

    } catch (error) {

        console.error("Delete User Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to delete user."
        });
    }
};


// ==========================================
// DEACTIVATE OWN ACCOUNT
// PATCH /api/users/deactivate
// ==========================================

exports.deactivateAccount = async (req, res) => {
    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }


        user.status = "inactive";

        await user.save();


        return res.status(200).json({
            success: true,
            message: "Your account has been deactivated."
        });

    } catch (error) {

        console.error(
            "Deactivate Account Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to deactivate account."
        });
    }
};


// ==========================================
// GET USER STATISTICS
// GET /api/users/statistics
// ==========================================

exports.getUserStatistics = async (req, res) => {
    try {

        const totalUsers = await User.countDocuments();

        const activeUsers = await User.countDocuments({
            status: "active"
        });

        const inactiveUsers = await User.countDocuments({
            status: "inactive"
        });

        const residents = await User.countDocuments({
            role: "resident"
        });

        const businessOwners = await User.countDocuments({
            role: "business"
        });

        const serviceProviders = await User.countDocuments({
            role: "service_provider"
        });

        const admins = await User.countDocuments({
            role: "admin"
        });


        return res.status(200).json({

            success: true,

            statistics: {
                totalUsers,
                activeUsers,
                inactiveUsers,
                residents,
                businessOwners,
                serviceProviders,
                admins
            }

        });

    } catch (error) {

        console.error(
            "User Statistics Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve user statistics."
        });
    }
};