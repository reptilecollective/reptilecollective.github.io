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
document.querySelectorAll('[data-carousel]').forEach(carousel => {
    let scrollable = carousel.querySelector(
        // navigator.userAgent.includes("Firefox") ? ".scrollable" : ".images"
        ".scrollable"
    );
    let images = carousel.querySelector('.images');
    let allDots = Array.from(carousel.querySelectorAll('.dot'));
    console.log(allDots);
    let timer;

    /** Window resize event */
    function setCarouselWidth(element) { element.style.setProperty('--carousel-width', element.offsetWidth+'px'); }
    window.addEventListener('resize', () => setCarouselWidth(carousel) );
    setCarouselWidth(carousel);
    
    /** Get current image number (starts at 0) */
    function getIndex() {
        let width = scrollable.offsetWidth;
        let pos = scrollable.scrollLeft;
        let index = Math.round(pos/width);
        return index;
    }

    function currentImage() { return carousel.querySelector(`[data-image="${getIndex()}"]`); }
    /** Scroll image container */
    function imgScroll(x=0) { scrollable.scrollTo({left:x, behavior:'smooth'}); }

    // Scrollable area
    scrollable.addEventListener('scroll', e => {
        allDots.forEach(element => element.classList.remove('active'));
        allDots[getIndex()].classList.add('active');
        background_image.style = `background: linear-gradient(0deg, rgb(20, 11, 11) 0%, rgba(5, 5, 5, 0.8) 100%), url(${currentImage()?.src ?? 'assets/reptile_egg_incubation.jpg'})`;
        background_image.classList.remove('slidein');
        void background_image.offsetWidth;
        background_image.classList.add('slidein');
    });

    // Dots
    for(let i in allDots) {
        let element = allDots[i];
        element.addEventListener('click', event => {
            imgScroll(scrollable.offsetWidth*Number(i));
        })
    }

    /** Set auto timer */
    function setTimer() {
        if(!carousel.dataset.timer) return;
        clearInterval(timer);
        timer = setInterval(() => {cycleImage(undefined, true);}, Number(carousel.dataset.timer));
    }

    /** Cycles to next or previous image */
    function cycleImage(event, auto) {
        let dir = Number(event?.srcElement.dataset?.direction) || 1;
        let end = allDots.length * scrollable.offsetWidth - (scrollable.offsetWidth * 1.5);
        let at_end = scrollable.scrollLeft >= end && dir === 1; // Start over when at the end
        let at_start = scrollable.scrollLeft === 0 && dir === -1; // Skip to end when at the start
        let x = at_start ? end : at_end ? 0 : scrollable.scrollLeft + scrollable.offsetWidth*dir;
        imgScroll(x);
        if(!auto) setTimer(); // Reset timer
    }

    // Buttons
    carousel.querySelectorAll(".arrow").forEach(e => e.addEventListener('click', cycleImage));

    // Auto
    setTimer();
})

/** Update Nav Bar onscroll */
window.onscroll = () => {
    let distance = document.documentElement.scrollTop || document.body.scrollTop;
    style(nav, 'hidden', (distance <= 380));
};
