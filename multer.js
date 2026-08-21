// ==========================================
// MERA ILAKA - FILE UPLOAD CONFIGURATION
// ==========================================

const multer = require("multer");
const path = require("path");
const fs = require("fs");


// ==========================================
// UPLOAD DIRECTORIES
// ==========================================

const uploadDirectories = {

    profile: path.join(__dirname, "../uploads/profile"),

    products: path.join(__dirname, "../uploads/products"),

    businesses: path.join(__dirname, "../uploads/businesses"),

    events: path.join(__dirname, "../uploads/events")

};


// ==========================================
// CREATE DIRECTORIES IF NOT AVAILABLE
// ==========================================

Object.values(uploadDirectories).forEach((directory) => {

    if (!fs.existsSync(directory)) {

        fs.mkdirSync(directory, {
            recursive: true
        });

    }

});


// ==========================================
// STORAGE CONFIGURATION
// ==========================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        const uploadType = req.body.uploadType || "profile";

        const destination =
            uploadDirectories[uploadType] ||
            uploadDirectories.profile;

        cb(null, destination);

    },


    filename: (req, file, cb) => {

        const extension =
            path.extname(file.originalname);

        const fileName =
            `${file.fieldname}-${Date.now()}${extension}`;

        cb(null, fileName);

    }

});


// ==========================================
// FILE TYPE FILTER
// ==========================================

const fileFilter = (req, file, cb) => {

    const allowedTypes = [

        "image/jpeg",

        "image/jpg",

        "image/png",

        "image/webp"

    ];


    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Only JPG, JPEG, PNG and WEBP images are allowed."
            ),
            false
        );

    }

};


// ==========================================
// MULTER CONFIGURATION
// ==========================================

const upload = multer({

    storage: storage,

    fileFilter: fileFilter,

    limits: {

        fileSize:
            Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024

    }

});


// ==========================================
// EXPORT UPLOAD CONFIGURATION
// ==========================================

module.exports = upload;