using Microsoft.EntityFrameworkCore;
using MyLibrary.Data;
using MyLibrary.Entities;

namespace MyLibrary.Repositories
{
    public class AuthorRepository
    {
        private readonly BookDbContext _dbContext;

        public AuthorRepository(BookDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<Author> GetAllAuthors()
        {
            return _dbContext.Authors.ToList();
        }

        public Author GetAuthorById(int id)
        {
            return _dbContext.Authors.FirstOrDefault(author => author.Id == id);
        }

        public void CreateAuthor(Author author)
        {
            _dbContext.Authors.Add(author);
            _dbContext.SaveChanges();
        }

        public void UpdateAuthor(Author author)
        {
            _dbContext.Entry(author).State = EntityState.Modified;
            _dbContext.SaveChanges();
        }

        public void DeleteAuthor(Author author)
        {
            var books = _dbContext.Books.Where(book => book.AuthorId == author.Id);
            _dbContext.Books.RemoveRange(books);
            _dbContext.Authors.Remove(author);
            _dbContext.SaveChanges();
        }
    }
}
