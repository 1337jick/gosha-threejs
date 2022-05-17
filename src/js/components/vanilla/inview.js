import gsap, { Expo } from 'gsap';
import { listen, dispatch } from 'models/utils/event-bus';

export default function inview(elem) {
    const elementsRaw = Array.from(document.querySelectorAll('[data-in]'));
    const elements = elementsRaw.map((elem) => {
        return {
            el: elem,
            tl: null,
            isIntersected: false,
        };
    });
    const state = {
        observer: null,
        options: null,
    };

    function init() {
        createObserver();
        addListeners();
    }

    function addListeners() {
        listen('loading-finished', setAnimation);
    }

    function createObserver() {
        state.options = {
            root: null,
            rootMargin: '0px 0px -20% 0px',
            threshold: [0, 0],
        };
        state.observer = new IntersectionObserver(handler, state.options);
    }

    function handler(entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                let i = elementsRaw.indexOf(entry.target);
                let elem = elements[i];

                entry.isIntersected = true;

                elem.tl.play();

                stillObserving()
                    ? state.observer.unobserve(entry.target)
                    : state.observer.disconnect();
            } else {
                // return
            }
        });
    }

    function stillObserving() {
        return elements.some((e) => !e.isIntersected);
    }

    function setAnimation() {
        elements.forEach((elem) => {
            elem.tl = gsap.timeline({ paused: true });
            const animationType = elem.el.dataset.in;
            if (animationType === 'subtitle-in') {
                elem.tl.from(elem.el, {
                    rotationX: -60,
                    y: 90,
                    duration: 1.2,
                    ease: Expo.easeOut,
                });
            } else if (animationType === 'title-in') {
                elem.tl.add('start');
                elem.tl.from(
                    elem.el,
                    {
                        rotationX: -100,
                        y: 90,
                        duration: 1.4,
                        ease: Expo.easeOut,
                    },
                    'start'
                );

                elem.tl.from(
                    elem.el,
                    {
                        letterSpacing: '-0.1em',
                        duration: 2.2,
                        ease: Expo.easeOut,
                    },
                    'start'
                );
            } else if (animationType === 'fade-in') {
                elem.tl.to(elem.el, {
                    opacity: 1,
                    duration: 2,
                    ease: Expo.easeOut,
                });
            } else if (animationType === 'fade-up') {
                elem.tl.fromTo(
                    elem.el,
                    {
                        alpha: 0,
                        y: 30,
                        duration: 1.3,
                        ease: Expo.easeOut,
                    },
                    {
                        alpha: 1,
                        y: 0,
                    }
                );
            } else if (animationType === 'stagger-fade') {
                const staggerItems = elem.el.querySelectorAll('.slide');
                elem.tl.staggerFromTo(
                    staggerItems,
                    1,
                    {
                        x: 100,
                        alpha: 0,
                    },
                    {
                        x: 0,
                        alpha: 1,
                        ease: Expo.easeOut,
                    },
                    0.1,
                    0,
                    () => {
                        dispatch('stagger-fade-finished');
                    }
                );
            }

            state.observer.observe(elem.el);
        });
    }

    init();
}
