import gsap from 'gsap';

export default function inView(elem) {
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
        setAnimation();
    }

    function createObserver() {
        state.options = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
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
            const animationDelay = elem.el.dataset.delay;
            if (animationType === 'fade-in') {
                elem.tl.from(elem.el, {
                    duration: 0.2,
                    alpha: 0,
                    delay: animationDelay,
                    ease: 'power1.in',
                });
            } else if (animationType === 'fade-up') {
                elem.tl.from(elem.el, {
                    duration: 0.5,
                    yPercent: 30,
                    alpha: 0,
                    delay: animationDelay,
                    ease: 'power2.out',
                });
            } else if (animationType === 'fade-up--stagger') {
                const rows = elem.el.querySelectorAll('.row')
                elem.tl.staggerFromTo(
                    rows,
                    0.5,
                    {
                        yPercent: 30,
                        alpha: 0,
                    },
                    {
                        yPercent: 0,
                        alpha: 1,
                        ease: 'power2.inOut'
                    },
                    0.05,
                    0
                );
        
            }

            state.observer.observe(elem.el);
        });
    }

    init();
}
