const nameInput = document.getElementById('name');
const otherJobRoleInput = document.getElementById('other-job-role');
const userTitleSelect = document.getElementById('title');
const colorSelect = document.getElementById('color');
const designSelect = document.getElementById('design');
const paymentSelect = document.getElementById('payment');

// start by giving focus to the first (top left) input on the form
nameInput.focus();

// hide the "Other Job Role" input till its needed
otherJobRoleInput.style.visibility = 'hidden';

/* 
    The following event listener checks if the 'Other' Job Role was selected
    among the available Job Roles. If so, it makes the 'otherJobRoleInput'
    element visible again. If not, it hides it again
*/
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

/* 
    These are the innerText values of the color <option> elements:

    Cornflower Blue (JS Puns shirt only)
    Dark Slate Grey (JS Puns shirt only)
    Gold            (JS Puns shirt only)
    Tomato          (I love JS shirt only)
    Steel Blue      (I love JS shirt only)
    Dim Grey        (I love JS shirt only)

    The function removeColorAvailabilityInfo strips the extra 
    availability information such as '(JS Puns shirt only)' and
    leaves only the color itself (e.g. 'Cornflower Blue').
*/
const removeColorAvailabilityInfo = () => {

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
const activitiesBox = document.getElementById('activities');

// This function calculates the total cost based on the checked courses
function getTotalCost() {
    let totalCost = 0;
    const inputs = activitiesBox.querySelectorAll('input');
    for(let i = 0; i < inputs.length; i++) {
        if(inputs[i].checked) {
            totalCost += parseInt(inputs[i].dataset.cost);
        }
    }
    return totalCost;
}

// The following event listener recalculates and displays the total cost each
// time a checkbox is checked or unchecked
activitiesBox.addEventListener('change', (event) => {    
    if(event.target.tagName === 'INPUT') {
        let totalCost = getTotalCost();
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
const form = document.querySelector('form');

// The form submit event listener does a full validation of the input fields
// and prevents submission if some information is wrong or missing
form.addEventListener('submit', (event) => { // correct event == submit !!! DEBUG!!

    /*
      **Note**: these little helper functions check if the information was
      entered correctly in the form input fields. They return true on success
      or false if there is missing/ wrong information
    */

    // A name should at least contain two characters, excluding spaces
    function isValidName() {
        const name = document.getElementById('name').value;
        return (name.trim().length >= 2);
    }
    // Only addresses with a .com top level domain are accepted (as instructed)
    // The following email addresses will be considered valid by this function:
    // steve.clarke.2@gmail.com, john@team.treehouse.com, peter@a.com
    function isValidEmail() {
        const email = document.getElementById('email').value;
        return /^(\w+\.?){1,3}@(\w+\.?){1,3}\.com$/.test(email);
    }

    // The "Register for Activities" section must have at least one 
    // activity selected. This means the total cost can't be zero
    function AreActivitiesSelected() {
        return getTotalCost() > 0;
    }

   // The isValidCreditCard function checks if all the credit card information
   // was entered correctly
    function isValidCreditCard() {
        // // check credit card expiration month - not required
        // const ccMonthSelect = document.getElementById('exp-month');
        // const selectedMonthIndex = ccMonthSelect.selectedIndex;
        // const ccMonth = ccMonthSelect.children[selectedMonthIndex].value;
        // const isValidccMonth = !isNaN(ccMonth);

        // // check credit card expiration year - not required
        // const ccYearSelect = document.getElementById('exp-year');
        // const selectedYearIndex = ccYearSelect.selectedIndex;
        // const ccYear = ccYearSelect.children[selectedYearIndex].value;
        // const isValidccYear = !isNaN(ccYear);

        return (
        // isValidccMonth &&
        // isValidccYear &&

        // a creditcard nr should be between 13 and 16 characters long    
        /^\d{13,16}$/.test(document.getElementById('cc-num').value) &&

        // a zip code should be 5 digits long
        /^\d{5}$/.test(document.getElementById('zip').value) &&

        // a creditcard cvv code should be 3 digits long
        /^\d{3}$/.test(document.getElementById('cvv').value) 
        );
    }

    // console.log('--------------------------------------------------');
    // console.log('isValidName: ' + isValidName());
    // console.log('isValidEmail: ' + isValidEmail());
    // console.log('AreActivitiesSelected: ' + AreActivitiesSelected());

    let isReadyForSubmission = 
        isValidName() &&
        isValidEmail() &&
        AreActivitiesSelected();

    if(getPaymentMethodId() === 'credit-card') {
        console.log('The credit card payment option was selected');
        isReadyForSubmission = isReadyForSubmission && isValidCreditCard();
    } else {
        console.log('The credit card payment option was NOT selected');
    }
    console.log('isReadyForSubmission = ' + isReadyForSubmission);

    // The user did not enter all information correctly, prevent submission
    if(!isReadyForSubmission) {
        event.preventDefault();
    }

    /*
    Note:
        Only validate the three credit card fields if "credit card" is the 
        selected payment option.
        Only call `preventDefault` on the `event` object if one or more of
        the required fields is invalid.
    */
});

