// ==========================================
// Mera Ilaka - Backend Server
// ==========================================

const app = require("./MERA-ILAKA");

const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
    console.log("======================================");
    console.log("      MERA ILAKA BACKEND SERVER");
    console.log("======================================");
    console.log(`Server running on: http://localhost:${PORT}`);
    console.log("Server started successfully!");
});
// ==========================================
// MERA ILAKA - BACKEND SERVER
// ==========================================

require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");


// ==========================================
// CONNECT DATABASE
// ==========================================

connectDB();


// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log("======================================");
    console.log("      MERA ILAKA BACKEND SERVER");
    console.log("======================================");

    console.log(`Server running on: http://localhost:${PORT}`);

});