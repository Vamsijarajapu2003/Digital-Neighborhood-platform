// ======================================
// Mera Ilaka - Services JavaScript
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Services Page Loaded");

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
            alert("No new service notifications.");
        });
    }

    // Search Services
    const searchBtn = document.getElementById("searchBtn");

    if (searchBtn) {

        searchBtn.addEventListener("click", function () {

            const keyword = document
                .getElementById("searchInput")
                .value
                .toLowerCase();

            const services = document.querySelectorAll(".product-card");

            services.forEach(function (service) {

                const text = service.innerText.toLowerCase();

                if (text.includes(keyword)) {
                    service.style.display = "block";
                } else {
                    service.style.display = "none";
                }

            });

        });

    }

    // Book Service
    const bookButtons = document.querySelectorAll(".book-btn");

    bookButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            alert("Service booked successfully!");

        });

    });

    // Contact Service Provider
    const contactButtons = document.querySelectorAll(".contact-btn");

    contactButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            alert("Contacting Service Provider...");

        });

    });

    // Rate Service
    const rateButtons = document.querySelectorAll(".rate-btn");

    rateButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const rating = prompt("Rate this service (1 to 5):");

            if (rating >= 1 && rating <= 5) {

                alert("Thank you! You rated this service " + rating + " stars.");

            } else {

                alert("Please enter a rating between 1 and 5.");

            }

        });

    });

    // Save Booking Count
    const bookCount = document.getElementById("bookingCount");

    if (bookCount) {

        let totalBookings = Number(localStorage.getItem("bookings")) || 0;

        bookCount.innerHTML = totalBookings;

    }

    // Increase Booking Count
    bookButtons.forEach(function(button){

        button.addEventListener("click", function(){

            let bookings = Number(localStorage.getItem("bookings")) || 0;

            bookings++;

            localStorage.setItem("bookings", bookings);

            const count = document.getElementById("bookingCount");

            if(count){
                count.innerHTML = bookings;
            }

        });

    });

});