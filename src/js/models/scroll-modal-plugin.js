import Scrollbar from 'smooth-scrollbar';

class ModalPlugin extends Scrollbar.ScrollbarPlugin {
    static pluginName = 'Modal';

    static defaultOptions = {
        open: false,
    };

    transformDelta(delta) {
        return this.options.open ? { x: 0, y: 0 } : delta;
    }
}

ModalPlugin.pluginName = 'Modal';

export default ModalPlugin;
