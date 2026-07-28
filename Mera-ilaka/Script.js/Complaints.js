// ======================================
// Mera Ilaka - Complaints JavaScript
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Complaints Page Loaded");

    // Welcome User
    const userName = localStorage.getItem("userName");
    const welcome = document.querySelector(".profile span");

    if (welcome && userName) {
        welcome.innerHTML = "Welcome, " + userName;
    }

    // Notification Bell
    const bell = document.querySelector(".profile i");

    if (bell) {
        bell.addEventListener("click", function () {
            alert("No new complaint notifications.");
        });
    }

    // Search Complaints
    const searchBtn = document.getElementById("searchBtn");

    if (searchBtn) {

        searchBtn.addEventListener("click", function () {

            const keyword = document
                .getElementById("searchInput")
                .value
                .toLowerCase();

            const complaints = document.querySelectorAll(".product-card");

            complaints.forEach(function (complaint) {

                const text = complaint.innerText.toLowerCase();

                if (text.includes(keyword)) {
                    complaint.style.display = "block";
                } else {
                    complaint.style.display = "none";
                }

            });

        });

    }

    // Submit Complaint
    const submitBtn = document.getElementById("submitComplaint");

    if (submitBtn) {

        submitBtn.addEventListener("click", function () {

            const complaintText = document
                .getElementById("complaintText")
                .value
                .trim();

            if (complaintText === "") {

                alert("Please enter your complaint.");

                return;

            }

            let total = Number(localStorage.getItem("complaints")) || 0;

            total++;

            localStorage.setItem("complaints", total);

            alert("Complaint Submitted Successfully!");

            document.getElementById("complaintText").value = "";

            const count = document.getElementById("complaintCount");

            if (count) {
                count.innerHTML = total;
            }

        });

    }

    // View Status
    const statusButtons = document.querySelectorAll(".status-btn");

    statusButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            alert("Complaint Status : Under Review");

        });

    });

    // Delete Complaint
    const deleteButtons = document.querySelectorAll(".delete-btn");

    deleteButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            if (confirm("Are you sure you want to delete this complaint?")) {

                alert("Complaint Deleted.");

            }

        });

    });

    // Complaint Counter
    const complaintCount = document.getElementById("complaintCount");

    if (complaintCount) {

        complaintCount.innerHTML =
            Number(localStorage.getItem("complaints")) || 0;

    }

});