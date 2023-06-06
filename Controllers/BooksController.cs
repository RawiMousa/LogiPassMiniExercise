using Microsoft.AspNetCore.Mvc;
using MyLibrary.Repositories;
using MyLibrary.Entities;
using MyLibrary.Validation;


namespace MyLibrary.Controllers
{
    [Route("api/books")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly BookRepository _bookRepository;

        private readonly AuthorRepository _authorRepository;
        

        public BooksController(BookRepository bookRepository, AuthorRepository authorRepository)
        {
            _bookRepository = bookRepository;
            _authorRepository = authorRepository;
        }


        // GET: api/books
        [HttpGet]
        public IActionResult GetAllBooks()
        {
            var books = _bookRepository.GetAllBooks();
            return Ok(books);
        }


        // GET: api/books/{id}
        [HttpGet("{id}")]
        public IActionResult GetBookById(int id)
        {
            var book = _bookRepository.GetBookById(id);
            if (book == null)
            {
                return NotFound();
            }
            return Ok(book);
        }


        // POST: api/books
        [HttpPost]
        public IActionResult CreateBook([FromBody] Book book)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validating the book details using the custom validation module BookValidation
            List<string> validationErrors = BookValidation.ValidateBook(book, _authorRepository);
            if (validationErrors.Count > 0)
            {
                foreach (var error in validationErrors)
                {
                    ModelState.AddModelError("", error);
                }
                return BadRequest(ModelState);
            }

            _bookRepository.CreateBook(book);

            return CreatedAtAction(nameof(GetBookById), new { id = book.Id }, book);
        }


        // PUT: api/books/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateBook(int id, [FromBody] Book updatedBook)
        {
            var existingBook = _bookRepository.GetBookById(id);
            if (existingBook == null)
            {
                return NotFound();
            }

            existingBook.Title = updatedBook.Title;
            existingBook.AuthorId = updatedBook.AuthorId;
            existingBook.Isbn = updatedBook.Isbn;
            existingBook.Year = updatedBook.Year;

            Console.WriteLine(updatedBook.Isbn);
            Console.WriteLine(existingBook.Isbn);

            _bookRepository.UpdateBook(existingBook);

            return NoContent();
        }

        // DELETE: api/books/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteBook(int id)
        {
            var existingBook = _bookRepository.GetBookById(id);
            if (existingBook == null)
            {
                return NotFound();
            }

            _bookRepository.DeleteBook(existingBook);

            return NoContent();
        }
    }
}

