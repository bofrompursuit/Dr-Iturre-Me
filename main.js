// Smooth scroll and interface logic
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dr. Iturre Medical Services site initialized');

    // Sticky header shadow on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    });

    // Mobile menu logic (to be added if needed)
});
