using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrainingApp.Entities;
using TrainingApp.Models;

namespace TrainingApp.Controllers
{
    [Produces("application/json")]
    [Route("api/Articles")]
    public class ArticlesController : Controller
    {
        private readonly AppDbContext _context;

        public ArticlesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Articles
        [HttpGet]
        public IEnumerable<Article> Index()
        {
            try
            {
                return _context.Article;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        // GET: api/Articles/5
        [HttpGet("{id}")]
        [Route("GetById/{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var article = await _context.Article.SingleOrDefaultAsync(m => m.Id == id);

            if (article == null)
            {
                return NotFound();
            }

            return Ok(article);
        }

        [HttpGet("{id}")]
        [Route("GetArticlesByCategoryId/{id}")]
        public IActionResult GetArticlesByCategoryId(int id)
        {
            try
            {
                var category = (from ac in _context.ArticleCategory
                                join a in _context.Article on ac.ArticleId equals a.Id
                                where ac.CategoryId == id
                                select new { ac.Id, a.Name }).ToList();

                return Ok(category);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpGet("{id}")]
        [Route("GetArticlesNotInCategoryId/{id}")]
        public IActionResult GetArticlesNotInCategoryId(int id)
        {
            try
            {
                var articleList = (from a in _context.Article select new { value = a.Id, label = a.Name }).ToList();

                var articleCategory = (from ac in _context.ArticleCategory
                                       join a in _context.Article on ac.ArticleId equals a.Id
                                       where ac.CategoryId == id
                                       select new { value = a.Id }).ToList().ToArray();

                return Ok(articleList.Where(a => !articleCategory.Any(ac => ac.value == a.value)));
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        // PUT: api/Articles/5
        [HttpPut("{id}")]
        [HttpPut("[action]")]
        public async Task<IActionResult> Put([FromBody] Article article)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(article).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ArticleExists(article.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPost]
        [Route("Post")]
        public async Task<IActionResult> Post([FromBody] Article article)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Article.Add(article);
            await _context.SaveChangesAsync();

            //return CreatedAtAction("GetById", new { id = article.Id }, article);
            return NoContent();
            //return RedirectToAction("Index");
        }

        // DELETE: api/Articles/5
        [HttpDelete]
        [Route("[action]/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var article = await _context.Article.SingleOrDefaultAsync(m => m.Id == id);
            if (article == null)
            {
                return NotFound();
            }

            _context.Article.Remove(article);
            await _context.SaveChangesAsync();

            return Ok(article);
        }

        private bool ArticleExists(int id)
        {
            return _context.Article.Any(e => e.Id == id);
        }
    }
}