(() => {
  const footer = document.querySelector('#footer');
  if (!footer) return;

  footer.innerHTML = `
    <div class="container">
      <div class="row gy-4 align-items-start">
        <div class="col-lg-5 col-md-12 footer-info">
          <a href="/" class="logo d-flex align-items-center">
            <span>Amigos Unidos</span>
          </a>
          <p>Recursos educativos e IA Ayudante para acompañar a niños, familias y cuidadores.</p>
          <div class="social-links d-flex mt-3">
            <a href="https://wa.me/573332439423" class="whatsapp-link" aria-label="WhatsApp Amigos Unidos" title="WhatsApp">
              <i class="bi bi-whatsapp" aria-hidden="true"></i>
            </a>
          </div>
        </div>
        <div class="col-lg-4 col-md-6 footer-links">
          <h4>Navegación</h4>
          <ul>
            <li><i class="bi bi-chevron-right"></i><a href="/">Inicio</a></li>
            <li><i class="bi bi-chevron-right"></i><a href="/ia-ayudante/">IA Ayudante</a></li>
            <li><i class="bi bi-chevron-right"></i><a href="/about.html">Nosotros</a></li>
            <li><i class="bi bi-chevron-right"></i><a href="/Amigos-mas.html">Amigos+</a></li>
            <li><i class="bi bi-chevron-right"></i><a href="/pricing.html">Precios</a></li>
          </ul>
        </div>
        <div class="col-lg-3 col-md-6 footer-contact">
          <h4>Contacto</h4>
          <p><strong>WhatsApp:</strong> <a href="https://wa.me/573332439423">+57 333 243 9423</a><br>
          <strong>Web:</strong> <a href="/">Amigos Unidos</a></p>
        </div>
      </div>
      <div class="container mt-4">
        <div class="copyright">&copy; Copyright <strong><span>Amigos Unidos</span></strong>. All Rights Reserved</div>
      </div>
    </div>`;
})();
