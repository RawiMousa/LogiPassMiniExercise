// This function retrieves all books in the database
function loadBooks() {
    const bookDropdown = document.getElementById('bookDropdown');
    
    if (bookDropdown.style.display === 'none') {
        fetch('/api/books')
            .then(response => response.json())
            .then(data => {
                bookDropdown.innerHTML = ''; // Clear existing options
                
                // Adding the default option as the first option
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Select a book';
                bookDropdown.appendChild(defaultOption);
                
                data.forEach(book => {
                    const option = document.createElement('option');
                    option.value = book.id;
                    option.textContent = book.title;
                    bookDropdown.appendChild(option);
                });
                
                bookDropdown.style.display = 'block'; // Show the dropdown
            })
            .catch(error => console.log(error));
    } else {
        bookDropdown.style.display = 'none'; // Hide the dropdown if already visible
    }
    // This event listener , acts upon selecting a specific book, and fetches the book using the ID and displays it using the displayBookDetails
    // When selecting another book , or returning the selection to 'Select a book' , the clearBookDetails method is executed
    bookDropdown.addEventListener('change', function() {
        const selectedBookId = this.value;
        if (selectedBookId) {
            fetch(`/api/books/${selectedBookId}`)
                .then(response => response.json())
                .then(book => {
                    clearBookDetails();
                    displayBookDetails(book);
                    clearBookEditingContainer(editFormContainer);
                })
                .catch(error => console.log(error));
        } else {
            clearBookDetails();
            clearBookEditingContainer(editFormContainer); // Clear the book editing container

        }
    });
}


// This function clears the container contents (the selected book edit details) when switching between books
function clearBookEditingContainer(container) {
    container.innerHTML = ''; // Clear the container contents
}


// This function clears the book details container (the display)
function clearBookDetails() {
    const bookDetailsContainer = document.getElementById('bookDetails');
    bookDetailsContainer.innerHTML = ''; // Clear the book details container
}





// This function displays a specific book detail upon selecting
function displayBookDetails(book) {
    const bookDetailsContainer = document.getElementById('bookDetails');
    
    const titleElement = document.createElement('p');
    titleElement.textContent = book.title;
    
    const isbnElement = document.createElement('p');
    isbnElement.textContent = 'ISBN: ' + book.isbn;
    
    fetch('/api/authors/' + book.authorId)
    .then(response => response.json())
    .then(author => {
        const authorElement = document.createElement('p');
        authorElement.textContent = 'Author: ' + author.name;

        // Clearing the book details container
        bookDetailsContainer.innerHTML = '';
        // Appending book details elements to the container
        bookDetailsContainer.appendChild(titleElement);
        bookDetailsContainer.appendChild(isbnElement);
        bookDetailsContainer.appendChild(authorElement);
        bookDetailsContainer.appendChild(yearElement);
        bookDetailsContainer.appendChild(editButton);
    })
    .catch(error => console.log(error));
    
    const yearElement = document.createElement('p');
    yearElement.textContent = 'Publication Year: ' + book.year;

    // Upon clicking the edit button , it will call the handleEditButtonClick , which will allow to edit the selected book
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit book';
    editButton.id = 'EditButton';
    editButton.addEventListener('click', () => {
        // Call the function to handle the edit button click
        handleEditButtonClick(book);
    });
    
}




// This function displays/creates the form with the current data of a specific book ,and allows us to edit the info.
function handleEditButtonClick(book) {
    // Create a form element
    const form = document.createElement('form');

    // Create labels for the fields
    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Title: ';
    const isbnLabel = document.createElement('label');
    isbnLabel.textContent = 'ISBN: ';
    const yearLabel = document.createElement('label');
    yearLabel.textContent = 'Publication Year: ';

    // Create input elements for the editable fields
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.value = book.title;
    
    const isbnInput = document.createElement('input');
    isbnInput.type = 'text';
    isbnInput.value = book.isbn;
    
    const yearInput = document.createElement('input');
    yearInput.type = 'text';
    yearInput.value = book.year;

    // Create a submit button for the form
    const submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = 'Save';

    // Append the input elements and submit button to the form
    // Append the labels and input elements to the form
    form.appendChild(titleLabel);
    form.appendChild(titleInput);
    form.appendChild(document.createElement('br')); // Add line break for spacing
    form.appendChild(isbnLabel);
    form.appendChild(isbnInput);
    form.appendChild(document.createElement('br'));
    form.appendChild(yearLabel);
    form.appendChild(yearInput);
    form.appendChild(document.createElement('br'));
    form.appendChild(submitButton);

    // Add an event listener to the form's submit event
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form submission
        
        // Call the function to handle form submission and update book details
        handleFormSubmit(book, titleInput.value, isbnInput.value, yearInput.value);
    });

    // Clear the edit form container and append the form
    const editFormContainer = document.getElementById('editFormContainer');
    editFormContainer.innerHTML = '';
    editFormContainer.appendChild(form);
}



// This function performs the PUT request/method , to update the selected book

function handleFormSubmit(book, title, isbn, year) {
    // const successMsg = 'Book updated successfully';
    const updatedBook = {
        id: book.id,
        title: title,
        isbn: isbn,
        year: year,
        authorId: book.authorId
    };

    fetch(`/api/books/${book.id}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedBook)
    })
        .then(response => {
        if (response.ok || response.status === 204) {
            // Book updated successfully
            // Display success message
            const successMsgElement = document.getElementById('successMsg');
            if (successMsgElement) {
              successMsgElement.textContent = 'Book updated successfully';
              successMsgElement.style.display = 'block';
              successMsgElement.textContent = 'Book updated successfully';
              // Hide the success message after 3 seconds
              setTimeout(() => {
                successMsgElement.style.display = 'none';
              }, 3000);}

            // Reload the book details to reflect the changes
            fetch(`/api/books/${book.id}`)
            .then(response => response.json())
            .then(book => {
                clearBookDetails();
                displayBookDetails(book);
            })
            .catch(error => console.log(error));
        } else {
            // Error updating the book
            console.log('Error updating book:', response.status);
        }
        })
        .catch(error => console.log(error));
}










