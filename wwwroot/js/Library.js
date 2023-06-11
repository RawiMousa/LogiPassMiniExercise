// This function retrieves all books in the database
function loadBooks() {

    const bookDropdown = document.getElementById('bookDropdown');

    const addNewBookLink = document.getElementById('addNewBook');
    
    const authorDropdown = document.getElementById('authorDropdown');
    authorDropdown.style.display = 'none'; // Hiding the authorDropdown list

    const authorDetails = document.getElementById('authorDetails');
    authorDetails.style.display = 'none'; // Hiding the author details

    const editAuthorFormContainer = document.getElementById('editAuthorFormContainer');
    editAuthorFormContainer.style.display = 'none'; // Hiding the author edit form

    const addNewAuthorLink = document.getElementById('addNewAuthor');
    addNewAuthorLink.style.display = 'none'; // Hiding the 'add new author' link

    const homeIntro = document.getElementById('HomeIntro');
    homeIntro.style.display = 'none'; // Hiding the paragraph that appears in the Home tab

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
                
                bookDropdown.style.display = 'block'; // Showing the dropdown
                addNewBookLink.style.display = 'inline-block'; // Showing the "Add a new book" link
            })
            .catch(error => console.log(error));
    } 
    // This event listener , acts upon selecting a specific book, and fetches the book using the ID and displays it using the displayBookDetails
    // When selecting another book , or returning the selection to 'Select a book' , the clearBookDetails method is executed
    bookDropdown.addEventListener('change', function() {
        const selectedBookId = this.value;
        if (selectedBookId) {

            const bookDetails = document.getElementById('bookDetails');
            bookDetails.style.display = 'block';

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
            clearBookEditingContainer(editFormContainer); // Clearing the book editing container
        }
    });
    // Adding a click event listener to the "Add a new book" link
    addNewBookLink.addEventListener('click', handleAddNewBookClick);
}


// This assisting function makes the dropDown list of the books to disappear when clicking on add a new book in order to present the form
function handleAddNewBookClick() {
    const bookDropdown = document.getElementById('bookDropdown');
    bookDropdown.style.display = 'none'; // Hiding the dropdown
    AddNewBook();
    clearBookDetails();
}


// This function clears the container contents (the selected book edit details) when switching between books
function clearBookEditingContainer(container) {
    container.innerHTML = ''; // Clearing the container contents
}


// This function clears the book details container (the display)
function clearBookDetails() {
    const bookDetailsContainer = document.getElementById('bookDetails');
    bookDetailsContainer.innerHTML = ''; // Clearing the book details container
}


// This function displays a specific book detail upon selecting
function displayBookDetails(book) {

    const bookDetailsContainer = document.getElementById('bookDetails'); // Creating the variable which gets the html <div> 'bookDetails'
    
    const titleElement = document.createElement('p');  // Creating a <p> element for the title
    titleElement.textContent = book.title;
    
    const isbnElement = document.createElement('p');  // Creating a <p> element for the isbn
    isbnElement.textContent = 'ISBN: ' + book.isbn;
    
    fetch('/api/authors/' + book.authorId)   // Fetching the author from the database via authorId to display it in the book details
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
        bookDetailsContainer.appendChild(document.createElement('br'));
        bookDetailsContainer.appendChild(document.createElement('br'));
        bookDetailsContainer.appendChild(removeButton);
    })
    .catch(error => console.log(error));
    
    const yearElement = document.createElement('p');
    yearElement.textContent = 'Publication Year: ' + book.year;

    // Upon clicking the edit button , it will call the handleEditButtonClick , which will allow to edit the selected book
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit book';
    editButton.id = 'EditButton';
    editButton.addEventListener('click', () => {
        // Calling the function to handle the edit button click
        handleEditButtonClick(book);
    });

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove book';
    removeButton.id = 'RemoveButton';
    removeButton.addEventListener('click', () => {
        // Calling the function to handle remove button click
        handleRemoveButtonClick(book);
    }
    )  
}


// This function displays/creates the form with the current data of a specific book ,and allows us to edit the info.
function handleEditButtonClick(book) {

    const formContainer = document.getElementById('editFormContainer');
    formContainer.style.display = 'block';  // Showing the edit form of the book
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


// Helper function to create field details popup
function createFieldDetailsPopup(field, details) {
    const popupContainer = document.getElementById('fieldDetailsPopupContainer');

    const fieldDetailsPopup = document.createElement('div');
    fieldDetailsPopup.classList.add('field-details-popup');

    const fieldDetailsText = document.createElement('p');
    fieldDetailsText.textContent = details;

    fieldDetailsPopup.appendChild(fieldDetailsText);
    popupContainer.appendChild(fieldDetailsPopup);

    field.addEventListener('click', () => {
        fieldDetailsPopup.classList.toggle('show');
    });
}


// Helper function to handle hover event on field details icon - This function serves AddNewBook()
function handleDetailsIconHover(icon, popup) {
    icon.addEventListener('mouseenter', () => {
        popup.classList.add('show');
    });
    icon.addEventListener('mouseleave', () => {
        popup.classList.remove('show');
    });
}


// Helper function to create field details popup - This function serves AddNewBook() and AddNewAuthor()
function createFieldDetailsPopup(details) {
    const fieldDetailsPopup = document.createElement('div');
    fieldDetailsPopup.classList.add('field-details-popup');

    const fieldDetailsText = document.createElement('p');
    fieldDetailsText.textContent = details;

    fieldDetailsPopup.appendChild(fieldDetailsText);

    return fieldDetailsPopup;
}


// Helper function to create field container - This function serves AddNewBook() and AddNewAuthor()
function createFieldContainer(labelText, fieldName, details, isDropdown = false, dropdownOptions = []) {
    const fieldContainer = document.createElement('div');

    // Creating label for the field
    const label = document.createElement('label');
    label.textContent = labelText;

    // Creating input element for the field
    let input;
    if (isDropdown) {
        input = document.createElement('select');
        dropdownOptions.forEach(option => {
            const dropdownOption = document.createElement('option');
            dropdownOption.value = option.value;
            dropdownOption.textContent = option.text;
            input.appendChild(dropdownOption);
        });
    } else {
        input = document.createElement('input');
        input.type = 'text';
        input.required = true;
    }
    input.name = fieldName;

    // Creating the question mark icon and field details popup for the field
    const detailsIcon = document.createElement('span');
    detailsIcon.classList.add('field-details-icon');
    detailsIcon.textContent = '?';

    const detailsPopup = createFieldDetailsPopup(details);

    // Creating error element for the field
    const error = document.createElement('div');
    error.classList.add(`${fieldName}-error`);

    // Handling click event on the details icon to show/hide the popup
    handleDetailsIconHover(detailsIcon, detailsPopup);

    // Appending label, input, details icon, error element, and details popup to the field container
    fieldContainer.appendChild(label);
    fieldContainer.appendChild(input);
    fieldContainer.appendChild(detailsIcon);
    fieldContainer.appendChild(error);
    fieldContainer.appendChild(detailsPopup);

    return fieldContainer;
}


// This function creates the Form to add a new book with the help of sub functions that were declared separately 
function AddNewBook() {
    // Creating a form element
    const addBookForm = document.createElement('form');

    // Creating field containers for each field
    const titleFieldContainer = createFieldContainer('Title: ', 'title', 'Title should contain English letters, dots,numbers, and should be 4-25 characters in length.');
    const isbnFieldContainer = createFieldContainer('ISBN: ', 'isbn', 'ISBN should be between 10-15 characters, including numbers and - only.');
    const yearFieldContainer = createFieldContainer('Publication Year: ', 'year', 'Year should be between 1900 and the current year.');
    
    // Creating the author label
    const authorLabel = document.createElement('label');
    authorLabel.textContent = 'Author: ';

    // Creating the dropdown list for the AuthorID field
    const authorDropdown = document.createElement('select');
    authorDropdown.name = 'authorId';

    // Fetching the authors data from the server
    fetch('/api/authors')
        .then(response => response.json())
        .then(authors => {
            authors.forEach(author => {
                const option = document.createElement('option');
                option.value = author.id;
                option.textContent = author.name;
                authorDropdown.appendChild(option);
            });

        addBookForm.appendChild(titleFieldContainer);
        addBookForm.appendChild(isbnFieldContainer);
        addBookForm.appendChild(yearFieldContainer);
        addBookForm.appendChild(authorLabel);
        addBookForm.appendChild(authorDropdown);
        addBookForm.appendChild(submitButton);
    })
    .catch(error => console.log(error));

    const submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = 'Add';


    // Adding an event listener to the form's submit event
    addBookForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Preventing form submission
        const formData = new FormData(addBookForm);
        const newBook = Object.fromEntries(formData.entries());

        // Calling the function to handle form submission and add a new book
        handleAddBookSubmit(newBook, addBookForm);
    });

    // Clearing the form
    const formContainer = document.getElementById('editFormContainer');
    formContainer.innerHTML = '';
    formContainer.style.display = 'block';

    formContainer.appendChild(addBookForm);
}


// This function handles the AddNewBook submission , returns a success message or an error message accordingly
function handleAddBookSubmit(newBook, form) {
    const titleError = form.querySelector('.title-error');
    const isbnError = form.querySelector('.isbn-error');
    const yearError = form.querySelector('.year-error');
    titleError.textContent = '';
    isbnError.textContent = '';
    yearError.textContent = '';

    fetch('/api/books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
    })
    .then(response => {
        if (response.ok || response.status === 204) {
            const successMsgElement = document.getElementById('successMsg');
            if (successMsgElement) {
                successMsgElement.textContent = 'Book added successfully!';
                successMsgElement.style.display = 'block';
                setTimeout(() => {
                    successMsgElement.style.display = 'none';
                }, 2000);
            }
        } else if (response.status === 400) {
          // Error updating the book
          response.json().then(data => {
            console.log(data);
            // Displaying error messages for each field
            if (data.title) {
                titleError.textContent = data.title;
            }
            if (data.isbn) {
                isbnError.textContent = data.isbn;
            }
            if (data.year) {
                yearError.textContent = data.year;
            }
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
          });
        } else {
            console.log('Error adding book:', response.status);
        }
    })
    .catch(error => console.log(error));
}


// This function handles the remove of a specific book from the database
function handleRemoveButtonClick(book) {
    // Fetching the API endpoint and sending a request to remove the book via book.id
    fetch(`api/books/${book.id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok || response.status === 204) {
            // Book removed successfully
            // Display success message or perform any necessary actions
            const successMsgElement = document.getElementById('successMsg');
            if (successMsgElement) {
              successMsgElement.textContent = 'Book removed successfully!';
              successMsgElement.style.display = 'block';
              // Hiding the success message after 3 seconds
              setTimeout(() => {
                successMsgElement.style.display = 'none';
              }, 2000);
              
            }
            console.log('Book removed successfully!');
        } else {
            // Error removing the book
            console.log('Error removing book:', response.status);
        }
    })
    .catch(error => console.log(error));
}

















// This function retrieves all authors in the database
function loadAuthors() {

    const authorDropdown = document.getElementById('authorDropdown');
    const addNewAuthorLink = document.getElementById('addNewAuthor');

    const bookDropdown = document.getElementById('bookDropdown');
    bookDropdown.style.display = 'none';

    const addNewBookLink = document.getElementById('addNewBook');
    addNewBookLink.style.display = 'none';

    const formContainer = document.getElementById('editFormContainer');
    formContainer.style.display = 'none';

    const bookDetails = document.getElementById('bookDetails');
    bookDetails.style.display = 'none';

    const homeIntro = document.getElementById('HomeIntro');
    homeIntro.style.display = 'none';

    if (authorDropdown.style.display === 'none') {
        fetch('/api/authors')
            .then(response => response.json())
            .then(data => {

                authorDropdown.innerHTML = ''; // Clear existing options
                
                // Adding the default option as the first option
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Select an author';
                authorDropdown.appendChild(defaultOption);
                
                data.forEach(author => {
                    const option = document.createElement('option');
                    option.value = author.id;
                    option.textContent = author.name;
                    authorDropdown.appendChild(option);
                });
                
                authorDropdown.style.display = 'block'; // Show the dropdown
                addNewAuthorLink.style.display = 'inline-block'; // Show the "Add a new author" link
                
            })
            .catch(error => console.log(error));
    } 
    // This event listener , acts upon selecting a specific author, and fetches the author using the ID and displays it using the displayAuthorDetails
    // When selecting another author , or returning the selection to 'Select an author' , the clearAuthorDetails method is executed
    authorDropdown.addEventListener('change', function() {
        const selectedAuthorId = this.value;
        if (selectedAuthorId) {

            const authorDetails = document.getElementById('authorDetails');
            authorDetails.style.display = 'block';

            fetch(`/api/authors/${selectedAuthorId}`)
                .then(response => response.json())
                .then(author => {
                    clearAuthorDetails();
                    displayAuthorDetails(author);
                    clearAuthorEditingContainer(editAuthorFormContainer);
                })
                .catch(error => console.log(error));
        } else {
            clearAuthorDetails();
            clearAuthorEditingContainer(editAuthorFormContainer); // Clear the author editing container
        }
    });
    // Add a click event listener to the "Add a new author" link
    addNewAuthorLink.addEventListener('click', handleAddNewAuthorClick);
}


// This assisting function makes the dropDown list of the authors to disappear when clicking on add a new author in order to present the form
function handleAddNewAuthorClick() {
    const authorDropdown = document.getElementById('authorDropdown');
    authorDropdown.style.display = 'none'; // Hide the dropdown
    AddNewAuthor();
    clearAuthorDetails();
}


// This function clears the container contents (the selected author edit details) when switching between authors
function clearAuthorEditingContainer(container) {
    container.innerHTML = ''; // Clearing the container contents
}


// This function clears the author details container (the display)
function clearAuthorDetails() {
    const authorDetailsContainer = document.getElementById('authorDetails');
    authorDetailsContainer.innerHTML = ''; // Clearing the author details container
}


// This function displays a specific author details upon selecting
function displayAuthorDetails(author) {
    const authorDetailsContainer = document.getElementById('authorDetails');
    
    const nameElement = document.createElement('p');
    nameElement.textContent = author.name;
    
    const biographyElement = document.createElement('p');
    biographyElement.textContent = 'Biography: ' + author.biography;
    biographyElement.id = 'biography-content'

    // Upon clicking the edit button , it will call the handleAuthorEditButtonClick , which will allow to edit the selected author
    const editAuthorButton = document.createElement('button');
    editAuthorButton.textContent = 'Edit author';
    editAuthorButton.id = 'EditButton';

    const removeAuthorButton = document.createElement('button');
    removeAuthorButton.textContent = 'Remove author';
    removeAuthorButton.id = 'RemoveButton';
    

    // Clearing the book details container
    authorDetailsContainer.innerHTML = '';
    // Appending book details elements to the container
    authorDetailsContainer.appendChild(nameElement);
    authorDetailsContainer.appendChild(biographyElement);
    authorDetailsContainer.appendChild(editAuthorButton);
    authorDetailsContainer.appendChild(document.createElement('br'));
    authorDetailsContainer.appendChild(document.createElement('br'));
    authorDetailsContainer.appendChild(removeAuthorButton);

    editAuthorButton.addEventListener('click', () => {
        // Calling the function to handle the edit button click
        handleAuthorEditButtonClick(author);
    });

    removeAuthorButton.addEventListener('click', () => {
        // Calling the function to handle remove button click
        handleRemoveAuthorButtonClick(author);
    }
    )  
}


// This function displays/creates the form with the current data of a specific author ,and allows us to edit the info.
function handleAuthorEditButtonClick(author) {

    const formContainer = document.getElementById('editAuthorFormContainer');
    formContainer.style.display = 'block';
    // Creating a form element
    const form = document.createElement('form');
  
    // Creating labels for the fields
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Name: ';

    // Creating input elements for the editable fields
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = author.name;
    nameInput.name = 'name';
    nameInput.required = true;

    // Creating error elements for the suitable fields (if any errors occur)
    const nameError = document.createElement('div');
    nameError.classList.add('error-message', 'name-error'); // Added 'title-error' class
  
    const biographyLabel = document.createElement('label');
    biographyLabel.textContent = 'Biography: ';

    const biographyInput = document.createElement('textarea');
    biographyInput.value = author.biography;
    biographyInput.name = 'biography';
    biographyInput.rows = 5; // Setting the number of visible rows for the textarea
    biographyInput.cols = 37; // Setting the number of visible columns for the textarea
    biographyInput.required = true; // Setting the required field option to true , to make this field mandatory
    
  
    const biographyError = document.createElement('div');
    biographyError.classList.add('error-message', 'biography-error'); // Added 'isbn-error' class
  
  
    const submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = 'Save';
  
    // Appending the input,label ,error elements and submit button to the form
    form.appendChild(nameLabel);
    form.appendChild(nameInput);
    form.appendChild(nameError);
    form.appendChild(document.createElement('br'));
  
    form.appendChild(biographyLabel);
    form.appendChild(biographyInput);
    form.appendChild(biographyError);
    form.appendChild(document.createElement('br'));
  
    form.appendChild(submitButton);
  
    // Adding an event listener to the form's submit event
    form.addEventListener('submit', (event) => {
      event.preventDefault();       // Preventing form submission
      const formData = new FormData(form);
      const editedAuthor = Object.fromEntries(formData.entries());

    // Calling the function to handle form submission and update book details
      handleEditAuthorFormSubmit(author, editedAuthor, form); 
    });

    // Clearing the form
    const editAuthorFormContainer = document.getElementById('editAuthorFormContainer');
    editAuthorFormContainer.innerHTML = '';
    editAuthorFormContainer.appendChild(form);
}


// This function performs the PUT request/method , to update the selected author
function handleEditAuthorFormSubmit(author, editedAuthor, form) {
    // Declaring the Error variable 
    const nameError = form.querySelector('.name-error');
    const biographyError = form.querySelector('.biography-error');

  
    const updatedAuthor = {
      id: author.id,
      ...editedAuthor,
    };
  
    fetch(`/api/authors/${author.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedAuthor)
    })
      .then(response => {
        if (response.ok || response.status === 204) {
          // Author updated successfully
          // Displaying success message
          const successMsgElement = document.getElementById('authorSuccessMsg');
          if (successMsgElement) {
            successMsgElement.textContent = 'Author updated successfully!';
            successMsgElement.style.display = 'block';
            // Hiding the success message after 3 seconds
            setTimeout(() => {
              successMsgElement.style.display = 'none';
            }, 2000);
          }
  
          // Reloading the author details to reflect the changes
          fetch(`/api/authors/${author.id}`)
            .then(response => response.json())
            .then(author => {
              clearAuthorDetails();
              displayAuthorDetails(author);
              // Reseting the error variables when a updating is successfull
              nameError.textContent = '';
              biographyError.textContent = '';
            })
            .catch(error => console.log(error));
        } else if (response.status === 400) {
          // Error updating the author
          response.json().then(data => {
            // The data that returns from the server when the status is 400, is a string which describes the field and the problem
              if (data[""]) {
                const errorMessage = data[""][0];
                // Setting the proper error message
                if (errorMessage.includes("Name")) {
                    nameError.textContent = errorMessage;
                }
                if (errorMessage.includes("Biography")) {
                    biographyError.textContent = errorMessage;
                }
            }
          });
        } else {
          console.log('Error updating author:', response.status);
        }
      })
      .catch(error => console.log(error));
}


// This function handles the remove of a specific author from the database
function handleRemoveAuthorButtonClick(author) {
    // Fetching the API endpoint and sending a request to remove the author via author.id
    fetch(`api/authors/${author.id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok || response.status === 204) {
            // Author removed successfully
            // Display success message or perform any necessary actions
            const successMsgElement = document.getElementById('authorSuccessMsg');
            if (successMsgElement) {
              successMsgElement.textContent = 'Author removed successfully!';
              successMsgElement.style.display = 'block';
              // Hiding the success message after 3 seconds
              setTimeout(() => {
                successMsgElement.style.display = 'none';
              }, 2000);
              
            }
            console.log('Author removed successfully!');
        } else {
            // Error removing the author
            console.log('Error removing author:', response.status);
        }
    })
    .catch(error => console.log(error));
}


// Helper function to create field container for the biography in Author entity and serves AddNewAuthor()
function createBiographyFieldContainer(labelText, fieldName, details) {
    const fieldContainer = document.createElement('div');

    // Creating label for the field
    const label = document.createElement('label');
    label.textContent = labelText;

    // Creating input element for the field
    let input
    input = document.createElement('textarea');
    input.rows = 5;
    input.cols = 37;
    input.required = true;

    input.name = fieldName;

    // Creating the question mark icon and field details popup for the field
    const detailsIcon = document.createElement('span');
    detailsIcon.classList.add('field-details-icon');
    detailsIcon.textContent = '?';

    const detailsPopup = createFieldDetailsPopup(details);

    // Creating error element for the field
    const error = document.createElement('div');
    error.classList.add(`${fieldName}-error`);

    // Handling click event on the details icon to show/hide the popup
    handleDetailsIconHover(detailsIcon, detailsPopup);

    // Appending label, input, details icon, error element, and details popup to the field container
    fieldContainer.appendChild(label);
    fieldContainer.appendChild(input);
    fieldContainer.appendChild(detailsIcon);
    fieldContainer.appendChild(error);
    fieldContainer.appendChild(detailsPopup);

    return fieldContainer;
}


// This function creates the Form to add a new author with the help of sub functions that were declared separately 
function AddNewAuthor() {
    // Creating a form element
    const addAuthorForm = document.createElement('form');

    // Creating field containers for each field
    const nameFieldContainer = createFieldContainer('Name: ', 'name', 'Name should be between 4-20 characters, English letters only.');
    const biographyFieldContainer = createBiographyFieldContainer('Biography: ', 'biography', 'Biography should be between 10-1200 characters.');

    const submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = 'Add';

    addAuthorForm.appendChild(nameFieldContainer);
    addAuthorForm.appendChild(biographyFieldContainer);
    addAuthorForm.appendChild(submitButton);

    // Adding an event listener to the form's submit event
    addAuthorForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Preventing form submission
        const formData = new FormData(addAuthorForm);
        const newAuthor = Object.fromEntries(formData.entries());

        // Calling the function to handle form submission and add a new book
        handleAddAuthorSubmit(newAuthor, addAuthorForm);
    });

    // Clearing the form
    const formContainer = document.getElementById('editAuthorFormContainer');
    formContainer.innerHTML = '';
    formContainer.style.display = 'block';

    formContainer.appendChild(addAuthorForm);
}


// This function handles the AddNewAuthor submission , returns a success message or an error message accordingly
function handleAddAuthorSubmit(newAuthor, form) {
    const nameError = form.querySelector('.name-error');
    const biographyError = form.querySelector('.biography-error');

    nameError.textContent = '';
    biographyError.textContent = '';

    fetch('/api/authors', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAuthor),
    })
    .then(response => {
        if (response.ok || response.status === 204) {
            const successMsgElement = document.getElementById('authorSuccessMsg');
            if (successMsgElement) {
                successMsgElement.textContent = 'Author added successfully!';
                successMsgElement.style.display = 'block';
                setTimeout(() => {
                    successMsgElement.style.display = 'none';
                }, 2000);
            }
        } else if (response.status === 400) {
          // Error updating the author
          response.json().then(data => {
            console.log(data);
            // Displaying error messages for each field
            if (data.name) {
                nameError.textContent = data.name;
            }
            if (data.biography) {
                biographyError.textContent = data.biography;
            }
            // The data that returns from the server when the status is 400, is a string which describes the field and the problem
              if (data[""]) {
                const errorMessage = data[""][0];
                // Setting the proper error message
                if (errorMessage.includes("Name")) {
                    nameError.textContent = errorMessage;
                }
                if (errorMessage.includes("Biography")) {
                    biographyError.textContent = errorMessage;
                }
            }
          });
        } else {
            console.log('Error adding author:', response.status);
        }
    })
    .catch(error => console.log(error));
}


// This function handles the remove of a specific author from the database
function handleRemoveAuthorButtonClick(author) {
    // Fetching the API endpoint and sending a request to remove the book via book.id
    fetch(`api/authors/${author.id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok || response.status === 204) {
            // Author removed successfully
            // Display success message or perform any necessary actions
            const successMsgElement = document.getElementById('authorSuccessMsg');
            if (successMsgElement) {
              successMsgElement.textContent = 'Author removed successfully!';
              successMsgElement.style.display = 'block';
              // Hiding the success message after 3 seconds
              setTimeout(() => {
                successMsgElement.style.display = 'none';
              }, 2000);
              
            }
            console.log('Author removed successfully!');
        } else {
            // Error removing the author
            console.log('Error removing author:', response.status);
        }
    })
    .catch(error => console.log(error));
}
