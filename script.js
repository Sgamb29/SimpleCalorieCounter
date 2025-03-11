

const output = document.getElementById("output");

let toAdd = true;

document.getElementById("addToggle").style.backgroundColor = "green";

let currentCount = 0;
let mealCount = 0;
let snackCount = 0;
let proteinCount = 0;

function incrementCounter(amount) {
    currentCount += toAdd ? amount : -amount;
    output.innerText = currentCount;
    setCookie("calories", currentCount, 10000);
}



function toggleAdd() {
    const addToggle = document.getElementById("addToggle");
    const subtractToggle = document.getElementById("subtractToggle");
    if (toAdd) {
        subtractToggle.style.backgroundColor = "green";
        addToggle.style.backgroundColor = "cadetBlue";
        toAdd = false;
    } else {
        subtractToggle.style.backgroundColor = "cadetBlue";
        addToggle.style.backgroundColor = "green";
        toAdd = true;
    }
}

function resetCounter() {
    currentCount = 0;
    mealCount = 0;
    snackCount = 0;
    proteinCount = 0;
    updateValues();
    setCookie("calories", currentCount, 10000);
    setCookie("protein", proteinCount, 10000);
    setCookie("meals", mealCount, 10000);
    setCookie("snacks", snackCount, 10000);
}

function addMeal() {
    mealCount += toAdd ? 1 : -1;
    document.getElementById("mealButton").innerText = "Meals: " + mealCount.toString();
    setCookie("meals", mealCount, 10000);
}

function addSnack() {
    snackCount += toAdd ? 1 : -1;
    document.getElementById("snackButton").innerText = "Snack: " + snackCount.toString();
    setCookie("snacks", snackCount, 10000);
}

const proteinInput = document.getElementById("proteinRange");
const proteinLabel = document.getElementById("proteinLabel");

proteinInput.addEventListener("input", (e) => {
    proteinCount = e.target.value;
    proteinLabel.innerText = "Protein: " + proteinCount.toString();
    setCookie("protein", proteinCount, 10000);
})

function updateValues() {
    document.getElementById("mealButton").innerText = "Meals: " + mealCount.toString();
    document.getElementById("snackButton").innerText = "Snack: " + snackCount.toString();
    proteinLabel.innerText = "Protein: " + proteinCount.toString();
    proteinInput.value = proteinCount;
    output.innerText = currentCount;
}

document.addEventListener("DOMContentLoaded", () => {
    try {
        const calories = getCookie("calories");
        const p = getCookie("protein");
        const m = getCookie("meals");
        const s = getCookie("snacks");

        currentCount = calories !== "" ? parseInt(calories) : 0;
        proteinCount = p !== "" ? parseInt(p) : 0; 
        mealCount = m !== "" ? parseInt(m) : 0;
        snackCount = s !== "" ? parseInt(s) : 0;

        updateValues();

    } catch (e) {
        console.log("Get cookie error: ", e);
    }
});

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
}


function getCookie(name) {
    try {
        const value = document.cookie.split(`${name}=`)[1].split(";")[0];
        return value;
        } catch {
            return "";
        }
        
}

// Traffic
const request = new Request("https://server.sgambapps.com/?site=simpleCalories", {
    method: "POST",
});
fetch(request)
.then(res => {
    if (res.ok) {
    console.log("visit counted");
    }
})
.catch(err => console.log(err));