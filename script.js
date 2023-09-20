// Utilities
function style(element, classname, state) { state ? element.classList.add(classname) : element.classList.remove(classname); }

// DOM
const nav = document.getElementById("nav");
const carousel_container = document.getElementById("carousel_images");
nav.classList.add('hidden');

/** Carousel */
document.querySelectorAll('[data-carousel]').forEach(container => {
    let images = container.querySelector(".carousel_images");
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
        container.querySelectorAll('.dot').forEach(element => element.classList.remove('active'));
        container.querySelector(`.dot[data-index="${getIndex()}"]`).classList.add('active');
    });

    function cycleImage(e) {
        let element = e?.srcElement ?? {dataset:{direction:1}};
        let end = 2680;
        let dir = Number(element.dataset.direction);
        let at_end = images.scrollLeft === end && dir === 1;
        let at_start = images.scrollLeft === 0 && dir === -1;
        let x = at_start ? end : at_end ? 0 : images.scrollLeft + images.offsetWidth*dir;
        imgScroll(x);
    }

    // Buttons
    container.querySelectorAll(".arrow").forEach(e => e.addEventListener('click', cycleImage));

    container.querySelectorAll('.dot').forEach(e => e.addEventListener('click', event => {
        let index = event.srcElement.dataset.index;
        imgScroll(images.offsetWidth*Number(index));
    }));

    // Auto
    if(container.dataset.timer) timer = setInterval(() => {cycleImage()}, Number(container.dataset.timer));
})

/** Update Nav Bar onscroll */
window.onscroll = () => {
    let distance = document.documentElement.scrollTop || document.body.scrollTop;
    style(nav, 'hidden', (distance <= 380));
};
