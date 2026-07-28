// ======================================
// Mera Ilaka Dashboard JavaScript
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Dashboard Loaded Successfully!");

    // Welcome User
    const userName = localStorage.getItem("userName");

    const welcomeText = document.querySelector(".profile span");

    if (welcomeText && userName) {
        welcomeText.innerHTML = "Welcome, " + userName;
    }

    // Notification Bell

    const bell = document.querySelector(".profile i");

    if (bell) {

        bell.addEventListener("click", function () {

            alert("You have 3 new notifications.");

        });

    }

    // Search Box

    const searchButton = document.querySelector(".search-box button");

    if (searchButton) {

        searchButton.addEventListener("click", function () {

            const keyword = document.querySelector(".search-box input").value;

            if (keyword.trim() === "") {

                alert("Please enter something to search.");

            } else {

                alert("Searching for : " + keyword);

            }

        });

    }

    // Dashboard Cards

    const cards = document.querySelectorAll(".card");

    cards.forEach(function(card){

        card.addEventListener("click", function(){

            const title = card.querySelector("h3").innerText;

            alert(title + " selected.");

        });

    });

    // Buttons

    const buttons = document.querySelectorAll("button");

    buttons.forEach(function(button){

        button.addEventListener("click", function(){

            console.log(button.innerText + " Button Clicked");

        });

    });

    // Table Rows

    const rows = document.querySelectorAll("table tbody tr");

    rows.forEach(function(row){

        row.addEventListener("click", function(){

            row.style.backgroundColor = "#dbeafe";

        });

    });

    // Sidebar Active Menu

    const menu = document.querySelectorAll(".sidebar ul li");

    menu.forEach(function(item){

        item.addEventListener("click", function(){

            menu.forEach(function(li){

                li.classList.remove("active");

            });

            item.classList.add("active");

        });

    });

});