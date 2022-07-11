const display = document.getElementById("display");
const delete_btn = document.getElementById("delete_btn");
const clear_btn = document.getElementById("clear_btn");
const number_btns = document.querySelectorAll(".number_btn");
const negative_sign_btn = document.getElementById("negative_sign_btn");
const operator_btns = document.querySelectorAll(".operator_btn");
const equals_btn = document.getElementById("equals_btn");

let previousOperand = '';
let currentOperand = '';
let enteredNumber = '';

let result = 0;
let isAdding = false;
let isSubtracting = false;
let isMultiplying = false;
let isDividing = false;

document.getElementById("log_btn").addEventListener("click", () => {
    LogStatus();
});

function LogStatus() {
    console.log(`previousOperand = ${previousOperand}`);
    console.log(`currentOperand = ${currentOperand}`);
    console.log(`enteredNumber = ${enteredNumber}`);
    console.log(`result = ${result}`);
    console.log(`isAdding = ${isAdding}`);
    console.log(`isSubtracting = ${isSubtracting}`);
    console.log(`isMultiplying = ${isMultiplying}`);
    console.log(`isDividing = ${isDividing}`);
    console.log('____________________________________________');
}

delete_btn.addEventListener("click", () => {
    DeleteLastNumber();
});

clear_btn.addEventListener("click", () => {
    DeselectOtherOperators();
    enteredNumber = '';
    UpdateDisplay();
});

number_btns.forEach((numberButton) => {
    numberButton.addEventListener("click", () => {
        if(enteredNumber.length < 16)
            AppendNumber(numberButton.innerHTML);
    });
});

negative_sign_btn.addEventListener("click", () => {
    if(enteredNumber.charAt(0) === '-')
        return;

    enteredNumber = '-' + enteredNumber;
    UpdateDisplay();
});

operator_btns.forEach((operator) => {
    operator.addEventListener("click", () => {
        SelectOperator(operator);
    });
});

equals_btn.addEventListener("click", () => {
    Compute();
});

function AppendNumber(num) {
    enteredNumber += num;
    UpdateDisplay();
}

function DeleteLastNumber() {
    enteredNumber = enteredNumber.slice(0,-1);
    UpdateDisplay();
}

function UpdateDisplay () {
    if(!isNaN(Number(enteredNumber)))
        display.innerHTML = Number(enteredNumber)
        .toLocaleString(undefined, {maximumFractionDigits: 16});
    else
        UpdateDisplayWithRawData(enteredNumber);
}

function UpdateDisplayWithRawData (text) {
    display.innerHTML = text;
}

function SelectOperator(operator) {
    if(isAdding || isSubtracting || isDividing || isMultiplying){
        Compute();
        enteredNumber = previousOperand;
        DeselectOtherOperators();
    }

    previousOperand = (enteredNumber !== '') ? enteredNumber : '0';
    enteredNumber = '';

    switch(operator.innerHTML) {
        case '+':
            isAdding = true;
            break;
        case '-':
            isSubtracting = true;
            break;
        case '/':
            isDividing = true;
            break;
        case '*':
            isMultiplying = true;
    }

    operator.className += ' operator_btn_selected';
}

function DeselectOtherOperators() {
    operator_btns.forEach((operator) => {
        operator.className = 'operator_btn';
    });

    isAdding = false;
    isSubtracting = false;
    isDividing = false;
    isMultiplying = false;
}

function Compute() {
    if(enteredNumber === '')
        return;

    currentOperand = enteredNumber;
    enteredNumber = '';
    
    switch(true) {
        case isAdding:
            result = parseFloat(previousOperand) + parseFloat(currentOperand);
            break;
        case isSubtracting:
            result = (parseFloat(previousOperand) - parseFloat(currentOperand));
            break;
        case isDividing:
            if(parseFloat(currentOperand) !== 0)
                result = parseFloat(previousOperand) / parseFloat(currentOperand);
            break;
        case isMultiplying:
            result = parseFloat(previousOperand) * parseFloat(currentOperand);
    }

    const tempResult = parseFloat(result.toPrecision(15));
    
    if(parseFloat(currentOperand) === 0 && isDividing)
        UpdateDisplayWithRawData('Cannot divide by zero');
    else
        UpdateDisplayWithRawData(
            (tempResult.toString().length < 16) ? tempResult : result.toPrecision(16));
    

    previousOperand = result;
    enteredNumber = result;
    currentOperand = '';

    DeselectOtherOperators();
}