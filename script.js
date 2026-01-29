
document.addEventListener('DOMContentLoaded', () => {

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Carousel Auto-Scroll (Smart Implementation)
    const cardContainers = document.querySelectorAll('.card-container');
    cardContainers.forEach(container => {
        container.addEventListener('wheel', (evt) => {
            // Check if we can scroll in the requested direction
            const isScrollable = container.scrollWidth > container.clientWidth;
            if (!isScrollable) return;

            const atLeft = container.scrollLeft === 0;
            const atRight = Math.ceil(container.scrollLeft + container.clientWidth) >= container.scrollWidth;

            // Normalize delta (handle different browsers/devices)
            const delta = evt.deltaY || evt.detail || (-evt.wheelDelta);

            // If scrolling UP (negative delta) and not at absolute left
            if (delta < 0 && !atLeft) {
                evt.preventDefault();
                container.scrollLeft += delta;
            }
            // If scrolling DOWN (positive delta) and not at absolute right
            else if (delta > 0 && !atRight) {
                evt.preventDefault();
                container.scrollLeft += delta;
            }
            // Otherwise, let the default vertical scroll happen (don't preventDefault)
        });
    });

    // Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    // Only activate if elements exist (in case we're on a page without them yet)
    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with slight delay (animation usually handled by CSS transition on position, 
            // but for smooth trailing we use basic keyframes or just direct update with CSS transition enabled)
            // Using animate for smoother performance or just direct update
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: 'forwards' });
        });

        // Hover Effect
        const hoverables = document.querySelectorAll('a, button, .movie-card');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
    }

    // Profile Dropdown Toggle
    const profileBtn = document.getElementById('userProfileBtn');
    const dropdown = document.getElementById('profileDropdown');

    if (profileBtn && dropdown) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent immediate closing
            dropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!profileBtn.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }

    // Internal Player Routing (Intercept External YouTube Links)
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a.movie-card');
        if (link) {
            const href = link.getAttribute('href');
            // Check if it's an external YouTube link
            if (href && (href.includes('youtube.com') || href.includes('youtu.be'))) {
                e.preventDefault(); // Stop external navigation

                let videoId = '';
                try {
                    const urlObj = new URL(href);
                    if (urlObj.hostname.includes('youtube.com')) {
                        videoId = urlObj.searchParams.get('v');
                    } else if (urlObj.hostname.includes('youtu.be')) {
                        videoId = urlObj.pathname.slice(1);
                    }
                } catch (err) {
                    console.error("Invalid URL:", href);
                }

                if (videoId) {
                    window.location.href = `watch.html?v=${videoId}`;
                }
            }
        }
    });

    // Scroll Animation (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Run only once
            }
        });
    }, observerOptions);

    // Target elements to animate
    const animatedElements = document.querySelectorAll('.row-title, .card-row-wrapper, .hero-content');
    animatedElements.forEach(el => {
        el.classList.add('fade-up');
        observer.observe(el);
    });

    // Search Filtering
    const searchInput = document.getElementById('searchInput');
    const resultsGrid = document.getElementById('resultsGrid');

    if (searchInput && resultsGrid) {
        const cards = resultsGrid.querySelectorAll('.movie-card');

        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();

            cards.forEach(card => {
                const title = card.getAttribute('data-title').toLowerCase();
                if (title.includes(term)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
});
