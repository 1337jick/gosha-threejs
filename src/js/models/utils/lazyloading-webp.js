import lazySizes from 'lazysizes';
import 'lazysizes/plugins/unveilhooks/ls.unveilhooks';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import 'lazysizes/plugins/respimg/ls.respimg';
import Modernizr from 'modernizr';
import * as ProjectConfig from 'models/utils/project-config';

Object.assign(lazySizes.cfg, {
    init: false,
});

let sourceExpression;
let sourceRegularExpression;
const urlHelper = document.createElement('a');

const validImage = (url) => {
    if (!url || !sourceExpression) {
        return false;
    }

    urlHelper.href = url;
    const absoluteUrl = urlHelper.href;

    // check source expression
    if (!absoluteUrl.match(sourceRegularExpression)) {
        return false;
    }

    return true;
};

const addWebpImages = () => {
    // replace images with webp version on the fly before they are loaded
    document.addEventListener('lazybeforeunveil', function (e) {
        const element = e.target;

        if (element.tagName === 'IMG') {
            const parent = element.parentNode;

            if (parent.tagName === 'PICTURE') {
                // picture tags
                const sources = Array.from(parent.querySelectorAll('source'));

                sources.forEach((source) => {
                    const dataSrcset = source.getAttribute('data-srcset');

                    if (!validImage(dataSrcset)) {
                        return;
                    }

                    const newSource = source.cloneNode();

                    newSource.setAttribute('data-srcset', dataSrcset + '.webp');
                    newSource.setAttribute('type', 'image/webp');

                    parent.insertBefore(newSource, source);
                });
            } else {
                // standard image tags
                const dataSrc = element.getAttribute('data-src');

                if (dataSrc && validImage(dataSrc)) {
                    element.setAttribute('data-src', dataSrc + '.webp');
                }
            }
        } else {
            // background images
            const bg = element.getAttribute('data-bg');

            if (bg && validImage(bg)) {
                element.setAttribute('data-bg', bg + '.webp');
            }
        }
    });
};

export default {
    lazySizes,
    init() {
        sourceExpression = ProjectConfig.get('webp.sourceExpression');
        sourceRegularExpression = new RegExp(sourceExpression, 'i');

        // wait for modernizr webp check
        Modernizr.on('webp', () => {
            if (Modernizr.webp && sourceExpression) {
                addWebpImages();
            }

            lazySizes.init();
        });
    },
};
