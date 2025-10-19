const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");

let currentInput = "";
let memory = 0; // memory storage

// Helpers
const isOperator = (ch) => ["+", "-", "*", "/", "%"].includes(ch);

function lastToken() {
  return currentInput.split(/[\+\-\*\/%]/).pop();
}

function appendValue(value) {
  if (value === ".") {
    const token = lastToken();
    if (token.includes(".")) return; // prevent multiple decimals
    if (token === "") {
      currentInput += "0.";
    } else {
      currentInput += ".";
    }
    display.value = currentInput;
    return;
  }

  if (value === "√") {
    try {
      let num = parseFloat(lastToken());
      if (isNaN(num)) return;
      let sqrtVal = Math.sqrt(num);
      currentInput = currentInput.slice(0, currentInput.length - lastToken().length) + sqrtVal;
      display.value = currentInput;
    } catch {
      display.value = "Error";
      currentInput = "";
    }
    return;
  }

  if (isOperator(value)) {
    if (currentInput === "") return; 
    if (isOperator(currentInput.slice(-1))) {
      // replace last operator instead of appending
      currentInput = currentInput.slice(0, -1) + value;
    } else {
      currentInput += value;
    }
    display.value = currentInput;
    return;
  }

  // ✅ Fix: just append numbers normally
  currentInput += value;
  display.value = currentInput;
}


// Evaluate expression with BODMAS
function evaluateExpression() {
  if (!currentInput) return;
  try {
    if (isOperator(currentInput.slice(-1))) {
      currentInput = currentInput.slice(0, -1);
    }
    let result = Function('"use strict"; return (' + currentInput + ')')();
    if (result === Infinity || result === -Infinity || isNaN(result)) {
      display.value = "Error";
      currentInput = "";
    } else {
      display.value = result;
      currentInput = result.toString();
    }
  } catch {
    display.value = "Error";
    currentInput = "";
  }
}

// Memory functions
function handleMemory(value) {
  switch (value) {
    case "MC":
      memory = 0;
      break;
    case "MR":
      currentInput += memory;
      display.value = currentInput;
      break;
    case "M+":
      memory += parseFloat(display.value) || 0;
      break;
    case "M-":
      memory -= parseFloat(display.value) || 0;
      break;
  }
}

// Button clicks
buttons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.getAttribute("data-value");

    if (value === "C") {
      currentInput = "";
      display.value = "";
    } else if (value === "DEL") {
      currentInput = currentInput.slice(0, -1);
      display.value = currentInput;
    } else if (value === "=") {
      evaluateExpression();
    } else if (["MC", "MR", "M+", "M-"].includes(value)) {
      handleMemory(value);
    } else {
      appendValue(value);
    }
  });
});

// Keyboard input
document.addEventListener("keydown", (event) => {
  const key = event.key;

  if ((key >= "0" && key <= "9") || ["+", "-", "*", "/", "%"].includes(key)) {
    appendValue(key);
  } else if (key === ".") {
    appendValue(".");
  } else if (key === "Enter") {
    evaluateExpression();
  } else if (key === "Backspace") {
    currentInput = currentInput.slice(0, -1);
    display.value = currentInput;
  } else if (key === "Escape") {
    currentInput = "";
    display.value = "";
  } else if (key.toLowerCase() === "r") {
    appendValue("√");
  }
});
