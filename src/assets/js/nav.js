document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('.nav-dropdown-toggle').forEach(function (button) {
    button.addEventListener('click', function () {
      var dropdown = button.parentElement;
      var isOpen = dropdown.classList.contains('is-open');

      document.querySelectorAll('.nav-dropdown.is-open').forEach(function (openDropdown) {
        openDropdown.classList.remove('is-open');
        openDropdown.querySelector('.nav-dropdown-toggle').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        dropdown.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
});
