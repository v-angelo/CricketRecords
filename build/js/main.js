import { testBatPlayers } from "./data.js";

function makeSortableTable(tableSelector, data) {
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

// select table row
const batTable = document.querySelector("#testBattingTable");

batTable.addEventListener("click", function (e) {
    const row = e.target.closest("tr");

    if (!row || row.rowIndex === 0) return; // ignore header

    document.querySelectorAll("#testBattingTable tr").forEach(r => r.classList.remove("selected"));
    row.classList.add("selected");
});
// de-select table row if clicked outside table
document.addEventListener("click", function (e) {
    const check = (!batTable.contains(e.target)) && (!modifyButton.contains(e.target)) && (!deleteButton.contains(e.target));
    if (check) {
        batTable.querySelectorAll("tr").forEach(row => row.classList.remove("selected"));
    }
});

let testBatData = [...testBatPlayers];
let storedBatData = JSON.parse(sessionStorage.getItem("storedBatData"));
let modifyPlayer = null;

if(!storedBatData) {
    sessionStorage.setItem("storedBatData", JSON.stringify(testBatData));
}

// initial table creation
makeSortableTable("#testBattingTable", storedBatData);

// saving to storage
function saveToStorage() {
    sessionStorage.setItem("storedBatData", JSON.stringify(storedBatData));
}

// Add button
const addButton = document.querySelector("#addButton");
const batForm = document.querySelector("#batForm");

addButton.addEventListener("click", () => {
    if (batForm.classList.contains("hidden")) {
        batForm.classList.remove("hidden");
        batForm.classList.add("flex");
    } else if (batForm.classList.contains("flex")) {
        batForm.classList.remove("flex");
        batForm.classList.add("hidden");
    }
    modifyPlayer = null;
    batForm.reset();
});


// modify button
modifyButton.addEventListener("click", () => {
    const tableRows = Array.from(batTable.querySelectorAll("tr"));
    const rowSelect = tableRows.some(row => row.classList.contains("selected"));
    if (rowSelect) {
        const row = tableRows.find(row => row.classList.contains("selected"));
        const cells = row.querySelectorAll("td");

        if (batForm.classList.contains("hidden")) {
            batForm.classList.remove("hidden");
            batForm.classList.add("flex");
        }

        document.getElementById("formPlayer").value = cells[1].textContent;
        document.getElementById("formCountry").value = cells[2].textContent;
        document.getElementById("formCareer").value = cells[3].textContent;
        document.getElementById("formMatches").value = cells[4].textContent;
        document.getElementById("formInnings").value = cells[5].textContent;
        document.getElementById("formRuns").value = cells[6].textContent;
        document.getElementById("formNO").value = cells[7].textContent;
        document.getElementById("formHS").value = cells[8].textContent;
        document.getElementById("formAvg").value = cells[9].textContent;
        document.getElementById("formBF").value = cells[10].textContent;
        document.getElementById("formSR").value = cells[11].textContent;
        document.getElementById("form100").value = cells[12].textContent;
        document.getElementById("form50").value = cells[13].textContent;
        document.getElementById("formDucks").value = cells[14].textContent;
        document.getElementById("formFours").value = cells[15].textContent;
        document.getElementById("formSixes").value = cells[16].textContent;

        modifyPlayer = cells[1].textContent;

    } else {
        alert("Select player data to modify!!");
    }
});

batForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formPlayer = document.getElementById("formPlayer").value.trim();
    const formCountry = document.getElementById("formCountry").value.trim();
    const formCareer = document.getElementById("formCareer").value.trim();
    const formMatches = document.getElementById("formMatches").value.trim();
    const formInnings = document.getElementById("formInnings").value.trim();
    const formRuns = document.getElementById("formRuns").value.trim();
    const formNO = document.getElementById("formNO").value.trim();
    const formHS = document.getElementById("formHS").value.trim();
    const formAvg = document.getElementById("formAvg").value.trim();
    const formBF = document.getElementById("formBF").value.trim();
    const formSR = document.getElementById("formSR").value.trim();
    const form100 = document.getElementById("form100").value.trim();
    const form50 = document.getElementById("form50").value.trim();
    const formDucks = document.getElementById("formDucks").value.trim();
    const formFours = document.getElementById("formFours").value.trim();
    const formSixes = document.getElementById("formSixes").value.trim();

    const newEntry = {
        player: formPlayer,
        nat: formCountry,
        career: formCareer,
        mat: formMatches,
        inns: formInnings,
        runs: formRuns,
        no: formNO,
        hs: formHS,
        ave: formAvg,
        bf: formBF,
        sr: formSR,
        hundreds: form100,
        fifties: form50,
        ducks: formDucks,
        fours: formFours,
        sixes: formSixes
    };
    console.log(newEntry);

    if (modifyPlayer) {
        // Update selected entry
        storedBatData = storedBatData.map(obj => (obj.player == modifyPlayer) ? newEntry : obj);
        console.log(storedBatData);
    } else {
        storedBatData.push(newEntry);
        console.log(storedBatData);
    }
    saveToStorage();
    makeSortableTable("#testBattingTable", storedBatData);
    batForm.reset();
});
