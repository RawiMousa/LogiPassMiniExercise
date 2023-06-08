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

    // Creating a form element
    const form = document.createElement('form');
  
    // Creating labels for the fields
    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Title: ';

    // Creating input elements for the editable fields
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.value = book.title;
    titleInput.name = 'title';

    // Creating error elements for the suitable fields (if any errors occur)
    const titleError = document.createElement('div');
    titleError.classList.add('error-message', 'title-error'); // Added 'title-error' class
  
    const isbnLabel = document.createElement('label');
    isbnLabel.textContent = 'ISBN: ';
    const isbnInput = document.createElement('input');
    isbnInput.type = 'text';
    isbnInput.value = book.isbn;
    isbnInput.name = 'isbn';
  
    const isbnError = document.createElement('div');
    isbnError.classList.add('error-message', 'isbn-error'); // Added 'isbn-error' class
  
    const yearLabel = document.createElement('label');
    yearLabel.textContent = 'Publication Year: ';
    const yearInput = document.createElement('input');
    yearInput.type = 'text';
    yearInput.value = book.year;
    yearInput.name = 'year';
  
    const yearError = document.createElement('div');
    yearError.classList.add('error-message', 'year-error'); // Added 'year-error' class
  
    const submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = 'Save';
  
    // Appending the input,label ,error elements and submit button to the form
    form.appendChild(titleLabel);
    form.appendChild(titleInput);
    form.appendChild(titleError);
    form.appendChild(document.createElement('br'));
  
    form.appendChild(isbnLabel);
    form.appendChild(isbnInput);
    form.appendChild(isbnError);
    form.appendChild(document.createElement('br'));
  
    form.appendChild(yearLabel);
    form.appendChild(yearInput);
    form.appendChild(yearError);
    form.appendChild(document.createElement('br'));
  
    form.appendChild(submitButton);
  
    // Adding an event listener to the form's submit event
    form.addEventListener('submit', (event) => {
      event.preventDefault();       // Preventing form submission
      const formData = new FormData(form);
      const editedBook = Object.fromEntries(formData.entries());

    // Calling the function to handle form submission and update book details
      handleFormSubmit(book, editedBook, form); 
    });

    // Clearing the form
    const editFormContainer = document.getElementById('editFormContainer');
    editFormContainer.innerHTML = '';
    editFormContainer.appendChild(form);
}
  

// This function performs the PUT request/method , to update the selected book
function handleFormSubmit(book, editedBook, form) {
    // Declaring the Error variable 
    const titleError = form.querySelector('.title-error');
    const isbnError = form.querySelector('.isbn-error');
    const yearError = form.querySelector('.year-error');

  
    const updatedBook = {
      id: book.id,
      ...editedBook,
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
          // Displaying success message
          const successMsgElement = document.getElementById('successMsg');
          if (successMsgElement) {
            successMsgElement.textContent = 'Book updated successfully!';
            successMsgElement.style.display = 'block';
            // Hiding the success message after 3 seconds
            setTimeout(() => {
              successMsgElement.style.display = 'none';
            }, 2000);
          }
  
          // Reloading the book details to reflect the changes
          fetch(`/api/books/${book.id}`)
            .then(response => response.json())
            .then(book => {
              clearBookDetails();
              displayBookDetails(book);
              // Reseting the error variables when a updating is successfull
              titleError.textContent = '';
              isbnError.textContent = '';
              yearError.textContent = '';
            })
            .catch(error => console.log(error));
        } else if (response.status === 400) {
          // Error updating the book
          response.json().then(data => {
            // The data that returns from the server when the status is 400, is a string which describes the field and the problem
              if (data[""]) {
                const errorMessage = data[""][0];
                // Setting the proper error message
                if (errorMessage.includes("Title")) {
                    titleError.textContent = errorMessage;
                }
                if (errorMessage.includes("ISBN")) {
                    isbnError.textContent = errorMessage;
                }
                if (errorMessage.includes("Year")) {
                    yearError.textContent = errorMessage;
                }
            }
            // }
          });
        } else {
          console.log('Error updating book:', response.status);
        }
      })
      .catch(error => console.log(error));
}


function AddANewBook() {
    
}




