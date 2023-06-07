using Microsoft.EntityFrameworkCore;
using MyLibrary.Data;
using MyLibrary.Entities;
using System.Diagnostics;
using Serilog;

namespace MyLibrary.Repositories
{
    public class BookRepository
    {
        private readonly BookDbContext _dbContext;

        public BookRepository(BookDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<Book> GetAllBooks()
        {
            return _dbContext.Books.ToList();
        }

        public Book GetBookById(int id)
        {
            return _dbContext.Books.FirstOrDefault(book => book.Id == id);
        }

        public void CreateBook(Book book)
        {
            _dbContext.Books.Add(book);
            _dbContext.SaveChanges();
        }

        public void UpdateBook(Book book)
        {
            _dbContext.Entry(book).State = EntityState.Modified;
            _dbContext.SaveChanges();
        }

        // public void UpdateBook(Book book)
        // {
        //     Log.Information("Updating book: {BookId}", book.Id);
        //     try
        //     {
        //         _dbContext.Books.Entry(book).State = EntityState.Modified;
        //         _dbContext.SaveChanges();
        //         Log.Information("Book updated successfully");
        //     }
        //     catch (Exception ex)
        //     {
        //         Log.Error(ex, "Error updating book");
        //     }
        // }


        public void DeleteBook(Book book)
        {
            _dbContext.Books.Remove(book);
            _dbContext.SaveChanges();
        }

        
    }
}
