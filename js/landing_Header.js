const header = document.querySelector("header");
const hamburgerBtn = document.querySelector("#hamburger-btn");
const closeMenuBtn = document.querySelector("#close-menu-btn");

// Toggle mobile menu on hamburger button click
hamburgerBtn.addEventListener("click", () => header.classList.toggle("show-mobile-menu"));

// Close mobile menu on close button click
closeMenuBtn.addEventListener("click", () => hamburgerBtn.click());


// Change header bg color
window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset;

    if(scrollY > 5){
        document.querySelector("header").classList.add("header-active");
    }else{
        document.querySelector("header").classList.remove("header-active");
    }

    // Scroll up button
    const scrollUpBtn = document.querySelector('.scrollUp-btn');

    if(scrollY > 250){
        scrollUpBtn.classList.add("scrollUpBtn-active");
    }else{
        scrollUpBtn.classList.remove("scrollUpBtn-active");
    }
})

// dot animation
document.addEventListener("DOMContentLoaded", function() {
    const menuLinks = document.querySelectorAll('.menu-links a');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Adjust threshold as needed
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    menuLinks.forEach(link => {
        const targetId = link.getAttribute('href').substring(1); // Remove the # from href
        const targetSection = document.getElementById(targetId);

        observer.observe(targetSection);
    });

    function handleIntersection(entries) {
        entries.forEach(entry => {
            const targetId = entry.target.id;
            const correspondingLink = document.querySelector(`.menu-links a[href="#${targetId}"]`);

            if (entry.isIntersecting) {
            // Remove the dot from all links
            menuLinks.forEach(link => {
                link.classList.remove('active-navlink');
            });

            // Add the dot to the corresponding link
            correspondingLink.classList.add('active-navlink');
            }
        });
    }
});