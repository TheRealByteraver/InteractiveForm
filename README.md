# Interactive Form project

This is an exercise in creating a fully interactive form, without compromising the functionality of the form in case javascript is not enabled in the browser.

# Technology stack

HTML / CSS / Javascript

# Exceeds requirements nr 2 description

For this exceeds requirement, we visually confirm that the input is valid while the user is typing _as soon as_ the entry is valid. We do _not_ immediately announce that the user input is invalid while the user is still typing, as that would be a bit obnoxious. We _do_ however mark the input as invalid when the input field looses focus, if the input is invalid of course. Also, if input that was previously marked as valid becomes invalid again because of changes made by the user, then the input will be marked as invalid immediately, and not only after the input looses focus.

I decided to do so as this seemed to be the 'friendliest' way of providing assistance to the user. This logic will _not_ mark the input as invalid if the user gives focus to an empty input, and then immediately changes focus to another input. E.g. when the form starts the 'name' input gets focus. If the user switches to the email field without entering a single character in the "name" field, then this action will _not_ trigger an "invalid input" warning on the "name" input field. I could possibly "fix" this by keeping track (for each input) whether it had focus since the form was loaded, but I decided I did enough ;)

# Exceeds requirements nr 3 description

The credit card number fields (credit card number, zip code, cvv code) have conditional error messages. They will show different error messages based on whether the number is too short or too long, or contains characters other than digits.
