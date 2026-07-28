// ================================
// Mera Ilaka App.js
// ================================

console.log("Mera Ilaka Application Started");

// Welcome Message
window.onload = function () {

    console.log("Welcome to Mera Ilaka");

};

// Navigation Active Menu

const menuItems = document.querySelectorAll(".sidebar ul li");

menuItems.forEach((item) => {

    item.addEventListener("click", function () {

        menuItems.forEach((i) => {
            i.classList.remove("active");
        });

        this.classList.add("active");

    });

});

// Search Button

const searchButton = document.querySelector(".search-box button");

if (searchButton) {

    searchButton.addEventListener("click", function () {

        const text = document.querySelector(".search-box input").value;

        if (text === "") {

            alert("Please enter something to search.");

        } else {

            alert("Searching for: " + text);

        }

    });

}

// Buttons

const buttons = document.querySelectorAll("button");

buttons.forEach((btn) => {

    btn.addEventListener("click", function () {

        console.log(btn.innerText + " button clicked.");

    });

});

// Notification Bell

const bell = document.querySelector(".profile i");

if (bell) {

    bell.addEventListener("click", function () {

        alert("No new notifications.");

    });

}

// Logout

const logout = document.querySelector('a[href="../login.html"]');

if (logout) {

    logout.addEventListener("click", function () {

        alert("Logging out...");

    });

}