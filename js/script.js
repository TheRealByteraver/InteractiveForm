const nameInput = document.querySelector('#name');
const otherJobRoleInput = document.querySelector('#other-job-role');
const userTitleSelect = document.querySelector('#title');
const colorSelect = document.querySelector('#color');
const designSelect = document.querySelector('#design');

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

    The function removeColorAvailabilityInfo removes the extra 
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

// select the fieldset containing all the activity checkboxes
const activitiesBox = document.querySelector('#activities');

activitiesBox.addEventListener('change', (event) => {
    if(event.target.tagName='input') {
        let totalCost = 0;
        const inputs = activitiesBox.querySelectorAll('input');
        for(let i = 0; i < inputs.length; i++) {
            if(inputs[i].checked) {
                totalCost += parseInt(inputs[i].dataset.cost);
            }
        }
        const activitiesCost = activitiesBox.querySelector('#activities-cost');
        activitiesCost.innerText = `Total: $${totalCost}`;
    }
});





