import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import shuffleLetters from 'shuffle-letters';
import baffle from 'baffle';

export default function paint(element) {
    const elements = {
        inner: element.querySelector('.js-header__inner'),
        intro: document.querySelector('.js-header__intro'),
        title: element.querySelector('.js-header__title'),
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
              end: () => window.innerHeight*3,
              scrub: true,
              invalidateOnRefresh: true,
              
          },
          x: -elements.intro.offsetWidth + (window.innerWidth / 1.3),
      });


      ScrollTrigger.create({
        trigger: element,
        start: `top top-=${window.innerHeight*2.5}`, //раньше чем додвинется лента

        onEnter: () => {
            // let b = baffle(elements.title);

            // b.reveal(1000);
            tl.to(elements.introContainer, {
                y: '100%',
                duration: 0.5,
                ease: 'expo.out',
            })

            shuffleLetters(elements.title, {
                text: 'Gosha Creative Dev',
                iterations: 12,
                fps: 60,

              });


        },
        onLeaveBack: () => {
            tl.to(elements.introContainer, {
                y: '0',
                duration: 0.5,
                ease: 'expo.out',
            })

            shuffleLetters(elements.title, {
                text: '____________',
                iterations: 12,
                fps: 60,
              });
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
              end: () => `+=${window.innerHeight*3}`,
              pin: true,
              pinType: 'transform',
          },
      });
  }

    init();
}
