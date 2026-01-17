// Initialise
const updateTimeElement = document.getElementById('update-time');
const now = new Date();
if (updateTimeElement != null) { updateTimeElement.textContent = now.toLocaleDateString() + " " + now.toLocaleTimeString() + " UTC+8"; }

let data = {} //for category lookup
let price = {} // for price lookup
window.onload = function () {
    if (window.location.pathname == "/index.html") {
        let list = JSON.parse(localStorage.getItem("localHistory")) || [];
        list.forEach(element => {
            displayHistory(element.kilogram, element.catty, element.tael, element.pound)
        });
    } else if (window.location.pathname == "/priceComparison.html") {
        // Obtain from prices.json
        fetch('prices.json')
            .then(response => response.json())
            .then(json => {
                json.forEach(item => {
                    const cat = item["Category"];
                    if (!data[cat]) { data[cat] = [] }; //Create new child array
                    const food = item["Food Item"]
                    data[cat].push(food);

                    price[food] = []; //price[Fppd Item] = {min Price, max Price, unit}
                    price[food].push(item["Min Price (HKD)"]);
                    price[food].push(item["Max Price (HKD)"]);
                    price[food].push(item["Unit"]);
                });

                const categorySelect = document.getElementById("category");
                categorySelect.innerHTML = '<option value=""> SELECT CATEGORY </option>';
                Object.keys(data).forEach(cat => {
                    let option = document.createElement("option");
                    option.value = cat;
                    option.textContent = cat; // Capitalize for display
                    categorySelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error loading prices.json:', error));
        console.log(data)
        console.log(price)
    }
}

// HTML Listen
function convertFromKilogram() {
    const kg = parseFloat(document.getElementById('kilogram').value) || 0;
    document.getElementById('catty').value = (kg * 1.653).toFixed(3);
    document.getElementById('tael').value = (kg * 26.45547).toFixed(3);
    document.getElementById('pound').value = (kg * 2.20462).toFixed(3);
}

function convertFromCatty() {
    const catty = parseFloat(document.getElementById('catty').value) || 0;
    const kg = catty / 1.653;
    document.getElementById('kilogram').value = kg.toFixed(3);
    document.getElementById('tael').value = (kg * 26.45547).toFixed(3);
    document.getElementById('pound').value = (kg * 2.20462).toFixed(3);
}

function convertFromTael() {
    const tael = parseFloat(document.getElementById('tael').value) || 0;
    const kg = tael / 26.45547;
    document.getElementById('kilogram').value = kg.toFixed(3);
    document.getElementById('catty').value = (kg * 1.653).toFixed(3);
    document.getElementById('pound').value = (kg * 2.20462).toFixed(3);
}

function convertFromPound() {
    const pound = parseFloat(document.getElementById('pound').value) || 0;
    const kg = pound / 2.20462;
    document.getElementById('kilogram').value = kg.toFixed(3);
    document.getElementById('catty').value = (kg * 1.653).toFixed(3);
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

function updateCategory() {
    const category = document.getElementById("category").value;
    const subCategory = document.getElementById("subCategory");

    // Remove all option class
    subCategory.innerHTML = '<option value=""> SELECT ITEM </option>'

    if (category && data[category]) {
        document.getElementById("subCategoryContainer").style.display = "flex";
        data[category].forEach(element => {
            let item = document.createElement("option");
            item.value = element;
            item.textContent = element;
            subCategory.appendChild(item);
        });
    } else {
        document.getElementById("subCategoryContainer").style.display = "none";
        subCategory.value = ""
        updateSubCategory()
    }
}

function updateSubCategory() {
    const subCategory = document.getElementById("subCategory");
    if (subCategory.value) {
        document.getElementById("priceContainer").style.display = "flex"
        document.getElementById("compareContainer").style.display = "flex"
        document.getElementById("percentageContainer").style.display = "flex"
        document.getElementById("minPriceNum").textContent = price[subCategory.value][0] + " / " + price[subCategory.value][2]
        document.getElementById("maxPriceNum").textContent = price[subCategory.value][1] + " / " + price[subCategory.value][2]
    } else {
        document.getElementById("priceContainer").style.display = "none"
        document.getElementById("compareContainer").style.display = "none"
        document.getElementById("percentageContainer").style.display = "none"
        document.getElementById("minPriceNum").textContent = null
        document.getElementById("maxPriceNum").textContent = null
    }
}

function updatePrice() {
    const subCategory = document.getElementById("subCategory").value;
    let avgPrice = (price[subCategory][0] + price[subCategory][1]) / 2;
    if (price[subCategory][2] == "catty") {
        avgPrice /= 1.653;
    } else if (price[subCategory][2] == "tael") {
        avgPrice /= 26.45547;
    } else if (price[subCategory][2] == "pound") {
        avgPrice /= 2.20462;
    }

    const unit = document.getElementById("priceUnit").value
    let input = document.getElementById("priceInput").value
    if (unit == "catty") {
        input /= 1.653;
    } else if (unit == "tael") {
        input /= 26.45547;
    } else if (unit == "pound") {
        input /= 2.20462;
    }

    if (unit == "piece" ^ price[subCategory][2] == "piece") {
        document.getElementById("percentageNumber").textContent = "INVALID"
    } else {
        document.getElementById("percentageNumber").textContent = `${(input / avgPrice * 100).toFixed(3)}%`
    }
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