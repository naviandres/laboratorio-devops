document.addEventListener('DOMContentLoaded', () => {
    const btnCta = document.getElementById('btn-cta');

    btnCta.addEventListener('click', () => {
        const serviciosSection = document.getElementById('servicios');
        serviciosSection.scrollIntoView({ behavior: 'smooth' });
    });
});