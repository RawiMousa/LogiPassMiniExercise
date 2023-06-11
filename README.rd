# MyLibrary

MyLibrary is a web application built using ASP.NET Core that allows you to manage a library of books and authors. It provides a user-friendly interface to perform CRUD (Create, Read, Update, Delete) operations on the library data.

## Features

- Add new authors and books to the library.
- View a list of all authors and books.
- Edit and update author and book details.
- Remove authors and books from the library.

## Technologies Used

- ASP.NET Core: A cross-platform framework for building web applications.
- SQLite: A lightweight and file-based database for storing the library data.
- JavaScript: Used for the frontend interactivity and dynamic rendering.
- HTML and CSS: Used for structuring and styling the web pages.

## Getting Started

To run the MyLibrary web app locally, follow these steps:

1. Install the .NET Core SDK on your machine.
2. Clone this repository to your local machine.
3. Open a terminal or command prompt and navigate to the root folder of the project.
4. Run the command `dotnet run` to start the app.
5. Open a web browser and go to `http://localhost:5125` or `http://localhost:7059` to access the app.

## Project Structure

The project structure is organized as follows:

- `Controllers`: Contains the API controllers for handling requests and serving responses.
- `Entities`: Contains the model classes representing the 'Author' and 'Book' entities.
- `Repositories`: Contains repository classes responsible for data access and manipulation.
- `Validation`: Contains custom validation modules for validating input data.

## Contributing

Contributions to MyLibrary are welcome! If you find any issues or have suggestions for improvement, please open an issue or submit a pull request on the GitHub repository.

## License

This project is licensed under the [MIT License](LICENSE).
