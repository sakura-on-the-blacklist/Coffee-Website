function showSignIn() {
    document.getElementById('main-container').style.display = 'flex';
    document.getElementById('signin-container').style.display = 'block';
    document.getElementById('signup-container').style.display = 'none';
    toggleScroll();
}

function showSignUp() {
    document.getElementById('main-container').style.display = 'flex';
    document.getElementById('signin-container').style.display = 'none';
    document.getElementById('signup-container').style.display = 'block';
    toggleScroll();
}

function toggleContainers() {
    var signinContainer = document.getElementById("signin-container");
    var signupContainer = document.getElementById("signup-container");

    if (signinContainer.style.display === "none") {
        signinContainer.style.display = "block";
        signupContainer.style.display = "none";
    } else {
        signinContainer.style.display = "none";
        signupContainer.style.display = "block";
    }
}

function hideMainContainer() {
    document.getElementById('main-container').style.display = 'none';
    toggleScroll();
}

function toggleScroll() {
    document.body.classList.toggle('no-scroll');
}

function stopPropagation(event) {
    event.stopPropagation();
}



// Toggle Policy Details
function togglePolicyDetails() {
    var policyDetails = document.getElementById("policy-details");
    policyDetails.style.display = policyDetails.style.display === "none" ? "block" : "none";
}

// Check if the scroll position is at the bottom
function isScrollAtBottom(element) {
    return element.scrollHeight - element.scrollTop <= element.clientHeight + 1;
}

// Enable or disable the accept button based on scroll position
function handleScroll() {
    var scrollableDiv = document.querySelector(".scrollable-div");
    var acceptButton = document.getElementById("accept-button");

    if (isScrollAtBottom(scrollableDiv)) {
        acceptButton.removeAttribute("disabled");
        acceptButton.style.backgroundColor = "#C87E4F"; // Enabled background color
        acceptButton.style.cursor = "pointer"; // Enabled cursor style
        acceptButton.style.transition = "background-color 0.3s ease"; // Transition effect for smooth color change
    } else {
        acceptButton.setAttribute("disabled", "disabled");
        acceptButton.style.backgroundColor = "#868686"; // Disabled background color
        acceptButton.style.cursor = "default"; // Disabled cursor style
        acceptButton.style.transition = "none"; // Remove transition for the disabled state
    }
}

// Add an event listener to the scrollable-div
document.querySelector(".scrollable-div").addEventListener("scroll", handleScroll);

// Update acceptTerms function
function acceptTerms() {
    var acceptButton = document.getElementById("accept-button");

    if (!acceptButton.hasAttribute("disabled")) {
        var checkbox = document.getElementById("accept-checkbox");
        checkbox.checked = true;
        togglePolicyDetails();
    }
}

// Add hover effect for the enabled state
document.getElementById("accept-button").addEventListener("mouseover", function() {
    var acceptButton = document.getElementById("accept-button");
    if (!acceptButton.hasAttribute("disabled")) {
        acceptButton.style.backgroundColor = "#C2703D"; // Hover background color
    }
});

// Remove hover effect when not hovering
document.getElementById("accept-button").addEventListener("mouseout", function() {
    var acceptButton = document.getElementById("accept-button");
    if (!acceptButton.hasAttribute("disabled")) {
        acceptButton.style.backgroundColor = "#C87E4F"; // Restore original background color
    }
});

// Does password match?
function confirmPassword() {
    let password = document.getElementById("userpassword").value; // set password to value of password ID
    let confirm = document.getElementById("confirmpassword").value; // set confirm to value of confirmpassword ID

    if (password.length > 0 && confirm.length > 0) { // check if password and confirmpassword is not empty
        if (password !== confirm) { // if password are not the same
        document.getElementById("confirmation").innerText = "Passwords Do Not Match!"; // set text of confirmation ID
        confirmation.style.color = 'red';
        confirmation.style.fontSize = '12px';
        } else {
        document.getElementById("confirmation").innerText = "";
        }
    }
}

window.onload = function() {
    let password = document.getElementById("userpassword");
    let confirm = document.getElementById("confirmpassword");

    password.addEventListener("keyup", confirmPassword, false); // add keyUp event to password input
    confirm.addEventListener("keyup", confirmPassword, false); // add keyUp event to confirmpassword input
}