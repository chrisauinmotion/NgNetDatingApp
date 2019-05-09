using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.DTOs
{
    public class UserForRegisterDTO
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        [StringLength(24, MinimumLength = 6, ErrorMessage = "You must provide a password between 6 & 24 characters")]
        public string Password { get; set; }
    }
}