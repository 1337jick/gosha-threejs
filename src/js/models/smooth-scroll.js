import { dispatch, listen } from 'models/utils/event-bus';

import gsap from 'gsap';
import ScrollSmoother from 'gsap/ScrollSmoother';
import ScrollTrigger from 'gsap/ScrollTrigger';
import DrawSVGPlugin from 'gsap/DrawSVGPlugin';
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, DrawSVGPlugin, SplitText);

export default function smoothScroll() {
    function init() {

        let smoother = ScrollSmoother.create({
            smooth: 1,
            effects: true, // looks for data-speed and data-lag attributes on elements
            // normalizeScroll: false,
            ignoreMobileResize: true,
            smoothTouch: 0.1,
        });
    
        ScrollTrigger.refresh();

        
        dispatch('smooth-scroll-init');
    }

    init();
}
