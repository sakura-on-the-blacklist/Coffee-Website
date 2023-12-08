// Menu Catalogue
// none for now :3



// Menu Grid
// none for now :3



// Add Product
var canvasCounter = 0;
var canvases = [];
var currentMainCanvasIndex = -1; // To keep track of the current mainCanvas image

function upload() {
    var fileInput = document.getElementById("finput");
    if (fileInput.files.length > 0) {
        var image = new Image();

        image.onload = function () {
            if (canvasCounter < 3) {
                if (canvasCounter === 0) {
                    var mainCanvas = document.getElementById("mainCanvas");
                    mainCanvas.width = this.width;
                    mainCanvas.height = this.height;
                    mainCanvas.getContext("2d").drawImage(this, 0, 0);
                    currentMainCanvasIndex = 0;
                }

                var canvas = document.createElement("canvas");
                canvas.id = "canvas" + (canvasCounter + 1);
                canvas.width = this.width;
                canvas.height = this.height;
                canvas.getContext("2d").drawImage(this, 0, 0);

                var imageGallery = document.querySelector(".imageGallery");
                imageGallery.appendChild(canvas);
                canvases.push(canvas);

                canvas.addEventListener("click", function () {
                    var mainCanvas = document.getElementById("mainCanvas");
                    mainCanvas.width = canvas.width;
                    mainCanvas.height = canvas.height;
                    mainCanvas.getContext("2d").drawImage(canvas, 0, 0);
                    currentMainCanvasIndex = canvases.indexOf(canvas);
                });

                canvasCounter++;

                if (canvasCounter === 3) {
                    fileInput.disabled = true;
                }

                var filenameDiv = document.createElement("div");
                filenameDiv.classList.add("filename"); // Apply the filename class

                var filenameParagraph = document.createElement("p");
                filenameParagraph.textContent = fileInput.files[0].name;
                filenameDiv.appendChild(filenameParagraph);

                var deleteIcon = document.createElement("div");
                deleteIcon.classList.add("delete-icon");
                deleteIcon.textContent = "Delete";
                deleteIcon.onclick = function() {
                    // Handle deletion of the file here
                    if (currentMainCanvasIndex === canvases.indexOf(canvas)) {
                        // If the deleted canvas was displayed in mainCanvas, update it
                        if (canvases.length > 1) {
                            currentMainCanvasIndex = currentMainCanvasIndex === 0 ? 1 : 0;
                            var mainCanvas = document.getElementById("mainCanvas");
                            mainCanvas.width = canvases[currentMainCanvasIndex].width;
                            mainCanvas.height = canvases[currentMainCanvasIndex].height;
                            mainCanvas.getContext("2d").drawImage(canvases[currentMainCanvasIndex], 0, 0);
                        } else {
                            // If there are no more canvases, clear mainCanvas
                            currentMainCanvasIndex = -1;
                            var mainCanvas = document.getElementById("mainCanvas");
                            mainCanvas.width = 0;
                            mainCanvas.height = 0;
                        }
                    }
                    
                    // Remove the canvas and filenameDiv
                    canvases.splice(canvases.indexOf(canvas), 1);
                    canvasCounter--;
                    imageGallery.removeChild(canvas);
                    uploadedImagesContainer.removeChild(filenameDiv);
                    fileInput.value = ""; // Clear the file input
                    fileInput.disabled = false; // Enable the file input
                };
                filenameDiv.appendChild(deleteIcon);

                var uploadedImagesContainer = document.getElementById("uploadedImages");
                uploadedImagesContainer.appendChild(filenameDiv);

                filenameDiv.style.width = fileInput.offsetWidth + "px";
            }
        };

        var file = fileInput.files[0];
        var blob = new Blob([file], { type: file.type });
        image.src = URL.createObjectURL(blob);
    }
}


// Range Slider
var range = document.getElementById("myRange");
var rangeValue = document.getElementById("rangeValue");

// Update the text and position it with respect to the range thumb
range.addEventListener("input", function() {
    var percentage = range.value + "%";
    rangeValue.innerHTML = percentage;

    // Calculate the left position based on the range value
    var thumbWidth = 30; // Width of the thumb
    var containerWidth = range.clientWidth;
    var leftPosition = (range.value / 100) * (containerWidth - thumbWidth);

    // Set the left position of the text element
    rangeValue.style.left = leftPosition + "px";
});







var currency; // Declare currency globally

function saveProduct() {
    // Retrieve values from the form
    var category = document.getElementById("category").value;
    var rawPrice = document.getElementById("price").value;
    var description = document.getElementById("description").value;

    // Retrieve values from status switch and discount slider
    var statusAvailable = document.getElementById("status").checked;
    var discountPercentage = document.getElementById("myRange").value;

    // Format the price to have exactly two decimals
    var price = parseFloat(rawPrice).toFixed(2);

    // Update spans within product information
    document.getElementById("priceSpan").textContent = `₱${price}`;
    document.getElementById("categorySpan").textContent = category;

    // Update the product description
    var productDescriptionP = document.getElementById("productDescription").querySelector("p");
    if (productDescriptionP) {
        productDescriptionP.textContent = description;
    }

    // Update spans based on status and discount values
    document.getElementById("availabilitySpan").textContent = statusAvailable ? "Available" : "Not Available";
    document.getElementById("discount-feeSpan").textContent = `${discountPercentage}%`;
}

function saveAndAdd() {
    // Check if all required forms are filled out
    if (!validateForm()) {
        alert("Please fill out all required fields before saving.");
        return;
    }

    // Call saveProduct function to save the product
    saveProduct();

    var productName = document.getElementById("product-name").value;
    var rawPrice = document.getElementById("price").value;
    var foodID = generateFoodID(); // You need to implement this function
    var description = document.getElementById("description").value;
    var statusAvailable = document.getElementById("status").checked;

    // Format the price to have exactly two decimals
    var price = parseFloat(rawPrice).toFixed(2);

    // Create a new container for the menu item in the menu grid
    var gridContainer = document.querySelector(".product-list-container");
    var newGridContainer = createGridMenuItemContainer(productName, price, foodID, statusAvailable, description,);
    gridContainer.appendChild(newGridContainer);

    // Create a new container for the menu item in the menu catalogue
    var catalogueContainer = document.querySelector(".product-category-container");
    var newCatalogueContainer = createCatalogueMenuItemContainer(productName, price, foodID, statusAvailable, description);
    catalogueContainer.appendChild(newCatalogueContainer);

    // Additional logic if needed, e.g., clearing the form for the next entry
    document.getElementById("productForm").reset();
}

// Function to validate the form fields
function validateForm() {
    var productName = document.getElementById("product-name").value;
    var price = document.getElementById("price").value;
    var description = document.getElementById("description").value;

    // Add more form fields to validate as needed

    // Check if any required field is blank
    if (!productName || !price || !description) {
        return false;
    }

    return true;
}

// Function to create a new menu item container for the menu catalogue
function createCatalogueMenuItemContainer(productName, price, foodID, statusAvailable, description) {
    var newContainer = document.createElement("div");
    newContainer.classList.add("container");

    // Create HTML structure for the menu item in the menu catalogue
    newContainer.innerHTML = `
        <div class="canvas">
            <canvas id="canvas"></canvas>
        </div>
        <div class="food-info">
            <div class="food-name">${productName}</div>
            <div class="food-cost">₱${price}</div>
        </div>
        <div class="product-status">
            <div class="food-orders">Total Order: 0</div>
            <div class="food-revenue">Revenue: 0</div>
        </div>
        <div class="seeMore-container">
            <button class="more-button" id="moreProductDetail">See More</button>
        </div>
    `;

    // Add event listener to the "See More" button within the new container
    const moreButton = newContainer.querySelector(".more-button");
    moreButton.addEventListener("click", function() {
        const sectionClassName = "product-detail";
        showSection(sectionClassName);
    });

    return newContainer;
}

// Function to create a new menu item container for the menu grid
function createGridMenuItemContainer(productName, price, foodID, statusAvailable, description, currencySymbol) {
    var newContainer = document.createElement("div");
    newContainer.classList.add("container");

    // Determine the food status based on availability
    var foodStatus = statusAvailable ? "Available" : "Not Available";

    // Create HTML structure for the menu item in the menu grid
    newContainer.innerHTML = `
        <div class="canvas">
            <canvas id="canvas"></canvas>
        </div>
        <div class="food-info">
            <div class="food-name">${productName}</div>
            <div class="food-cost">₱${price}</div>
        </div>
        <div class="id-status">
            <div class="food-id">ID: ${foodID}</div>
            <div class="food-status">${foodStatus}</div>
        </div>
        <div class="food-description">
            ${description}
        </div>
        <div class="button-container">
            <button class="edit-button">Edit</button>
            <button class="delete-button">Delete</button>
        </div>
    `;

    // Add event listener to the "Edit" button within the new container
    const editButton = newContainer.querySelector(".edit-button");
    editButton.addEventListener("click", function() {
        const sectionClassName = "add-product";
        showSection(sectionClassName);
    });

    return newContainer;
}

// Function to generate a random food ID (you may implement this logic as per your requirements)
function generateFoodID() {
    return Math.floor(Math.random() * 10000) + 1;
}







// Product Detail
var currentDisplayIndex = 0;

function displayCanvas() {
    var displayCanvas = document.getElementById("displayCanvas");
    if (canvases.length > 0) {
        currentDisplayIndex = (currentDisplayIndex + 1) % canvases.length;
        displayCanvas.width = canvases[currentDisplayIndex].width;
        displayCanvas.height = canvases[currentDisplayIndex].height;
        displayCanvas.getContext("2d").drawImage(canvases[currentDisplayIndex], 0, 0);
    }
}

function saveAndDisplayCanvas() {
    saveProduct(); // Call saveProduct function to save the product
    displayCanvas(); // Call displayCanvas to update the canvas
}

// Hooking the "Save" button to saveAndDisplayCanvas
document.getElementById("saveProduct").addEventListener("click", saveAndDisplayCanvas);

// Hooking the "Save and Add" button to saveAndAdd and displayCanvas
document.getElementById("saveAndAdd").addEventListener("click", function() {
    saveAndAdd();
    displayCanvas();
});

// Rest of your existing code...
window.addEventListener("load", displayCanvas);

setInterval(displayCanvas, 3000);
