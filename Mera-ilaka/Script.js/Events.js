// ======================================
// Mera Ilaka - Events JavaScript
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Events Page Loaded");

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
            alert("You have new event notifications.");
        });
    }

    // Search Events
    const searchBtn = document.getElementById("searchBtn");

    if (searchBtn) {

        searchBtn.addEventListener("click", function () {

            const keyword = document
                .getElementById("searchInput")
                .value
                .toLowerCase();

            const events = document.querySelectorAll(".product-card");

            events.forEach(function (eventCard) {

                const text = eventCard.innerText.toLowerCase();

                if (text.includes(keyword)) {
                    eventCard.style.display = "block";
                } else {
                    eventCard.style.display = "none";
                }

            });

        });

    }

    // Register Event
    const registerButtons = document.querySelectorAll(".register-btn");

    registerButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            let count = Number(localStorage.getItem("eventRegistrations")) || 0;

            count++;

            localStorage.setItem("eventRegistrations", count);

            alert("Registration Successful!");

            const total = document.getElementById("eventCount");

            if (total) {
                total.innerHTML = count;
            }

        });

    });

    // View Details
    const viewButtons = document.querySelectorAll(".view-btn");

    viewButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            alert("Opening Event Details...");

        });

    });

    // Reminder
    const reminderButtons = document.querySelectorAll(".reminder-btn");

    reminderButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            alert("Reminder Added Successfully!");

        });

    });

    // Display Total Registrations
    const totalRegistrations = document.getElementById("eventCount");

    if (totalRegistrations) {

        totalRegistrations.innerHTML =
            Number(localStorage.getItem("eventRegistrations")) || 0;

    }

});