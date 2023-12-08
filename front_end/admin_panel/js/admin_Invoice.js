// Invoice List


// Invoice Detail
// Function to calculate the total for each row
function calculateTotal() {
    const rows = document.querySelectorAll(".invoice-detail-table table tr:not(:first-child):not(:last-child)");

    let grandTotal = 0;

    rows.forEach((row) => {
        const quantity = parseInt(row.querySelector("td:nth-child(3)").textContent);
        const unitCost = parseFloat(row.querySelector("td:nth-child(4)").textContent.replace("P", ""));
        const total = quantity * unitCost;

        // Display the total cost in the row
        row.querySelector("td:nth-child(5)").textContent = "P" + total.toFixed(2);
        grandTotal += total;
    });

    // Display the grand total in the Total Cost row
    const grandTotalRow = document.querySelector(".invoice-detail-table table tr:last-child");
    grandTotalRow.querySelector("td:last-child").textContent = "P" + grandTotal.toFixed(2);
}

// Calculate the totals when the page loads
window.addEventListener("load", calculateTotal);