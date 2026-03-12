// --- Scroll Reveal for Workflow ---
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.workflow-step').forEach((step, index) => {
        step.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(step);
    });
});
