using System.ComponentModel.DataAnnotations;

namespace MyLibrary.Entities
{
    public class Author
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Biography { get; set; }

    }
}