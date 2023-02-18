import * as ComponentParser from 'models/utils/component-parser';
import * as VanillaFactory from 'models/utils/vanilla-factory';

// Register static components
// VanillaFactory.registerComponent('in-view', inView);

// Define async components
const asyncComponents = [
    'three',
    'header',
    'works',
];

// Register async components
asyncComponents.forEach((asyncComponent) => {
    VanillaFactory.registerComponent(asyncComponent, () =>
        import(/* webpackChunkName: "[request]" */ 'components/vanilla/' + asyncComponent)
    );
});

ComponentParser.registerFactory('vanilla', VanillaFactory.create);
