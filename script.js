const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id]');

if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation menu');
    });
  });
}

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      navLinks.forEach((link) => link.classList.toggle('active', link === activeLink));
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });

sections.forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const yearElement = document.querySelector('#current-year');
if (yearElement) yearElement.textContent = String(new Date().getFullYear());

const form = document.querySelector('#contact-form');
const recipient = 'bhartibadal5@gmail.com';

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.querySelector('#name');
    const email = document.querySelector('#email');
    const message = document.querySelector('#message');
    const fields = [
      { input: name, error: document.querySelector('#name-error'), message: 'Please enter your name.' },
      { input: email, error: document.querySelector('#email-error'), message: 'Please enter a valid email address.' },
      { input: message, error: document.querySelector('#message-error'), message: 'Please add a short message.' }
    ];
    let isValid = true;

    fields.forEach(({ input, error, message: errorMessage }) => {
      const valid = input.value.trim() && (input.type !== 'email' || input.validity.valid);
      error.textContent = valid ? '' : errorMessage;
      input.setAttribute('aria-invalid', String(!valid));
      if (!valid) isValid = false;
    });

    if (!isValid) {
      fields.find(({ input }) => input.getAttribute('aria-invalid') === 'true').input.focus();
      return;
    }

    const subject = encodeURIComponent(`Portfolio message from ${name.value.trim()}`);
    const body = encodeURIComponent(`Name: ${name.value.trim()}\nEmail: ${email.value.trim()}\n\n${message.value.trim()}`);
    document.querySelector('#form-status').textContent = 'Opening your email app to complete the message.';
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  });
}
