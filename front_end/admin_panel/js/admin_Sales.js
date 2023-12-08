// SALES
const optionMenu = document.querySelector(".select-menu"),
    selectBtn = optionMenu.querySelector(".select-btn"),
    options = optionMenu.querySelectorAll(".option"),
    sBtn_text = optionMenu.querySelector(".sBtn-text");

let selectedRowsPerPage = 10;

selectBtn.addEventListener("click", () => optionMenu.classList.toggle("active"));       

options.forEach(option =>{
    option.addEventListener("click", ()=>{
        let selectedOption = option.querySelector(".option-text").innerText;
        sBtn_text.innerText = selectedOption;
        selectedRowsPerPage = parseInt(selectedOption);
        optionMenu.classList.remove("active");
        updateSalesDisplayedRows(salesCurrentPage);
        updateSalesPagination(salesCurrentPage);
    });
});

// Show 10 rows, 25 rows, 50 rows, 100 rows
// Get references to the select element and the table
const salesSelectElement = document.getElementById("sales-show-items");
const salesTable = document.getElementById("sales-table");
const salesTableInfo = document.getElementById("sales-table-description");

// Pagination variables for sales
let salesTotalPages = 0; // Initialize total pages to 0
let salesCurrentPage = 1; // Add this line to keep track of the current page

// Add this function to handle both search and pagination together
function searchAndPaginate() {
    searchTable();
    updateSalesPagination(salesCurrentPage);
}

function searchTable() {
    // Declare variables
    var input, filter, table, tr, td, i, j, txtValue;
    input = document.querySelector('.search input');
    filter = input.value.toUpperCase();
    table = document.getElementById('sales-table');
    tr = table.querySelectorAll("tr:not(:first-child)");

    // Loop through all table rows
    for (i = 0; i < tr.length; i++) {
        let matchFound = false;
        // Loop through all columns in each row
        for (j = 0; j < tr[i].getElementsByTagName('td').length; j++) {
            td = tr[i].getElementsByTagName('td')[j];
            if (td) {
                txtValue = td.textContent || td.innerText;
                // If the column's text matches the search query, display the row, else hide it
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    matchFound = true;
                    break;
                }
            }
        }
        // Show or hide the row based on match status
        tr[i].style.display = matchFound ? '' : 'none';
    }
}

// Define a function to update the displayed rows and the info text for sales
function updateSalesDisplayedRows(page) {
    // Get the selected option value (number of rows to show)
    const rowsPerPage = selectedRowsPerPage;
    const rows = salesTable.querySelectorAll("tr:not(:first-child)");

    // Filter rows based on the search query
    const filterInput = document.querySelector('.search input');
    const filter = filterInput.value.toUpperCase();
    const filteredRows = Array.from(rows).filter(row => {
        const rowText = Array.from(row.getElementsByTagName('td')).map(td => td.textContent || td.innerText).join('');
        return rowText.toUpperCase().indexOf(filter) > -1;
    });

    // Calculate the total number of pages dynamically for sales
    salesTotalPages = Math.ceil(filteredRows.length / rowsPerPage);

    // Adjust current page if it exceeds the new total pages
    if (page > salesTotalPages) {
        page = salesTotalPages;
    }

    // Calculate the range of rows to display based on the current page
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Show or hide rows based on the current page
    rows.forEach((row, index) => {
        if (filteredRows.includes(row) && index >= startIndex && index < endIndex) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });

    // Update the table information for sales
    const startEntry = startIndex + 1;
    const endEntry = Math.min(endIndex, filteredRows.length);
    const totalEntries = filteredRows.length;

    salesTableInfo.textContent = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries | Page ${page} of ${salesTotalPages}`;
}

updateSalesDisplayedRows(salesCurrentPage);


// Add a function to update the current page and re-render pagination for sales
function updateSalesPagination(page) {
    salesCurrentPage = page;

    // Get the selected option value (number of rows to show)
    const rowsPerPage = selectedRowsPerPage;
    const rows = salesTable.querySelectorAll("tr:not(:first-child)");

    // Filter rows based on the search query
    const filterInput = document.querySelector('.search input');
    const filter = filterInput.value.toUpperCase();
    const filteredRows = Array.from(rows).filter(row => {
        const rowText = Array.from(row.getElementsByTagName('td')).map(td => td.textContent || td.innerText).join('');
        return rowText.toUpperCase().indexOf(filter) > -1;
    });

    // Calculate the total number of pages dynamically for sales
    salesTotalPages = Math.ceil(filteredRows.length / rowsPerPage);

    // Adjust current page if it exceeds the new total pages
    if (salesCurrentPage > salesTotalPages) {
        salesCurrentPage = salesTotalPages;
    }

    // Calculate the range of rows to display based on the current page
    const startIndex = (salesCurrentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Show or hide rows based on the current page
    filteredRows.forEach((row, index) => {
        if (index >= startIndex && index < endIndex) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });

    // Update the table information for sales
    const startEntry = startIndex + 1;
    const endEntry = Math.min(endIndex, filteredRows.length);
    const totalEntries = filteredRows.length;

    salesTableInfo.textContent = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries | Page ${salesCurrentPage} of ${salesTotalPages}`;

    // Re-render pagination
    createSalesPagination(salesTotalPages, salesCurrentPage);
}

// Pagination Code for sales
const salesElement = document.querySelector(".sales-pagination ul");

function createSalesPagination(totalPages, page) {
    let liTag = '';
    let active;
    let beforePage = page - 1;
    let afterPage = page + 1;

    if (page > 1) {
        liTag += `<li class="btn prev" onclick="updateSalesPagination(${page - 1})"><span><i class="fas fa-angle-left"></i> Prev</span></li>`;
    }

    if (totalPages <= 4) {
        for (let plength = 1; plength <= totalPages; plength++) {
            active = plength === page ? "active" : "";
            liTag += `<li class="numb ${active}" onclick="updateSalesPagination(${plength})"><span>${plength}</span></li>`;
        }
    } else {
        if (page > 2) {
            liTag += `<li class="first numb" onclick="updateSalesPagination(1)"><span>1</span></li>`;
            if (page > 3) {
                liTag += `<li class="dots"><span>...</span></li>`;
            }
        }

        for (let plength = beforePage; plength <= afterPage; plength++) {
            if (plength > totalPages) {
                continue;
            }
            if (plength <= 0) {
                continue;
            }
            active = plength === page ? "active" : "";
            liTag += `<li class="numb ${active}" onclick="updateSalesPagination(${plength})"><span>${plength}</span></li>`;
        }

        if (page < totalPages - 1) {
            if (page < totalPages - 2) {
                liTag += `<li class="dots"><span>...</span></li>`;
            }
            liTag += `<li class="last numb" onclick="updateSalesPagination(${totalPages})"><span>${totalPages}</span></li>`;
        }
    }

    if (page < totalPages) {
        liTag += `<li class="btn next" onclick="updateSalesPagination(${page + 1})"><span>Next <i class="fas fa-angle-right"></i></span></li>`;
    }

    salesElement.innerHTML = liTag;
    return liTag;
}

// Initialize pagination for sales
function initSalesPagination() {
    updateSalesPagination(1); // Initialize with the first page
}

initSalesPagination();

const searchInput = document.querySelector('.search input');
searchInput.addEventListener("input", () => {
    searchAndPaginate();
});

// Check the value in column 3 (Quantity) and update column 4 (Status) accordingly for sales
const salesRows = salesTable.querySelectorAll("tr:not(:first-child)");

salesRows.forEach(row => {
    const quantity = parseInt(row.cells[2].textContent);

    // Check if Quantity is 0 and update Status accordingly for sales
    if (quantity === 0) {
        row.cells[3].textContent = "Out of Stock";
    } else {
        row.cells[3].textContent = "In Stock";
    }
});