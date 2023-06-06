using Microsoft.EntityFrameworkCore;
using MyLibrary.Entities;


namespace MyLibrary.Data
{
    public class BookDbContext : DbContext
    {
        public BookDbContext(DbContextOptions<BookDbContext> options) : base(options)
        {
        }
        public DbSet<Author> Authors { get; set; }

        public DbSet<Book> Books { get; set; }

    }
}
