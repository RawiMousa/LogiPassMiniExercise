using Microsoft.AspNetCore.Mvc;
using MyLibrary.Repositories;
using MyLibrary.Entities;
using MyLibrary.Validation;

namespace MyLibrary.Controllers
{
    [Route("api/authors")]
    [ApiController]
    public class AuthorsController : ControllerBase
    {
        private readonly AuthorRepository _authorRepository;

        public AuthorsController(AuthorRepository authorRepository)
        {
            _authorRepository = authorRepository;
            
        }

        // GET: api/authors
        [HttpGet]
        public IActionResult GetAllAuthors()
        {
            var authors = _authorRepository.GetAllAuthors();
            return Ok(authors);
        }

        // GET: api/authors/{id}
        [HttpGet("{id}")]
        public IActionResult GetAuthorById(int id)
        {
            var author = _authorRepository.GetAuthorById(id);
            if (author == null)
            {
                return NotFound();
            }
            return Ok(author);
        }

        // POST: api/authors
        [HttpPost]
        public IActionResult CreateAuthor([FromBody] Author author)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validating the author details using the custom validation module BookValidation
            List<string> validationErrors = AuthorValidation.ValidateAuthor(author, _authorRepository);
            if (validationErrors.Count > 0)
            {
                foreach (var error in validationErrors)
                {
                    ModelState.AddModelError("", error);
                }
                return BadRequest(ModelState);
            }

            _authorRepository.CreateAuthor(author);
            return CreatedAtAction(nameof(GetAuthorById), new { id = author.Id }, author);
        }

        // PUT: api/authos/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateAuthor(int id, [FromBody] Author updatedAuthor)
        {
            var existingAuthor = _authorRepository.GetAuthorById(id);
            if (existingAuthor == null)
            {
                return NotFound();
            }

            // Validating the author details using the custom validation module BookValidation
            List<string> validationErrors = AuthorValidation.ValidateAuthor(updatedAuthor, _authorRepository);
            if (validationErrors.Count > 0)
            {
                foreach (var error in validationErrors)
                {
                    ModelState.AddModelError("", error);
                }
                return BadRequest(ModelState);
            }

            existingAuthor.Name = updatedAuthor.Name;
            existingAuthor.Biography = updatedAuthor.Biography;
         

            _authorRepository.UpdateAuthor(existingAuthor);

            return NoContent();
        }

        // DELETE: api/authors/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteAuthor(int id)
        {
            var existingAuthor = _authorRepository.GetAuthorById(id);
            if (existingAuthor == null)
            {
                return NotFound();
            }

            _authorRepository.DeleteAuthor(existingAuthor);

            return NoContent();
        }
    }
}

