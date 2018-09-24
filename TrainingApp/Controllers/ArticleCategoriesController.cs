using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrainingApp.Entities;
using TrainingApp.ViewModels;

namespace TrainingApp.Controllers
{
    [Produces("application/json")]
    [Route("api/ArticleCategories")]
    public class ArticleCategoriesController : Controller
    {
        private readonly AppDbContext _context;

        public ArticleCategoriesController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/ArticleCategories
        [HttpPost]
        public async Task<IActionResult> PostArticleCategory([FromBody] ArticleCategory articleCategory)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.ArticleCategory.Add(articleCategory);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ArticleCategoryExists(articleCategory.ArticleId, articleCategory.CategoryId))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetArticleCategory", new { id = articleCategory.ArticleId }, articleCategory);
        }

        [HttpPost]
        [Route("InsertMultiple")]
        public async Task<IActionResult> InsertMultiple([FromBody] List<ArticleCategoryViewModel> articleCategoryList)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                ArticleCategory articleCategory;

                foreach (var item in articleCategoryList)
                {
                    articleCategory = new ArticleCategory();
                    articleCategory.CategoryId = item.CategoryId;
                    articleCategory.ArticleId = item.ArticleId;

                    if (!ArticleCategoryExists(articleCategory.ArticleId, articleCategory.CategoryId))
                    {
                        _context.ArticleCategory.Add(articleCategory);
                    }                    
                }

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                throw;
            }

        }

        // DELETE: api/ArticleCategories/5
        [HttpDelete]
        [Route("[action]/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var articleCategory = await _context.ArticleCategory.SingleOrDefaultAsync(ac => ac.Id == id);

                if (articleCategory == null)
                {
                    return NotFound();
                }

                _context.ArticleCategory.Remove(articleCategory);
                await _context.SaveChangesAsync();

                return Ok(articleCategory);

                //const string query = "DELETE FROM [dbo].[ArticleCategory] WHERE [Id]={0}";
                //var rows = _context.Database.ExecuteSqlCommand(query, id);
                //return NoContent();
            }
            catch (Exception ex)
            {
                throw;
            }            
        }

        //[HttpGet("{id}")]
        [HttpPost]
        [Route("DeleteMultiple")]
        public IActionResult DeleteMultiple([FromBody] int[] rowSelected)
        {
            //https://github.com/axios/axios
            try
            {
                var myList = _context.ArticleCategory.Where(ac => rowSelected.Contains(ac.Id));
                _context.ArticleCategory.RemoveRange(_context.ArticleCategory.Where(ac => rowSelected.Contains(ac.Id)));
                _context.SaveChanges();

                return NoContent();
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        private bool ArticleCategoryExists(int articleId, int categoryId)
        {
            return _context.ArticleCategory.Any(e => (e.ArticleId == articleId && e.CategoryId == categoryId));
        }
    }
}