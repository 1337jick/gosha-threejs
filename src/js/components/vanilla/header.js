import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export default function paint(element) {
    const elements = {
        inner: element.querySelector('.js-header__inner'),
        intro: document.querySelector('.js-header__intro'),
        introContainer: document.querySelector('.js-header__intro__container'),
    };


    function init() {
        initScene();
    }

 

    function initScene() {
        const scene = gsap.timeline();

        
        const pinScene = headerPinTimeline();
        const introScene = introTimeline();
  
        scene.add(pinScene);
        scene.add(introScene);

    }

    function introTimeline() {
      const tl = gsap.timeline();

      tl.to(elements.intro, {
          scrollTrigger: {
              trigger: element,
              start: () => `top top`,
              end: () => window.innerHeight*2,
              scrub: true,
              invalidateOnRefresh: true,
              
          },
          x: -elements.intro.offsetWidth + (window.innerWidth / 1.3),
      });


      ScrollTrigger.create({
        trigger: element,
        start: `top top-=${window.innerHeight*1.8}`, //раньше чем додвинется лента

        onEnter: () => {
            tl.to(elements.introContainer, {
                y: '-100%',
                duration: 1,
                ease: 'expo.out',
            })
        },
        onLeaveBack: () => {
            tl.to(elements.introContainer, {
                y: '0',
                duration: 1,
                ease: 'expo.out',
            })
        },
    });
    }

    // pin header container
    function headerPinTimeline() {
      return gsap.timeline({
          scrollTrigger: {
              trigger: elements.inner,
              start: `top top`,
              scrub: true,
              end: () => `+=${window.innerHeight*2}`,
              pin: true,
              pinType: 'transform',
          },
      });
  }

    init();
}
