import Scrollbar from 'smooth-scrollbar';

class DisableScrollPlugin extends Scrollbar.ScrollbarPlugin {
    static pluginName = 'disableScroll';

    static defaultOptions = {
        direction: '',
    };

    transformDelta(delta) {
        if (this.options.direction) {
            delta[this.options.direction] = 0;
        }

        return { ...delta };
    }
}

DisableScrollPlugin.pluginName = 'disableScroll';

export default DisableScrollPlugin;
