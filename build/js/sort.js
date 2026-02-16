// Select table row
const testBatTable = document.querySelector("#testBattingTable");

testBatTable.addEventListener("click", function (e) {
    const row = e.target.closest("tr");

    if (!row || row.rowIndex === 0) return; // ignore header

    document.querySelectorAll("#testBattingTable tr").forEach(r => r.classList.remove("selected"));
    row.classList.add("selected");
});

// sorting
const tbody = testBatTable.querySelector("tbody");
const sortDirection = {};

testBatTable.querySelectorAll("th button").forEach(button => {
    button.addEventListener("click", function () {
        // find parent th
        const th = this.closest("th");

        // get column index
        const columnIndex = th.cellIndex;

        // Toggle direction
        sortDirection[columnIndex] = !sortDirection[columnIndex];
        const ascending = sortDirection[columnIndex];

        // Get all rows from tbody
        const rows = Array.from(tbody.querySelectorAll("tr"));

        // sorting
        rows.sort((a, b) => {
            let cellA = a.children[columnIndex].textContent.trim();
            let cellB = b.children[columnIndex].textContent.trim();

            const numA = parseFloat(cellA);
            const numB = parseFloat(cellB);

            if (!isNaN(numA) && !isNaN(numB)) {
                return ascending ? numA - numB : numB - numA;
            }

            return ascending? cellA.localeCompare(cellB): cellB.localeCompare(cellA);
        });

        this.textContent = this.textContent.replace(/["▲""▼"]/g, "");
        this.textContent += ascending ? "▲" : "▼";

        // re-writing rows
        rows.forEach(row => tbody.appendChild(row));
    });
});