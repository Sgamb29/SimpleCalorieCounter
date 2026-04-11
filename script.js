const output = document.getElementById("output");
const inputDisplay = document.getElementById("inputDisplay");
let toAdd = true;
let lastInput = "";

document.getElementById("addToggle").style.backgroundColor = "green";

let currentCount = 0;
let calorieGoal = 2000;
let lastFetchCall = "";
let numberEntered = ""; // For using the calculator UI

function incrementCounter(amount=0) {
    if (amount != 0) {
        currentCount += toAdd ? amount : -amount;
    }
    if (numberEntered.length >= 1) {
        currentCount += toAdd ? parseInt(numberEntered) : -parseInt(numberEntered);
        numberEntered = "";
        inputDisplay.innerText = "--";
    }
    // output.innerText = currentCount;
    // document.getElementById("goalOutput").innerText = (calorieGoal - currentCount).toString() + " calories left";
    setCookie("calories", currentCount, 10000);
    setLastInputTime();
    updateValues();
}

function isValidNumber(num) {
    const valid = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    let isValid = false;
    valid.forEach((digit) => {
        if (num.toString() === digit) {
            isValid = true;
        }
    });
    return isValid;
}

function enterNumber(num) {
    if (numberEntered.length >= 5) {
        return;
    }
    if (isValidNumber(num)) {
        numberEntered = numberEntered + num.toString();
        inputDisplay.innerText = numberEntered;
    } 
}

function backSpace() {
    if (numberEntered.length > 1) {
        numberEntered = numberEntered.slice(0, numberEntered.length - 1);
    } else {
        numberEntered = "";
        inputDisplay.innerText = "--";
        return;
    }
    inputDisplay.innerText = numberEntered;
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
    document.getElementById("goalOutput").innerText = "Remaining: " + (calorieGoal - currentCount);
    document.getElementById("lastInputTime").innerText = lastInput;
    output.innerText = "Calories: " + currentCount;
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

        setCookie("calorieGoal", calorieGoal.toString(), 1000);
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