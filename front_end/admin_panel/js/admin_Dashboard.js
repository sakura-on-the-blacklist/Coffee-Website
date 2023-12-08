// Products Sold



// Total Visitors
// Function to format numbers with commas
function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to increment and display the visit count
function incrementVisitCount() {
    // Check if 'visitCount' is stored in local storage
    if (localStorage.getItem('visitCount')) {
        // If it exists, increment it by 1
        let count = parseInt(localStorage.getItem('visitCount'));
        count++;
        localStorage.setItem('visitCount', count);
        document.getElementById('visitCount').textContent = formatNumberWithCommas(count);
    } else {
        // If it doesn't exist, initialize it to 1
        localStorage.setItem('visitCount', 1);
        document.getElementById('visitCount').textContent = formatNumberWithCommas(1);
    }
}

// Call the function to increment and display the visit count
incrementVisitCount();



// New Users



// Total Orders



// Recent Orders Requested
// Handle the "View More" button click
const viewOrdersButton = document.getElementById("viewOrders");

viewOrdersButton.addEventListener("click", function() {
    const sectionClassName = "orders"; // Assuming the section class name for "Orders" is "orders"
    showSection(sectionClassName);
});


// Monthly Revenue
let labels = ['Jan', 'Feb', 'Ma', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
let itemData = [8771, 10744, 10389, 11958, 13757, 14185, 19501, 5195, 32410, 32952, 18692];

const data = {
    labels:labels,
    datasets: [{
        data: itemData,
        borderColor: 'rgb(66, 135, 245)',
        fill: true,
        backgroundColor: 'rgb(131, 174, 242)',
        tension: 0.1
    }]
}

const config = {
    type: 'line',
    data: data,
    options: {
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false,
            }
        }
    }
};

const chart = new Chart(
    document.getElementById('myChart'),
    config
);



// Trending Orders
// Function to start circle progress animations for trending orders
function startTrendingCircleProgressAnimations(skills) {
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
const trendingProductNames = Array.from(document.querySelectorAll('.orders-table td:nth-child(2)')).map(td => td.textContent);

// Remove product names starting with "Set A:" to "Set H:"
const filteredTrendingProductNames = trendingProductNames.filter(productName => !productName.match(/^Set [A-H]:/));

// Count the occurrences of each product name
const trendingProductCounts = filteredTrendingProductNames.reduce((acc, productName) => {
    acc[productName] = (acc[productName] || 0) + 1;
    return acc;
}, {});

// Get total number of orders
const totalTrendingOrders = filteredTrendingProductNames.length;

// Create an array with product names and their order percentages
const trendingProductOrderPercentages = Object.entries(trendingProductCounts).map(([productName, count]) => ({
    productName,
    percentage: (count / totalTrendingOrders) * 100,
}));

// Sort product order percentages in descending order
const sortedTrendingProductPercentages = trendingProductOrderPercentages.sort((a, b) => b.percentage - a.percentage).slice(0, 4);

// Update the HTML with the top 4 most ordered product names for trending orders
const trendingSkills = sortedTrendingProductPercentages.map((entry, index) => {
    const { productName, percentage } = entry;
    const selector = `.trendingFood-${index + 1} .bar`;
    document.querySelector(`.trendingFood-${index + 1} .text`).textContent = `${productName}`;
    return { selector, value: percentage / 100 };
});

// Intersection Observer options for trending orders
const trendingObserverOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5, // Adjust the threshold as needed
};

// Callback function for Intersection Observer for trending orders
function handleTrendingIntersection(entries, observer) {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // Start circle progress animations when the .trending-orders section is visible
            startTrendingCircleProgressAnimations(trendingSkills); // Pass `trendingSkills` here
            // Unobserve the target to avoid unnecessary callbacks
            observer.unobserve(entry.target);
        }
    });
}

// Create Intersection Observer for trending orders
const trendingOrdersSection = document.querySelector(".trending-orders");
const trendingObserver = new IntersectionObserver(handleTrendingIntersection, trendingObserverOptions);

// Observe the .trending-orders section
trendingObserver.observe(trendingOrdersSection);



// Function to copy rows from "Orders Table" to "Recent Orders Table"
function copyRows() {
    var ordersTable = document.getElementById('ordersTable');
    var recentOrdersTable = document.getElementById('recentOrdersTable');

    // Get all rows from "Orders Table" except the header row
    var rowsToCopy = Array.from(ordersTable.querySelectorAll('tr')).slice(1);

    // Copy each row to "Recent Orders Table"
    rowsToCopy.forEach(function(row) {
    var newRow = recentOrdersTable.insertRow(-1);
    Array.from(row.cells).forEach(function(cell) {
        var newCell = newRow.insertCell(-1);
        newCell.textContent = cell.textContent;
    });
    });
}

// Call the function to copy rows
copyRows();