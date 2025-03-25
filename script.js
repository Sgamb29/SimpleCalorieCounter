

const output = document.getElementById("output");

let toAdd = true;

document.getElementById("addToggle").style.backgroundColor = "green";

let currentCount = 0;
let vegCount = 0;
let fruitCount = 0;
let grainsCount = 0;
let proteinCount = 0;

let calorieGoal = 2000;
let lastFetchCall = "";

function incrementCounter(amount) {
    currentCount += toAdd ? amount : -amount;
    output.innerText = currentCount;
    document.getElementById("goalOutput").innerText = (calorieGoal - currentCount).toString() + " calories left";
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
    vegCount = 0;
    fruitCount = 0;
    grainsCount = 0;
    proteinCount = 0;
    updateValues();
    setCookie("calories", currentCount, 10000);
    setCookie("protein", proteinCount, 10000);
    setCookie("veg", vegCount, 10000);
    setCookie("fruit", fruitCount, 10000);
    setCookie("grains", grainsCount, 10000);
}

function addVeg() {
    vegCount += toAdd ? 1 : -1;
    document.getElementById("vegButton").innerText = "Veg: " + vegCount.toString();
    setCookie("veg", vegCount, 10000);
}

function addFruit() {
    fruitCount += toAdd ? 1 : -1;
    document.getElementById("fruitButton").innerText = "Fruit: " + fruitCount.toString();
    setCookie("fruit", fruitCount, 10000);
}

function addGrain() {
    grainsCount += toAdd ? 1 : -1;
    document.getElementById("grainButton").innerText = "Grains: " + grainsCount.toString();
    setCookie("grains", grainsCount, 10000);
}

const proteinInput = document.getElementById("proteinRange");
const proteinLabel = document.getElementById("proteinLabel");

proteinInput.addEventListener("input", (e) => {
    proteinCount = parseInt(e.target.value);
    proteinLabel.innerText = "Protein: " + proteinCount.toString();
    setCookie("protein", proteinCount, 10000);
})

function addToProtein(num) {
    if (num < 0 && proteinCount === 0) {
        return;
    }
    if (num > 0 && proteinCount === 150) {
        return;
    }
    proteinCount += parseInt(num);
    updateValues();
    setCookie("protein", proteinCount, 10000);
}

function updateValues() {
    document.getElementById("vegButton").innerText = "Veg: " + vegCount.toString();
    document.getElementById("fruitButton").innerText = "Fruit: " + fruitCount.toString();
    document.getElementById("grainButton").innerText = "Grains: " + grainsCount.toString();
    
    document.getElementById("goalOutput").innerText = (calorieGoal - currentCount) + " calories left";
    proteinLabel.innerText = "Protein: " + proteinCount.toString();
    proteinInput.value = proteinCount;
    output.innerText = currentCount;
}

function setCalorieGoal() {
    const numReg = /^[0-9]+$/;
    calorieGoal = prompt("Set Calorie Goal: ");
    const isMatch = numReg.test(calorieGoal); 
    if (isMatch) {
        calorieGoal = parseInt(calorieGoal);
        setCookie("calorieGoal", calorieGoal.toString(), 10000);
        updateValues();
    } else {
        console.log("error");
    }
}



document.addEventListener("DOMContentLoaded", () => {
    try {
        const calories = getCookie("calories");
        const p = getCookie("protein");
        const m = getCookie("veg");
        const s = getCookie("fruit");
        const g = getCookie("grains");
        const lastFetch = getCookie("lastFetch");
        const cGoal = getCookie("calorieGoal");

        currentCount = calories !== "" ? parseInt(calories) : 0;
        proteinCount = p !== "" ? parseInt(p) : 0; 
        vegCount = m !== "" ? parseInt(m) : 0;
        fruitCount = s !== "" ? parseInt(s) : 0;
        grainsCount = g !== "" ? parseInt(g) : 0;
        calorieGoal = cGoal !== "" ? parseInt(cGoal) : 2000;


        lastFetchCall = lastFetch !== "" ? parseInt(lastFetch) : "";

        updateValues();

        makeTrafficCall();


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

function makeTrafficCall() {
    // Logic for fetch to only call once per day;
    const time = new Date();
    const DOTW = time.getDay();


    // // Traffic
    const request = new Request("https://server.sgambapps.com/?site=simpleCalories", {
        method: "POST",
    });
    if (lastFetchCall !== parseInt(DOTW)) {
        fetch(request)
        .then(res => {
            if (res.ok) {
            console.log("visit counted");
            }
        })
        .catch(err => console.log(err));

        setCookie("lastFetch", DOTW.toString(), 10000);
        console.log("cookie set");
    }


}

