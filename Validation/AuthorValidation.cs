using MyLibrary.Repositories;
using System.Text.RegularExpressions;
using MyLibrary.Entities;

namespace MyLibrary.Validation
{
    public static class AuthorValidation
    {
        public static List<string> ValidateAuthor(Author author, AuthorRepository authorRepository)
        {
            List<string> errors = new List<string>();

            // Validating the name
            string namePattern = @"^[A-Za-z ]{4,20}$";
            bool isValidName = Regex.IsMatch(author.Name, namePattern);

            if (!isValidName)
            {
                errors.Add("Name should be between 4-20 characters, English letters only.");
            }

            // Validating the Biography
            string biographyPattern = @"^[A-Za-z0-9.,!?'""\s]{10,400}$";
            bool isValidBiography = Regex.IsMatch(author.Biography, biographyPattern);

            if (!isValidBiography)
            {
                errors.Add("Biography should be between 10-400 characters");
            }

            return errors;
        }
    }
}
