// Function to start circle progress animations
function startCircleProgressAnimations(skills) {
    if (Array.isArray(skills)) {
        const order_options = {
            startAngle: -1.55,
            size: 150,
            fill: { gradient: ["#5146C2", "#A1B1FF"] }, // circular progress bar
        };

        skills.forEach((skill) => {
            $(skill.selector).circleProgress(order_options).on("circle-animation-progress", function (event, progress, stepValue) {
                const intValue = stepValue === 1 ? 100 : Math.round(stepValue * 100);
                $(this).parent().find("span").text(intValue + "%");
            });

            $(skill.selector).circleProgress({
                value: skill.value,
            });
        });
    }
}

// Get all product names from the table
const productNames = Array.from(document.querySelectorAll('.orders-table td:nth-child(2)')).map(td => td.textContent);

// Remove product names starting with "Set A:" to "Set H:"
const filteredProductNames = productNames.filter(productName => !productName.match(/^Set [A-H]:/));

// Count the occurrences of each product name
const productCounts = filteredProductNames.reduce((acc, productName) => {
    acc[productName] = (acc[productName] || 0) + 1;
    return acc;
}, {});

// Get total number of orders
const totalOrders = filteredProductNames.length;

// Create an array with product names and their order percentages
const productOrderPercentages = Object.entries(productCounts).map(([productName, count]) => ({
    productName,
    percentage: (count / totalOrders) * 100,
}));

// Sort product order percentages in descending order
const sortedProductPercentages = productOrderPercentages.sort((a, b) => b.percentage - a.percentage).slice(0, 4);

// Update the HTML with the top 4 most ordered product names
const skills = sortedProductPercentages.map((entry, index) => {
    const { productName, percentage } = entry;
    const selector = `.avgFood-${index + 1} .bar`;
    document.querySelector(`.avgFood-${index + 1} .text`).textContent = `${productName}`;
    return { selector, value: percentage / 100 };
});

// Intersection Observer options
const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5, // Adjust the threshold as needed
};

// Callback function for Intersection Observer
function handleIntersection(entries, observer) {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // Start circle progress animations when the .orders section is visible
            startCircleProgressAnimations(skills); // Pass `skills` here
            // Unobserve the target to avoid unnecessary callbacks
            observer.unobserve(entry.target);
        }
    });
}

// Create Intersection Observer
const ordersSection = document.querySelector(".orders");
const observer = new IntersectionObserver(handleIntersection, observerOptions);

// Observe the .orders section
observer.observe(ordersSection); 