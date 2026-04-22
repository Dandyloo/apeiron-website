// main.js — runs on every page

// utils
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// navbar
function initNavbar() {
    const navbar   = $('#navbar');
    const toggle   = $('#navToggle');
    const navLinks = $('#navLinks');
    if (!navbar) return;

    // Scroll morph
    const onScroll = () => {
        navbar.classList.toggle('is-scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile toggle
    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            const open = toggle.classList.toggle('is-open');
            navLinks.classList.toggle('is-open', open);
            document.body.style.overflow = open ? 'hidden' : '';
        });

        // Close on link click
        $$('.nav-link', navLinks).forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('is-open');
                navLinks.classList.remove('is-open');
                document.body.style.overflow = '';
            });
        });

        // Close on outside click
        document.addEventListener('click', e => {
            if (!navbar.contains(e.target)) {
                toggle.classList.remove('is-open');
                navLinks.classList.remove('is-open');
                document.body.style.overflow = '';
            }
        });
    }

    // Mark active link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    $$('.nav-link').forEach(link => {
        const href = link.getAttribute('href').split('/').pop();
        link.classList.toggle('is-active', href === currentPath);
    });
}

// scroll reveal
function initScrollReveal() {
    const targets = $$('.scroll-reveal, .reveal-left, .reveal-right');
    if (!targets.length) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

    targets.forEach(el => io.observe(el));
}

// counter animation
function animateCount(el) {
    const raw    = el.textContent.trim();
    const suffix = raw.replace(/[\d.]/g, '');
    const target = parseFloat(raw);
    if (isNaN(target)) return;

    const duration = 1800;
    const start    = performance.now();

    const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        // easeOutExpo
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const val  = Math.round(ease * target * 10) / 10;
        el.textContent = Number.isInteger(target) ? Math.round(val) + suffix : val + suffix;
        if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
}

function initCounters() {
    const countEls = $$('.stat-box-num, .about-stat-num, .overview-stat-num');
    if (!countEls.length) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.counted) {
                entry.target.dataset.counted = 'true';
                animateCount(entry.target);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    countEls.forEach(el => io.observe(el));
}

// team panel
const teamData = {
    1: {
        name: 'Emmanuella Chinenye',
        role: 'Admin & Creative Assistant',
        bio: "Hi! Emmanuella here! I'm the Admin and Creative Assistant here at Apeiron, and I've been here for 3 years. I love being a creative assistant because I get to bring ideas to life and watch brands transform through strategic creativity. When I'm not working on campaigns, I enjoy exploring new design trends and mentoring young creatives. My favourite kind of project to work on is brand identity design — there's something magical about creating a visual language that truly represents a business.",
        social: [
            { label: 'LinkedIn', url: 'https://linkedin.com' },
            { label: 'Instagram', url: 'https://instagram.com' },
        ],
    },
    2: {
        name: 'Aziz',
        role: 'Senior Graphic Designer',
        bio: "Hi! Aziz here! I'm a Senior Graphic Designer here at Apeiron, and I've been here for 2 years and 6 months. I love being a graphic designer because every project is a new canvas to tell a visual story. When I'm sitting behind a screen, putting an awesome design together, it almost feels like I am a conductor of an orchestra. Outside of design, I enjoy exploring new art exhibitions and experimenting with different creative mediums. My favourite kind of project to work on is social media campaigns.",
        social: [
            { label: 'Behance', url: 'https://behance.net' },
            { label: 'Instagram', url: 'https://instagram.com' },
        ],
    },
    3: {
        name: 'Abel',
        role: 'Graphic Designer',
        bio: "Hi! Abel here! I'm a Graphic Designer here at Apeiron, and I've been here for 1 year and 2 months. I love being a graphic designer because when I'm sitting behind a screen, putting an awesome design together, it almost feels like I am a conductor of an orchestra directing elements together to form a visual masterpiece. And I'm absolutely hooked on that feeling, lol. Outside of design, I really enjoy reading works of fiction by African authors and watching animated TV shows. My favourite kind of project to work on is identity design.",
        social: [
            { label: 'Dribbble', url: 'https://dribbble.com' },
            { label: 'Twitter', url: 'https://twitter.com' },
        ],
    },
    4: {
        name: 'Emmanuel Ntim',
        role: 'Web Developer',
        bio: "Hi! Emmanuel here! I'm a Web Developer here at Apeiron, where I help build and maintain our website. I enjoy turning ideas into functional and user-friendly pages that improve our online presence. When I'm not coding, I'm usually on the tennis court.",
        social: [
            { label: 'LinkedIn', url: 'https://linkedin.com' },
            { label: 'GitHub', url: 'https://github.com' },
        ],
    },
};

function initTeamPanel() {
    const overlay = $('.team-panel-overlay');
    const panel   = $('.team-panel');
    const closeBtn = $('.team-panel-close');
    if (!panel || !overlay) return;

    // panel inner refs
    const nameEl    = panel.querySelector('.team-panel-name');
    const roleEl    = panel.querySelector('.team-panel-role');
    const bioEl     = panel.querySelector('.team-panel-bio');
    const socialsEl = panel.querySelector('.team-panel-socials');

    function openPanel(id) {
        const member = teamData[id];
        if (!member) return;

        if (nameEl)    nameEl.textContent = member.name;
        if (roleEl)    roleEl.textContent = member.role;
        if (bioEl)     bioEl.textContent  = member.bio;
        if (socialsEl) {
            socialsEl.innerHTML = member.social
                .map(s => `<a href="${s.url}" target="_blank" rel="noopener" class="team-panel-social-btn">${s.label}</a>`)
                .join('');
        }

        panel.classList.add('is-open');
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closePanel() {
        panel.classList.remove('is-open');
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    // Card clicks
    $$('.team-card').forEach(card => {
        card.addEventListener('click', () => openPanel(card.dataset.member));
    });

    if (closeBtn) closeBtn.addEventListener('click', closePanel);
    overlay.addEventListener('click', closePanel);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closePanel();
    });
}

// videos
function initVideos() {
    const videos = $$('.video-wrapper video');
    videos.forEach(video => {
        // Support both old .video-play-overlay and new .iphone-play-btn
        const overlay = video.closest('.video-wrapper')?.querySelector('.video-play-overlay, .iphone-play-btn');
        if (!overlay) return;
 
        video.addEventListener('play', () => {
            // New iphone-play-btn uses CSS class; old overlay used display
            if (overlay.classList.contains('iphone-play-btn')) {
                overlay.classList.add('is-playing');
            } else {
                overlay.style.display = 'none';
            }
            // Pause siblings
            videos.forEach(v => { if (v !== video && !v.paused) v.pause(); });
        });
 
        ['pause', 'ended'].forEach(evt => {
            video.addEventListener(evt, () => {
                if (overlay.classList.contains('iphone-play-btn')) {
                    overlay.classList.remove('is-playing');
                } else {
                    overlay.style.display = 'flex';
                }
            });
        });
 
        overlay.addEventListener('click', () => video.play());
    });
}

// faq
function initFAQ() {
    $$('.faq-item').forEach(item => {
        const btn = item.querySelector('.faq-q');
        if (!btn) return;
        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-open');
            // close all
            $$('.faq-item.is-open').forEach(i => i.classList.remove('is-open'));
            if (!isOpen) item.classList.add('is-open');
        });
    });
}

// contact form
function initContactForm() {
    const form = $('#contactForm');
    const msgEl = $('#formMessage');
    if (!form) return;

    let lastSubmit = 0;

    // Real-time validation
    $$('[required]', form).forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.classList.contains('is-error')) validateField(field);
        });
    });

    function validateField(field) {
        const ok = field.value.trim() !== '' &&
            (field.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value));
        field.style.borderColor = ok ? 'var(--gold)' : '#e74c3c';
        field.classList.toggle('is-error', !ok);
        return ok;
    }

    form.addEventListener('submit', async e => {
        e.preventDefault();

        // Cooldown
        const now = Date.now();
        if (now - lastSubmit < 5000) {
            showMsg('Please wait a moment before submitting again.', 'error');
            return;
        }
        lastSubmit = now;

        // Validate all required fields
        const fields = $$('[required]', form);
        const valid  = fields.map(validateField).every(Boolean);
        if (!valid) {
            showMsg('Please fill in all required fields correctly.', 'error');
            return;
        }

        const submitBtn = form.querySelector('.form-submit');
        const btnText   = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        if (btnText)  btnText.style.display  = 'none';
        if (btnLoader) btnLoader.style.display = 'inline-flex';
        submitBtn.disabled = true;
        if (msgEl) msgEl.style.display = 'none';

        try {
            // TODO: swap simulation below with real endpoint
            await new Promise(r => setTimeout(r, 1800));

            showMsg('✓ Message sent! We\'ll get back to you within 24 hours.', 'success');
            form.reset();
            $$('input, select, textarea', form).forEach(f => f.style.borderColor = '');
        } catch (err) {
            showMsg('✗ Something went wrong. Please try again or contact us directly.', 'error');
            console.error(err);
        } finally {
            if (btnText)  btnText.style.display  = 'inline';
            if (btnLoader) btnLoader.style.display = 'none';
            submitBtn.disabled = false;
        }
    });

    function showMsg(text, type) {
        if (!msgEl) return;
        msgEl.textContent = text;
        msgEl.className   = `form-msg ${type}`;
    }
}

/* ─────────────────────────────────────────
   8. SMOOTH SCROLL — anchor links
───────────────────────────────────────── */
function initSmoothScroll() {
    $$('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = target.getBoundingClientRect().top + window.scrollY - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 78);
            window.scrollTo({ top: offset, behavior: 'smooth' });
        });
    });
}

const serviceData = {
    'social-media': {
        icon: 'fab fa-instagram',
        badge: 'Most Popular',
        title: 'Social Media Management',
        description: 'Your audience lives on social media — and that\'s exactly where we meet them. We build, grow, and manage your presence across every platform that matters to your brand, turning followers into customers and customers into advocates.',
        features: [
            'Custom social media strategy aligned with your business goals',
            'Content creation, design & scheduling across all platforms',
            'Community management — replies, comments & reputation monitoring',
            'Targeted paid social ad campaigns built to convert',
            'Monthly analytics reports with actionable insights',
        ],
        pricingHref: 'pricing.html#social-media',
        contactHref: 'contact.html',
    },
    'content': {
        icon: 'fas fa-pen-fancy',
        badge: 'Creative Excellence',
        title: 'Content Creation',
        description: 'Content is the currency of the digital world. We produce high-quality photos, videos, and written content that stops the scroll, tells your story, and moves people to act — consistently, across every touchpoint.',
        features: [
            'Professional corporate photography & videography shoots',
            'Short-form video content optimised for social platforms',
            'Scroll-stopping graphic design for social media',
            'Copywriting for ads, websites, captions & email campaigns',
            'SEO-optimised blog & article writing that builds authority',
        ],
        pricingHref: 'pricing.html#content',
        contactHref: 'contact.html',
    },
    'digital-pr': {
        icon: 'fas fa-bullhorn',
        badge: 'Build Authority',
        title: 'Digital PR Services',
        description: 'Visibility is everything. We amplify your brand voice, secure media coverage, and position you as a credible authority in your industry — so the right people know your name before you ever reach out to them.',
        features: [
            'Press release writing & distribution to targeted media outlets',
            'Proactive media outreach & journalist relationship building',
            'Strategic influencer partnerships aligned to your audience',
            'Thought leadership articles & ghostwritten industry content',
            'Crisis management & rapid brand reputation response',
        ],
        pricingHref: 'pricing.html#digital-pr',
        contactHref: 'contact.html',
    },
    'branding': {
        icon: 'fas fa-palette',
        badge: 'Stand Out',
        title: 'Branding & Rebranding',
        description: 'Your brand is more than a logo — it\'s your personality, your promise, and your story. We build identities that are memorable, meaningful, and built to last, whether you\'re establishing a brand from scratch or ready for a complete reinvention.',
        features: [
            'Brand strategy, positioning & competitive analysis',
            'Logo design & complete visual identity system',
            'Colour palette, typography & brand voice development',
            'Comprehensive brand guidelines document',
            'Marketing collateral — business cards, letterheads & more',
        ],
        pricingHref: 'pricing.html#branding',
        contactHref: 'contact.html',
    },
    'web-design': {
        icon: 'fas fa-laptop-code',
        badge: 'Convert Visitors',
        title: 'Web Design & Development',
        description: 'Your website is your hardest-working team member — available 24/7, representing your brand to the world. We build websites that are beautiful, fast, and built to convert visitors into customers, from landing pages to full e-commerce stores.',
        features: [
            'Custom website design — on-brand, not off-the-shelf templates',
            'Fully responsive development across all screen sizes',
            'E-commerce with secure payment gateway integration',
            'SEO-ready build — clean code, fast loads, on-page optimisation',
            'CMS integration, training & 30–90 days post-launch support',
        ],
        pricingHref: 'pricing.html#web-design',
        contactHref: 'contact.html',
    },
};

/* ─────────────────────────────────────────────────────────────
   INIT SERVICE DRAWER
   ADD this function, then call it in DOMContentLoaded
───────────────────────────────────────────────────────────── */
function initServiceDrawer() {
    const overlay   = $('#svcDrawerOverlay');
    const drawer    = $('#svcDrawer');
    const closeBtn  = $('#svcDrawerClose');
    if (!drawer || !overlay) return;
 
    // Drawer content refs
    const iconEl     = $('#drawerIcon');
    const badgeEl    = $('#drawerBadge');
    const titleEl    = $('#drawerTitle');
    const descEl     = $('#drawerDesc');
    const featuresEl = $('#drawerFeatures');
    const pricingBtn = $('#drawerPricingBtn');
    const contactBtn = $('#drawerContactBtn');
 
    function openDrawer(serviceKey) {
        const svc = serviceData[serviceKey];
        if (!svc) return;
 
        // Populate
        if (iconEl)     iconEl.className     = svc.icon;
        if (badgeEl)    badgeEl.textContent   = svc.badge;
        if (titleEl)    titleEl.textContent   = svc.title;
        if (descEl)     descEl.textContent    = svc.description;
        if (featuresEl) featuresEl.innerHTML  = svc.features
            .map(f => `<li>${f}</li>`)
            .join('');
        if (pricingBtn) pricingBtn.href = svc.pricingHref;
        if (contactBtn) contactBtn.href = svc.contactHref;
 
        drawer.classList.add('is-open');
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
 
        // Focus close button for accessibility
        setTimeout(() => closeBtn && closeBtn.focus(), 450);
    }
 
    function closeDrawer() {
        drawer.classList.remove('is-open');
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
    }
 
    // Bind card buttons
    $$('.svc-card-btn').forEach(btn => {
        btn.addEventListener('click', () => openDrawer(btn.dataset.service));
    });
 
    // Close triggers
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeDrawer();
    });
}

function initPortfolioFilter() {
    const filterBtns = $$('.filter-btn');
    const items      = $$('.port-item[data-category]');
    const emptyEl    = $('#portfolioEmpty');
    if (!filterBtns.length) return;
 
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => {
                b.classList.remove('is-active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('is-active');
            btn.setAttribute('aria-selected', 'true');
 
            const filter = btn.dataset.filter;
            let visible  = 0;
 
            items.forEach(item => {
                const match = filter === 'all' || item.dataset.category === filter;
                item.classList.toggle('is-hidden', !match);
                if (match) visible++;
            });
 
            // Empty state
            if (emptyEl) {
                emptyEl.style.display = visible === 0 ? 'flex' : 'none';
            }
        });
    });
}

/* ─────────────────────────────────────────
   INIT ALL
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollReveal();
    initCounters();
    initTeamPanel();
    initVideos();
    initFAQ();
    initContactForm();
    initSmoothScroll();
    initServiceDrawer();
    initPortfolioFilter();
});