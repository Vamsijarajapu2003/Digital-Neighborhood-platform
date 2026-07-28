// =======================================
// Mera Ilaka - Emergency JavaScript
// =======================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Emergency Page Loaded");

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
            alert("No new emergency alerts.");
        });
    }

    // SOS Button
    const sosButton = document.getElementById("sosBtn");

    if (sosButton) {

        sosButton.addEventListener("click", function () {

            alert("🚨 SOS Alert Sent Successfully!");

        });

    }

    // Ambulance Call
    const ambulanceBtn = document.getElementById("ambulanceBtn");

    if (ambulanceBtn) {

        ambulanceBtn.addEventListener("click", function () {

            alert("Calling Ambulance (108)...");

            window.location.href = "tel:108";

        });

    }

    // Police Call
    const policeBtn = document.getElementById("policeBtn");

    if (policeBtn) {

        policeBtn.addEventListener("click", function () {

            alert("Calling Police (100)...");

            window.location.href = "tel:100";

        });

    }

    // Fire Station Call
    const fireBtn = document.getElementById("fireBtn");

    if (fireBtn) {

        fireBtn.addEventListener("click", function () {

            alert("Calling Fire Station (101)...");

            window.location.href = "tel:101";

        });

    }

    // Current Location
    const locationBtn = document.getElementById("locationBtn");

    if (locationBtn) {

        locationBtn.addEventListener("click", function () {

            if (navigator.geolocation) {

                navigator.geolocation.getCurrentPosition(

                    function (position) {

                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;

                        alert(
                            "Current Location\n\nLatitude : " +
                            latitude +
                            "\nLongitude : " +
                            longitude
                        );

                    },

                    function () {

                        alert("Unable to get your location.");

                    }

                );

            } else {

                alert("Geolocation is not supported by this browser.");

            }

        });

    }

});