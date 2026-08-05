// Ensure init is called when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    initScrollAnimation();
    initModal();
    initGallery();
    initAdminPanel();
    initRevealAnimations();
});

function initRevealAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Play once
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

function initModal() {
    // Socio Modal
    const socioModal = document.getElementById('socio-modal');
    const openSocioBtn = document.getElementById('open-socio-modal');
    const closeSocioBtn = socioModal ? socioModal.querySelector('.close-modal') : null;
    const galleryModal = document.getElementById('cancha-gallery-modal');
    const loginModal = document.getElementById('login-modal');
    const openLoginBtn = document.getElementById('open-login-modal');
    const navLoginBtn = document.getElementById('nav-login-button');
    const closeLoginBtn = loginModal ? loginModal.querySelector('.close-login-modal') : null;
    const loginForm = document.getElementById('login-demo-form');
    const loginStatus = document.getElementById('login-demo-status');
    const loginRecovery = loginModal ? loginModal.querySelector('.login-recovery-link') : null;

    if(socioModal && openSocioBtn && closeSocioBtn) {
        const openSocio = () => {
            if (loginModal) loginModal.classList.remove('show');
            if (galleryModal) galleryModal.classList.remove('show');
            document.body.classList.remove('gallery-open');
            socioModal.classList.add('show');
            const firstField = socioModal.querySelector('input');
            if (firstField) firstField.focus({ preventScroll: true });
        };
        const closeSocio = () => {
            socioModal.classList.remove('show');
            openSocioBtn.focus({ preventScroll: true });
        };

        openSocioBtn.addEventListener('click', openSocio);
        closeSocioBtn.addEventListener('click', closeSocio);
        socioModal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeSocio();
        });
    }

    if(loginModal && closeLoginBtn) {
        const openLogin = () => {
            if (socioModal) socioModal.classList.remove('show');
            if (galleryModal) galleryModal.classList.remove('show');
            document.body.classList.remove('gallery-open');
            loginModal.classList.add('show');
            if (loginStatus) loginStatus.textContent = '';
            const firstField = loginModal.querySelector('input');
            if (firstField) firstField.focus({ preventScroll: true });
        };
        const closeLogin = () => {
            loginModal.classList.remove('show');
            const returnTarget = navLoginBtn || openLoginBtn;
            if (returnTarget) returnTarget.focus({ preventScroll: true });
        };

        if (openLoginBtn) openLoginBtn.addEventListener('click', openLogin);
        if (navLoginBtn) navLoginBtn.addEventListener('click', openLogin);
        closeLoginBtn.addEventListener('click', closeLogin);
        loginModal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLogin();
        });

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const user = document.getElementById('login-user').value.trim();
                const password = document.getElementById('login-password').value;

                if (user === 'root' && password === '1') {
                    loginModal.classList.remove('show');
                    document.body.classList.add('admin-view');
                    window.scrollTo({ top: 0, behavior: 'auto' });
                    if (loginStatus) loginStatus.textContent = '';
                    const adminHeading = document.querySelector('.admin-topbar h2');
                    if (adminHeading) adminHeading.setAttribute('tabindex', '-1');
                    if (adminHeading) adminHeading.focus({ preventScroll: true });
                    return;
                }

                if (loginStatus) loginStatus.textContent = 'Credenciales incorrectas. Para esta demo usa root / 1.';
            });
        }

        if (loginRecovery) {
            loginRecovery.addEventListener('click', () => {
                if (loginStatus) loginStatus.textContent = 'Demo: aquí se iniciaría la recuperación de contraseña.';
            });
        }
    }

    window.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (socioModal && socioModal.classList.contains('show')) {
            socioModal.classList.remove('show');
            if (openSocioBtn) openSocioBtn.focus({ preventScroll: true });
        }
        if (loginModal && loginModal.classList.contains('show')) {
            loginModal.classList.remove('show');
            const returnTarget = navLoginBtn || openLoginBtn;
            if (returnTarget) returnTarget.focus({ preventScroll: true });
        }
    });

    // Galería Cancha Modal - Manejado independientemente ahora por initGallery
    
    // Global close on background click
    window.addEventListener('click', (e) => {
        if (e.target === socioModal) {
            socioModal.classList.remove('show');
            if (openSocioBtn) openSocioBtn.focus({ preventScroll: true });
        }
        if (e.target === loginModal) {
            loginModal.classList.remove('show');
            const returnTarget = navLoginBtn || openLoginBtn;
            if (returnTarget) returnTarget.focus({ preventScroll: true });
        }
    });
}

function initAdminPanel() {
    const footerAccess = document.getElementById('footer-admin-access');
    const loginModal = document.getElementById('login-modal');
    const loginStatus = document.getElementById('login-demo-status');
    const backButtons = document.querySelectorAll('#back-to-site, #back-to-site-mobile');
    const tabs = document.querySelectorAll('[data-admin-tab]');
    const panes = document.querySelectorAll('.admin-pane');
    const newsForm = document.getElementById('admin-news-form');
    const newsTitle = document.getElementById('admin-news-title');
    const newsBody = document.getElementById('admin-news-body');
    const newsStatus = document.getElementById('admin-news-status');
    const newsCount = document.getElementById('admin-news-count');
    const summaryNews = document.getElementById('admin-summary-news');
    const bookingDays = document.querySelectorAll('.calendar-day.has-booking');
    const bookingDetail = document.getElementById('booking-detail');
    let publishedNewsCount = 4;

    if (footerAccess && loginModal) {
        footerAccess.addEventListener('click', () => {
            loginModal.classList.add('show');
            if (loginStatus) loginStatus.textContent = '';
            const firstField = loginModal.querySelector('input');
            if (firstField) firstField.focus({ preventScroll: true });
        });
    }

    backButtons.forEach((button) => {
        button.addEventListener('click', () => {
            document.body.classList.remove('admin-view');
            window.location.hash = '#inicio';
            window.scrollTo({ top: 0, behavior: 'auto' });
        });
    });

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.adminTab;
            tabs.forEach((item) => item.classList.toggle('active', item.dataset.adminTab === target));
            panes.forEach((pane) => pane.classList.toggle('active', pane.dataset.adminPane === target));
        });
    });

    if (newsForm && newsTitle && newsBody) {
        newsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = newsTitle.value.trim();
            const body = newsBody.value.trim();
            if (!title || !body) return;

            const adminList = document.querySelector('[data-admin-pane="actividades"] .admin-list');
            if (adminList) {
                const item = document.createElement('article');
                item.innerHTML = `<strong>${escapeHtml(title)}</strong><span>Publicado ahora · demo local</span>`;
                adminList.prepend(item);
            }

            const publicTrack = document.querySelector('.carousel-track');
            if (publicTrack) {
                const slide = document.createElement('li');
                slide.className = 'carousel-slide';
                slide.innerHTML = `
                    <div class="card">
                        <div style="height: 150px; background: #e2e8f0; border-radius: 6px; margin-bottom: 1rem; background-image: url('news1_trophy.jpg'); background-size: cover; background-position: center;"></div>
                        <h4>${escapeHtml(title)}</h4>
                        <p style="font-size: 0.85rem; color: var(--color-text-light); margin-bottom: 1rem;">${escapeHtml(body)}</p>
                        <a href="#" style="color: var(--color-primary); font-size: 0.9rem; font-weight: 600;">Ver detalles &rarr;</a>
                    </div>
                `;
                publicTrack.prepend(slide);
            }

            publishedNewsCount += 1;
            if (newsCount) newsCount.textContent = String(publishedNewsCount);
            if (summaryNews) summaryNews.textContent = `${publishedNewsCount} noticias visibles en portada`;
            if (newsStatus) newsStatus.textContent = 'Noticia demo publicada localmente en esta sesión.';
            newsForm.reset();
        });
    }

    bookingDays.forEach((day) => {
        day.addEventListener('click', () => {
            bookingDays.forEach((item) => item.classList.toggle('active', item === day));
            if (!bookingDetail) return;
            const name = day.dataset.bookingName;
            const time = day.dataset.bookingTime;
            const place = day.dataset.bookingPlace;
            bookingDetail.innerHTML = `
                <span>Reserva seleccionada</span>
                <strong>${escapeHtml(name)}</strong>
                <p>${escapeHtml(time)} · ${escapeHtml(place)}</p>
            `;
        });
    });
}

function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[char]));
}

function initGallery() {
    const galleryModal = document.getElementById('cancha-gallery-modal');
    const openBtn = document.getElementById('cancha-preview');
    const closeBtn = document.querySelector('.close-modal-gallery');
    if(!galleryModal || !openBtn) return;

    const mainImage = document.getElementById('field-gallery-main');
    const thumbs = Array.from(galleryModal.querySelectorAll('.field-thumb'));
    let activeIndex = 0;

    const selectImage = (index) => {
        if (!mainImage || !thumbs.length) return;
        activeIndex = (index + thumbs.length) % thumbs.length;
        const thumb = thumbs[activeIndex];
        mainImage.src = thumb.dataset.fullSrc;
        mainImage.alt = thumb.dataset.fullAlt;
        thumbs.forEach((item, itemIndex) => {
            const isActive = itemIndex === activeIndex;
            item.classList.toggle('active', isActive);
            item.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
    };

    const openGallery = () => {
        selectImage(0);
        galleryModal.setAttribute('aria-hidden', 'false');
        galleryModal.classList.add('show');
        document.body.classList.add('gallery-open');
        if (thumbs[0]) thumbs[0].focus({ preventScroll: true });
    };

    openBtn.addEventListener('click', openGallery);

    const closeGallery = () => {
        galleryModal.classList.remove('show');
        galleryModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('gallery-open');
        openBtn.focus({ preventScroll: true });
    };

    if (closeBtn) closeBtn.addEventListener('click', closeGallery);
    // Optional: swipe down to close or click backdrop
    const backdrop = galleryModal.querySelector('.gallery-backdrop');
    if (backdrop) backdrop.addEventListener('click', closeGallery);

    thumbs.forEach((thumb, index) => {
        thumb.addEventListener('click', () => selectImage(index));
    });

    galleryModal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeGallery();
        }
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            selectImage(activeIndex - 1);
            thumbs[activeIndex].focus({ preventScroll: true });
        }
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            selectImage(activeIndex + 1);
            thumbs[activeIndex].focus({ preventScroll: true });
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && galleryModal.classList.contains('show')) {
            closeGallery();
        }
    });
}

function initScrollAnimation() {
    const navbar = document.querySelector('.navbar');
    const heroLogo = document.querySelector('#hero-logo');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = navbar ? navbar.querySelectorAll('.nav-links a') : [];
    const threshold = 90;

    if (!navbar || !heroLogo) return;

    const closeMobileMenu = (releaseFocus = false) => {
        navbar.classList.remove('menu-open');
        if (mobileMenuToggle) mobileMenuToggle.setAttribute('aria-expanded', 'false');
        if (releaseFocus && mobileMenuToggle && document.activeElement === mobileMenuToggle) {
            mobileMenuToggle.blur();
        }
    };

    const updateNavState = () => {
        if (window.scrollY > threshold) {
            navbar.classList.add('scrolled');
            heroLogo.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
            heroLogo.classList.remove('scrolled');
            closeMobileMenu(true);
        }
    };

    updateNavState();
    window.addEventListener('scroll', updateNavState, { passive: true });

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            if (!navbar.classList.contains('scrolled')) return;
            const isOpen = navbar.classList.toggle('menu-open');
            mobileMenuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            if (!isOpen) mobileMenuToggle.blur();
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => closeMobileMenu(true));
    });

    document.addEventListener('pointerdown', (event) => {
        if (!navbar.classList.contains('menu-open')) return;
        if (navbar.contains(event.target)) return;
        closeMobileMenu(true);
    });

    window.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        if (!navbar.classList.contains('menu-open')) return;
        closeMobileMenu(true);
    });
}

function initCarousel() {
    const track = document.querySelector('.carousel-track');
    if(!track) return;
}

// CERTIFICADO DE SOCIO GENERATOR (Real implementation using jsPDF)
function generarCertificado(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = "Procesando pago...";
    btn.disabled = true;
    
    setTimeout(() => {
        const nombre = document.getElementById('nombre').value;
        const rut = document.getElementById('rut').value;
        const folio = "CDP-" + Math.floor(1000 + Math.random() * 9000);

        // 1. Clear previous QR if exists
        const qrContainer = document.getElementById("qrcode");
        qrContainer.innerHTML = "";
        qrContainer.style.display = "block";

        // 2. Generate QR Code
        const urlVerificacion = `https://clubdeportivopullally.cl/validar?folio=${folio}`;
        const qrcode = new QRCode(qrContainer, {
            text: urlVerificacion,
            width: 100,
            height: 100
        });

        setTimeout(() => {
            const qrCanvas = qrContainer.querySelector('canvas');
            const qrImgData = qrCanvas.toDataURL("image/png");
            
            // hide QR div after generation
            qrContainer.style.display = "none";

            // 3. Create PDF
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Style headers
            doc.setFillColor(0, 104, 55); // #006837 Verde
            doc.rect(0, 0, 210, 30, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(18);
            doc.text("CLUB DEPORTIVO PULLALLY", 105, 18, { align: "center" });

            doc.setTextColor(40, 40, 40);
            doc.setFontSize(14);
            doc.text("CERTIFICADO OFICIAL DE SOCIO", 105, 45, { align: "center" });

            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            doc.text(`Folio N°: ${folio}`, 20, 60);
            doc.text(`Fecha: ${new Date().toLocaleDateString('es-CL')}`, 150, 60);

            const textoCentral = `El Club Deportivo Pullally, fundado el 26 de noviembre de 1926 en la comuna de Papudo, certifica que:`;
            doc.text(textoCentral, 20, 75);

            // Data Box
            doc.setFillColor(245, 245, 245);
            doc.rect(20, 85, 170, 30, 'F');
            doc.setFont("helvetica", "bold");
            doc.text(`Nombre: ${nombre}`, 30, 98);
            doc.text(`RUT: ${rut}`, 30, 108);

            doc.setFont("helvetica", "normal");
            doc.text("Se encuentra registrado como socio ACTIVO de la institución, con sus derechos y deberes al día.", 20, 130, { maxWidth: 170 });

            // Add QR
            doc.addImage(qrImgData, 'PNG', 20, 150, 35, 35);
            doc.setFontSize(9);
            doc.text("Escanee este código QR para comprobar", 60, 165);
            doc.text("la validez oficial de este documento.", 60, 170);

            // Signature simulation
            doc.setDrawColor(150, 150, 150);
            doc.line(130, 175, 185, 175);
            doc.text("Directiva General", 157, 180, { align: "center" });
            doc.text("CD Pullally", 157, 185, { align: "center" });

            doc.save(`Certificado_Socio_${folio}.pdf`);

            alert("¡Pago Exitoso! Tu certificado de socio se ha descargado.");
            btn.innerHTML = originalText;
            btn.disabled = false;
            e.target.reset(); // clear form
        }, 500); // wait for qr to render
    }, 1500); // simulate payment network delay
}
