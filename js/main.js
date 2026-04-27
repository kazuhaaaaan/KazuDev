// main JS file
console.log('main.js loaded');

//index.html 
// Update Copyright Year
            document.getElementById('year').textContent = new Date().getFullYear();

            // Theme Toggle Logic
            const themeToggleBtns = document.querySelectorAll('.theme-toggle');
            
            function toggleTheme() {
                if (document.documentElement.classList.contains('dark')) {
                    document.documentElement.classList.remove('dark');
                    localStorage.theme = 'light';
                } else {
                    document.documentElement.classList.add('dark');
                    localStorage.theme = 'dark';
                }
            }

            themeToggleBtns.forEach(btn => {
                btn.addEventListener('click', toggleTheme);
            });

            // Navbar Scroll Effect
            const navbar = document.getElementById('navbar');
            const backToTop = document.getElementById('back-to-top');
            
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    // Apply background color dynamically based on theme when scrolled
                    navbar.classList.add('bg-white/90', 'dark:bg-dark/90', 'backdrop-blur-md', 'shadow-sm', 'dark:shadow-lg');
                    navbar.classList.remove('bg-transparent', 'py-2');
                    
                    backToTop.classList.remove('opacity-0', 'invisible', 'translate-y-4');
                    backToTop.classList.add('opacity-100', 'visible', 'translate-y-0');
                } else {
                    navbar.classList.remove('bg-white/90', 'dark:bg-dark/90', 'backdrop-blur-md', 'shadow-sm', 'dark:shadow-lg');
                    navbar.classList.add('bg-transparent', 'py-2');
                    
                    backToTop.classList.add('opacity-0', 'invisible', 'translate-y-4');
                    backToTop.classList.remove('opacity-100', 'visible', 'translate-y-0');
                }
            });

            // Back to top click
            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            // Mobile Menu Toggle dengan Slide Animasi
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');
            const closeMenuBtn = document.getElementById('close-menu-btn');
            const mobileMenu = document.getElementById('mobile-menu');
            const mobileLinks = document.querySelectorAll('.mobile-link');

            function toggleMenu() {
                if (mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.remove('hidden');
                    // Timeout to allow display block to apply before animating
                    setTimeout(() => {
                        mobileMenu.classList.remove('opacity-0', 'translate-x-full');
                        mobileMenu.classList.add('opacity-100', 'translate-x-0');
                    }, 10);
                    document.body.style.overflow = 'hidden'; // Prevent scrolling
                } else {
                    mobileMenu.classList.remove('opacity-100', 'translate-x-0');
                    mobileMenu.classList.add('opacity-0', 'translate-x-full');
                    setTimeout(() => {
                        mobileMenu.classList.add('hidden');
                        document.body.style.overflow = '';
                    }, 300);
                }
            }

            mobileMenuBtn.addEventListener('click', toggleMenu);
            closeMenuBtn.addEventListener('click', toggleMenu);
            mobileLinks.forEach(link => {
                link.addEventListener('click', toggleMenu);
            });

            // Tab System for About Section
            function openTab(tabName, button) {
                // Hide all contents
                const contents = document.querySelectorAll('.tab-content');
                contents.forEach(content => {
                    content.classList.add('hidden');
                    content.classList.remove('active');
                });

                // Remove active classes from all buttons
                const buttons = document.querySelectorAll('.tab-btn');
                buttons.forEach(btn => {
                    btn.classList.remove('text-primary', 'border-primary');
                    btn.classList.add('text-gray-500', 'dark:text-gray-400', 'border-transparent');
                });

                // Show selected content and highlight button
                document.getElementById(tabName).classList.remove('hidden');
                setTimeout(() => document.getElementById(tabName).classList.add('active'), 10);
                
                button.classList.remove('text-gray-500', 'dark:text-gray-400', 'border-transparent');
                button.classList.add('text-primary', 'border-primary');
            }

            // Typing Effect
            const typedTextSpan = document.getElementById("typed-text");
            const textArray = ["Web Developer", "IT Support", "Freelancer"];
            const typingDelay = 100;
            const erasingDelay = 50;
            const newTextDelay = 2000;
            let textArrayIndex = 0;
            let charIndex = 0;

            function type() {
                if (charIndex < textArray[textArrayIndex].length) {
                    typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
                    charIndex++;
                    setTimeout(type, typingDelay);
                } else {
                    setTimeout(erase, newTextDelay);
                }
            }

            function erase() {
                if (charIndex > 0) {
                    typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
                    charIndex--;
                    setTimeout(erase, erasingDelay);
                } else {
                    textArrayIndex++;
                    if (textArrayIndex >= textArray.length) textArrayIndex = 0;
                    setTimeout(type, typingDelay + 1100);
                }
            }

            document.addEventListener("DOMContentLoaded", function() {
                if (textArray.length) setTimeout(type, newTextDelay + 250);
            });

            // Scroll Animation (Intersection Observer)
            const revealElements = document.querySelectorAll('.reveal');
            
            const revealCallback = (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target); // Hentikan observasi setelah animasi selesai
                    }
                });
            };

            const revealOptions = {
                threshold: 0.15,
                rootMargin: "0px 0px -50px 0px"
            };

            const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
            
            revealElements.forEach(el => {
                revealObserver.observe(el);
            });

            // Active Link Highlighting on Scroll
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-link');

            window.addEventListener('scroll', () => {
                let current = '';
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    if (scrollY >= (sectionTop - sectionHeight / 3)) {
                        current = section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('text-primary');
                    if (link.getAttribute('href') === `#${current}`) {
                        link.classList.add('text-primary');
                    }
                });
            });

           // FORMSPREE LOGIC
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');
const submitBtn = document.getElementById('submit-btn');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Status Loading
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="ph ph-spinner animate-spin text-xl"></i> Mengirim...';
    submitBtn.disabled = true;

    const data = new FormData(contactForm);

    try {
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            contactForm.reset();
            formMessage.textContent = "Pesan berhasil terkirim! Saya akan segera membalasnya.";
            formMessage.className = "text-green-500 block text-sm py-2";
        } else {
            throw new Error();
        }
    } catch (error) {
        formMessage.textContent = "Oops! Terjadi kesalahan saat mengirim pesan.";
        formMessage.className = "text-red-500 block text-sm py-2";
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Sembunyikan pesan setelah 5 detik
        setTimeout(() => {
            formMessage.classList.add('hidden');
        }, 5000);
    }
});
    