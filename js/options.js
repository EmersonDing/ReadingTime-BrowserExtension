"use strict";
var saveBtn = document.getElementById('userSettings-list_save');
var resetBtn = document.getElementById('userSettings-list_reset');
var wpmValue = document.getElementById('userSettings-list_value_wpm');
var cjkValue = document.getElementById('userSettings-list_value_cjk');
var colorValue = document.getElementById('userSettings-list_value_color');
var notifyMsg = document.getElementById('userSettings-list_notify');
var defaultWpm = 275, defaultCjk = 500, defaultColor = "#000000";

//Adding event listener to buttons as Chrome does not allow HTML onclick events
saveBtn.addEventListener('click', function() {
  validateInput(wpmValue.value, cjkValue.value, colorValue.value);
});

//Adding event listener to buttons as Chrome does not allow HTML onclick events
resetBtn.addEventListener('click', function() {
  wpmValue.value = defaultWpm;
  cjkValue.value = defaultCjk;
  colorValue.value = defaultColor;

  storeValues(defaultWpm, defaultCjk, defaultColor);
  notifyMessage("success-reset");
});

//Check storage for current color and reading speed values
chrome.storage.local.get(null, function (result) {
  if (result.readingSpeed !== undefined) {
    wpmValue.value = result.readingSpeed;
  }
  else {
    wpmValue.value = defaultWpm;
  }
  if (result.cjkReadingSpeed !== undefined) {
    cjkValue.value = result.cjkReadingSpeed;
  }
  else {
    cjkValue.value = defaultCjk;
  }
  if (result.iconColor !== undefined) {
    colorValue.value = result.iconColor;
  }
  else {
    colorValue.value = defaultColor;
  }
});

//Check input matches regex before using it
function validateInput(wpm, cjk, color) {
  var colorRegex = /^#([0-9a-f]{6}|[0-9a-f]{3})$/i;
  var numRegex = /^\d+$/;

  if (wpm === '' || cjk === '' || color === '') {
    notifyMessage("error-reset");
    return;
  }

  if ( numRegex.test(wpm) && numRegex.test(cjk) && colorRegex.test(color) ) {
    storeValues(wpm, cjk, color);
    notifyMessage("success-save");
  }
  else {
    notifyMessage("error-format");
  }
}

//Save values to storage
function storeValues(wpm, cjk, color) {
  chrome.storage.local.set({'readingSpeed': wpm});
  chrome.storage.local.set({'cjkReadingSpeed': cjk});
  chrome.storage.local.set({'iconColor': color});
}

//Generate response message
function notifyMessage(status) {
  if (status === "success-reset") {
    notifyMsg.innerHTML = "Success! Your values have been reset to default and saved.";
    notifyMsg.style.color = "green";
  }
  else if (status === "success-save") {
    notifyMsg.innerHTML = "Success! Your new values have been saved.";
    notifyMsg.style.color = "green";
  }
  else if (status === "error-format") {
    notifyMsg.innerHTML = 'Error: Incorrect format, please check your values.';
    notifyMsg.style.color = "red";
  }
  else if (status === "error-reset") {
    notifyMsg.innerHTML = 'Error: Please ensure all fields have a value.';
    notifyMsg.style.color = "red";
  }
  else {
    notifyMsg.innerHTML = 'Unknown response.';
  }
}
