let regex1 = "(bab)*(b+a)(bab+aba)(a+b)*(aa+bb)*(b+a+bb)(a+b)*(aa+bb)";
let regex2 = "(1+0)*(11+00)(00+11)*(1+0+11)(1+0+11)*(101+111)(101+111)*(1+0*+11)(1+0*+11)*";
var currentRegex = 1; // Current regex identifier

function switchRegex() {
  clearInput(); // Clears the input field and display
  let regexLabel = document.getElementById("regexLabel");
  let languageLabel = document.getElementById("languageLabel");
  let regexDiagram1 = document.getElementById("regexDiagram1");
  let regexDiagram2 = document.getElementById("regexDiagram2");
  let pdaDiagram1 = document.getElementById("pdaDiagram1");
  let pdaDiagram2 = document.getElementById("pdaDiagram2");
  let cfg1 = document.getElementById("cfg1");
  let cfg2 = document.getElementById("cfg2");
  // Get references to elements in the DOM

  if (currentRegex == 2) {
    regexLabel.textContent = regex1; // Set regex text to regex1
    languageLabel.textContent = "[a,b]"; // Set language label to [a,b]
    currentRegex = 1; // Update currentRegex to 1
    regexDiagram1.classList.remove("d-none"); // Show regex diagram 1
    regexDiagram2.classList.add("d-none"); // Hide regex diagram 2
    pdaDiagram1.classList.remove("d-none"); // Show PDA diagram 1
    pdaDiagram2.classList.add("d-none"); // Hide PDA diagram 2
    cfg1.classList.remove("d-none"); // Show CFG 1
    cfg2.classList.add("d-none"); // Hide CFG 2
  } else {
    regexLabel.textContent = regex2; // Set regex text to regex2
    languageLabel.textContent = "[0,1]"; // Set language label to [0,1]
    currentRegex = 2; // Update currentRegex to 2
    regexDiagram1.classList.add("d-none"); // Hide regex diagram 1
    regexDiagram2.classList.remove("d-none"); // Show regex diagram 2
    pdaDiagram1.classList.add("d-none"); // Hide PDA diagram 1
    pdaDiagram2.classList.remove("d-none"); // Show PDA diagram 2
    cfg1.classList.add("d-none"); // Hide CFG 1
    cfg2.classList.remove("d-none"); // Show CFG 2
  }
}

var nodes = {
  1: {
    x0: {a: "x11", b: "x12"},
    x11: {a: "x9", b: "x10"},
    x12: {a: "x13", b: "x10"},
    x10: {a: "x3", b: "x15"},
    x9: {a: "x15", b: "x2"},
    x13: {a: "x15", b: "x14"},
    x14: {a: "x1", b: "x12"},
    x3: {a: "x15", b: "x1"},
    x2: {a: "x1", b: "x15"},
    x15: {a: "x15", b: "x15"},
    x1: {a: "x4", b: "x4"},
    x4: {a: "x5", b: "x7"},
    x7: {a: "x5", b: "x8"},
    x8: {a: "x5", b: "x8"},
    x5: {a: "x6", b: "x7"},
    x6: {a: "x6", b: "x7"},
  },
  2: {
    w0: {0: "w1", 1: "w8"},
    w1: {0: "w2", 1: "w8"},
    w8: {0: "w1", 1: "w2"},
    w2: {0: "w3", 1: "w3"},
    w3: {0: "w3", 1: "w4"},
    w4: {0: "w5", 1: "w7"},
    w7: {0: "w5", 1: "w6"},
    w6: {0: "w6", 1: "w6"},
    w5: {0: "w3", 1: "w6"},
  },
};
// Defines state transitions for both regex patterns

let input_display = document.getElementById("input-display");
let simulateBtn = document.getElementById("simulateBtn");
// Get references to input display and simulate button

async function simulate() {
  let input_string = document.getElementById("inputString").value;
  console.log(input_string);
  let nextNode, transition, currentNode = currentRegex == 1 ? "x0" : "w0";
  input_display.innerHTML = ""; // Clear display for new simulation

  // Create and display span elements for each character initially
  let spanElements = [];
  for (let i = 0; i < input_string.length; i++) {
      let spanElement = document.createElement("span");
      spanElement.textContent = input_string[i];
      input_display.appendChild(spanElement);
      spanElements.push(spanElement);
  }

  // Process each character
  for (let i = 0; i < input_string.length; i++) {
      let char = input_string[i];
      let spanElement = spanElements[i];

      // Check if the character is valid
      if ((currentRegex == 1 && !['a', 'b'].includes(char)) ||
          (currentRegex == 2 && !['0', '1'].includes(char))) {
          spanElement.classList.add("invalid");
          continue; // Skip the animation for invalid characters
      }

      nextNode = nodes[currentRegex][currentNode][char];
      if (!nextNode) {
          spanElement.classList.add("invalid");
          continue; // Skip the animation for invalid transitions
      }

      // Valid input handling
      transition = `${currentNode}${nextNode}`;
      let circleElement = document.getElementById(nextNode);
      let transitionElement = document.getElementById(transition);

      // Highlight current node and transition
      if (circleElement) circleElement.classList.add("hovered");
      if (transitionElement) transitionElement.classList.add("transition");

      spanElement.classList.add("valid"); // Highlight the valid character

      await sleep(1000); // Visual delay to observe the transition

      if (circleElement) circleElement.classList.remove("hovered");
      if (transitionElement) transitionElement.classList.remove("transition");

      currentNode = nextNode; // Move to the next node
      await sleep(500); // Short delay before the next character
  }
}

function validate() {
  let input_string = document.getElementById("inputString").value;
  console.log("Validating input:", input_string);
  let nextNode, currentNode = currentRegex == 1 ? "x0" : "w0";
  let validInput = true; // Assume input is valid unless proven otherwise

  // Clear previous outputs and set up the input display
  input_display.innerHTML = '';
  input_display.classList.remove("red", "blue");

  // Display each character of the input string
  for (let i = 0; i < input_string.length; i++) {
      let char = input_string[i];
      let spanElement = document.createElement("span");
      spanElement.textContent = char;
      input_display.appendChild(spanElement);

      // Check if the character is valid for the current regex
      if ((currentRegex == 1 && !['a', 'b'].includes(char)) ||
          (currentRegex == 2 && !['0', '1'].includes(char))) {
          console.log("Invalid character detected:", char);
          validInput = false; // Mark as invalid on first invalid character
          break;
      }

      nextNode = nodes[currentRegex][currentNode][char];
      if (!nextNode) {
          console.log("No valid transition for this character:", char);
          validInput = false; // Mark as invalid on first invalid transition
          break;
      }

      currentNode = nextNode; // Update current node to the next node
  }

  // Determine if the final node is a valid end state
  let validEndState = (currentRegex == 1 && ["x8", "x6"].includes(currentNode)) ||
                      (currentRegex == 2 && currentNode === "w6");

  if (!validInput || !validEndState) {
      console.log("Input validation failed");
      input_display.classList.add("red");
      simulateBtn.disabled = false; // Allow simulation of invalid input for visualization
  } else {
      console.log("Input is valid");
      input_display.classList.add("blue");
      simulateBtn.disabled = false; // Ensure simulation can proceed
  }
}

window.onload = function () {
  simulateBtn.disabled = true; // Disable simulate button on initial load
};

function clearInput() {
  document.getElementById("inputString").value = ""; // Clear the input field
  input_display.classList.remove("blue");
  input_display.classList.remove("red");
  input_display.innerHTML = ""; // Clear the input display
  simulateBtn.disabled = true; // Disable simulate button
}

function sleep(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds); // 1000 milliseconds = 1 second
  });
}
