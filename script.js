const output = document.getElementById("output");
const inputDisplay = document.getElementById("inputDisplay");
let toAdd = true;
let lastInput = "";

document.getElementById("addToggle").style.backgroundColor = "green";

let currentCount = 0;
let calorieGoal = 2000;
let lastFetchCall = "";
let numberEntered = ""; // For using the calculator UI
let historyList = [];

function incrementCounter(amount=0) {
    // It appears I'm not using this first if statement anymore.
    if (amount != 0) {
        currentCount += toAdd ? amount : -amount;
    }
    if (numberEntered.length >= 1) {
        // Change number to positive or negative based on boolean.
        n = toAdd ? parseInt(numberEntered) : -parseInt(numberEntered);
        // Add to current count & save to history.
        currentCount += n;
        saveToList(n)
        // Reset UI
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
    resetHistory();
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

const historyKey = "history";
function saveToList(num) {
    historyList.push(num);
    const s = historyList.join(",");
    setCookie(historyKey, s, 10000)
    const hl = document.getElementById("historyList");
    if (!hl.hidden) {
        hl.innerText = reverseCopy().join("\n");
    }
}

function resetHistory() {
    const hl = document.getElementById("historyList");
    hl.innerText = "";
    hl.hidden = true;
    historyList = [];
    setCookie(historyKey, "", 10000);
}

function toggleList() {
    if (historyList.length === 0) {
        return;
    }
    const historyOutput = document.getElementById("historyList");
    if (historyOutput.hidden) {
        historyOutput.hidden = false;
        historyOutput.innerText = reverseCopy().join("\n");
    } else {
        historyOutput.hidden = true;
    }
}

function reverseCopy() {
    const l = historyList.length;
    if (l === 0) {
        return;
    }
    let r = [];
    for(let i = l - 1; i >=0; i--) {
        r.push(historyList[i]);
    }
    return r;
}

document.addEventListener("DOMContentLoaded", () => {
    try {
        const calories = getCookie("calories");
        const lastFetch = getCookie("lastFetch");
        const cGoal = getCookie("calorieGoal");
        const lI = getCookie("lastInput");
        const h = getCookie(historyKey);

        currentCount = calories !== "" ? parseInt(calories) : 0;
        calorieGoal = cGoal !== "" ? parseInt(cGoal) : 2000;
        lastFetchCall = lastFetch !== "" ? parseInt(lastFetch) : "";
        lastInput = lI !== "" ? lI : "";
        historyList = h !== "" ? h.split(",") : [];
        
        

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