import gsap from 'gsap';

export default function paint(element) {
    const elements = {
        inner: element.querySelector('.js-header__inner'),
        intro: document.querySelector('.js-header__intro'),
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
              end: () => `+=3000`,
              scrub: true,
              invalidateOnRefresh: true,
              
          },
          x: -elements.intro.offsetWidth + (window.innerWidth / 1.5),
      });
    }

    // pin header container
    function headerPinTimeline() {
      return gsap.timeline({
          scrollTrigger: {
              trigger: elements.inner,
              start: `top top`,
              scrub: true,
              end: () => `+=3000`,
              pin: true,
              pinType: 'transform',
          },
      });
  }

    init();
}
