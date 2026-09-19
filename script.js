document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menu && navLinks) {
    menu.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(isOpen));
    });
  }

  document.querySelectorAll('.year').forEach((item) => {
    item.textContent = new Date().getFullYear();
  });

  const revealTargets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealTargets.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealTargets.forEach((target) => observer.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add('visible'));
  }

  const form = document.getElementById('contactForm');
  if (!form) {
    return;
  }

  const notice = document.getElementById('formNotice');
  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending…';
    }

    try {
      const response = await fetch('contact-form.php', {
        method: 'POST',
        body: new FormData(form)
      });

      let data;
      try {
        data = await response.json();
      } catch (error) {
        throw new Error('Invalid server response');
      }

      if (!notice) return;

      notice.textContent = data.message || 'Your request has been submitted.';
      notice.className = `notice show ${data.success ? 'success' : 'error'}`;

      if (data.success) {
        form.reset();
      }
    } catch (error) {
      if (notice) {
        notice.textContent = 'We could not submit your request right now. Please email hello@quantixglobalsolutions.com.';
        notice.className = 'notice show error';
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Inquiry';
      }
    }
  });
});
