// =======================================
// Mera Ilaka - Profile JavaScript
// =======================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Profile Page Loaded");

    // Load User Details
    const user = JSON.parse(localStorage.getItem("meraIlakaUser"));

    if (user) {

        if (document.getElementById("fullname"))
            document.getElementById("fullname").value = user.fullname || "";

        if (document.getElementById("email"))
            document.getElementById("email").value = user.email || "";

        if (document.getElementById("mobile"))
            document.getElementById("mobile").value = user.mobile || "";

    }

    // Save Profile
    const saveBtn = document.getElementById("saveBtn");

    if (saveBtn) {

        saveBtn.addEventListener("click", function () {

            const fullname = document.getElementById("fullname").value;
            const email = document.getElementById("email").value;
            const mobile = document.getElementById("mobile").value;

            const updatedUser = {
                fullname: fullname,
                email: email,
                mobile: mobile,
                password: user ? user.password : ""
            };

            localStorage.setItem(
                "meraIlakaUser",
                JSON.stringify(updatedUser)
            );

            localStorage.setItem("userName", fullname);

            alert("Profile Updated Successfully!");

        });

    }

    // Change Password
    const passwordBtn = document.getElementById("changePasswordBtn");

    if (passwordBtn) {

        passwordBtn.addEventListener("click", function () {

            const newPassword =
                document.getElementById("newPassword").value;

            if (newPassword.length < 6) {

                alert("Password must be at least 6 characters.");

                return;

            }

            if (user) {

                user.password = newPassword;

                localStorage.setItem(
                    "meraIlakaUser",
                    JSON.stringify(user)
                );

                alert("Password Changed Successfully!");

                document.getElementById("newPassword").value = "";

            }

        });

    }

    // Profile Photo Preview
    const profilePhoto =
        document.getElementById("profilePhoto");

    if (profilePhoto) {

        profilePhoto.addEventListener("change", function () {

            const reader = new FileReader();

            reader.onload = function (e) {

                document.getElementById("photoPreview").src =
                    e.target.result;

            };

            reader.readAsDataURL(profilePhoto.files[0]);

        });

    }

    // Logout
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", function () {

            localStorage.removeItem("loggedIn");
            localStorage.removeItem("userName");

            alert("Logged Out Successfully!");

            window.location.href = "../login.html";

        });

    }

});