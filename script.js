

const output = document.getElementById("output");

let toAdd = true;

document.getElementById("addToggle").style.backgroundColor = "green";

let currentCount = 0;

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
    output.innerText = currentCount;
    setCookie("calories", currentCount, 10000);
}


document.addEventListener("DOMContentLoaded", () => {
    try {
        const calories = getCookie("calories");
        if (calories !== "") {
            currentCount = parseInt(calories);
            output.innerText = currentCount;
        }
    } catch {
        
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