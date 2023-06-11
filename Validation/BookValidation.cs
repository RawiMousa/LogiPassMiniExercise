using MyLibrary.Repositories;
using System.Text.RegularExpressions;
using MyLibrary.Entities;

namespace MyLibrary.Validation
{
    public static class BookValidation
    {
        public static List<string> ValidateBook(Book book, AuthorRepository authorRepository)
        {
            List<string> errors = new List<string>();

            // Making sure the added book belongs to an existing author
            var existingAuthor = authorRepository.GetAuthorById(book.AuthorId);
            if (existingAuthor == null)
            {
                errors.Add("Invalid author ID. Author does not exist.");
            }

            // Validating the ISBN
            string isbnPattern = @"^[0-9\-]+$";
            bool isValidIsbn = Regex.IsMatch(book.Isbn, isbnPattern);

            if ((book.Isbn.Length > 15) || (book.Isbn.Length < 10) || (!isValidIsbn) || string.IsNullOrWhiteSpace(book.Isbn))
            {
                errors.Add("ISBN should be between 10-15 characters, including numbers and '-' only.");
            }

            // Validating the Title
            string titlePattern = @"^[A-Za-z0-9. ]{4,25}$";
            bool isValidTitle = Regex.IsMatch(book.Title, titlePattern);

            if (!isValidTitle || string.IsNullOrWhiteSpace(book.Title))
            {
                errors.Add("Title should contain English letters, dots,numbers, and should be 4-25 characters in length.");
            }

            // Validating the Year
            int currentYear = DateTime.Now.Year;
            if ((book.Year < 1900) || (book.Year > currentYear) || string.IsNullOrWhiteSpace(book.Year.ToString()))
            {
                errors.Add("Year should be between 1900 and the current year.");
            }

            return errors;
        }
    }
}
