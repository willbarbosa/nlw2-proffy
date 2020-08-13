// Search for the button
document.querySelector('#add-time')
// When you click the button
.addEventListener('click', cloneField)

// Run an action
function cloneField() {
    // Duplicate fields
    const newFieldContainer = document.querySelector('.schedule-item').cloneNode(true)

    // Clear fields
    const fields = newFieldContainer.querySelectorAll('input')
    
    // For each field, clear
    fields.forEach(function (field) {
        // Take the field at the moment and clean it
        field.value = ""
    })

    // Place on page
    document.querySelector('#schedule-items').appendChild(newFieldContainer)
}