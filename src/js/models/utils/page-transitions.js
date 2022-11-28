import barba from '@barba/core';

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';
import smoothScroll from 'models/smooth-scroll';

import inView from 'models/in-view';

import { scrollToTop } from 'models/scroll';
import { closeOverlay } from 'models/overlay';
import { parse } from 'models/utils/app';
import { dispatch } from 'models/utils/event-bus';

export default function initPageTransitions() {
    const elements = {
        bgs: document.querySelectorAll('.js-overlay__bg__item'),
        navigation: document.querySelector('.js-navigation'),
        header: document.querySelector('.js-header'),
        logo: document.querySelector('.js-navigation__logo'),
    };

    barba.init({
        views: [
            {
                namespace: 'home',

                beforeEnter() {
                    if (
                        document
                            .querySelector('.js-navigation__logo')
                            .classList.contains('is-visible')
                    ) {
                        document
                            .querySelector('.js-navigation__logo')
                            .classList.remove('is-visible');
                    }

                    if (document.documentElement.classList.contains('is-header-scrolled')) {
                        document.documentElement.classList.remove('is-header-scrolled');
                    }
                },
            },
            {
                namespace: 'join',

                beforeEnter(data) {
                    document.querySelector('.js-navigation__logo').classList.add('is-visible');
                },
            },
            {
                namespace: 'services',

                beforeEnter(data) {
                    document.querySelector('.js-navigation__logo').classList.add('is-visible');
                },
            },
            {
                namespace: 'team',

                beforeEnter(data) {
                    document.querySelector('.js-navigation__logo').classList.add('is-visible');
                },
            },
        ],

        transitions: [
            {
                name: 'default',
                once() {
                    const tl = gsap.timeline({
                        defaults: {
                            overwrite: 'all',
                        },
                    });


                    setTimeout(() => {
                        tl.to(elements.bgs, {
                            y: 0,
                            stagger: 0.05,
                            duration: 0.6,
                            ease: 'expo.out',
                        });
                    }, 200);
           
                },

                before() {
                    document.documentElement.classList.add('is-transitioning');
                    

                    document.querySelector(`.js-contact__link[href="${window.location.pathname}"]`).classList.add('is-active');
                },
                leave(data) {
                    // remove active menu link
                    document.querySelector('.js-contact__link.is-active').classList.remove('is-active');
                    // animate out
                    const elems = document.querySelectorAll('.js-contact__link');
                    const tl = gsap.timeline();

                    // if menu was open
                    if (document.querySelector('.js-overlay__content.is-visible')) {
                        // animate links
                        tl.to(elems, {
                            alpha: 0,
                            yPercent: 100,
                            stagger: -0.05,
                            duration: 0.3,
                            ease: 'expo.out',

                            onComplete: () => {
                                closeOverlay();

                                // kill scrolltriggers
                                let triggers = ScrollTrigger.getAll();
                                triggers.forEach((trigger) => {
                                    trigger.kill();
                                });
                            },
                        });
                        return tl;
                    } else {
                        tl.to(elements.bgs, {
                            yPercent: -100,
                            stagger: 0.05,
                            duration: 0.6,
                            ease: 'expo.out',
                        });

                        return tl;
                    }
                },

                afterLeave() {
                    let triggers = ScrollTrigger.getAll();
                    triggers.forEach((trigger) => {
                        trigger.kill();
                    });
                    scrollToTop(false);

                    const previouslyCreatedSmoother = ScrollSmoother.get();
                    previouslyCreatedSmoother.kill();
                },

                beforeEnter() {
                    ScrollTrigger.clearScrollMemory();
                    smoothScroll();
                },

                enter(data) {
                    const tl = gsap.timeline();

                    tl.to(elements.bgs, {
                        yPercent: 0,
                        stagger: 0.05,
                        duration: 0.6,
                        ease: 'expo.out',
                    });
             


                    if (document.querySelector('.js-preloader')) {
                        document.querySelector('.js-preloader').remove();
                    }

                    parse(data.next.container);

                    // inview
                    inView();
                },

                afterEnter() {
                    setTimeout(() => {
                        document.documentElement.classList.remove('is-transitioning');
                        dispatch('loading-finished');
                        dispatch('show-navigation');
                    }, 500);
                },
            },
        ],
    });
}
