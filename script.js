/**
 * Moin Shah - Modern Bento Portfolio Script
 * Controls theme switching, floating nav scroll adjustments, mobile overlays,
 * visibility animations, bento counters, live IST time display, and form submit feedbacks.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // THEME SELECTION & STORAGE
    // ==========================================================================
    const themeBtn = document.getElementById('theme-btn');
    const body = document.body;
    
    // Retrieve theme or default to dark
    const activeTheme = localStorage.getItem('portfolio-theme') || 'dark';
    body.setAttribute('data-theme', activeTheme);
    
    themeBtn.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', nextTheme);
        localStorage.setItem('portfolio-theme', nextTheme);
    });

    // ==========================================================================
    // FLOATING HEADER CONTROLS (SCROLL DETECTION)
    // ==========================================================================
    const mainHeader = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    });

    // ==========================================================================
    // MOBILE NAVIGATION DROPDOWN
    // ==========================================================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuLinks = mobileMenu.querySelectorAll('.nav-item');
    const desktopLinks = document.querySelectorAll('.nav-menu .nav-item');

    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenu.classList.toggle('active');
        
        // Toggle icon visual
        const icon = hamburgerBtn.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars-staggered';
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && e.target !== hamburgerBtn) {
            mobileMenu.classList.remove('active');
            const icon = hamburgerBtn.querySelector('i');
            icon.className = 'fa-solid fa-bars-staggered';
        }
    });

    // Close mobile dropdown when a link is clicked
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            const icon = hamburgerBtn.querySelector('i');
            icon.className = 'fa-solid fa-bars-staggered';
        });
    });

    // ==========================================================================
    // SCROLL SYNCHRONIZED NAVIGATION (ACTIVE ELEMENT TRACKER)
    // ==========================================================================
    const sections = document.querySelectorAll('section');
    
    const activeSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                
                // Helper to update links
                const updateActive = (links) => {
                    links.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                };
                
                updateActive(desktopLinks);
                updateActive(menuLinks);
            }
        });
    }, {
        root: null,
        rootMargin: '-35% 0px -55% 0px',
        threshold: 0
    });

    sections.forEach(section => activeSectionObserver.observe(section));

    // ==========================================================================
    // BENTO METRICS ANIMATOR
    // ==========================================================================
    let statsLaunched = false;
    
    const animateBentoCounters = () => {
        if (statsLaunched) return;
        statsLaunched = true;
        
        const bentoNumbers = document.querySelectorAll('.stat-number');
        bentoNumbers.forEach(number => {
            const targetVal = parseInt(number.getAttribute('data-target'), 10);
            const countDuration = 1200; // ms
            const stepRate = Math.abs(Math.floor(countDuration / targetVal));
            let startCount = 0;
            
            const timer = setInterval(() => {
                startCount += 1;
                number.textContent = startCount + '+';
                if (startCount >= targetVal) {
                    number.textContent = targetVal + '+';
                    clearInterval(timer);
                }
            }, stepRate);
        });
    };

    // ==========================================================================
    // SKILLS PROGRESS BAR ANIME
    // ==========================================================================
    const triggerSkillsFill = (skillsSection) => {
        const skillFills = skillsSection.querySelectorAll('.skill-bar-fill');
        skillFills.forEach(fill => {
            const widthVal = fill.getAttribute('data-width');
            fill.style.width = `${widthVal}%`;
        });
    };

    // ==========================================================================
    // ENTRANCE EFFECT OBSERVER
    // ==========================================================================
    const animatedBlocks = document.querySelectorAll('.section-animate');
    
    const blockEntranceObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const block = entry.target;
                block.classList.add('visible');
                
                // If this block contains stats, animate them
                if (block.id === 'about-section') {
                    animateBentoCounters();
                }
                
                // If this block contains skills, load bar animations
                if (block.id === 'skills-section') {
                    triggerSkillsFill(block);
                }
                
                // Unobserve to run animation only once
                observer.unobserve(block);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    });

    animatedBlocks.forEach(block => blockEntranceObserver.observe(block));

    // ==========================================================================
    // LIVE AHMEDABAD CLOCK DISPLAY (IST: UTC+5:30)
    // ==========================================================================
    const updateAhmedabadTime = () => {
        const date = new Date();
        // Shift time offset to IST
        const utcOffset = date.getTime() + (date.getTimezoneOffset() * 60000);
        const istTime = new Date(utcOffset + (3600000 * 5.5));
        
        let hrs = istTime.getHours();
        let mins = istTime.getMinutes();
        const meridian = hrs >= 12 ? 'PM' : 'AM';
        
        hrs = hrs % 12;
        hrs = hrs ? hrs : 12; // Handle midnight
        mins = mins < 10 ? '0' + mins : mins;
        
        const timeValString = `${hrs}:${mins} ${meridian}`;
        const timeDisplayElement = document.getElementById('time-display');
        if (timeDisplayElement) {
            timeDisplayElement.textContent = timeValString;
        }
    };

    // Run clock updates
    setInterval(updateAhmedabadTime, 1000);
    updateAhmedabadTime();

    // ==========================================================================
    // PORTFOLIO CONTACT FORM HANDLER
    // ==========================================================================
    const portfolioForm = document.getElementById('portfolio-form');
    const formFeedbackAlert = document.getElementById('form-msg-alert');

    if (portfolioForm) {
        portfolioForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = portfolioForm.querySelector('.form-submit-button');
            const originalHTML = submitBtn.innerHTML;
            
            // Clear alerts
            formFeedbackAlert.className = 'form-feedback-alert';
            formFeedbackAlert.textContent = '';
            
            try {
                // Set loading button
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Dispatching Message...';
                
                // Mock network request delay
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Success banner
                formFeedbackAlert.classList.add('success');
                formFeedbackAlert.textContent = 'Message sent! I will respond as soon as possible.';
                portfolioForm.reset();
                
            } catch (err) {
                formFeedbackAlert.classList.add('error');
                formFeedbackAlert.textContent = 'An error occurred. Please try sending again.';
            } finally {
                // Restore button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
                
                // Auto dismiss alert banner
                setTimeout(() => {
                    formFeedbackAlert.style.transition = 'opacity 0.5s ease';
                    formFeedbackAlert.style.opacity = '0';
                    setTimeout(() => {
                        formFeedbackAlert.className = 'form-feedback-alert';
                        formFeedbackAlert.textContent = '';
                        formFeedbackAlert.style.opacity = '1';
                    }, 500);
                }, 5000);
            }
        });
    }
});
