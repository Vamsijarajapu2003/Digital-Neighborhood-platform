// ======================================
// Mera Ilaka - Groups JavaScript
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Groups Page Loaded");

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
            alert("No new group notifications.");
        });
    }

    // Search Groups
    const searchBtn = document.getElementById("searchBtn");

    if (searchBtn) {

        searchBtn.addEventListener("click", function () {

            const keyword = document
                .getElementById("searchInput")
                .value
                .toLowerCase();

            const groups = document.querySelectorAll(".product-card");

            groups.forEach(function (group) {

                const text = group.innerText.toLowerCase();

                if (text.includes(keyword)) {
                    group.style.display = "block";
                } else {
                    group.style.display = "none";
                }

            });

        });

    }

    // Join Group
    const joinButtons = document.querySelectorAll(".join-btn");

    joinButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            let joined = Number(localStorage.getItem("joinedGroups")) || 0;

            joined++;

            localStorage.setItem("joinedGroups", joined);

            alert("You have joined the group!");

            const count = document.getElementById("groupCount");

            if (count) {
                count.innerHTML = joined;
            }

        });

    });

    // Leave Group
    const leaveButtons = document.querySelectorAll(".leave-btn");

    leaveButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            let joined = Number(localStorage.getItem("joinedGroups")) || 0;

            if (joined > 0) {
                joined--;
            }

            localStorage.setItem("joinedGroups", joined);

            alert("You have left the group.");

            const count = document.getElementById("groupCount");

            if (count) {
                count.innerHTML = joined;
            }

        });

    });

    // View Group Details
    const viewButtons = document.querySelectorAll(".view-btn");

    viewButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            alert("Opening Group Details...");

        });

    });

    // Display Joined Groups Count
    const totalGroups = document.getElementById("groupCount");

    if (totalGroups) {

        totalGroups.innerHTML =
            Number(localStorage.getItem("joinedGroups")) || 0;

    }

});