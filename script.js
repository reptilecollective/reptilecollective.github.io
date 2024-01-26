// Utilities
function style(element, classname, state) { state ? element.classList.add(classname) : element.classList.remove(classname); }

// DOM
let nav = document.getElementById("nav");
let background_image = document.getElementById("background_image");
nav.classList.add('hidden');

// Return to top
function toTop() {
    window.scrollTo({top:0, behavior:'smooth'});
}



/** Carousel */
document.querySelectorAll('.carousel').forEach(carousel => {
    const slider = carousel.querySelector('ul');
    const allDots = Array.from(carousel.querySelectorAll('.dot'));
    let timer;
    
    /** Get current image number (starts at 0). Position divided by width */
    function getIndex() { return Math.round(slider.scrollLeft/carousel.offsetWidth); }

    /** Scroll image container */
    function goto(x=0) { slider.scrollTo({left:x, behavior:'smooth'}); }

    /** Returns visible element */
    function currentSlide() { return carousel.querySelector(`[data-image="${getIndex()}"]`); }

    /** Cycles to next or previous image */
    function cycleImage(event, auto) {
        let dir = Number(event?.srcElement.dataset?.direction) || 1;
        let end = allDots.length * slider.offsetWidth - slider.offsetWidth;
        let at_end = slider.scrollLeft >= end && dir === 1; // Start over when at the end
        let at_start = slider.scrollLeft === 0 && dir === -1; // Skip to end when at the start
        let x = at_start ? end : at_end ? 0 : slider.scrollLeft + slider.offsetWidth*dir;
        goto(x);
        if(!auto) setTimer(); // Reset timer
    }

    // Scroll event
    slider.addEventListener('scroll', e => {
        let index = getIndex();
        for(let d of allDots) d.classList.remove('active');
        allDots[index].classList.add('active');

        // Update background
        background_image.style = `background: linear-gradient(0deg, rgb(20, 11, 11) 0%, rgba(5, 5, 5, 0.8) 100%), url(${currentSlide()?.src ?? 'assets/reptile_egg_incubation.jpg'})`;
        background_image.classList.remove('slidein');
        void background_image.offsetWidth;
        background_image.classList.add('slidein');
    });

    // Next/previous buttons
    carousel.querySelectorAll(".arrow").forEach(e => e.addEventListener('click', cycleImage));

    // Dot onclick
    for(let i in allDots) {
        let element = allDots[i];
        element.addEventListener('click', event => goto(slider.offsetWidth*Number(i)));
    }

    /** Set auto timer */
    function setTimer() {
        if(!carousel.dataset.timer) return;
        clearInterval(timer);
        timer = setInterval(() => {cycleImage(undefined, true);}, Number(carousel.dataset.timer));
    }

    // Auto
    setTimer();
})

/** Update Nav Bar onscroll */
window.onscroll = () => {
    let distance = document.documentElement.scrollTop || document.body.scrollTop;
    style(nav, 'hidden', (distance <= 380));
};
