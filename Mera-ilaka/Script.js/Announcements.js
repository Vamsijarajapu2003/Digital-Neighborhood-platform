// =======================================
// Mera Ilaka - Announcements JavaScript
// =======================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Announcements Page Loaded");

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
            alert("You have 3 new announcements.");
        });
    }

    // Search Function
    const searchBtn = document.getElementById("searchBtn");

    if (searchBtn) {

        searchBtn.addEventListener("click", function () {

            const keyword = document
                .getElementById("searchInput")
                .value
                .toLowerCase();

            const cards = document.querySelectorAll(".product-card");

            cards.forEach(function(card) {

                const text = card.innerText.toLowerCase();

                if (text.includes(keyword)) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }

            });

        });

    }

    // Read More Buttons
    const buttons = document.querySelectorAll(".read-more");

    buttons.forEach(function(button){

        button.addEventListener("click", function(){

            alert("Opening Announcement Details...");

        });

    });

});