/**
* Template Name: Logis
* Updated: Mar 12 2024 with Bootstrap v5.3.3
* Template URL: https://bootstrapmade.com/logis-bootstrap-logistics-website-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
document.addEventListener('DOMContentLoaded', () => {
  "use strict";

  const footerDescription = document.querySelector('.footer .footer-info > p');
  if (footerDescription) {
    footerDescription.textContent = 'Plataforma de inteligencia artificial con Froggi y herramientas digitales para acompañar a las familias.';
  }

  const socialLinks = document.querySelector('.footer .social-links');
  if (socialLinks) {
    const whatsapp = document.createElement('a');
    const icon = document.createElement('i');
    whatsapp.href = 'https://wa.me/573332439423';
    whatsapp.className = 'whatsapp-link';
    whatsapp.target = '_blank';
    whatsapp.rel = 'noopener noreferrer';
    whatsapp.title = 'Escríbenos por WhatsApp al +57 333 243 9423';
    whatsapp.setAttribute('aria-label', whatsapp.title);
    icon.className = 'bi bi-whatsapp';
    icon.setAttribute('aria-hidden', 'true');
    whatsapp.append(icon);
    socialLinks.replaceChildren(whatsapp);
  }

  const footerContact = document.querySelector('.footer .footer-contact');
  if (footerContact) {
    const heading = footerContact.querySelector('h4');
    const details = footerContact.querySelector('p');
    if (heading) heading.textContent = 'Contacto';
    if (details) {
      const phoneLabel = document.createElement('strong');
      const phone = document.createElement('a');
      const siteLabel = document.createElement('strong');
      const site = document.createElement('a');
      phoneLabel.textContent = 'WhatsApp: ';
      phone.href = 'tel:+573332439423';
      phone.textContent = '+57 333 243 9423';
      siteLabel.textContent = 'Web: ';
      site.href = 'https://amigos-unidos.onrender.com/';
      site.textContent = 'Amigos Unidos';
      details.replaceChildren(phoneLabel, phone, document.createElement('br'), siteLabel, site);
    }
  }

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Sticky header on scroll
   */
  const selectHeader = document.querySelector('#header');
  if (selectHeader) {
    document.addEventListener('scroll', () => {
      window.scrollY > 100 ? selectHeader.classList.add('sticked') : selectHeader.classList.remove('sticked');
    });
  }

  /**
   * Scroll top button
   */
  const scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    const togglescrollTop = function() {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
    window.addEventListener('load', togglescrollTop);
    document.addEventListener('scroll', togglescrollTop);
    scrollTop.addEventListener('click', window.scrollTo({
      top: 0,
      behavior: 'smooth'
    }));
  }

  /**
   * Mobile nav toggle
   */
  const mobileNavShow = document.querySelector('.mobile-nav-show');
  const mobileNavHide = document.querySelector('.mobile-nav-hide');

  document.querySelectorAll('.mobile-nav-toggle').forEach(el => {
    el.addEventListener('click', function(event) {
      event.preventDefault();
      mobileNavToogle();
    })
  });

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavShow.classList.toggle('d-none');
    mobileNavHide.classList.toggle('d-none');
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navbar a').forEach(navbarlink => {

    if (!navbarlink.hash) return;

    let section = document.querySelector(navbarlink.hash);
    if (!section) return;

    navbarlink.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  const navDropdowns = document.querySelectorAll('.navbar .dropdown > a');

  navDropdowns.forEach(el => {
    el.addEventListener('click', function(event) {
      if (document.querySelector('.mobile-nav-active')) {
        event.preventDefault();
        this.classList.toggle('active');
        this.nextElementSibling.classList.toggle('dropdown-active');

        let dropDownIndicator = this.querySelector('.dropdown-indicator');
        dropDownIndicator.classList.toggle('bi-chevron-up');
        dropDownIndicator.classList.toggle('bi-chevron-down');
      }
    })
  });

  /**
   * Initiate pURE cOUNTER
   */
  new PureCounter();

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init swiper slider with 1 slide at once in desktop view
   */
  new Swiper('.slides-1', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  });

  /**
   * Animation on scroll function and init
   */
  function aos_init() {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', () => {
    aos_init();
  });

});
