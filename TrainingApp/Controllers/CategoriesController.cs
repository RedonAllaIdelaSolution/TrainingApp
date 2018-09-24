using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrainingApp.Entities;

namespace TrainingApp.Controllers
{
    [Produces("application/json")]
    [Route("api/Categories")]
    public class CategoriesController : Controller
    {
        private readonly AppDbContext _context;

        public CategoriesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Categories
        [HttpGet]
        public IEnumerable<Category> Index()
        {
            try
            {
                return _context.Category;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        // GET: api/Categories/5
        [HttpGet("{id}")]
        [Route("GetById/{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var category = await _context.Category.SingleOrDefaultAsync(m => m.Id == id);

            if (category == null)
            {
                return NotFound();
            }

            return Ok(category);
        }

        // PUT: api/Categories/5
        [HttpPut("{id}")]
        [HttpPut("[action]")]
        public async Task<IActionResult> Put([FromBody] Category category)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                _context.Entry(category).State = EntityState.Modified;

                await _context.SaveChangesAsync();

                return Ok(category);
            }
            catch (DbUpdateConcurrencyException)
            {
               if (!CategoryExists(category.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        // POST: api/Categories
        [HttpPost("[action]")]
        public async Task<IActionResult> Post([FromBody] Category category)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Category.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetById", new { id = category.Id }, category);
        }

        // DELETE: api/Categories/5
        [HttpDelete]
        [Route("[action]/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var category = await _context.Category.SingleOrDefaultAsync(m => m.Id == id);
            if (category == null)
            {
                return NotFound();
            }

            _context.Category.Remove(category);
            await _context.SaveChangesAsync();

            return Ok(category);
        }

        // GET: api/Categories/5
        [HttpGet("{id}")]
        [Route("GetCategoryByArticleId/{id}")]
        public IActionResult GetCategoryByArticleId(int id)
        {
            try
            {
                var category = (from ac in _context.ArticleCategory
                                join c in _context.Category on ac.CategoryId equals c.Id
                                where ac.ArticleId == id
                                select new { ac.Id, c.Name }).ToList();

                return Ok(category);
            }
            catch (Exception ex)
            {

                throw;
            }
        }

        [HttpGet("{id}")]
        [Route("GetCategoriesNotInArticle/{id}")]
        public IActionResult GetCategoriesNotInArticle(int id)
        {
            try
            {
                var categorList = (from c in _context.Category select new { value = c.Id, label = c.Name }).ToList();

                var articleCategory = (from ac in _context.ArticleCategory
                                       join c in _context.Category on ac.CategoryId equals c.Id
                                       where ac.ArticleId == id
                                       select new { value = c.Id }).ToList().ToArray();

                return Ok(categorList.Where(c => !articleCategory.Any(ac => ac.value == c.value)));
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        private bool CategoryExists(int id)
        {
            return _context.Category.Any(e => e.Id == id);
        }
    }
}