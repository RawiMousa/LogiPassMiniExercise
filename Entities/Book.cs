using System.ComponentModel.DataAnnotations;

namespace MyLibrary.Entities
{
    public class Book
    {
        public int Id { get; set; }

        [Required]

        public string Isbn { get; set; }

        public string Title { get; set; }

        public int AuthorId { get; set; }

        public int Year { get; set; }
    }
}
