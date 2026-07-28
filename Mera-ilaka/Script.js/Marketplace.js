// =======================================
// Mera Ilaka - Marketplace JavaScript
// =======================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Marketplace Page Loaded");

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

            alert("No new notifications.");

        });

    }

    // Search Products
    const searchBtn = document.getElementById("searchBtn");

    if (searchBtn) {

        searchBtn.addEventListener("click", function () {

            const keyword = document
                .getElementById("searchInput")
                .value
                .toLowerCase();

            const products = document.querySelectorAll(".product-card");

            products.forEach(function(product){

                const text = product.innerText.toLowerCase();

                if(text.includes(keyword)){
                    product.style.display = "block";
                }else{
                    product.style.display = "none";
                }

            });

        });

    }

    // Buy Now Button
    const buyButtons = document.querySelectorAll(".buy-btn");

    buyButtons.forEach(function(button){

        button.addEventListener("click", function(){

            alert("Thank you! Your order has been placed.");

        });

    });

    // Add to Cart
    const cartButtons = document.querySelectorAll(".cart-btn");

    cartButtons.forEach(function(button){

        button.addEventListener("click", function(){

            let cart = Number(localStorage.getItem("cart")) || 0;

            cart++;

            localStorage.setItem("cart", cart);

            alert("Product added to cart.\nTotal Items: " + cart);

        });

    });

    // Show Cart Count
    const cartCount = document.getElementById("cartCount");

    if(cartCount){

        const total = Number(localStorage.getItem("cart")) || 0;

        cartCount.innerHTML = total;

    }

});