// ==========================================
// MERA ILAKA - MAIN EXPRESS APPLICATION
// ==========================================

const express = require("express");
const cors = require("cors");

// Create Express application
const app = express();

const path = require("path");
// ==========================================
// MIDDLEWARE
// ==========================================

// Allow frontend requests
app.use(cors());

// Read JSON data
app.use(express.json());

// Read form data
app.use(express.urlencoded({ extended: true }));
 
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

// ==========================================
// BASIC TEST ROUTE
// ==========================================
const path = require("path");

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
); 

app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Welcome to Mera Ilaka Digital Neighborhood Platform API",
        status: "Backend is running successfully"
    });

});


// ==========================================
// API TEST ROUTE
// ==========================================

app.get("/api/test", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Mera Ilaka API is working successfully"
    });

});


// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// Temporary login API
app.post("/api/auth/login", (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {

        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });

    }

    res.status(200).json({
        success: true,
        message: "Login API is working",
        user: {
            email: email
        }
    });

});


// Temporary registration API
app.post("/api/auth/register", (req, res) => {

    const {
        name,
        email,
        password
    } = req.body;

    if (!name || !email || !password) {

        return res.status(400).json({
            success: false,
            message: "Name, email and password are required"
        });

    }

    res.status(201).json({
        success: true,
        message: "Registration API is working",
        user: {
            name: name,
            email: email
        }
    });

});


// ==========================================
// USER API
// ==========================================

app.get("/api/users", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Users API is working",
        users: []
    });

});


// ==========================================
// ANNOUNCEMENTS API
// ==========================================

app.get("/api/announcements", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Announcements API is working",
        announcements: []
    });

});


// ==========================================
// BUSINESSES API
// ==========================================

app.get("/api/businesses", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Businesses API is working",
        businesses: []
    });

});


// ==========================================
// SERVICES API
// ==========================================

app.get("/api/services", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Services API is working",
        services: []
    });

});


// ==========================================
// EVENTS API
// ==========================================

app.get("/api/events", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Events API is working",
        events: []
    });

});


// ==========================================
// GROUPS API
// ==========================================

app.get("/api/groups", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Groups API is working",
        groups: []
    });

});


// ==========================================
// COMPLAINTS API
// ==========================================

app.get("/api/complaints", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Complaints API is working",
        complaints: []
    });

});


// ==========================================
// MARKETPLACE API
// ==========================================

app.get("/api/marketplace", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Marketplace API is working",
        products: []
    });

});


// ==========================================
// EMERGENCY API
// ==========================================

app.get("/api/emergency", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Emergency API is working",
        emergencyServices: [
            {
                name: "Police",
                number: "112"
            },
            {
                name: "Ambulance",
                number: "108"
            },
            {
                name: "Fire Service",
                number: "101"
            }
        ]
    });

});


// ==========================================
// NOTIFICATIONS API
// ==========================================

app.get("/api/notifications", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Notifications API is working",
        notifications: []
    });

});


// ==========================================
// ADMIN API
// ==========================================

app.get("/api/admin/dashboard", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Admin dashboard API is working",

        statistics: {
            users: 1250,
            businesses: 185,
            services: 96,
            events: 86,
            complaints: 156,
            marketplaceListings: 325
        }

    });

});


// ==========================================
// 404 ERROR HANDLER
// ==========================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "API route not found"
    });

});


// ==========================================
// ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {

    console.error("Server Error:", err);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });

}); 

const authRoutes = require("./routes/authRoutes");

app.use(
    "/api/auth",
    authRoutes
);

const userRoutes = require("./routes/userRoutes");

app.use(
    "/api/users",
    userRoutes
);

const announcementRoutes =
    require("./routes/announcementRoutes");

app.use(
    "/api/announcements",
    announcementRoutes
);

const marketplaceRoutes =
    require("./routes/marketplaceRoutes");

app.use(
    "/api/marketplace",
    marketplaceRoutes
);

const businessRoutes =
    require("./routes/businessRoutes");

app.use(
    "/api/businesses",
    businessRoutes
);

const serviceRoutes =
    require("./routes/serviceRoutes");

app.use(
    "/api/services",
    serviceRoutes
);

const eventRoutes =
    require("./routes/eventRoutes");

app.use(
    "/api/events",
    eventRoutes
);

const groupRoutes =
    require("./routes/groupRoutes");

app.use(
    "/api/groups",
    groupRoutes
);

const complaintRoutes =
    require("./routes/complaintRoutes");

app.use(
    "/api/complaints",
    complaintRoutes
);

const emergencyRoutes =
    require("./routes/emergencyRoutes");

app.use(
    "/api/emergencies",
    emergencyRoutes
);

const adminRoutes =
    require("./routes/adminRoutes");

app.use(
    "/api/admin",
    adminRoutes
);


// ==========================================
// EXPORT APP
// ==========================================

module.exports = app;