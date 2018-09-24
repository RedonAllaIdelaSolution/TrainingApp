using Microsoft.EntityFrameworkCore;
using System;

namespace TrainingApp.Entities
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            /* Define any composite PKs here*/
            modelBuilder.Entity<ArticleCategory>()
                .HasKey(x => new { x.ArticleId, x.CategoryId });
        }

        public DbSet<Article> Article { get; set; }
        public DbSet<Category> Category { get; set; }
        public DbSet<ArticleCategory> ArticleCategory { get; set; }
    }
}