// Function to change Burger Menu Icon
function menuBtnChange() {
    sidebarBtn.classList.toggle("bx-menu");
    sidebarBtn.classList.toggle("bx-menu-alt-right");
}

//sidebar button
let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".bx-menu");
sidebarBtn.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    menuBtnChange();
});

//show sub-Menu
let arrow = document.querySelectorAll(".arrow");
for (var i = 0; i < arrow.length; i++) {
    arrow[i].addEventListener("click", (e) => {
        let arrowParent = e.target.parentElement.parentElement; //selecting main parent of arrow
        arrowParent.classList.toggle("showMenu");
    });
}

// show each section
const menuLinks = document.querySelectorAll(".nav-links a:not([href='#logoutOverlay'])");
const subMenuLinks = document.querySelectorAll(".sub-menu a:not([href='#logoutOverlay'])");
const logoutLink = document.querySelector(".sidebar .nav-links li a[href='#logoutOverlay']");

function showSection(sectionClassName) {
    if (sectionClassName) {
        // Hide all sections
        const sections = document.querySelectorAll("section");
        sections.forEach((section) => {
            section.style.display = "none";
        });

        // Show the corresponding section if it exists
        const targetSection = document.querySelector(`.${sectionClassName}`);
        if (targetSection) {
            targetSection.style.display = "block";
        }
    }
}

menuLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
        event.preventDefault();
        const sectionClassName = this.getAttribute("href").substring(1);
        showSection(sectionClassName);
    });
});

subMenuLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
        event.preventDefault();
        const sectionClassName = this.getAttribute("href").substring(1);
        showSection(sectionClassName);
    });
});



// Function to open the logout confirmation popup
function openLogoutPopup() {
    const overlay = document.getElementById('logoutOverlay');
    overlay.style.display = 'flex';
}

// Function to close the logout confirmation popup
function closeLogoutPopup() {
    const overlay = document.getElementById('logoutOverlay');
    overlay.style.display = 'none';
}

// Function to handle the logout action
function logout() {
    // Perform logout actions here (e.g., redirect, clear session, etc.)
    window.location.href = 'path/to/your/index.html';
    closeLogoutPopup();
}

// Add a click event listener to the "Logout" link
if (logoutLink) {
    logoutLink.addEventListener("click", function (event) {
        event.preventDefault();
        openLogoutPopup();
    });
}