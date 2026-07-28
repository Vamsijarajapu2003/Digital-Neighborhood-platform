// ======================================
// Mera Ilaka - Register JavaScript
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    const registerForm = document.getElementById("registerForm");

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const fullname = document.getElementById("fullname").value.trim();
        const email = document.getElementById("email").value.trim();
        const mobile = document.getElementById("mobile").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // Check empty fields
        if (
            fullname === "" ||
            email === "" ||
            mobile === "" ||
            password === "" ||
            confirmPassword === ""
        ) {
            alert("Please fill all fields.");
            return;
        }

        // Email validation
        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

        if (!email.match(emailPattern)) {
            alert("Please enter a valid email address.");
            return;
        }

        // Mobile validation
        if (mobile.length !== 10 || isNaN(mobile)) {
            alert("Please enter a valid 10-digit mobile number.");
            return;
        }

        // Password length
        if (password.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        // Password match
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        // Save user details in Local Storage
        const user = {
            fullname: fullname,
            email: email,
            mobile: mobile,
            password: password
        };

        localStorage.setItem("meraIlakaUser", JSON.stringify(user));

        alert("Registration Successful!");

        // Redirect to login page
        window.location.href = "login.html";

    });

});