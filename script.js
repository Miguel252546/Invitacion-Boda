document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // DOM MANAGER
    // Centralizes all element selections to avoid repetitive document.getElementById
    // =========================================================================
    const DOM = {
        mainContent: document.getElementById('mainContent'),
        audio: document.getElementById('bgMusic'),
        musicBtn: document.getElementById('musicBtn'),
        musicIcon: document.getElementById('musicIcon'),
        weddingVideo: document.getElementById('bgVideo'),
        videoOverlay: document.getElementById('videoOverlay'),
        galleryItems: document.querySelectorAll('.gallery-item'),
        lightbox: document.getElementById('lightbox'),
        lightboxImg: document.getElementById('lightboxImg'),
        lightboxClose: document.getElementById('lightboxClose'),
        whatsappBtn: document.getElementById('whatsappBtn'),
        dropdownMenu: document.getElementById('dropdownMenu'),
        heroImage: document.querySelector('.hero-image'),
        // Particles containers
        particles: {
            hero: document.getElementById('heroParticles'),
            countdown: document.getElementById('countdownParticles'),
            rsvp: document.getElementById('rsvpParticles'),
            footer: document.getElementById('footerParticles'),
            detalles: document.getElementById('detallesParticles'),
        }
    };

    // =========================================================================
    // MUSIC MANAGER
    // Handles all audio logic and user interaction requirements
    // =========================================================================
    const MusicManager = {
        isPlaying: false,
        hasInteracted: false,

        init() {
            if (!DOM.audio) return;
            DOM.audio.volume = 0.25;

            const tryPlay = () => {
                if (!this.hasInteracted) {
                    DOM.audio.play().then(() => {
                        this.setPlaying(true);
                    }).catch(() => { });
                    this.hasInteracted = true;
                }
            };

            document.addEventListener('click', tryPlay, { once: true });
            document.addEventListener('touchstart', tryPlay, { once: true });

            DOM.musicBtn?.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this.isPlaying) {
                    this.pause();
                } else {
                    this.play();
                }
            });
        },

        play() {
            DOM.audio.play().then(() => this.setPlaying(true));
        },

        pause() {
            DOM.audio.pause();
            this.setPlaying(false);
        },

        setPlaying(state) {
            this.isPlaying = state;
            if (DOM.musicBtn) {
                state ? DOM.musicBtn.classList.add('playing') : DOM.musicBtn.classList.remove('playing');
            }
            if (DOM.musicIcon) {
                DOM.musicIcon.className = state ? 'fas fa-volume-up' : 'fas fa-music';
            }
        }
    };

    // =========================================================================
    // VIDEO MANAGER
    // Handles the complex interaction of the video overlay and playback
    // =========================================================================
    const VideoManager = {
        init() {
            if (!DOM.videoOverlay || !DOM.weddingVideo) return;

            DOM.videoOverlay.style.cursor = 'pointer';
            DOM.videoOverlay.style.pointerEvents = 'auto';

            DOM.videoOverlay.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handlePlay();
            });

            DOM.weddingVideo.addEventListener('click', (e) => e.stopPropagation());
            DOM.weddingVideo.style.pointerEvents = 'auto';
        },

        handlePlay() {
            const overlay = DOM.videoOverlay;
            const video = DOM.weddingVideo;

            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
            overlay.style.visibility = 'hidden';

            setTimeout(() => {
                overlay.classList.add('hidden');
                video.classList.add('active');
                video.style.opacity = '1';
                video.style.zIndex = '10';
                video.style.pointerEvents = 'auto';
                video.muted = false;
                video.volume = 1;

                video.play().catch(err => {
                    console.error('Error playing video:', err);
                    this.resetOverlay();
                });
            }, 500);
        },

        resetOverlay() {
            DOM.videoOverlay.style.opacity = '1';
            DOM.videoOverlay.style.pointerEvents = 'auto';
            DOM.videoOverlay.style.visibility = 'visible';
            DOM.videoOverlay.classList.remove('hidden');
            DOM.weddingVideo.classList.remove('active');
            DOM.weddingVideo.style.opacity = '0';
        }
    };

    // =========================================================================
    // GALLERY MANAGER
    // Handles lightbox logic and lazy loading
    // =========================================================================
    const GalleryManager = {
        init() {
            if (DOM.galleryItems.length === 0) return;

            DOM.galleryItems.forEach(item => {
                item.addEventListener('click', () => {
                    const img = item.querySelector('img');
                    if (img && DOM.lightboxImg && DOM.lightbox) {
                        DOM.lightboxImg.src = img.src;
                        DOM.lightbox.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }
                });

                // Lazy load check
                const img = item.querySelector('img');
                if (img) {
                    if (img.complete) img.classList.add('loaded');
                    else img.addEventListener('load', () => img.classList.add('loaded'));
                }
            });

            DOM.lightboxClose?.addEventListener('click', () => this.close());
            DOM.lightbox?.addEventListener('click', (e) => {
                if (e.target === DOM.lightbox) this.close();
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.close();
            });
        },

        close() {
            if (DOM.lightbox) {
                DOM.lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    };

    // =========================================================================
    // COUNTDOWN MANAGER
    // Logic for the time remaining until the wedding
    // =========================================================================
    const CountdownManager = {
        targetDate: new Date('2027-05-15T15:00:00').getTime(),

        init() {
            this.update();
            setInterval(() => this.update(), 1000);
        },

        update() {
            const now = new Date().getTime();
            const distance = this.targetDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            this.animateValue('days', days);
            this.animateValue('hours', hours);
            this.animateValue('minutes', minutes);
            this.animateValue('seconds', seconds);
        },

        animateValue(id, value) {
            const el = document.getElementById(id);
            if (!el) return;
            const newValue = String(value).padStart(2, '0');
            if (el.textContent !== newValue) {
                // For seconds, we change the value instantly to avoid the "pulsing" effect
                if (id === 'seconds') {
                    el.textContent = newValue;
                    return;
                }

                // Refined animation for days, hours, and minutes
                gsap.to(el, {
                    scale: 1.05,
                    duration: 0.05,
                    ease: 'power1.out',
                    onComplete: () => {
                        el.textContent = newValue;
                        gsap.to(el, { scale: 1, duration: 0.1, ease: 'power1.in' });
                    }
                });
            }
        }
    };

    // =========================================================================
    // ANIMATION MANAGER
    // All GSAP and visual movement logic
    // =========================================================================
    const AnimationManager = {
        init() {
            gsap.registerPlugin(ScrollTrigger);
            this.initHeroParallax();
            this.initScrollAnimations();
            this.initParticles();
        },

        initHeroParallax() {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                if (DOM.heroImage && scrolled < window.innerHeight) {
                    DOM.heroImage.style.transform = `scale(${1.1 + scrolled * 0.0003}) translateY(${scrolled * 0.3}px)`;
                }
            });
        },

        initParticles() {
            const createParticles = (container, count, className, customStyle = '') => {
                if (!container) return;
                for (let i = 0; i < count; i++) {
                    const p = document.createElement('div');
                    p.className = className;
                    p.style.left = Math.random() * 100 + '%';
                    if (customStyle) p.style.cssText += customStyle;
                    container.appendChild(p);
                }
            };

            createParticles(DOM.particles.hero, 35, 'hero-particle');
            createParticles(DOM.particles.countdown, 25, 'section-particle');
            createParticles(DOM.particles.rsvp, 30, 'section-particle', 'bottom: 0; animation: floatUp 8s ease-in-out infinite; animation-delay: ' + (Math.random() * 8) + 's');
            createParticles(DOM.particles.footer, 25, 'section-particle');
            createParticles(DOM.particles.detalles, 25, 'section-particle');
        },

        initScrollAnimations() {
            // Opening
            gsap.from('.deco-line', {
                scrollTrigger: { trigger: '.opening', start: 'top 80%', toggleActions: 'play none none reverse' },
                opacity: 0, scale: 0, duration: 1, ease: 'back.out(1.7)'
            });
            gsap.from('.opening-text', {
                scrollTrigger: { trigger: '.opening', start: 'top 75%', toggleActions: 'play none none reverse' },
                opacity: 0, y: 60, duration: 1, delay: 0.2
            });
            gsap.from('.names-line', {
                scrollTrigger: { trigger: '.opening', start: 'top 70%', toggleActions: 'play none none reverse' },
                opacity: 0, y: 40, duration: 1, delay: 0.4
            });

            // Other sections
            gsap.from('.count-box', {
                scrollTrigger: { trigger: '.countdown', start: 'top 80%', toggleActions: 'play none none reverse' },
                opacity: 0, y: 50, scale: 0.8, duration: 0.8, stagger: 0.15, ease: 'back.out(1.4)'
            });
            gsap.from('.parent-card', {
                scrollTrigger: { trigger: '.parents', start: 'top 80%', toggleActions: 'play none none reverse' },
                opacity: 0, y: 60, duration: 1, stagger: 0.25
            });
            gsap.from('.parent-heart', {
                scrollTrigger: { trigger: '.parents', start: 'top 75%', toggleActions: 'play none none reverse' },
                opacity: 0, scale: 0, rotation: -180, duration: 1, ease: 'back.out(1.7)'
            });
            gsap.from('.gallery-item', {
                scrollTrigger: { trigger: '.gallery', start: 'top 80%', toggleActions: 'play none none reverse' },
                opacity: 0, y: 70, duration: 0.8, stagger: 0.1
            });
            gsap.from('.video-box', {
                scrollTrigger: { trigger: '.video-section', start: 'top 70%', toggleActions: 'play none none reverse' },
                opacity: 0, y: 60, scale: 0.95, duration: 1.2
            });
            gsap.from('.detalle-card', {
                scrollTrigger: { trigger: '.detalles', start: 'top 80%' },
                opacity: 0, y: 50, duration: 0.8, stagger: 0.2
            });
            gsap.from('.regalos .regalo-card', {
                scrollTrigger: { trigger: '.regalos', start: 'top 80%', toggleActions: 'play none none reverse' },
                opacity: 0, scale: 0.8, y: 50, duration: 1, ease: 'back.out(1.4)'
            });
            gsap.from('.rsvp-icon', {
                scrollTrigger: { trigger: '.rsvp', start: 'top 75%', toggleActions: 'play none none reverse' },
                opacity: 0, scale: 0, duration: 0.8, ease: 'back.out(1.7)'
            });
            gsap.from('.rsvp-question', {
                scrollTrigger: { trigger: '.rsvp', start: 'top 70%', toggleActions: 'play none none reverse' },
                opacity: 0, y: 80, duration: 1.2, delay: 0.2
            });
            gsap.from('.rsvp-text', {
                scrollTrigger: { trigger: '.rsvp', start: 'top 60%', toggleActions: 'play none none reverse' },
                opacity: 0, y: 40, duration: 0.8, delay: 0.4
            });
            gsap.from('.rsvp-btn', {
                scrollTrigger: { trigger: '.rsvp', start: 'top 55%', toggleActions: 'play none none reverse' },
                opacity: 0, y: 30, scale: 0.9, duration: 0.8, delay: 0.5, ease: 'back.out(1.4)'
            });
            gsap.from('.footer-hearts i', {
                scrollTrigger: { trigger: '.footer', start: 'top 90%', toggleActions: 'play none none reverse' },
                opacity: 0, scale: 0, duration: 0.5, stagger: 0.15, ease: 'back.out(1.7)'
            });
            gsap.from('.footer-names', {
                scrollTrigger: { trigger: '.footer', start: 'top 85%', toggleActions: 'play none none reverse' },
                opacity: 0, y: 30, duration: 1, delay: 0.3
            });
            gsap.from('.footer-date, .footer-tag', {
                scrollTrigger: { trigger: '.footer', start: 'top 80%', toggleActions: 'play none none reverse' },
                opacity: 0, y: 20, duration: 0.8, stagger: 0.15, delay: 0.5
            });

            // Anuncios en el footer (entrada premium)
            gsap.from('.ads-rail', {
                scrollTrigger: { trigger: '.ads-rail', start: 'top 92%', toggleActions: 'play none none reverse' },
                opacity: 0, x: 30, duration: 0.9, delay: 0.5, ease: 'power3.out'
            });
            gsap.from('.ads-card', {
                scrollTrigger: { trigger: '.ads-rail', start: 'top 90%', toggleActions: 'play none none reverse' },
                opacity: 0, y: 20, scale: 0.96, duration: 0.7, stagger: 0.15, delay: 0.7, ease: 'power3.out'
            });

            gsap.from('.float-btns', {
                opacity: 0, x: 100, duration: 1, delay: 0.5
            });
        }
    };

    // =========================================================================
    // UI EFFECTS MANAGER
    // Minor visual effects: tilt, magnetic buttons, glow, and dropdowns
    // =========================================================================
    const UIEffects = {
        init() {
            this.initWhatsAppDropdown();
            this.initMagneticButtons();
            this.initCardTilt();
            this.initCursorGlow();
            this.initSmoothScroll();
        },

        initWhatsAppDropdown() {
            if (!DOM.whatsappBtn || !DOM.dropdownMenu) return;
            DOM.whatsappBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                DOM.dropdownMenu.classList.toggle('active');
            });
            document.addEventListener('click', (e) => {
                if (!DOM.whatsappBtn.contains(e.target) && !DOM.dropdownMenu.contains(e.target)) {
                    DOM.dropdownMenu.classList.remove('active');
                }
            });
        },

        initMagneticButtons() {
            const btns = document.querySelectorAll('.rsvp-btn, .hero-btn, .detail-btn');
            btns.forEach(btn => {
                btn.addEventListener('mousemove', (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    gsap.to(btn, { x: x * 0.15, y: y * 0.15, duration: 0.3 });
                });
                btn.addEventListener('mouseleave', () => {
                    gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
                });
            });
        },

        initCardTilt() {
            const cards = document.querySelectorAll('.detail-card, .parent-card');
            cards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    gsap.to(card, {
                        rotateY: (rect.width / 2 - x) / 25,
                        rotateX: (y - rect.height / 2) / 25,
                        duration: 0.3
                    });
                });
                card.addEventListener('mouseleave', () => {
                    gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
                });
            });
        },

        initCursorGlow() {
            const glow = document.createElement('div');
            glow.style.cssText = `
                position: fixed;
                width: 500px;
                height: 500px;
                background: radial-gradient(circle, rgba(135, 206, 235, 0.08) 0%, transparent 70%);
                pointer-events: none;
                z-index: 9999;
                transform: translate(-50%, -50%);
                opacity: 0;
                transition: opacity 0.3s;
            `;
            document.body.appendChild(glow);
            document.addEventListener('mousemove', (e) => {
                glow.style.left = e.clientX + 'px';
                glow.style.top = e.clientY + 'px';
                glow.style.opacity = '1';
            });
            document.addEventListener('mouseleave', () => glow.style.opacity = '0');
        },

        initSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            });
        }
    };

    // =========================================================================
    // ADVERTISING RAIL (lateral, refinada)
    // Bloque compacto de publicidad a un costado del footer.
    // Cada anuncio es una mini-tarjeta con thumbnail + texto.
    // Para añadir/quitar anuncios, edita el array `ads`.
    // Esquema: id, image (opcional), imageFallback, tag, title, url, target.
    // =========================================================================
    const AdsManager = {
        // Catálogo de anuncios. Edita libremente este array.
        // Si el array queda vacío, la sección se oculta automáticamente.
        ads: [
            {
                id: 'sample-1',
                image: '',
                imageFallback: '♥',
                tag: 'Oferta',
                title: 'Ahorra más en tus compras',
                url: '#',
                target: '_blank'
            },
            {
                id: 'sample-2',
                image: '',
                imageFallback: '✦',
                tag: 'Recomendado',
                title: 'Tu luna de miel',
                url: '#',
                target: '_blank'
            }
        ],

        init() {
            const section = document.getElementById('adsSection');
            const list = document.getElementById('adsTrack');
            if (!section || !list) return;

            // Si no hay anuncios, ocultar la sección completa
            if (!this.ads || this.ads.length === 0) {
                section.style.display = 'none';
                return;
            }

            this.renderCards(list);
        },

        renderCards(container) {
            container.innerHTML = '';

            this.ads.forEach((ad) => {
                const card = document.createElement('a');
                card.className = 'ads-card';
                card.href = ad.url || '#';
                card.target = ad.target || '_blank';
                card.rel = card.target === '_blank' ? 'noopener noreferrer' : '';
                card.setAttribute('aria-label', `${ad.title || 'Publicidad'}`);

                const thumbHTML = ad.image
                    ? `<img src="${ad.image}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                       <span class="ads-thumb-fallback" style="display:none;">${ad.imageFallback || '★'}</span>`
                    : `<span class="ads-thumb-fallback">${ad.imageFallback || '★'}</span>`;

                card.innerHTML = `
                    <div class="ads-thumb" aria-hidden="true">${thumbHTML}</div>
                    <div class="ads-content">
                        ${ad.tag ? `<span class="ads-tag">${ad.tag}</span>` : ''}
                        <h3 class="ads-title">${ad.title || ''}</h3>
                    </div>
                    <i class="fas fa-chevron-right ads-arrow" aria-hidden="true"></i>
                `;

                container.appendChild(card);
            });
        }
    };

    // =========================================================================
    // APP CONTROLLER
    // Orchestrates the initialization of the entire application
    // =========================================================================
    const App = {
        init() {
            if (!DOM.mainContent) return;

            DOM.mainContent.style.display = 'block';
            DOM.mainContent.style.opacity = '0';

            gsap.to(DOM.mainContent, {
                opacity: 1,
                duration: 1,
                onComplete: () => this.startModules()
            });
        },

        startModules() {
            MusicManager.init();
            VideoManager.init();
            GalleryManager.init();
            CountdownManager.init();
            AnimationManager.init();
            UIEffects.init();
            AdsManager.init();
            console.log('Wedding App: All modules initialized successfully.');
        }
    };

    App.init();
});
