document.addEventListener("DOMContentLoaded", () => {
    // 0. Scroll Button
    const scrollBtn = document.querySelector('.hero-scroll-btn');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            const nextSection = document.querySelector('#numbers');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // 1. Navbar shadow on scroll — throttled for performance
    const navbar = document.querySelector('.navbar');
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (window.scrollY > 10) {
                    navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.05)';
                } else {
                    navbar.style.boxShadow = 'none';
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // 2. Accordion Functionality
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            // Close other items
            const currentlyActive = document.querySelector('.accordion-item.active');
            if(currentlyActive && currentlyActive !== item) {
                currentlyActive.classList.remove('active');
                currentlyActive.querySelector('.accordion-content').style.maxHeight = null;
            }
            
            // Toggle current item
            item.classList.toggle('active');
            const content = item.querySelector('.accordion-content');
            
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 40 + "px"; // 40px for padding
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // Open first accordion by default
    if(accordionItems.length > 0) {
        accordionItems[0].classList.add('active');
        const firstContent = accordionItems[0].querySelector('.accordion-content');
        firstContent.style.maxHeight = firstContent.scrollHeight + 40 + "px";
    }

    // 3. GSAP Animations
    gsap.registerPlugin(ScrollTrigger);

    // Configure GSAP for optimal performance
    gsap.config({
        force3D: true,        // Force GPU acceleration on all transforms
        nullTargetWarn: false  // Suppress warnings for missing elements
    });

    // Initial Hero Reveal - Premium Upside Down effect
    const heroTl = gsap.timeline();
    
    // Set initial 3D transform state
    gsap.set('.reveal-word', { rotationX: -180, opacity: 0, y: -50 });
    
    heroTl.to('.reveal-word',
        { 
            rotationX: 0, 
            opacity: 1, 
            y: 0,
            duration: 1.2, 
            stagger: 0.15,
            ease: "back.out(1.2)", 
            delay: 0.2 
        }
    )
    .fromTo('.hero-bottom',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1 },
        "-=0.5"
    );

    // Scroll Reveal Elements (Fade Up) — with lazy rendering
    const fadeUpElements = document.querySelectorAll('.fade-up');
    
    fadeUpElements.forEach(elem => {
        gsap.fromTo(elem, 
            { y: 50, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 1, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: elem,
                    start: "top 85%",
                    toggleActions: "play none none none",
                    fastScrollEnd: true  // Better behavior on fast scrolling
                }
            }
        );
    });

    // Silos section — only animate if elements exist
    const silosWrapper = document.querySelector('.silos-wrapper');
    
    if (silosWrapper) {
        // Silos Automatic Expansion (No scrub)
        gsap.to(".silos-image-wrapper", {
            width: "85vw",
            height: "85vh",
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".silos-wrapper",
                start: "top 70%",
                toggleActions: "play none none none"
            }
        });

        // Silos Scrubbed Animations (Text up, Panel up)
        const silosTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".silos-wrapper",
                start: "top top",
                end: "bottom bottom",
                scrub: 0.8,           // Slightly faster scrub for smoother feel
                fastScrollEnd: true
            }
        });

        // 1. Move text up and fade out
        silosTl.to(".silos-hero-text", {
            y: "-=150",
            opacity: 0,
            duration: 1
        })

        // 2. Darken background slightly
        .to(".silos-image-wrapper::after", {
            opacity: 0.7,
            duration: 0.5,
            onStart: () => document.querySelector(".silos-image-wrapper").classList.add("darken"),
            onReverseComplete: () => document.querySelector(".silos-image-wrapper").classList.remove("darken")
        }, "<")
        
        // 3. Fade in the story container
        .to(".story-text-container", {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out"
        }, "<0.5")

        // 4. Fade in the title group
        .fromTo(".story-title-group", 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1 },
            "<"
        )

        // 5. Fade out title group and fade in paragraphs
        .to(".story-title-group", {
            opacity: 0,
            y: -30,
            duration: 1
        }, "+=0.8")
        .to(".story-content p", {
            opacity: 1,
            y: 0,
            stagger: 0.3,
            duration: 1.5,
            ease: "power2.out",
            onStart: () => gsap.set(".story-content", { pointerEvents: "auto" })
        }, "<0.3")
        
        // 6. Keep paragraphs visible for a bit
        .to({}, { duration: 0.5 }) 
        
        // 7. Fade out everything as the section ends
        .to(".story-text-container", {
            y: "-=150",
            opacity: 0,
            duration: 1,
            ease: "power1.inOut"
        }, "+=0.3");
    }

    // Number Counter Animation
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const obj = { val: 0 };
        
        gsap.to(obj, {
            val: target,
            duration: 2.5,
            ease: "power2.out",
            scrollTrigger: {
                trigger: stat,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            onUpdate: function() {
                stat.innerText = Math.ceil(obj.val).toLocaleString('en-US').replace(/,/g, ' ');
            }
        });
    });
});
