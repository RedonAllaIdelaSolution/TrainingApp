using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TrainingApp.Entities
{
    [Table("Article")]
    public class Article
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key, Column(Order = 0)]
        [Required]
        [DisplayName("Id")]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        [DisplayName("Name")]
        public string Name { get; set; }

        [MaxLength(250)]
        [DisplayName("Description")]
        public string Description { get; set; }

        [DisplayName("Quantity")]
        public decimal Quantity { get; set; }

        [DisplayName("Price")]
        public decimal Price { get; set; }

        [MaxLength(50)]
        [DisplayName("State")]
        public string State { get; set; }

        [MaxLength(50)]
        [DisplayName("More")]
        public string More { get; set; }
    }
}