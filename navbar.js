document.addEventListener('DOMContentLoaded', function() {
    // Toggle mobile menu
    var mobileMenuToggle = document.getElementById('mobile-menu');
    var navbarUl = document.querySelector('.navbar ul');
  
    mobileMenuToggle.addEventListener('click', function() {
      navbarUl.classList.toggle('mobile-nav');
      mobileMenuToggle.classList.toggle('is-active');
    });
  });
  

  function showAlert(message) {
    var alertBox = document.getElementById('myAlert');
    alertBox.textContent = message;
    alertBox.style.display = 'block';
    setTimeout(function() {
        alertBox.style.display = 'none';
    }, 2000);
}