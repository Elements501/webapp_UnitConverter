// Initialise
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
    displayHistory(one, two, three, four)

    let list = JSON.parse(localStorage.getItem("localHistory")) || [];
    list.push({ kilogram: one, catty: two, tael: three, pound: four })
    localStorage.setItem("localHistory", JSON.stringify(list))
}

function clearHistory() {
    document.getElementById("historyContainer").replaceChildren()
    localStorage.removeItem("localHistory")
}

// LOCAL FUNCTION
function displayHistory(one, two, three, four) {
    const table = document.getElementsByClassName("historyTable")[0].cloneNode(true)
    table.className = 'historyLine';

    table.querySelector("#one").textContent = one
    table.querySelector("#two").textContent = two
    table.querySelector("#three").textContent = three
    table.querySelector("#four").textContent = four

    document.getElementById("historyContainer").appendChild(table)
}