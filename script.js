
const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");
const buttons = document.querySelectorAll(".buttons button");

let expression = "";
let justCalculated = false;

function updateDisplay() {
    expressionDisplay.textContent = expression
        .replace(/\*/g, " × ")
        .replace(/\//g, " ÷ ")
        .replace(/-/g, " − ")
        .replace(/\+/g, " + ")
        .replace(/%/g, " % ");

    resultDisplay.textContent = expression || "0";

    expressionDisplay.scrollLeft = expressionDisplay.scrollWidth;
    resultDisplay.scrollLeft = resultDisplay.scrollWidth;
}

function calculate() {
    if (!expression) return;

    try {
        // Sirf calculator ke allowed characters accept karo.
        if (!/^[0-9+\-*/%.()\s]+$/.test(expression)) {
            throw new Error("Invalid expression");
        }

        const answer = Function(
            '"use strict"; return (' + expression + ')'
        )();

        if (typeof answer !== "number" || !Number.isFinite(answer)) {
            throw new Error("Invalid calculation");
        }

        const formattedAnswer = Number(answer.toPrecision(12)).toString();

        expressionDisplay.textContent =
            expression
                .replace(/\*/g, " × ")
                .replace(/\//g, " ÷ ")
                .replace(/-/g, " − ")
                .replace(/\+/g, " + ")
                .replace(/%/g, " % ")
            + " =";

        resultDisplay.textContent = formattedAnswer;
        resultDisplay.scrollLeft = resultDisplay.scrollWidth;

        expression = formattedAnswer;
        justCalculated = true;

    } catch (error) {
        resultDisplay.textContent = "Error";
        expressionDisplay.textContent = expression;
        expression = "";
        justCalculated = false;
    }
}

function handleInput(value) {
    if (value === "C") {
        expression = "";
        expressionDisplay.textContent = "";
        resultDisplay.textContent = "0";
        justCalculated = false;
        return;
    }

    if (value === "DEL") {
        if (justCalculated) {
            expression = "";
            justCalculated = false;
        } else {
            expression = expression.slice(0, -1);
        }

        updateDisplay();
        return;
    }

    if (value === "=") {
        calculate();
        return;
    }

    const operators = ["+", "-", "*", "/", "%"];

    if (justCalculated) {
        if (operators.includes(value)) {
            // Answer ke baad operator dabao to calculation continue ho.
            justCalculated = false;
        } else {
            // Naya number dabao to nayi calculation shuru ho.
            expression = "";
            expressionDisplay.textContent = "";
            justCalculated = false;
        }
    }

    if (operators.includes(value)) {
        if (!expression) {
            if (value !== "-") return;
        } else {
            const lastChar = expression.slice(-1);

            if (operators.includes(lastChar)) {
                expression = expression.slice(0, -1);
            }
        }
    }

    if (value === ".") {
        const currentNumber = expression.split(/[+\-*/%]/).pop();

        if (currentNumber.includes(".")) return;

        if (!currentNumber) {
            expression += "0";
        }
    }

    expression += value;
    updateDisplay();
    justCalculated = false;
}

buttons.forEach(function (button) {
    button.addEventListener("click", function () {
        const value = button.dataset.value;

        if (button.classList.contains("clear")) {
            handleInput("C");
        } else if (button.classList.contains("delete")) {
            handleInput("DEL");
        } else if (button.classList.contains("equal")) {
            handleInput("=");
        } else {
            handleInput(value);
        }
    });
});

// Keyboard se bhi calculator use kar sakte ho.
document.addEventListener("keydown", function (event) {
    if (/^[0-9.+\-*/%]$/.test(event.key)) {
        handleInput(event.key);
    } else if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        handleInput("=");
    } else if (event.key === "Backspace") {
        handleInput("DEL");
    } else if (event.key === "Escape") {
        handleInput("C");
    }
});
