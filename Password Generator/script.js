const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator1 = document.querySelector(".indicator1");
const indicator2 = document.querySelector(".indicator2");
const indicator3 = document.querySelector(".indicator3");
const indicator4 = document.querySelector(".indicator4");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "'~`!@#$%^&*()_-+={[}]|:;<,>.?/";

let password = "";
let passwordLength = 10;
let checkCount = 0;


uppercaseCheck.checked = true;
handleSlider();

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;

    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%";
}

function getRndInteger(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && hasNum && hasSym && passwordLength >= 12)
    {
        indicator1.style.background = "#00ff66";
        indicator2.style.background = "#00ff66";
        indicator3.style.background = "#00ff66";
        indicator4.style.background = "#00ff66";
    }
    else if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        indicator1.style.background = "yellow";
        indicator2.style.background = "yellow";
        indicator3.style.background = "yellow";
        indicator4.style.background = "none";
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        indicator1.style.background = "yellow";
        indicator2.style.background = "yellow";
        indicator3.style.background = "none";
        indicator4.style.background = "none";
    } else {
        indicator1.style.background = "#ff0000";
        indicator2.style.background = "none";
        indicator3.style.background = "none";
        indicator4.style.background = "none";
    }
}


async function copyContent(){
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }

    // To make copy span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array){
    // Fisher yates methord

    for(let i=array.length - 1; i > 0 ; i--){
        // finding random j, using random function
        const j = Math.floor(Math.random() * (i + 1));
        // swap
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((element) => (str += element));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    // In a case if length is less then selected check boxes
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange());
})

// Event listener on slider

inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value;
    handleSlider();
})

// Event listener for coping password

copyBtn.addEventListener('click',() => {
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click',() => {
    // If there is none of the checkbox selected
    if(checkCount == 0)
        return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // Password init
    password = "";

    // function array to carry function
    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // Compulsory addition
    for(let i=0 ; i< funcArr.length; i++){
        password += funcArr[i]();
    }

    // Remaining addition
    for(let i=0 ; i < passwordLength - funcArr.length; i++){
        let randIndex = getRndInteger(0,funcArr.length);

        password += funcArr[randIndex]();
    }

    // Password Suffling
    password = shufflePassword(Array.from(password));


    // Display in UI
    passwordDisplay.value = password;


    // Strength Calculating
    calcStrength();


});