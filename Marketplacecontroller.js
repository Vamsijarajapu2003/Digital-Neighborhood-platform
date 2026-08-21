// ==========================================
// MERA ILAKA - MARKETPLACE CONTROLLER
// ==========================================

const Product = require("../models/Product");


// ==========================================
// CREATE PRODUCT
// POST /api/marketplace
// ==========================================

exports.createProduct = async (req, res) => {
    try {

        const {
            title,
            description,
            category,
            price,
            condition,
            location,
            images,
            contactPhone,
            contactEmail
        } = req.body;


        // ------------------------------------------
        // VALIDATE REQUIRED FIELDS
        // ------------------------------------------

        if (!title || !description || price === undefined) {

            return res.status(400).json({
                success: false,
                message:
                    "Title, description and price are required."
            });

        }


        // ------------------------------------------
        // VALIDATE PRICE
        // ------------------------------------------

        if (Number(price) < 0) {

            return res.status(400).json({
                success: false,
                message: "Price cannot be negative."
            });

        }


        // ------------------------------------------
        // CREATE PRODUCT
        // ------------------------------------------

        const product = await Product.create({

            seller: req.user.id,

            title: title.trim(),

            description: description.trim(),

            category: category || "other",

            price: Number(price),

            condition: condition || "used",

            location: location || {},

            images: Array.isArray(images)
                ? images
                : [],

            contactPhone:
                contactPhone
                    ? contactPhone.trim()
                    : "",

            contactEmail:
                contactEmail
                    ? contactEmail.toLowerCase().trim()
                    : "",

            status: "pending"

        });


        return res.status(201).json({

            success: true,

            message:
                "Product submitted successfully. It is waiting for approval.",

            product

        });

    } catch (error) {

        console.error(
            "Create Product Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to create product."

        });

    }
};


// ==========================================
// GET ALL APPROVED PRODUCTS
// GET /api/marketplace
// ==========================================

exports.getProducts = async (req, res) => {
    try {

        const {
            category,
            condition,
            minPrice,
            maxPrice,
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
        // CATEGORY FILTER
        // ------------------------------------------

        if (category) {

            filter.category = category;

        }


        // ------------------------------------------
        // CONDITION FILTER
        // ------------------------------------------

        if (condition) {

            filter.condition = condition;

        }


        // ------------------------------------------
        // PRICE FILTER
        // ------------------------------------------

        if (
            minPrice !== undefined ||
            maxPrice !== undefined
        ) {

            filter.price = {};

            if (minPrice !== undefined) {

                filter.price.$gte =
                    Number(minPrice);

            }

            if (maxPrice !== undefined) {

                filter.price.$lte =
                    Number(maxPrice);

            }

        }


        // ------------------------------------------
        // KEYWORD SEARCH
        // ------------------------------------------

        if (keyword) {

            filter.$or = [

                {
                    title: {
                        $regex: keyword,
                        $options: "i"
                    }
                },

                {
                    description: {
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
            Math.max(parseInt(page), 1);

        const limitNumber =
            Math.min(
                Math.max(parseInt(limit), 1),
                100
            );

        const skip =
            (pageNumber - 1) *
            limitNumber;


        // ------------------------------------------
        // GET PRODUCTS
        // ------------------------------------------

        const products =
            await Product.find(filter)

                .populate(
                    "seller",
                    "name email phone"
                )

                .sort({
                    createdAt: -1
                })

                .skip(skip)

                .limit(limitNumber);


        const total =
            await Product.countDocuments(filter);


        return res.status(200).json({

            success: true,

            count: products.length,

            total,

            page: pageNumber,

            pages:
                Math.ceil(
                    total / limitNumber
                ),

            products

        });

    } catch (error) {

        console.error(
            "Get Products Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve marketplace products."

        });

    }
};


// ==========================================
// GET PRODUCT BY ID
// GET /api/marketplace/:id
// ==========================================

exports.getProductById = async (req, res) => {
    try {

        const product =
            await Product.findById(
                req.params.id
            )

            .populate(
                "seller",
                "name email phone"
            );


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found."

            });

        }


        // ------------------------------------------
        // INCREASE PRODUCT VIEWS
        // ------------------------------------------

        product.views =
            (product.views || 0) + 1;


        await product.save();


        return res.status(200).json({

            success: true,

            product

        });

    } catch (error) {

        console.error(
            "Get Product Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve product."

        });

    }
};


// ==========================================
// GET MY PRODUCTS
// GET /api/marketplace/my-products
// ==========================================

exports.getMyProducts = async (req, res) => {
    try {

        const products =
            await Product.find({

                seller: req.user.id

            })

            .sort({

                createdAt: -1

            });


        return res.status(200).json({

            success: true,

            count: products.length,

            products

        });

    } catch (error) {

        console.error(
            "Get My Products Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve your products."

        });

    }
};


// ==========================================
// UPDATE PRODUCT
// PUT /api/marketplace/:id
// ==========================================

exports.updateProduct = async (req, res) => {
    try {

        const {
            title,
            description,
            category,
            price,
            condition,
            location,
            images,
            contactPhone,
            contactEmail
        } = req.body;


        const product =
            await Product.findById(
                req.params.id
            );


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found."

            });

        }


        // ------------------------------------------
        // CHECK OWNER
        // ------------------------------------------

        if (
            product.seller.toString() !==
            req.user.id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You can update only your own products."

            });

        }


        // ------------------------------------------
        // UPDATE FIELDS
        // ------------------------------------------

        if (title !== undefined) {

            product.title =
                title.trim();

        }


        if (description !== undefined) {

            product.description =
                description.trim();

        }


        if (category !== undefined) {

            product.category =
                category;

        }


        if (price !== undefined) {

            if (Number(price) < 0) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Price cannot be negative."

                });

            }

            product.price =
                Number(price);

        }


        if (condition !== undefined) {

            product.condition =
                condition;

        }


        if (location !== undefined) {

            product.location =
                location;

        }


        if (images !== undefined) {

            product.images =
                Array.isArray(images)
                    ? images
                    : [];

        }


        if (contactPhone !== undefined) {

            product.contactPhone =
                contactPhone.trim();

        }


        if (contactEmail !== undefined) {

            product.contactEmail =
                contactEmail
                    .toLowerCase()
                    .trim();

        }


        // ------------------------------------------
        // SEND UPDATED PRODUCT FOR APPROVAL
        // ------------------------------------------

        product.status = "pending";


        await product.save();


        return res.status(200).json({

            success: true,

            message:
                "Product updated and sent for approval.",

            product

        });

    } catch (error) {

        console.error(
            "Update Product Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to update product."

        });

    }
};


// ==========================================
// DELETE PRODUCT
// DELETE /api/marketplace/:id
// ==========================================

exports.deleteProduct = async (req, res) => {
    try {

        const product =
            await Product.findById(
                req.params.id
            );


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found."

            });

        }


        // ------------------------------------------
        // CHECK OWNER
        // ------------------------------------------

        if (
            product.seller.toString() !==
            req.user.id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You can delete only your own products."

            });

        }


        await Product.findByIdAndDelete(
            req.params.id
        );


        return res.status(200).json({

            success: true,

            message:
                "Product deleted successfully."

        });

    } catch (error) {

        console.error(
            "Delete Product Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to delete product."

        });

    }
};


// ==========================================
// SEARCH PRODUCTS
// GET /api/marketplace/search?keyword=phone
// ==========================================

exports.searchProducts = async (req, res) => {
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


        const products =
            await Product.find({

                status: "approved",

                $or: [

                    {
                        title: {
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
                    }

                ]

            })

            .populate(
                "seller",
                "name email phone"
            )

            .sort({
                createdAt: -1
            })

            .limit(50);


        return res.status(200).json({

            success: true,

            count: products.length,

            products

        });

    } catch (error) {

        console.error(
            "Search Products Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to search products."

        });

    }
};


// ==========================================
// GET PENDING PRODUCTS
// ADMIN
// GET /api/marketplace/admin/pending
// ==========================================

exports.getPendingProducts = async (req, res) => {
    try {

        const products =
            await Product.find({

                status: "pending"

            })

            .populate(
                "seller",
                "name email phone"
            )

            .sort({

                createdAt: -1

            });


        return res.status(200).json({

            success: true,

            count: products.length,

            products

        });

    } catch (error) {

        console.error(
            "Get Pending Products Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve pending products."

        });

    }
};


// ==========================================
// APPROVE PRODUCT
// ADMIN
// PATCH /api/marketplace/:id/approve
// ==========================================

exports.approveProduct = async (req, res) => {
    try {

        const product =
            await Product.findById(
                req.params.id
            );


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found."

            });

        }


        product.status = "approved";


        product.approvedBy =
            req.user.id;


        product.approvedAt =
            new Date();


        await product.save();


        return res.status(200).json({

            success: true,

            message:
                "Product approved successfully.",

            product

        });

    } catch (error) {

        console.error(
            "Approve Product Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to approve product."

        });

    }
};


// ==========================================
// REJECT PRODUCT
// ADMIN
// PATCH /api/marketplace/:id/reject
// ==========================================

exports.rejectProduct = async (req, res) => {
    try {

        const {
            reason
        } = req.body;


        const product =
            await Product.findById(
                req.params.id
            );


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found."

            });

        }


        product.status = "rejected";


        product.rejectionReason =
            reason
                ? reason.trim()
                : "Product rejected by administrator.";


        product.rejectedBy =
            req.user.id;


        product.rejectedAt =
            new Date();


        await product.save();


        return res.status(200).json({

            success: true,

            message:
                "Product rejected successfully.",

            product

        });

    } catch (error) {

        console.error(
            "Reject Product Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to reject product."

        });

    }
};


// ==========================================
// MARK PRODUCT AS SOLD
// PATCH /api/marketplace/:id/sold
// ==========================================

exports.markAsSold = async (req, res) => {
    try {

        const product =
            await Product.findById(
                req.params.id
            );


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found."

            });

        }


        // ------------------------------------------
        // CHECK OWNER
        // ------------------------------------------

        if (
            product.seller.toString() !==
            req.user.id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Only the seller can mark this product as sold."

            });

        }


        product.status = "sold";


        product.soldAt =
            new Date();


        await product.save();


        return res.status(200).json({

            success: true,

            message:
                "Product marked as sold.",

            product

        });

    } catch (error) {

        console.error(
            "Mark Product Sold Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to mark product as sold."

        });

    }
};