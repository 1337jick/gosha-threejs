import * as ComponentParser from 'models/utils/component-parser';
import * as VanillaFactory from 'models/utils/vanilla-factory';

// Register static components

// Define async components
const asyncComponents = [
    'inview',,
];

// Register async components
asyncComponents.forEach((asyncComponent) => {
    VanillaFactory.registerComponent(asyncComponent, () =>
        import(/* webpackChunkName: "[request]" */ 'components/vanilla/' + asyncComponent)
    );
});

ComponentParser.registerFactory('vanilla', VanillaFactory.create);