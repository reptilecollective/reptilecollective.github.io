// Utilities
function style(element, classname, state) { state ? element.classList.add(classname) : element.classList.remove(classname); }

// DOM
const nav = document.getElementById("nav");
const carousel_container = document.getElementById("carousel_images");
nav.classList.add('hidden');

// Return to top
function toTop() {
    window.scrollTo({top:0, behavior:'smooth'});
}

/** Carousel */
document.querySelectorAll('[data-carousel]').forEach(container => {
    let images = container.querySelector(".carousel_images");
    let allDots = container.querySelectorAll('.dot');
    let image_count = 0;
    let timer;

    /** Get current image number (starts at 0) */
    function getIndex() {
        let width = images.offsetWidth;
        let pos = images.scrollLeft;
        let index = Math.round(pos/width);
        return index;
    }

    /** Scroll image container */
    function imgScroll(x=0) { images.scrollTo({left:x, behavior:'smooth'}); }

    // Scrollable area
    images.addEventListener('scroll', e => {
        allDots.forEach(element => element.classList.remove('active'));
        container.querySelector(`.dot[data-index="${getIndex()}"]`).classList.add('active');
    });

    // Dots
    allDots.forEach(e => {
        image_count++;

        e.addEventListener('click', event => {
            let index = event.srcElement.dataset.index;
            imgScroll(images.offsetWidth*Number(index));
        })
    });

    /** Set auto timer */
    function setTimer() {
        if(!container.dataset.timer) return;
        clearInterval(timer);
        timer = setInterval(() => {cycleImage(undefined, true);}, Number(container.dataset.timer));
    }

    /** Cycles to next or previous image */
    function cycleImage(event, auto) {
        let dir = Number(event?.srcElement.dataset?.direction) || 1;
        let end = image_count*images.offsetWidth-images.offsetWidth;
        let at_end = images.scrollLeft >= end && dir === 1; // Start over when at the end
        let at_start = images.scrollLeft === 0 && dir === -1; // Skip to end when at the start
        let x = at_start ? end : at_end ? 0 : images.scrollLeft + images.offsetWidth*dir;
        imgScroll(x);
        if(!auto) setTimer(); // Reset timer
    }

    // Buttons
    container.querySelectorAll(".arrow").forEach(e => e.addEventListener('click', cycleImage));

    // Auto
    setTimer();
})

/** Update Nav Bar onscroll */
window.onscroll = () => {
    let distance = document.documentElement.scrollTop || document.body.scrollTop;
    style(nav, 'hidden', (distance <= 380));
};
