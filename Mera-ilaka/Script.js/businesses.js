// ======================================
// Mera Ilaka - Businesses JavaScript
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Businesses Page Loaded");

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
            alert("No new business notifications.");
        });
    }

    // Search Businesses
    const searchBtn = document.getElementById("searchBtn");

    if (searchBtn) {

        searchBtn.addEventListener("click", function () {

            const keyword = document
                .getElementById("searchInput")
                .value
                .toLowerCase();

            const businesses = document.querySelectorAll(".product-card");

            businesses.forEach(function (business) {

                const text = business.innerText.toLowerCase();

                if (text.includes(keyword)) {
                    business.style.display = "block";
                } else {
                    business.style.display = "none";
                }

            });

        });

    }

    // View Details Button
    const viewButtons = document.querySelectorAll(".view-btn");

    viewButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            alert("Opening Business Details...");

        });

    });

    // Contact Button
    const contactButtons = document.querySelectorAll(".contact-btn");

    contactButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            alert("Business Contact Information");

        });

    });

    // Favorite Business
    const favButtons = document.querySelectorAll(".favorite-btn");

    favButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            let favorites = Number(localStorage.getItem("favorites")) || 0;

            favorites++;

            localStorage.setItem("favorites", favorites);

            alert("Business added to Favorites!\nTotal Favorites: " + favorites);

        });

    });

});