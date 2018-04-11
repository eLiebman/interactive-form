// Cursor starts in the 'name' field
$('#name').focus();


/*--------------------------
-- Show and Hide Elements --
--------------------------*/

const hide = ($element) => {
  $element.addClass('is-hidden');
  return $element;
}
const show = ($element) => {
  $element.removeClass('is-hidden');
  return $element;
}

// Hide Elements
hide($('#other'));
hide($('#colors-js-puns'));
hide($('.paypal'));
hide($('.bitcoin'));

// Show 'Other' Field
$('#title').on('change', function() {
  if ($('#title').val() === 'other') {
    show($('#other')).focus();
  } else {
    hide($('#other')).val('');
  }
});

// Set contents of color select Menu
const setColors = (colors) => {
  $('#color').html(colors);
};
// Available Colors
const shirtColors = {
  'js puns':`
    <option value="cornflowerblue">Cornflower Blue</option>
    <option value="darkslategrey">Dark Slate Grey</option>
    <option value="gold">Gold</option>
  `,
  'heart js':`
    <option value="tomato">Tomato</option>
    <option value="steelblue">Steel Blue</option>
    <option value="dimgrey">Dim Grey</option>
  `
};
// When design is chosen, show appropriate colors
$('#design').on('change', function() {
  const colorsToShow = $('#design').val();
  const colorMenu = $('#colors-js-puns');
  if (colorsToShow === 'Select Theme') {
    hide(colorMenu);
  } else {
  setColors(shirtColors[colorsToShow]);
  show(colorMenu);
  }
});

// When User Selects Payment
$('#payment').on('change', function() {
// Hide All
  hide($('#credit-card'));
  hide($('.paypal'));
  hide($('.bitcoin'));
// Show Selected Payment Method Info
  const payMethod = $('#payment').val();
  if (payMethod === 'credit card') {
    show($('#credit-card'));
  } else if (payMethod === 'paypal') {
    show($('.paypal'));
  } else if (payMethod === 'bitcoin') {
    show($('.bitcoin'));
  }
});


/*---------------------------
-- Conflict Management and---
-- Workshop 'Total' ---------
----------------------------*/

// Disable Checkbox
const disable = ($element) => {
  $element.attr('disabled', true);
  $element.parent().addClass('disabled');
};
// Enable Checkbox
const enable = ($element) => {
  $element.attr('disabled', false);
  $element.parent().removeClass('disabled');
};
// Get jQuery object for workshop using input name
const workshop = (name) => {
  return $(`label input[name="${name}"]`);
};

// Disable conflicts when workshop is selected
// Re-enable when deselected
const timeConflict = ($element, $element2) => {
  $element.on('change', function() {
    if(this.checked){
      disable($element2);
    } else {
      enable($element2);
    }
  });
  $element2.on('change', function() {
    if(this.checked){
      disable($element);
    } else {
      enable($element);
    }
  });
}

timeConflict(workshop("js-frameworks"), workshop("express"));
timeConflict(workshop("js-libs"), workshop("node"));

// Show Total Cost
const workshops = $('input[type="checkbox"]');
// When User Selects Workshop
workshops.on('change', function(e) {
// Remove Warnings
  $('.activities').removeClass('error');
  $('.warning:contains(workshop)').remove();
// Remove Total
  $('#total').remove();
// Calculate Total
  let additionalCost = 200;
  let total = 0;
  workshops.each(function() {
    if(this.checked) {
      total += additionalCost;
    }
    additionalCost = 100;
  });
// Show Total
  if (total !== 0){
    const totalBanner = $(`<span id="total">Total: $${total}</span>`);
    $('.activities').append(totalBanner);
  }
});


/* -----------------------
-- Validation Functions --
------------------------*/

const isBlank = (string) => {
  return string === undefined || string.replace(/\s/g, '') === '';
};

const isNumber = (string) => {
  const nonDigits = /[^0-9]+/g;
  return !nonDigits.test(string);
};

const validName = (name) => {
  const nonLetters = /[^a-z \.\'\-]+/gi;
  return !nonLetters.test(name);
};

const validEmail = (email) => {
  const valid = /[^.@]+@[^.@]+\.[^.@]+/;
  return valid.test(email);
};


/* -----------------------
-- Validation on Submit --
------------------------*/

// Warn prevents form submission,
// Adds a red border (class of 'error'),
// And appends a warning message to the element
const warn = (warning, $element, e) => {
  $element.addClass('error');
  $(`<span class="warning">${warning}</span>`).insertAfter($element);
  e.preventDefault();
};

// When User Submits Form
$('form').on('submit', function(e) {
// Reset Warnings/Errors
  $('.warning').remove();
  $('.earlyWarning').remove();
  $('input, fieldset').removeClass('error');

// Get Values
  const userName = $('#name').val();
  const email = $('#mail').val();

// Is Name Valid?
  if(isBlank(userName) || !validName(userName)) {
    warn('Enter a valid name', $('#name'), e);
  }
// Is Email Valid?
  if(!validEmail(email)) {
    warn('Enter a valid e-mail', $('#mail'), e);
  }
// Is Other Field Blank?
  if ($('#title').val() === 'other' && isBlank($('#other').val())) {
    warn('Enter your job title', $('#other'));
  }
// Did user select a shirt design?
  if ($('#design').val() === 'Select Theme') {
    warn('Select a t-shirt design', $('#design'), e);
  }
// Did the user select any workshops?
  const checkboxes = $('input:checked').length;
  if(!checkboxes) {
    warn('Select at least one workshop', $('.activities'), e);
  }

// If Credit Card is Selected
  if($('#payment').val() === 'credit card') {
    const ccnum = $('#cc-num').val();
    const zip = $('#zip').val();
    const cvv = $('#cvv').val();
// Test Number
    if (isBlank(ccnum)) {
      warn('Enter card number', $('#cc-num'), e);
    } else if (!isNumber(ccnum)) {
      warn('Not a valid number', $('#cc-num'), e);
    } else if (ccnum.length < 13 || ccnum.length > 16) {
      warn('Number must be 13-16 digits', $('#cc-num'), e);
    }
// Test Zip Code
    if (isBlank(zip)) {
      warn('Enter zip code', $('#zip'), e);
    } else if (!isNumber(zip)) {
      warn('Not a valid number', $('#zip'), e);
    } else if (zip.length !== 5) {
      warn('Zip must be 5 digits', $('#zip'), e);
    }
// Test CVV
    if (isBlank(cvv)) {
      warn('Enter CVV number', $('#cvv'), e);
    } else if (!isNumber(cvv)) {
      warn('Not a valid number', $('#cvv'), e);
    } else if (cvv.length !== 3) {
      warn('CVV must be 3 digits', $('#cvv'), e);
    }
  }
});


/*------------------------
-- Warning Functions for -
-- Realtime Validation ---
------------------------*/

// Early Warning doesn't turn red
// until the page is submitted.
// This offers guidance without being too aggressive.
// If submit errors are present and a realtime error occurs,
// then the border and warning will be red.

const earlyWarning = (warning, element) => {
  if ($('.error').length) {
    $(`<span class="warning">${warning}</span>`).insertAfter(element);
  } else {
    $(`<span class="earlyWarning">${warning}</span>`).insertAfter(element);
  }
};

const removeWarningLabel = (element) => {
  $(element).next('.warning').remove();
  $(element).next('.earlyWarning').remove();
};

const replaceWarning = (warning, element) => {
  removeWarningLabel(element);
  earlyWarning(warning, element);
  if($('.error').length) {
    $(element).addClass('error');
  }
}

const clearWarning = (element) => {
  removeWarningLabel($(element));
  $(element).removeClass('error');
};


/*------------------------
-- Realtime Validation ---
------------------------*/

// Validate Name
$('#name').on('keyup', function () {
  const userName = $('#name').val();
  if(isBlank(userName)) {
    return;
  } else if (!validName(userName)){
    replaceWarning('Enter a valid name', this);
  } else {
    clearWarning(this);
  }
});

// Clear Submit Warnings with Valid E-mail
$('#mail').on('keyup', function () {
  const email = $(this).val();
  if(validEmail(email)) {
    clearWarning(this);
  }
});
// Clear Submit Warnings for Job Title
$('#other').on('keyup', function () {
  const title = $(this).val();
  if (!isBlank(title)) {
    clearWarning(this);
  }
});
$('#title').on('change', function() {
  if ($(this).val() !== 'other') {
    clearWarning($('#other'));
  }
});
// Clear Submit Warnings with T-Shirt selection
$('#design').on('change', function() {
  if($(this).val() !== 'Select Theme') {
    clearWarning(this);
  }
});

// Validate Credit Card Number
$('#cc-num').on('keyup', function () {
  validateNumber($('#cc-num'), 'Number', '13-16', (val) => {
    return 13 <= val.length && val.length <= 16;
  });
});
// Validate Zip
$('#zip').on('keyup', function () {
  validateNumber($('#zip'), 'Zip', '5', (val) => {
    return val.length === 5;
  });
});
// Validate CVV
$('#cvv').on('keyup', function() {
  validateNumber($('#cvv'), 'CVV', '3', (val) => {
    return val.length === 3;
  });
});

// Validation Function
// Takes jQuery object for the field,
// Name of field (for error message)
// Valid digits (for error message)
// And a function to test number of digits

function validateNumber(element, name, display, test) {
  const value = $(element).val();
  if (isBlank(value)) {
    return;
  } else if (!isNumber(value)) {
    replaceWarning('Not a valid number', element);
  } else if ( !test(value) ) {
    replaceWarning(`${name} must be ${display} digits`, element);
  } else {
    clearWarning(element);
  }
};
