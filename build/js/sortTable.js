export default function makeSortableTable(tableSelector, data) {
    const table = document.querySelector(tableSelector);
    const tbody = table.querySelector("tbody");
    const headers = table.querySelectorAll("thead th");

    let workingData = [...data];
    let currentSort = { key: null, ascending: true };

    // function to get column keys from the <th> elements
    function getColumnKeys() {
        return Array.from(headers).map(th => th.dataset.key || null);
    }

    // function to create table rows
    function render() {
        tbody.innerHTML = "";

        const columnKeys = getColumnKeys();

        workingData.forEach((item, rowIndex) => {
            const row = document.createElement("tr");

            row.className = "border-t dark:border-white/15 border-black/15 cursor-pointer hover:bg-amber-400 active:bg-amber-600";

            columnKeys.forEach((key, colIndex) => {
                const cell = document.createElement("td");

                if (!key) { // index column
                    cell.textContent = rowIndex + 1;
                } else {
                    cell.textContent = item[key] ?? ""; // Nullish Coalescing Operator: ??
                }

                if (currentSort.key === key) {
                    cell.classList.add("font-bold");
                }

                row.appendChild(cell);
            });

            tbody.appendChild(row);
        });
    }

    // sort function
    function sortBy(columnIndex) {
        const columnKeys = getColumnKeys();
        const key = columnKeys[columnIndex];

        if (!key) return; // ignore index column

        if (currentSort.key === key) {
            currentSort.ascending = !currentSort.ascending;
        } else {
            currentSort.key = key;
            currentSort.ascending = true;
        }

        workingData.sort((a, b) => {
            const valA = a[key];
            const valB = b[key];

            const numA = parseFloat(valA);
            const numB = parseFloat(valB);

            if (!isNaN(numA) && !isNaN(numB)) {
                return currentSort.ascending
                    ? numA - numB
                    : numB - numA;
            }

            return currentSort.ascending
                ? String(valA).localeCompare(String(valB))
                : String(valB).localeCompare(String(valA));
        });

        updateIcons(columnIndex);
        render();
    }

    // function to update sorting icons when th is clicked
    function updateIcons(activeIndex) {
        headers.forEach(th => {
            const btn = th.querySelector("button");
            if (btn) btn.textContent = btn.textContent.replace(/▲|▼/g, "");
        });

        const activeHeader = headers[activeIndex];
        const button = activeHeader.querySelector("button");

        if (button) {
            button.textContent += currentSort.ascending ? " ▲" : " ▼";
        }
    }

    // Attach click listeners
    headers.forEach((th, index) => {
        const button = th.querySelector("button");
        if (!button) return;

        button.addEventListener("click", () => sortBy(index));
    });

    render();
}