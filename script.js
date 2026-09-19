document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const iconNodes = document.querySelectorAll('.fa-solid');

  iconNodes.forEach((icon) => {
    icon.setAttribute('aria-hidden', 'true');
  });

  document.querySelectorAll('.card').forEach((card) => {
    if (!card.querySelector('.icon-badge')) {
      card.classList.add('card-with-marker');
    }
  });

  if (iconNodes.length > 0) {
    const iconProbe = document.createElement('i');
    iconProbe.className = 'fa-solid fa-circle-check';
    iconProbe.style.position = 'absolute';
    iconProbe.style.visibility = 'hidden';
    document.body.append(iconProbe);
    const iconContent = window.getComputedStyle(iconProbe, '::before').content;
    iconProbe.remove();

    if (!iconContent || iconContent === 'none' || iconContent === 'normal' || iconContent === '""') {
      document.body.classList.add('icons-fallback');
    }
  }

  if (menu && navLinks) {
    navLinks.setAttribute('aria-label', 'Primary');
    if (!navLinks.id) {
      navLinks.id = 'site-navigation';
    }
    menu.setAttribute('aria-controls', navLinks.id);

    const closeMenu = () => {
      navLinks.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
    };

    menu.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });

    document.addEventListener('click', (event) => {
      if (!menu.contains(event.target) && !navLinks.contains(event.target)) {
        closeMenu();
      }
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
