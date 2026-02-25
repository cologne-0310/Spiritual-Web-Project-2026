document.addEventListener('DOMContentLoaded', () => {
    // 手機版選單切換 (Mobile Menu Toggle)
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';
            mobileBtn.setAttribute('aria-expanded', !isExpanded);

            // 在實際應用中，我們通常會切換 class
            // 此處為了演示方便，直接切換 display 屬性與樣式
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
                if (navActions) navActions.style.display = 'none';
                mobileBtn.innerHTML = '☰';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = '#FDFBF7';
                navLinks.style.padding = '1rem';
                navLinks.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';

                if (navActions) {
                    navActions.style.display = 'flex';
                    navActions.style.position = 'absolute';
                    navActions.style.top = 'calc(100% + 200px)'; /* 簡單定位修正 */
                    navActions.style.width = '100%';
                    navActions.style.justifyContent = 'center';
                    navActions.style.padding = '1rem';
                }

                mobileBtn.innerHTML = '✕';
            }
        });
    }

    // 平滑捲動效果 (Smooth Scroll)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 捲動時淡入動畫 (Fade in on Scroll)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.course-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});
