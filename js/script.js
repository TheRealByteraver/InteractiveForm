// As a naming convention for variables holding DOM elements we use
// id or classname followed by html tag, all in camelCase

const form = document.querySelector('form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const otherJobRoleInput = document.getElementById('other-job-role');
const titleSelect = document.getElementById('title');
const colorSelect = document.getElementById('color');
const designSelect = document.getElementById('design');
const activitiesFieldset = document.getElementById('activities');
const paymentSelect = document.getElementById('payment');
const ccNumInput = document.getElementById('cc-num');
const zipInput = document.getElementById('zip');
const cvvInput = document.getElementById('cvv');

// step 3
// start by giving focus to the first (top left) input on the form
nameInput.focus();

// step 4
// hide the "Other Job Role" input field till its needed
otherJobRoleInput.style.visibility = 'hidden';

// The following event listener checks if the 'Other' Job Role was selected
// among the available Job Roles. If so, it makes the 'otherJobRoleInput'
// element visible again. If not, it hides it again
titleSelect.addEventListener('change', (event) => {
    if(event.target.value === 'other') {
        otherJobRoleInput.style.visibility = '';
    }
    else {
        otherJobRoleInput.style.visibility = 'hidden';
    }
});

// step 5
// Initially disable the color select element
colorSelect.setAttribute('disabled', true);

// The function removeColorAvailabilityInfo strips the extra availability 
// information such as '(JS Puns shirt only)' and leaves only the color itself
// (e.g. 'Cornflower Blue'). After all the availability information is only 
// useful if javascript is not available.
function removeColorAvailabilityInfo() {

    // isolate the color from the string in $1
    const regex = /((\w+ ){1,})\s*(\(.*?\))/

    // get a list of all the color <option> elements
    const colorOptions = colorSelect.querySelectorAll('option');

    // update the text of the color options:
    for(let i = 0; i < colorOptions.length; i++) {

        // skip the 'Select a design theme above' option
        if(colorOptions[i].dataset.theme) { 
            colorOptions[i].innerText = 
                colorOptions[i].innerText.replace(regex, '$1');               
        }
    }
}
// run the function once at script startup
removeColorAvailabilityInfo();

// The designSelect addEventListener will hide/ show the correct colors 
// that are available for the choosen shirt type, and select the first
// available color automatically
designSelect.addEventListener('change', (event) => {

    // get a list of all the color <option> elements
    const colorOptions = colorSelect.querySelectorAll('option');

    // only add the 'selected' attribute to one available color
    let selected = false;

    // show the ones that correspond to the user-choosen theme
    for(let i = 0; i < colorOptions.length; i++) {
        if(colorOptions[i].dataset.theme === event.target.value) {
            colorOptions[i].removeAttribute('hidden');
            if(!selected) {
                selected = true;
                colorOptions[i].setAttribute('selected', true);
            }
        } else {
            colorOptions[i].removeAttribute('selected');
            colorOptions[i].setAttribute('hidden', true);
        }            
    }    
    // make the updated color selection section available again
    colorSelect.removeAttribute('disabled');
});

// step 6
// This function calculates the total cost based on the checked courses
function getTotalCost() {
    let totalCost = 0;
    const inputs = activitiesFieldset.querySelectorAll('input');
    for(let i = 0; i < inputs.length; i++) {
        if(inputs[i].checked) {
            totalCost += parseInt(inputs[i].dataset.cost);
        }
    }
    return totalCost;
}

// The following event listener recalculates and displays the total cost each
// time a checkbox is checked or unchecked. 
// It also disables conflicting activities (for exceeds step 1)
activitiesFieldset.addEventListener('change', (event) => { 
    if(event.target.tagName === 'INPUT') {
        const selectedSpans = event.target.parentNode.querySelectorAll('span');
        const selectedActivity = selectedSpans[0].innerText;
        const selectedTime = selectedSpans[1].innerText;
        const inputs = activitiesFieldset.querySelectorAll('input');

        for(let i = 0; i < inputs.length; i++) {
            const spans = inputs[i].parentNode.querySelectorAll('span');
            const activity = spans[0].innerText;
            const time = spans[1].innerText;
            if((time === selectedTime) && (selectedActivity !== activity)) {

                // we found a potential conflict
                if(event.target.checked) {
                    inputs[i].removeAttribute('checked');
                    inputs[i].setAttribute('disabled', true);
                    inputs[i].parentElement.classList.add('disabled');
                } else {
                    inputs[i].removeAttribute('disabled');
                    inputs[i].parentElement.classList.remove('disabled');
                }
            } 
        }
        // (re)calculate the total cost and update the displayed value
        const totalCost = getTotalCost();
        const activitiesCost = document.getElementById('activities-cost');
        activitiesCost.innerText = `Total: $${totalCost}`;
    }
});

// step 7
// The array 'paymentOptions' holds a list of the payment options id's as 
// specified in the html. We use the fact that these exact values are also 
// present in the 'value' attribute of the <select> list with the payment 
// options.
// It is generated dynamically: this way the form should still work if the 
// webdesigner adds other payment methods in the index.html file later on.
function getPaymentIdsArray() {
    const paymentSelectOptions = paymentSelect.children;
    const paymentIds = [];
    // populate the paymentOptions list based on the <select> list in the html
    for(let i = 0; i < paymentSelectOptions.length; i++) {
        paymentIds.push(paymentSelectOptions[i].value);
    }
    return paymentIds;
};

// create the array with the payment methods id strings
const paymentOptions = getPaymentIdsArray();

// set the credit card option as the default
const creditCardOption = payment.querySelector('option[value="credit-card"]');
creditCardOption.setAttribute('selected', true);

// The function getPaymentMethodId() returns the id of the currently
// active payment method 
function getPaymentMethodId() {
    const index = document.getElementById('payment').selectedIndex;
    return paymentOptions[index];
}

// The function selectPaymentMethod hides all payment method input & info 
// fields except for the one currently active one
function selectPaymentMethod() {

    // hide all fields. We skip the first payment Option as it is not
    // a real payment option
    for( let i = 1; i < paymentOptions.length; i++ ) {
        document.getElementById(paymentOptions[i]).style.display = 'none';
    }
    // show selected field again
    document.getElementById(getPaymentMethodId()).style.display = '';   
}

// Listen for payment method changes
payment.addEventListener('change', (event) => {
    selectPaymentMethod(event.target.value);
});

// By default, we select the credit card payment method
selectPaymentMethod('credit-card');

// step 8
// ****************************************************************************
// **Note**: these little helper functions check if the information was
// entered correctly in the form input fields. They return true on success
// or false if there is missing/ wrong information

// A name should at least contain two characters, excluding spaces
function isValidName() {
    return /([a-z]){2,}/i.test(nameInput.value);
}
// Only addresses with a .com top level domain are accepted (as instructed)
// The following email addresses will be considered valid by this function:
// steve.clarke.2@gmail.com, john@team.treehouse.com, peter@a.com
function isValidEmail() {
    return /^(\w+\.?){1,3}@(\w+\.?){1,3}\.com$/.test(emailInput.value);
}
// The "Register for Activities" section must have at least one 
// activity selected. This means the total cost can't be zero
function AreActivitiesSelected() {
    return (getTotalCost() > 0);
}
// a creditcard nr should be between 13 and 16 characters long
function isValidccNum() {        
    return /^\d{13,16}$/.test(ccNumInput.value);
}
// a zip code should be 5 digits long
function isValidZip() {        
    return /^\d{5}$/.test(zipInput.value);
}
// a creditcard CVV code should be 3 digits long
function isValidCvv() {        
    return /^\d{3}$/.test(cvvInput.value);
}
// The "VisualHint" helper functions add or remove classes on the 
// ***parent element*** of the provided argument 'element'. 
// These css classes will make it obvious if the input provided by the 
// user was valid or not.
// The function "isVisualHintSet" will return true if any visual hint
// was provided previously.
function setIsValidVisualHint(element) {
    const e = element.parentNode;
    e.classList.add('valid');
    e.classList.remove('not-valid');
    e.lastElementChild.style.display = '';
}
function setIsNotValidVisualHint(element) {
    const e = element.parentNode;
    e.classList.add('not-valid');
    e.classList.remove('valid');
    e.lastElementChild.style.display = 'inline';
}
function setVisualHint(element, isValid) {
    (isValid ? setIsValidVisualHint : setIsNotValidVisualHint)(element);
}
function isVisualHintSet(element) {
    const e = element.parentNode;
    return (
        e.classList.contains('not-valid') ||
        e.classList.contains('valid')
    );
}
// end of little helper functions :)
// ****************************************************************************

// The form submit event listener does a full validation of the input fields
// and prevents submission if some information is wrong or missing
form.addEventListener('submit', (event) => { 

    // Perform the checks and store the results in boolean variables
    // because we'll need those values twice
    const nameIsOk = isValidName();
    const emailIsOk = isValidEmail();
    const activitiesAreOk = AreActivitiesSelected();
    const creditCardNrIsOk = isValidccNum();
    const creditCardZipIsOk = isValidZip();
    const creditCardCVVIsOk = isValidCvv();    
    const paymentIsByCreditCard = (getPaymentMethodId() === 'credit-card');

    // Check if the user filled in all the mandatory fields correctly
    let isReadyForSubmission = nameIsOk && emailIsOk && activitiesAreOk;

    // perform extra credit card checks if that payment option was selected
    if(paymentIsByCreditCard) {
        isReadyForSubmission = (isReadyForSubmission && 
            creditCardNrIsOk && creditCardZipIsOk && creditCardCVVIsOk);
    } 

    // The user did not enter all information correctly, prevent submission
    if(!isReadyForSubmission) {

        // Add visual cues to help the user if any of the above are false
        setVisualHint(nameInput, nameIsOk);
        setVisualHint(emailInput, emailIsOk);

        // setVisualHint acts on the parent element, but we need to add a 
        // visual hint to the 'activitiesFieldset', hence we take 1st child
        setVisualHint(activitiesFieldset.firstElementChild, activitiesAreOk);
        if(paymentIsByCreditCard) {
            setVisualHint(ccNumInput, creditCardNrIsOk);
            setVisualHint(zipInput, creditCardZipIsOk);
            setVisualHint(cvvInput, creditCardCVVIsOk);
        }
        // prevent form submission, the user needs to correct things first
        event.preventDefault();
    }
});

// step 9
// The function addFocusBlurEventListeners adds focus and blur events to the 
// inputs inside the <fieldset> with the id 'activities'. We need to add the
// event listeners to each individual input element separately because the focus 
// and blur events do not bubble up to the parent elements.
function addFocusBlurEventListeners() {
    const activitiesBoxArray = document.getElementById('activities-box').children;
    for(let i = 0; i < activitiesBoxArray.length; i++) {
        const input = activitiesBoxArray[i].getElementsByTagName('input')[0];

        // add the focus event listener
        input.addEventListener('focus', (event) => {   
            const label = event.target.parentElement;
            label.className = 'focus';
        });

        // add the blur event listener
        input.addEventListener('blur', (event) => {   
            const label = event.target.parentElement;
            label.className = '';            
        });
    }
}
// call the above function once to add the event listeners
addFocusBlurEventListeners();

// Exceeds step 2
// In the updateVisualHint function, we visually confirm that the input 
// is valid while the user is typing. We do _not_ immediately announce
// that the user input is invalid while the user is still typing, as 
// that would be a bit obnoxious. 
// We DO however mark the input as invalid when the input field looses
// focus (and the input is invalid), unless the input field is empty,
// in which case we do nothing.
//
// The updateVisualHint helper function does what is described above and
// is the same for each event handler so we extract the logic in a separate
// function:
function updateVisualHint(element, isValidInput) {   
    if(isVisualHintSet(element)) {
        // we already set a visual hint previously, so now we can also
        // warn for invalid input, if the user changes previously valid 
        // input and the input becomes invalid for example
        setVisualHint(element, isValidInput);            
    } 
    else {
        // The user is still typing in the field for "the first time"
        // so we only affirm valid input as soon as the input is valid
        if(isValidInput) {
            setIsValidVisualHint(element);
        }
    }    
}
// This little helper function will return true if the user already started 
// typing characters into the field provided by the paramter. We do not add 
// warnings to empty fields, only to fields with invalid input.
function hasInputData(element) {
    return (element.value.length > 0);
}
// Both event handlers have the same logic for every input, so we make a 
// function that adds them for a given input element
function addInputEventhandlers(inputElement, validatorFunction) {

    // act on change of input
    inputElement.addEventListener('keyup', () => {
        updateVisualHint(inputElement, validatorFunction());
    });
    // act on loss of focus
    inputElement.addEventListener('blur', () => {
        if(isVisualHintSet(inputElement) || hasInputData(inputElement)) {
            setVisualHint(inputElement, validatorFunction());
        }
    });
}
// Add the event handlers to the applicable input fields
addInputEventhandlers(nameInput, isValidName);
addInputEventhandlers(emailInput, isValidEmail);
addInputEventhandlers(ccNumInput, isValidccNum);
addInputEventhandlers(zipInput, isValidZip);
addInputEventhandlers(cvvInput, isValidCvv);







