document.addEventListener('DOMContentLoaded', () => {
    // =====================
    // DOM ELEMENTS
    // =====================
    const mainContent = document.getElementById('mainContent');
    const audio = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicBtn');
    const musicIcon = document.getElementById('musicIcon');
    const playBtn = document.getElementById('playBtn');
    const weddingVideo = document.getElementById('weddingVideo');
    const videoBox = document.querySelector('.video-box');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const whatsappBtn = document.getElementById('whatsappBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');

    let isPlaying = false;
    let hasInteracted = false;

    // =====================
    // MAIN CONTENT
    // =====================
    function initMain() {
        mainContent.style.display = 'block';
        mainContent.style.opacity = '0';

        gsap.to(mainContent, {
            opacity: 1,
            duration: 1,
            onComplete: () => {
                initParticles();
                initAnimations();
                initMusic();
                initScrollAnimations();
            }
        });
    }

    // =====================
    // PARTICLES
    // =====================
    function initParticles() {
        // Hero particles
        const heroParticles = document.getElementById('heroParticles');
        for (let i = 0; i < 35; i++) {
            const p = document.createElement('div');
            p.className = 'hero-particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDelay = Math.random() * 10 + 's';
            p.style.animationDuration = (10 + Math.random() * 8) + 's';
            heroParticles.appendChild(p);
        }

        // Countdown particles
        const countdownParticles = document.getElementById('countdownParticles');
        for (let i = 0; i < 25; i++) {
            const p = document.createElement('div');
            p.className = 'section-particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.top = Math.random() * 100 + '%';
            p.style.opacity = Math.random() * 0.2 + 0.05;
            countdownParticles.appendChild(p);
        }

        // RSVP particles
        const rsvpParticles = document.getElementById('rsvpParticles');
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('div');
            p.className = 'section-particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.bottom = '0';
            p.style.animation = `floatUp ${8 + Math.random() * 6}s ease-in-out infinite`;
            p.style.animationDelay = Math.random() * 8 + 's';
            rsvpParticles.appendChild(p);
        }

        // Footer particles
        const footerParticles = document.getElementById('footerParticles');
        for (let i = 0; i < 25; i++) {
            const p = document.createElement('div');
            p.className = 'section-particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.bottom = '0';
            p.style.opacity = Math.random() * 0.15 + 0.05;
            footerParticles.appendChild(p);
        }

        // Detalles particles
        const detallesParticles = document.getElementById('detallesParticles');
        if (detallesParticles) {
            for (let i = 0; i < 25; i++) {
                const p = document.createElement('div');
                p.className = 'section-particle';
                p.style.cssText = `
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation-delay: ${Math.random() * 10}s;
                `;
                detallesParticles.appendChild(p);
            }
        }
    }

    // =====================
    // MUSIC CONTROL
    // =====================
    function initMusic() {
        audio.volume = 0.25;

        const tryPlay = () => {
            if (!hasInteracted) {
                audio.play().then(() => {
                    isPlaying = true;
                    musicBtn.classList.add('playing');
                    musicIcon.className = 'fas fa-volume-up';
                }).catch(() => { });
                hasInteracted = true;
            }
        };

        document.addEventListener('click', tryPlay, { once: true });
        document.addEventListener('touchstart', tryPlay, { once: true });

        musicBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            tryPlay();

            if (isPlaying) {
                audio.pause();
                isPlaying = false;
                musicBtn.classList.remove('playing');
                musicIcon.className = 'fas fa-music';
            } else {
                audio.play().then(() => {
                    isPlaying = true;
                    musicBtn.classList.add('playing');
                    musicIcon.className = 'fas fa-volume-up';
                });
            }
        });
    }

    // =====================
    // WHATSAPP DROPDOWN
    // =====================
    if (whatsappBtn && dropdownMenu) {
        whatsappBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!whatsappBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('active');
            }
        });
    }

    // =====================
    // VIDEO CONTROL
    // =====================
    // if (playBtn && weddingVideo && videoBox) {
    //     playBtn.addEventListener('click', () => {
    //         weddingVideo.play();
    //         videoBox.classList.add('playing');
    //     });

    //     weddingVideo.addEventListener('click', () => {
    //         if (weddingVideo.paused) {
    //             weddingVideo.play();
    //             videoBox.classList.add('playing');
    //         } else {
    //             weddingVideo.pause();
    //             videoBox.classList.remove('playing');
    //         }
    //     });
    // }
    // ==================== VIDEO CONTROL ====================
    function initVideoControl() {
        const videoOverlay = document.getElementById('videoOverlay');
        const video = document.getElementById('bgVideo');
        const videoWrapper = document.querySelector('.video-wrapper');

        console.log('initVideoControl: Inicializando control de video...');
        console.log('videoOverlay encontrado:', !!videoOverlay);
        console.log('video encontrado:', !!video);

        if (!videoOverlay || !video) {
            console.error('CRITICO: Video overlay o elemento de video no encontrado');
            return;
        }

        // Asegurar que el overlay es clickeable
        videoOverlay.style.cursor = 'pointer';
        videoOverlay.style.pointerEvents = 'auto';

        console.log('Agregando listener de click al overlay...');

        // Al hacer click en overlay, reproducir video
        videoOverlay.addEventListener('click', (e) => {
            console.log('Click detectado en overlay');
            e.preventDefault();
            e.stopPropagation();

            // Fade out del overlay
            videoOverlay.style.opacity = '0';
            videoOverlay.style.pointerEvents = 'none';
            videoOverlay.style.visibility = 'hidden';
            console.log('Desvaneciendo overlay...');

            setTimeout(() => {
                videoOverlay.classList.add('hidden');
                console.log('Overlay completamente oculto');

                // Agregar clase active al video para fade-in
                video.classList.add('active');
                // Asegurar visibilidad directa por JavaScript (fallback)
                video.style.opacity = '1';
                video.style.zIndex = '10';
                video.style.pointerEvents = 'auto';
                console.log('Clase active anadida al video, opacidad:', video.style.opacity);

                // Asegurar que el video no esta silenciado
                video.muted = false;
                video.volume = 1;
                console.log('Video desmutado, volumen:', video.volume);

                // Reproducir video
                console.log('Intentando reproducir video...');
                const playPromise = video.play();

                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            console.log('Video reproduciendo correctamente');
                        })
                        .catch(err => {
                            console.error('Error al reproducir video:', err.name);
                            console.error('Detalles del error:', err.message);
                            console.error('Codigo:', err.code);
                            // Mostrar mensaje al usuario
                            videoOverlay.style.opacity = '1';
                            videoOverlay.style.pointerEvents = 'auto';
                            videoOverlay.style.visibility = 'visible';
                            videoOverlay.classList.remove('hidden');
                            video.classList.remove('active');
                            video.style.opacity = '0';
                            video.style.zIndex = '1';
                        });
                } else {
                    console.warn('Play promise es undefined');
                }
            }, 500);
        });

        // Permitir que se pueda hacer click en el video tambien (para controles)
        video.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Permitir que los controles sean totalmente interactuables
        video.style.pointerEvents = 'auto';

        console.log('initVideoControl completado');
    }

    // =====================
    // GALLERY LIGHTBOX
    // =====================
    if (galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (img && lightboxImg && lightbox) {
                    lightboxImg.src = img.src;
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) closeLightbox();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });

        function closeLightbox() {
            if (lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        // Lazy load images
        galleryItems.forEach(item => {
            const img = item.querySelector('img');
            if (img) {
                if (img.complete) {
                    img.classList.add('loaded');
                } else {
                    img.addEventListener('load', () => img.classList.add('loaded'));
                }
            }
        });
    }

    // =====================
    // COUNTDOWN
    // =====================
    function updateCountdown() {
        const weddingDate = new Date('2027-05-15T15:00:00').getTime();
        const now = new Date().getTime();
        const distance = weddingDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        animateNumber('days', days);
        animateNumber('hours', hours);
        animateNumber('minutes', minutes);
        animateNumber('seconds', seconds);
    }

    function animateNumber(id, value) {
        const el = document.getElementById(id);
        if (el) {
            const newValue = String(value).padStart(2, '0');
            if (el.textContent !== newValue) {
                gsap.to(el, {
                    scale: 1.15,
                    duration: 0.1,
                    onComplete: () => {
                        el.textContent = newValue;
                        gsap.to(el, { scale: 1, duration: 0.1 });
                    }
                });
            }
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // =====================
    // GSAP ANIMATIONS
    // =====================
    function initAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Hero parallax
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroImage = document.querySelector('.hero-image');
            if (heroImage && scrolled < window.innerHeight) {
                heroImage.style.transform = `scale(${1.1 + scrolled * 0.0003}) translateY(${scrolled * 0.3}px)`;
            }
        });
    }

    function initScrollAnimations() {
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

        // Countdown
        gsap.from('.count-box', {
            scrollTrigger: { trigger: '.countdown', start: 'top 80%', toggleActions: 'play none none reverse' },
            opacity: 0, y: 50, scale: 0.8, duration: 0.8, stagger: 0.15, ease: 'back.out(1.4)'
        });

        // Parents
        const parentCards = document.querySelectorAll('.parent-card');
        if (parentCards.length > 0) {
            gsap.from('.parent-card', {
                scrollTrigger: { trigger: '.parents', start: 'top 80%', toggleActions: 'play none none reverse' },
                opacity: 0, y: 60, duration: 1, stagger: 0.25
            });
            gsap.from('.parent-heart', {
                scrollTrigger: { trigger: '.parents', start: 'top 75%', toggleActions: 'play none none reverse' },
                opacity: 0, scale: 0, rotation: -180, duration: 1, ease: 'back.out(1.7)'
            });
        }

        // Gallery
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (galleryItems.length > 0) {
            gsap.from('.gallery-item', {
                scrollTrigger: { trigger: '.gallery', start: 'top 80%', toggleActions: 'play none none reverse' },
                opacity: 0, y: 70, duration: 0.8, stagger: 0.1
            });
        }

        // Video
        const videoBox = document.querySelector('.video-box');
        if (videoBox) {
            gsap.from('.video-box', {
                scrollTrigger: { trigger: '.video-section', start: 'top 70%', toggleActions: 'play none none reverse' },
                opacity: 0, y: 60, scale: 0.95, duration: 1.2
            });
        }

        // Detalles
        const detalleCards = document.querySelectorAll('.detalle-card');
        if (detalleCards.length > 0) {
            gsap.from('.detalle-card', {
                scrollTrigger: { trigger: '.detalles', start: 'top 80%' },
                opacity: 0, y: 50, duration: 0.8, stagger: 0.2
            });
        }

        // Regalos
        const regaloCard = document.querySelector('.regalo-card');
        if (regaloCard) {
            gsap.from('.regalo-card', {
                scrollTrigger: { trigger: '.regalos', start: 'top 80%', toggleActions: 'play none none reverse' },
                opacity: 0, scale: 0.8, y: 50, duration: 1, ease: 'back.out(1.4)'
            });
        }

        // RSVP
        const rsvpSection = document.querySelector('.rsvp');
        if (rsvpSection) {
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
        }

        // Footer
        const footer = document.querySelector('.footer');
        if (footer) {
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
        }

        // Floating buttons
        const floatBtns = document.querySelector('.float-btns');
        if (floatBtns) {
            gsap.from('.float-btns', {
                opacity: 0, x: 100, duration: 1, delay: 0.5
            });
        }
    }

    // =====================
    // SMOOTH SCROLL
    // =====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // =====================
    // BUTTON EFFECTS
    // =====================
    const magneticBtns = document.querySelectorAll('.rsvp-btn, .hero-btn, .detail-btn');
    magneticBtns.forEach(btn => {
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

    // =====================
    // CARD TILT
    // =====================
    const tiltCards = document.querySelectorAll('.detail-card, .parent-card');
    tiltCards.forEach(card => {
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

    // =====================
    // CURSOR GLOW
    // =====================
    const cursorGlow = document.createElement('div');
    cursorGlow.style.cssText = `
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
    document.body.appendChild(cursorGlow);

    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
        cursorGlow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });

    // =====================
    // INITIALIZE
    // =====================
    initMain();
    initVideoControl();
});