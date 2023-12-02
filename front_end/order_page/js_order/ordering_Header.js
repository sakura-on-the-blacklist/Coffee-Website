// Profile Details
const optionMenu = document.querySelector(".select-menu"),
       selectBtn = optionMenu.querySelector(".select-btn");

selectBtn.addEventListener("click", () => optionMenu.classList.toggle("active"));



// Category Carousel
var menuContainer = document.getElementById("menuContainer");
    
function scrollMenu(direction) {
    var scrollAmount = 200;
    if (direction === 'left') {
        menuContainer.scrollLeft -= scrollAmount;
    } else if (direction === 'right') {
        menuContainer.scrollLeft += scrollAmount;
    }
}