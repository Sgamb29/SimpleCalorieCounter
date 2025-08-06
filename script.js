const output = document.getElementById("output");
let toAdd = true;
let lastInput = "";

document.getElementById("addToggle").style.backgroundColor = "green";

let currentCount = 0;
let calorieGoal = 2000;
let lastFetchCall = "";

function incrementCounter(amount) {
    currentCount += toAdd ? amount : -amount;
    output.innerText = currentCount;
    document.getElementById("goalOutput").innerText = (calorieGoal - currentCount).toString() + " calories left";
    setCookie("calories", currentCount, 10000);
    setLastInputTime();
}

function toggleAdd() {
    const addToggle = document.getElementById("addToggle");
    const subtractToggle = document.getElementById("subtractToggle");
    if (toAdd) {
        subtractToggle.style.backgroundColor = "green";
        addToggle.style.backgroundColor = "black";
        toAdd = false;
    } else {
        subtractToggle.style.backgroundColor = "black";
        addToggle.style.backgroundColor = "green";
        toAdd = true;
    }
}

function resetCounter() {
    currentCount = 0;
    updateValues();
    setCookie("calories", currentCount, 10000);
}

function updateValues() {
    document.getElementById("goalOutput").innerText = (calorieGoal - currentCount) + " calories left";
    document.getElementById("lastInputTime").innerText = lastInput;
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
        const lastFetch = getCookie("lastFetch");
        const cGoal = getCookie("calorieGoal");
        const lI = getCookie("lastInput");

        currentCount = calories !== "" ? parseInt(calories) : 0;
        calorieGoal = cGoal !== "" ? parseInt(cGoal) : 2000;
        lastFetchCall = lastFetch !== "" ? parseInt(lastFetch) : "";
        lastInput = lI !== "" ? lI : "";
        
        

        updateValues();

        setCookie("calorieGoal", calorieGoal.toString(), 100);
        setCookie("calories", currentCount.toString(), 100);
        setCookie("lastInput", lastInput, 100);

        makeTrafficCall();
    } catch (e) {
        console.log("Get cookie error: ", e);
    }
});

function setLastInputTime() {
    const lastTimeOutput = document.getElementById("lastInputTime");
    const now = new Date();
    const timeStr = `Last calorie input: ${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;
    lastTimeOutput.innerText = timeStr;
    setCookie("lastInput", timeStr);
}

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