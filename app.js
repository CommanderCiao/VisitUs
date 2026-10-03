(() => {
  'use strict';
  const config = window.SITE_CONFIG || {};
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const menuButton = $('.menu-toggle');
  const navigation = $('#navigation');
  const lightbox = $('#lightbox');
  let lastTrigger = null;
  let photoIndex = 0;

  const closeMenu = () => {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Открыть меню');
  };
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') !== 'true';
    navigation.classList.toggle('is-open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  });
  $$('.header a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', event => {
    if (!event.target.closest('.header')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });
  window.matchMedia('(min-width: 851px)').addEventListener('change', closeMenu);

  if ('IntersectionObserver' in window && !motionQuery.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px 20px 0px' });
    document.documentElement.classList.add('motion-ready');
    $$('.reveal').forEach(element => observer.observe(element));
    motionQuery.addEventListener('change', event => {
      if (event.matches) {
        document.documentElement.classList.remove('motion-ready');
        observer.disconnect();
      }
    });
  }

  const openDialog = (dialog, trigger) => {
    closeMenu();
    lastTrigger = trigger;
    dialog.showModal();
  };
  $$('dialog').forEach(dialog => {
    $('[data-close]', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => lastTrigger?.focus({ preventScroll: true }));
  });

  const photos = $$('.portfolio-item').map(item => ({
    src: $('img', item).getAttribute('src'),
    alt: $('img', item).alt,
    title: $('h3', item).textContent,
  }));
  const showPhoto = index => {
    photoIndex = (index + photos.length) % photos.length;
    const photo = photos[photoIndex];
    $('#lightbox-image').src = photo.src;
    $('#lightbox-image').alt = photo.alt;
    $('#lightbox-caption').textContent = photo.title;
    $('#lightbox-count').textContent = `${photoIndex + 1} / ${photos.length}`;
  };
  $$('[data-lightbox]').forEach(button => button.addEventListener('click', () => {
    showPhoto(Number(button.dataset.lightbox));
    openDialog(lightbox, button);
  }));
  $('.lightbox-prev').addEventListener('click', () => showPhoto(photoIndex - 1));
  $('.lightbox-next').addEventListener('click', () => showPhoto(photoIndex + 1));
  lightbox.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(photoIndex + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });

  if (config.brand) {
    $$('[data-brand]').forEach(element => { element.textContent = config.brand.toLocaleLowerCase('ru'); });
    document.title = `${config.brand} — фуршеты и банкеты с душой`;
  }
  if (config.city) {
    $('[data-location]').textContent = config.city;
    $('[data-location]').hidden = false;
  }
  if (config.demo === false) $$('[data-demo]').forEach(element => { element.hidden = true; });
  $('#year').textContent = String(new Date().getFullYear());

  const phone = String(config.phone || '').replace(/[^+\d]/g, '');
  const whatsapp = String(config.whatsapp || '').replace(/\D/g, '');
  const telegram = String(config.telegram || '').replace(/^@/, '').replace(/[^a-zA-Z0-9_]/g, '');
  const email = String(config.email || '').trim();
  const hasContact = Boolean(phone || whatsapp || telegram || email);
  const contactsDemo = config.contactsDemo === true;
  const addContact = (label, href, className = '') => {
    const link = document.createElement(contactsDemo ? 'span' : 'a');
    link.textContent = label;
    link.className = `contact-detail ${className}`.trim();
    if (!contactsDemo) link.href = href;
    if (!contactsDemo && href.startsWith('https:')) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    $('#contact-links').append(link);
  };
  if (phone) addContact(config.phone, `tel:${phone}`, 'phone-link');
  if (telegram) addContact('Telegram', `https://t.me/${telegram}`);
  if (whatsapp) addContact('WhatsApp', `https://wa.me/${whatsapp}`);
  if (email) addContact(email, `mailto:${encodeURIComponent(email)}`);
  if (hasContact) {
    $('#contact-note').textContent = contactsDemo
      ? 'Для демонстрации · контакты тестовые'
      : 'Обсудим меню и детали лично';
  }
})();
