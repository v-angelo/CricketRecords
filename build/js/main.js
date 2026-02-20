import { testBatData, odiBatData, t20BatData } from "./data.js";
import makeSortableTable from "./sortTable.js";

let dataArray;
let storedBatData;

// re-direct resolve and initialization
const params = new URLSearchParams(window.location.search);
const type = params.get("type");
headSpan.textContent = type;

if (type == "ODI") {
    dataArray = [...odiBatData];
    let odiData = JSON.parse(sessionStorage.getItem("odiData"));
    if (!odiData) {
        sessionStorage.setItem("odiData", JSON.stringify(dataArray));
        odiData = JSON.parse(sessionStorage.getItem("odiData"));
    }
    storedBatData = [...odiData];
    sessionStorage.setItem("storedBatData", JSON.stringify(storedBatData));
} else if (type == "T20") {
    dataArray = [...t20BatData];
    let t20Data = JSON.parse(sessionStorage.getItem("t20Data"));
    if (!t20Data) {
        sessionStorage.setItem("t20Data", JSON.stringify(dataArray));
        t20Data = JSON.parse(sessionStorage.getItem("t20Data"));
    }
    storedBatData = [...t20Data];
    sessionStorage.setItem("storedBatData", JSON.stringify(storedBatData));
} else {
    dataArray = [...testBatData];
    let testData = JSON.parse(sessionStorage.getItem("testData"));
    if (!testData) {
        sessionStorage.setItem("testData", JSON.stringify(dataArray));
        testData = JSON.parse(sessionStorage.getItem("testData"));
    }
    storedBatData = [...testData];
    sessionStorage.setItem("storedBatData", JSON.stringify(storedBatData));
}

// function to save to storage and create new table
function saveAndRender() {
    sessionStorage.setItem("storedBatData", JSON.stringify(storedBatData));
    makeSortableTable("#testBattingTable", storedBatData);
    if (type == "ODI") {
        sessionStorage.setItem("odiData", JSON.stringify(storedBatData));
    } else if (type == "T20") {
        sessionStorage.setItem("t20Data", JSON.stringify(storedBatData));
    } else {
        sessionStorage.setItem("testData", JSON.stringify(storedBatData));
    }
}

// initial table creation
saveAndRender();

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

// add/modify variable initialization
const batForm = document.querySelector("#batForm");
let modifyPlayer = null;

// add button
addButton.addEventListener("click", () => {
    if (batForm.classList.contains("hidden")) {
        batForm.classList.remove("hidden");
        batForm.classList.add("flex");
    }
    modifyPlayer = null;
});

// delete button
deleteButton.addEventListener("click", () => {
    const tableRows = Array.from(batTable.querySelectorAll("tr"));
    const rowSelect = tableRows.some(row => row.classList.contains("selected"));
    if (rowSelect) {
        const row = tableRows.find(row => row.classList.contains("selected"));
        const rowData = Array.from(row.cells).map(cell => cell.textContent.trim());
        console.log(rowData[1]);
        storedBatData = storedBatData.filter(obj => obj.player != rowData[1]);
    } else {
        alert("Select player data to delete!!");
    }

    if (batForm.classList.contains("flex")) {
        batForm.classList.remove("flex");
        batForm.classList.add("hidden");
    }
    modifyPlayer = null;
    saveAndRender();
});

// reset button
resetButton.addEventListener("click", () => {
    modifyPlayer = null;
    batForm.reset();
});

// cancel button
cancelButton.addEventListener("click", () => {
    if (batForm.classList.contains("flex")) {
        batForm.classList.remove("flex");
        batForm.classList.add("hidden");
    }
    modifyPlayer = null;
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
        modifyPlayer = null;
    }
});

// submit form algorithm
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
    saveAndRender();
    batForm.reset();
});
