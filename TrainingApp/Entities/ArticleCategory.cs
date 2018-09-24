using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TrainingApp.Entities
{
    [Table("ArticleCategory")]
    public class ArticleCategory
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key, Column(Order = 0)]
        [Required]
        [DisplayName("Id")]
        public int Id { get; set; }

        [Required]
        [DisplayName("ArticleId")]
        public int ArticleId { get; set; }

        [Required]
        [DisplayName("CategoryId")]
        public int CategoryId { get; set; }
    }
}