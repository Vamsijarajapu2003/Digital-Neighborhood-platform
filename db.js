// ==========================================
// MERA ILAKA - MONGODB DATABASE CONNECTION
// ==========================================

const mongoose = require("mongoose");


// ==========================================
// CONNECT TO MONGODB
// ==========================================

const connectDB = async () => {

    try {

        const mongoURI = process.env.MONGO_URI;

        // Check MongoDB URL
        if (!mongoURI) {

            console.error("❌ MONGO_URI is not defined in .env file");

            process.exit(1);

        }


        // Connect to MongoDB
        const connection = await mongoose.connect(mongoURI);


        console.log("======================================");
        console.log("       MERA ILAKA DATABASE");
        console.log("======================================");

        console.log(
            `MongoDB Connected: ${connection.connection.host}`
        );

        console.log(
            `Database Name: ${connection.connection.name}`
        );

        console.log("Database connection successful!");


    } catch (error) {

        console.error("❌ MongoDB Connection Failed!");

        console.error("Error:", error.message);

        process.exit(1);

    }

};


// ==========================================
// EXPORT FUNCTION
// ==========================================

module.exports = connectDB;