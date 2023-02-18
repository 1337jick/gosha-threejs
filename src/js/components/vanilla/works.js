import SplitText from 'gsap/SplitText';


export default function works(element) {
    const elements = {
      items: element.querySelectorAll('.js-works__item'),
    };
    


    function init() {
        // initSplit();
    }


    function initSplit() {
      new SplitText(elements.items, { type: 'chars', charsClass: 'char' });
    }

 

    init();
}
