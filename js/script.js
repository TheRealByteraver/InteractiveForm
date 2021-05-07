const form = document.querySelector('form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const otherJobRoleInput = document.getElementById('other-job-role');
const userTitleSelect = document.getElementById('title');
const colorSelect = document.getElementById('color');
const designSelect = document.getElementById('design');
const paymentSelect = document.getElementById('payment');
const creditCardNumInput = document.getElementById('cc-num');
const creditCardZipInput = document.getElementById('zip');
const creditCardCVVInput = document.getElementById('cvv');

// start by giving focus to the first (top left) input on the form
nameInput.focus();

// hide the "Other Job Role" input field till its needed
otherJobRoleInput.style.visibility = 'hidden';

// The following event listener checks if the 'Other' Job Role was selected
// among the available Job Roles. If so, it makes the 'otherJobRoleInput'
// element visible again. If not, it hides it again
userTitleSelect.addEventListener('change', (event) => {
    if(event.target.value === 'other') {
        otherJobRoleInput.style.visibility = '';
        //otherJobRoleInput.focus(); // has no effect
    }
    else {
        otherJobRoleInput.style.visibility = 'hidden';
    }
});

// Initially disable the color select element
colorSelect.setAttribute('disabled', true);

// The function removeColorAvailabilityInfo strips the extra 
// availability information such as '(JS Puns shirt only)' and
// leaves only the color itself (e.g. 'Cornflower Blue').
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
// select the fieldset containing all the activity checkboxes
const activitiesFieldset = document.getElementById('activities');

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
// time a checkbox is checked or unchecked. It also disables conflicting
// activities
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
function getPaymentIdsArray() {
    const paymentSelectOptions = paymentSelect.children;
    const paymentIds = [];
    // populate the paymentOptions list based on the <select> list in the html
    for(let i = 0; i < paymentSelectOptions.length; i++) {
        paymentIds.push(paymentSelectOptions[i].value);
    }
    return paymentIds;
};
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
// fields except for the one that has an id provided by the argument
function selectPaymentMethod(paymentId) {
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
// The form submit event listener does a full validation of the input fields
// and prevents submission if some information is wrong or missing
form.addEventListener('submit', (event) => { 

    // **Note**: these little helper functions check if the information was
    // entered correctly in the form input fields. They return true on success
    // or false if there is missing/ wrong information

    // A name should at least contain two characters, excluding spaces
    function isValidName() {
        //const name = document.getElementById('name').value;
        return (nameInput.value.trim().length >= 2);
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
        return getTotalCost() > 0;
    }
    // a creditcard nr should be between 13 and 16 characters long
    function isValidCreditCardNr() {        
        return /^\d{13,16}$/.test(creditCardNumInput.value);
    }
    // a zip code should be 5 digits long
    function isValidCreditCardZip() {        
        return /^\d{5}$/.test(creditCardZipInput.value);
    }
    // a creditcard CVV code should be 3 digits long
    function isValidCreditCardCVV() {        
        return /^\d{3}$/.test(creditCardCVVInput.value);
    }

    // The setVisualHint helper function adds or removes classes on the
    // input elements that have (in)valid entries
    function setVisualHint(element, isValid) {
        element.classList.add((isValid ? '' : 'not-') + 'valid');
        element.classList.remove((isValid ? 'not-' : '') + 'valid');
        element.lastElementChild.style.display = (isValid ? '' : 'inline');
    }

    // Perform the checks and store the results
    const nameIsOk = isValidName();
    const emailIsOk = isValidEmail();
    const activitiesAreOk = AreActivitiesSelected();
    const creditCardNrIsOk = isValidCreditCardNr();
    const creditCardZipIsOk = isValidCreditCardZip();
    const creditCardCVVIsOk = isValidCreditCardCVV();    
    const paymentIsByCreditCard = (getPaymentMethodId() === 'credit-card');

    // console.log('nameIsOk = ' + isValidName());
    // console.log('emailIsOk = ' + isValidEmail());
    // console.log('activitiesAreOk = ' + AreActivitiesSelected());
    // console.log('creditCardNrIsOk = ' + isValidCreditCardNr());
    // console.log('creditCardZipIsOk = ' + isValidCreditCardZip());
    // console.log('creditCardCVVIsOk = ' + isValidCreditCardCVV());    
    // console.log('paymentIsByCreditCard = ' + (getPaymentMethodId() === 'credit-card'));

    // Check if the user filled in all the mandatory fields correctly
    let isReadyForSubmission = nameIsOk && emailIsOk && activitiesAreOk;

    // perform extra credit card check if that payment option was selected
    if(paymentIsByCreditCard) {
        isReadyForSubmission = (isReadyForSubmission && 
            creditCardNrIsOk && creditCardZipIsOk && creditCardCVVIsOk);
    } 

    // The user did not enter all information correctly, prevent submission
    if(!isReadyForSubmission) {

        // Add visual cues to help the user if any of the above are false
        setVisualHint(nameInput.parentNode, nameIsOk);
        setVisualHint(emailInput.parentNode, emailIsOk);
        setVisualHint(activitiesFieldset, activitiesAreOk);
        if(paymentIsByCreditCard) {
            setVisualHint(creditCardNumInput.parentNode, creditCardNrIsOk);
            setVisualHint(creditCardZipInput.parentNode, creditCardZipIsOk);
            setVisualHint(creditCardCVVInput.parentNode, creditCardCVVIsOk);
        }
        //console.log('preventdefault called');
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


