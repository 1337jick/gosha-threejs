// import Vue from 'vue'; // Uncomment to enable Vue.js components
import * as app from 'models/utils/app';
import * as ComponentParser from 'models/utils/component-parser';
/*
Vue.mixin({
	mounted () {
		if (this.$el.querySelectorAll) {
			// handle vanilla component rendering inside vue component
			ComponentParser.parse(this.$el, false);

			// handle lazyloaded images stuck in lazyloading state
			this.$el.querySelectorAll('.lazyloading').forEach(image => {
				image.classList.remove('lazyloading');
				image.classList.add('lazyload');
			});
		}
	},
});
*/ // Uncomment to enable Vue.js components
app.registerParser(ComponentParser.parse);
