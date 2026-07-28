// ===============================
// Mera Ilaka - Login JavaScript
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        // Check empty fields
        if (email === "" || password === "") {
            alert("Please enter both Email and Password.");
            return;
        }

        // Demo login credentials
        const demoEmail = "admin@merailaka.com";
        const demoPassword = "admin123";

        if (email === demoEmail && password === demoPassword) {

            alert("Login Successful!");

            // Save login status
            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("userName", "Administrator");

            // Redirect to dashboard
            window.location.href = "pages/dashboard.html";

        } else {

            alert("Invalid Email or Password.");

        }

    });

});