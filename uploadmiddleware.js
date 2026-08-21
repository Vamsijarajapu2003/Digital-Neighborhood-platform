// ==========================================
// MERA ILAKA - FILE UPLOAD MIDDLEWARE
// ==========================================

const multer = require("multer");
const path = require("path");
const fs = require("fs");


// ==========================================
// UPLOAD DIRECTORY
// ==========================================

const uploadDirectory = path.join(
    __dirname,
    "../uploads"
);


// ==========================================
// CREATE UPLOAD FOLDER
// ==========================================

if (!fs.existsSync(uploadDirectory)) {

    fs.mkdirSync(
        uploadDirectory,
        {
            recursive: true
        }
    );

}


// ==========================================
// STORAGE CONFIGURATION
// ==========================================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(
            null,
            uploadDirectory
        );

    },

    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(
            null,
            uniqueName
        );

    }

});


// ==========================================
// FILE TYPE VALIDATION
// ==========================================

const fileFilter = function (
    req,
    file,
    cb
) {

    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif"
    ];


    if (
        allowedTypes.includes(
            file.mimetype
        )
    ) {

        cb(
            null,
            true
        );

    } else {

        cb(
            new Error(
                "Only JPG, JPEG, PNG, WEBP and GIF images are allowed."
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
            5 * 1024 * 1024

    }

});


// ==========================================
// SINGLE IMAGE UPLOAD
// ==========================================

// Use for:
// profile picture
// business logo
// product image
// event image

const uploadSingle =
    upload.single("image");


// ==========================================
// MULTIPLE IMAGE UPLOAD
// ==========================================

// Maximum 5 images

const uploadMultiple =
    upload.array(
        "images",
        5
    );


// ==========================================
// EXPORT
// ==========================================

module.exports = {

    upload,
    uploadSingle,
    uploadMultiple

};