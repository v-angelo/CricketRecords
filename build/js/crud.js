// Select table row
const batTable = document.querySelector("#testBattingTable");

batTable.addEventListener("click", function (e) {
    const row = e.target.closest("tr");

    if (!row || row.rowIndex === 0) return; // ignore header

    document.querySelectorAll("#testBattingTable tr").forEach(r => r.classList.remove("selected"));
    row.classList.add("selected");
});

document.addEventListener("click", function (e) {
    if (!batTable.contains(e.target)) {
        batTable.querySelectorAll("tr").forEach(row => row.classList.remove("selected"));
    }
});

// Add button
const addButton = document.querySelector("#addButton");
const batForm = document.querySelector("#testBatForm");

addButton.addEventListener("click", () => {
    if(batForm.classList.contains("hidden")) {
        batForm.classList.remove("hidden");
        batForm.classList.add("flex");
    } else if(batForm.classList.contains("flex")) {
        batForm.classList.remove("flex");
        batForm.classList.add("hidden");
    }
});