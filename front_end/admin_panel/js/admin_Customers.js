// CUSTOMERS
const customerSelectBtn = document.querySelector(".customer-select-btn"),
    customerOptions = document.querySelectorAll(".customer-option"),
    customerSBtnText = document.querySelector(".customer-sBtn-text");

let customerSelectedRowsPerPage = 10;

customerSelectBtn.addEventListener("click", () => document.querySelector(".customer-select-menu").classList.toggle("active"));

customerOptions.forEach(option => {
    option.addEventListener("click", () => {
        let selectedOption = option.querySelector(".customer-option-text").innerText;
        customerSBtnText.innerText = selectedOption;
        customerSelectedRowsPerPage = parseInt(selectedOption);
        document.querySelector(".customer-select-menu").classList.remove("active");
        updateCustomerDisplayedRows(customerCurrentPage);
        updateCustomerPagination(customerCurrentPage);
    });
});

const customerSelectElement = document.getElementById("customer-show-items");
const customerTable = document.getElementById("customer-list-table");
const customerTableInfo = document.getElementById("customer-table-description");

let customerTotalPages = 0;
let customerCurrentPage = 1;

function searchAndPaginateCustomers() {
    searchTableCustomers();
    updateCustomerPagination(customerCurrentPage);
}

function searchTableCustomers() {
    var input, filter, table, tr, td, i, j, txtValue;
    input = document.querySelector('.search-customer input');
    filter = input.value.toUpperCase();
    table = document.getElementById('customer-list-table');
    tr = table.querySelectorAll("tr:not(:first-child)");

    for (i = 0; i < tr.length; i++) {
        let matchFound = false;
        for (j = 0; j < tr[i].getElementsByTagName('td').length; j++) {
            td = tr[i].getElementsByTagName('td')[j];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    matchFound = true;
                    break;
                }
            }
        }
        tr[i].style.display = matchFound ? '' : 'none';
    }
}

function updateCustomerDisplayedRows(page) {
    const rowsPerPage = customerSelectedRowsPerPage;
    const rows = customerTable.querySelectorAll("tr:not(:first-child)");

    const filterInput = document.querySelector('.search-customer input');
    const filter = filterInput.value.toUpperCase();
    const filteredRows = Array.from(rows).filter(row => {
        const rowText = Array.from(row.getElementsByTagName('td')).map(td => td.textContent || td.innerText).join('');
        return rowText.toUpperCase().indexOf(filter) > -1;
    });

    customerTotalPages = Math.ceil(filteredRows.length / rowsPerPage);

    if (page > customerTotalPages) {
        page = customerTotalPages;
    }

    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    rows.forEach((row, index) => {
        if (filteredRows.includes(row) && index >= startIndex && index < endIndex) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });

    const startEntry = startIndex + 1;
    const endEntry = Math.min(endIndex, filteredRows.length);
    const totalEntries = filteredRows.length;

    customerTableInfo.textContent = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries | Page ${page} of ${customerTotalPages}`;
}

updateCustomerDisplayedRows(customerCurrentPage);

function updateCustomerPagination(page) {
    customerCurrentPage = page;

    const rowsPerPage = customerSelectedRowsPerPage;
    const rows = customerTable.querySelectorAll("tr:not(:first-child)");

    const filterInput = document.querySelector('.search-customer input');
    const filter = filterInput.value.toUpperCase();
    const filteredRows = Array.from(rows).filter(row => {
        const rowText = Array.from(row.getElementsByTagName('td')).map(td => td.textContent || td.innerText).join('');
        return rowText.toUpperCase().indexOf(filter) > -1;
    });

    customerTotalPages = Math.ceil(filteredRows.length / rowsPerPage);

    if (customerCurrentPage > customerTotalPages) {
        customerCurrentPage = customerTotalPages;
    }

    const startIndex = (customerCurrentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    filteredRows.forEach((row, index) => {
        if (index >= startIndex && index < endIndex) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });

    const startEntry = startIndex + 1;
    const endEntry = Math.min(endIndex, filteredRows.length);
    const totalEntries = filteredRows.length;

    customerTableInfo.textContent = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries | Page ${customerCurrentPage} of ${customerTotalPages}`;

    createCustomerPagination(customerTotalPages, customerCurrentPage);
}

const customerElement = document.querySelector(".customer-pagination ul");

function createCustomerPagination(totalPages, page) {
    let liTag = '';
    let active;
    let beforePage = page - 1;
    let afterPage = page + 1;

    if (page > 1) {
        liTag += `<li class="btn prev" onclick="updateCustomerPagination(${page - 1})"><span><i class="fas fa-angle-left"></i> Prev</span></li>`;
    }

    if (totalPages <= 4) {
        for (let plength = 1; plength <= totalPages; plength++) {
            active = plength === page ? "active" : "";
            liTag += `<li class="numb ${active}" onclick="updateCustomerPagination(${plength})"><span>${plength}</span></li>`;
        }
    } else {
        if (page > 2) {
            liTag += `<li class="first numb" onclick="updateCustomerPagination(1)"><span>1</span></li>`;
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
            liTag += `<li class="numb ${active}" onclick="updateCustomerPagination(${plength})"><span>${plength}</span></li>`;
        }

        if (page < totalPages - 1) {
            if (page < totalPages - 2) {
                liTag += `<li class="dots"><span>...</span></li>`;
            }
            liTag += `<li class="last numb" onclick="updateCustomerPagination(${totalPages})"><span>${totalPages}</span></li>`;
        }
    }

    if (page < totalPages) {
        liTag += `<li class="btn next" onclick="updateCustomerPagination(${page + 1})"><span>Next <i class="fas fa-angle-right"></i></span></li>`;
    }

    customerElement.innerHTML = liTag;
    return liTag;
}

function initCustomerPagination() {
    updateCustomerPagination(1);
}

initCustomerPagination();

const searchInputCustomer = document.querySelector('.search-customer input');
searchInputCustomer.addEventListener("input", () => {
    searchAndPaginateCustomers();
});