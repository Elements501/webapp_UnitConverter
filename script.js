// Initialise
const updateTimeElement = document.getElementById('update-time');
const now = new Date();
updateTimeElement.textContent = now.toLocaleDateString() + " " + now.toLocaleTimeString() + " UTC+8";

window.onload = function () {
    let list = JSON.parse(localStorage.getItem("localHistory")) || [];
    list.forEach(element => {
        displayHistory(element.kilogram, element.catty, element.tael, element.pound)
    });
}

// HTML Listen
function convertFromKilogram() {
    const kg = parseFloat(document.getElementById('kilogram').value) || 0;
    document.getElementById('catty').value = (kg / 0.6048).toFixed(3);
    document.getElementById('tael').value = (kg * 26.45547).toFixed(3);
    document.getElementById('pound').value = (kg * 2.20462).toFixed(3);
}

function convertFromCatty() {
    const catty = parseFloat(document.getElementById('catty').value) || 0;
    const kg = catty / 0.6048;
    document.getElementById('kilogram').value = kg.toFixed(3);
    document.getElementById('tael').value = (kg * 26.45547).toFixed(3);
}

function convertFromTael() {
    const tael = parseFloat(document.getElementById('tael').value) || 0;
    const kg = tael / 26.45547;
    document.getElementById('kilogram').value = kg.toFixed(3);
    document.getElementById('catty').value = (kg / 0.6048).toFixed(3);
    document.getElementById('pound').value = (kg * 2.20462).toFixed(3);
}

function convertFromPound() {
    const pound = parseFloat(document.getElementById('pound').value) || 0;
    const kg = pound / 2.20462;
    document.getElementById('kilogram').value = kg.toFixed(3);
    document.getElementById('catty').value = (kg / 0.6048).toFixed(3);
    document.getElementById('tael').value = (kg * 26.45547).toFixed(3);
}

function addToHistory(one, two, three, four) {
    displayHistory(one, two, three, four);

    let list = JSON.parse(localStorage.getItem("localHistory")) || [];
    list.push({ kilogram: one, catty: two, tael: three, pound: four });
    localStorage.setItem("localHistory", JSON.stringify(list));
}

function clearHistory() {
    document.getElementById("historyContainer").replaceChildren();
    localStorage.removeItem("localHistory");
}

// LOCAL FUNCTION
function displayHistory(one, two, three, four) {
    const table = document.getElementsByClassName("historyTable")[0].cloneNode(true)
    table.className = 'historyLine';

    table.querySelector("#one").textContent = one;
    table.querySelector("#two").textContent = two;
    table.querySelector("#three").textContent = three;
    table.querySelector("#four").textContent = four;

    document.getElementById("historyContainer").appendChild(table);

    // Swipe to delete
    const deleteButton = table.querySelector("#deleteButton");
    table.addEventListener('touchstart', (e) => {
        table.dataset.startX = e.touches[0].clientX;
        deleteButton.style.display = "inline";
        deleteButton.style.flex = 0
    });

    table.addEventListener('touchmove', (e) => {
        const startX = parseFloat(table.dataset.startX);
        const currentX = e.touches[0].clientX;
        const deltaX = currentX - startX;
        if (deltaX > 0) {
            console.log(deltaX)
            deleteButton.style.flex = `${deltaX * 0.01}`
            deleteButton.style.boxShadow = `${deltaX * 0.01 + 1}rem 0 1rem 0.1rem #1f1f1f inset`
        }
    });

    table.addEventListener('touchend', (e) => {
        const startX = parseFloat(table.dataset.startX);
        const endX = e.changedTouches[0].clientX;
        const deltaX = endX - startX;
        if (deltaX > 50) { // Swipe left to right threshold
            const container = document.getElementById("historyContainer");
            const index = Array.from(container.children).indexOf(table);
            let list = JSON.parse(localStorage.getItem("localHistory")) || [];
            list.splice(index, 1);
            localStorage.setItem("localHistory", JSON.stringify(list));
            table.remove();
        } else {
            deleteButton.style.display = "none"
        }
    });
}