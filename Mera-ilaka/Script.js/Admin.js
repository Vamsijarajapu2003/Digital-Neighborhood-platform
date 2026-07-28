// =======================================
// Mera Ilaka - Admin JavaScript
// =======================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Admin Dashboard Loaded");

    // Welcome Admin
    const userName = localStorage.getItem("userName") || "Administrator";

    const welcome = document.getElementById("adminName");

    if (welcome) {
        welcome.innerHTML = userName;
    }

    // Dashboard Statistics
    const users = Number(localStorage.getItem("users")) || 1;
    const complaints = Number(localStorage.getItem("complaints")) || 0;
    const events = Number(localStorage.getItem("eventRegistrations")) || 0;
    const groups = Number(localStorage.getItem("joinedGroups")) || 0;

    if (document.getElementById("totalUsers"))
        document.getElementById("totalUsers").innerHTML = users;

    if (document.getElementById("totalComplaints"))
        document.getElementById("totalComplaints").innerHTML = complaints;

    if (document.getElementById("totalEvents"))
        document.getElementById("totalEvents").innerHTML = events;

    if (document.getElementById("totalGroups"))
        document.getElementById("totalGroups").innerHTML = groups;

    // Search User
    const searchBtn = document.getElementById("searchBtn");

    if (searchBtn) {

        searchBtn.addEventListener("click", function () {

            const keyword = document
                .getElementById("searchInput")
                .value
                .toLowerCase();

            const rows = document.querySelectorAll("tbody tr");

            rows.forEach(function (row) {

                const text = row.innerText.toLowerCase();

                if (text.includes(keyword)) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }

            });

        });

    }

    // Delete User
    const deleteButtons = document.querySelectorAll(".delete-btn");

    deleteButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            if (confirm("Delete this user?")) {

                button.closest("tr").remove();

                alert("User Deleted Successfully.");

            }

        });

    });

    // Add Announcement
    const addAnnouncement = document.getElementById("addAnnouncement");

    if (addAnnouncement) {

        addAnnouncement.addEventListener("click", function () {

            const announcement = document
                .getElementById("announcementText")
                .value
                .trim();

            if (announcement === "") {

                alert("Please enter an announcement.");

                return;

            }

            alert("Announcement Added Successfully!");

            document.getElementById("announcementText").value = "";

        });

    }

    // Logout
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", function () {

            localStorage.removeItem("loggedIn");

            alert("Admin Logged Out Successfully!");

            window.location.href = "../login.html";

        });

    }

});