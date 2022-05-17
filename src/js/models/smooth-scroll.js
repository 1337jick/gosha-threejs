import SmoothScrollbar from 'smooth-scrollbar';
import ScrollTriggerPlugin from 'models/scroll-trigger-plugin';
import DisableScrollPlugin from 'models/disable-horizontal-plugin';
import { dispatch, listen } from 'models/utils/event-bus';
import gsap from 'gsap';

// GSAP ScrollTrigger & Soft Edges plugin for SmoothScroll
SmoothScrollbar.use(ScrollTriggerPlugin, DisableScrollPlugin);

export default function smoothScroll() {
    // Init smooth scrollbar
    const view = document.getElementById('view-main');
    const scrollbar = SmoothScrollbar.init(view, {
        renderByPixels: false,
        damping: 0.1,
        plugins: {
            disableScroll: {
                direction: 'x',
            },
        },
    });

    function init() {
        dispatch('smooth-scroll-init');
        listen('loading-finished', setMarkers);
    }

    function setMarkers() {
        // Only necessary to correct marker position - not needed in production
        if (document.querySelector('.gsap-marker-scroller-start')) {
            const markers = gsap.utils.toArray('[class *= "gsap-marker"]');
            markers;

            scrollbar.addListener(({ offset }) => {
                gsap.set(markers, { marginTop: -offset.y });
            });
        }
    }

    init();
}
