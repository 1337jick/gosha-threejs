# Quick start

## Setup

Make sure you have Node v.11 or above installed.

```
npm install
```

Copy `.env.default` to `.env` if it exists.


## Production

To build an optimized version of the application in `/dist/` use command:

```
gulp build:production
```

or just use shortcut:

```
gulp
```

## Development

Deploy the app and start the middleware server with live reload:

```
gulp serve
```

## Basic configuration

Build settings located in `config.development.js` and `config.production.js`.

Webpack configuration located in `webpackConfig.development.js` and `webpackConfig.production.js`.

The locale can be switched using the `pug.locale` parameter in build config and can override with `FORCE_LOCALE` environment variable.

The configuration files can be switched using the `NODE_ENV` environment variable.

## File structure

```bash
├── /dist/                      # Production directory (minified, optimized and compiled files)
└── /src/                       # The source code of the application
    ├── /icons/                 # SVG icons
    ├── /js/                    # JavaScript source
    ├── /locales/               # JSON localizations strings
    ├── /pug/                   # Pug templates
        └── /_includes/         # Pug partials
    ├── /scss/                  # SCSS styles
        └── /templates/         # SCSS templates for generator tasks (icons, sprites, etc..)
        └── /generates/         # Generated styles
    ├── /sprites/               # Sprite raster images
    ├── /static/                # Root of static files (fonts, images, videos, etc..)
├── /tmp/                       # Temporary served files
├── .env                        # Environment variables
├── .editorconfig               # IDE style configuration
├── babel.config                # Babel config
├── config.development.js       # Development build configuration
├── config.production.js        # Production build configuration
├── webpackConfig.development.js      # Webpack development configuration
├── webpackConfig.production.js       # Webpack production configuration
├── package.json                # Project meta and dependencies
```

## Gulp tasks

`gulp serve` deploy the app and start middleware server with live reload

`gulp build` build the app in `/dist/` with current environment

`gulp build:production` build the app to `/dist/` with force production environment

`gulp pug` compile Pug files

`gulp sass` compile Sass files

`gulp js` build JS with Webpack + Babel

`gulp sprites` make spritesheet based on sprites in `/src/sprites/`

`gulp svgsprite` make svg spritesheet based on icons in `/src/icons/`

`gulp copy:static` copy static files from `/src/static/` to `/dist/`

`gulp browsersync` start browser sync server

`gulp watch` start watching stream

`gulp clean` remove temporary files

`gulp clean:dist` clean directory `/dist/`

# Advanced configuration

## HTML

Boilerplate use [Pug](https://pugjs.org/) as an HTML Preprocessor.

The following options are available in the build configuration:

| parameter | type | description |
| :--- | :---: | :--- |
| `locale` | `string` | default locale |
| `ext` | `string` | extension of `.html` files  |
| `pugOptions` | `object` | [compiler options](https://pugjs.org/api/reference.html) |
| `fetch` | `function` | callable to fetch external data |
| `templates` | `array` | templates map |

The following constants are available in each template:

| variable | type | description |
| :--- | :---: | :--- |
| `__` | `object` | current locale data |
| `$$` | `object` | fetched data (only if use fetch) |
| `ENV` | `object` | environment variables |
| `NODE_ENV` | `string` | current `NODE_ENV` |
| `PACKAGE` | `object` | `package.json` contents |
| `LOCALE` | `string` | current locale |
| `$` | `string` | current page key (only in templates) |

## Locales

All locales should be stored in `./src/locales/{LANG}/*.json`.

Builder merges all `.json` files from current locale directory into one object, and you can access it from `__` constant in each template.

The locale can be switched using `locale` parameter in build config and can override with `FORCE_LOCALE` environment variable.


###Styles

Boilerplate use [Sass](https://sass-lang.com/) as an CSS Preprocessor.

[Autoprefixer](https://github.com/postcss/autoprefixer), [clean-css](https://github.com/jakubpawlowicz/clean-css) and [RTLCSS](https://github.com/MohammadYounes/rtlcss) (disabled by default in config) is also included. Clean-css disabled by default in the development environment to increase assembly speed.

Entrypoint by default: `./src/scss/main.scss`.

The following options are available in the build configuration:

| parameter | type | description |
| :--- | :---: | :--- |
| `maps` | `boolean` | use [Sourcemap](https://www.npmjs.com/package/gulp-sourcemaps) |
| `autoprefixer` | `boolean` | use [Autoprefixer](https://github.com/postcss/autoprefixer)  |
| `rtl` | `boolean` | use [RTLCSS](https://github.com/MohammadYounes/rtlcss) |
| `cleanCss` | `boolean` | use [clean-css](https://github.com/jakubpawlowicz/clean-css) |
| `sassOptions` | `object` | [node-sass options](https://github.com/sass/node-sass#options) |
| `cleanCssOptions` | `object` | [clean-css options](https://github.com/jakubpawlowicz/clean-css#constructor-options) |
| `autoprefixerOptions` | `object` | [Autoprefixer options](https://github.com/postcss/autoprefixer#options) |


Styles are written in .scss file format.

## Media Queries

A `sass-mq` library is used to generate media query mixins. The breakpoints are defined in `_variables.scss`, in the `$mq-breakpoints` object. Media queries use mobile-first approach. Check [sass-mq documentation](https://github.com/sass-mq/sass-mq) for more info.

Example use:
```scss
@include mq(laptop) { // wider than 'laptop' breakpoint
    background-color: red;
}
@include mq($until: tablet) { // narrower than 'tablet' breakpoint
    background-color: yellow;
}
@include mq($from: tablet, $until: desktop) { // between 'tablet' and 'desktop' breakpoints
    background-color: green;
}
```

## Grid

Use [CSS Grid](https://css-tricks.com/snippets/css/complete-guide-grid/) for your grid needs. There is nothing special about the way we use it except Jumpstart provides to predefined variables called `$gutter-small` and `$gutter-big`. Use these to keep the grid gaps consistent throughout the modules.

Example use:
```scss
.my-module__items {
	display: grid;
	gap: $gutter-small;
	grid-template-columns: minmax(100px, 1fr);
	@include mq(desktop) {
			gap: $gutter-big;
			grid-template-columns: repeat(2, minmax(100px, 1fr)) 2fr;
	}
}
```

## SVG Sprites

All svg icons should be stored in `./src/icons/`.

Make sure the shapes do not use a `fill` and `stroke` properties, so that you can dynamically change the color in css.

To directly compile svg spritesheet use command:

```
gulp svgsprite
```

Spritesheet stored in:

`{WORKDIR}/assets/img/sprites/svgsprites.svg`.

Svg sprites also generated scss:

`./src/scss/generated/svgsprites.scss`

Make sure to include it in `./src/scss/main.scss`.

To use icon in Pug use mixin:

```jade
+svgicon("ICON_NAME", insertinline = true | false)
```

## Sprites

All sprites should be stored in `./src/sprites/`. `@2x (retina)` icons also supported.

To directly compile png spritesheet use command:

```
gulp sprites
```

Spritesheet stored in:

`{WORKDIR}/assets/img/sprites/sprites.png`.

`{WORKDIR}/assets/img/sprites/sprites@2x.png`.

Sprites also generated scss:

`./src/scss/generated/svgsprites.scss`

Make sure to include it in `./src/scss/main.scss`.

To use sprites in pug:

```jade
.my-sprite.-NAME
```

## Scripts

The scripts system is based on vanilla javascript and vue.js. By default vue.js is disabled and has to be enabled by uncommenting all the lines that are anotated with "Uncomment to enable Vue.js components"

`scripts` directory is split into four main sections:

| Folder | Description |
| --- | --- |
| `bootstrap` | Code used to initiate the system and register all components |
| `components` | Vanilla and Vue.js components |
| `models` | Model files containing a reusable logic used in the components |
| `store` | A vuex store instance to define global variable storage |

Dev talks video: **Scripts - Introduction**

![](https://docs.frontend.agentur-loop.com/assets/videos/scripts-1.mp4)

Example `load-content.js` file from the video: [load-content.js](https://docs.frontend.agentur-loop.com/assets/videos/files/load-content.js)

### Bootstrap

Use `init` folder to register your components and global models.

Each component (vanilla or vue) can be registered as a static or async component. Async components will be downloaded as separate files which helps to keep the main.js filesize down but results in a longer time until the script is initiated, so choose what's the best option on a case-by-case basis.

Most of the models will be imported in one of the components, as they are mostly used to add a logic layer to the component. In case you need a model that's not connected to any component but it's required to run at the page load - you may import it in the `init/global-models.js` file.

Use `vendor` folder to register all the external dependencies, like polyfills or global libraries.

### Components

This is where most of your code will live - you can decide if you want to create a vanilla js or vue.js component.
Whenever possible use vanilla.js as it will usually provide better performance. Use vue.js for more complicated components.

Components are only instantiated when there is a DOM element that triggers them. To instantiate a component on a DOM element add this data attribute: `data-component='{"component": "component-name"}'`. In case of vue components an existence of `data-component` is enough, as the component name is derived from the DOM node name and the default value for the `factory` setting is `vue`.

Example of vanilla script instantiation:
```html
<div data-component='{"component": "vanilla-example-one"}'></div>
```

Example of vue.js script instantiation (follow next step to enable them in your project):
```html
<vue-example-one data-component='{"factory": "vue"}'></vue-example-one>
```

Component is by default initialised when the browser has free resources, which can cause some delay in the component load time. If you want to force the component initialisation as soon as possible for critical components - use a `"immediate": true` parameter, i.e.:
```html
<div data-component='{"component": "header", "immediate": true}'></div>
```

If you want to ignore the component initialisation on page load (i.e. because you want to manually initialise it later) - use a `"ignoreOnPageLoad": true` parameter, i.e.:
```html
<div data-component='{"component": "map", "ignoreOnPageLoad": true}'></div>
```

If you want to initialise previously unintialized components inside a specific container, use following method:
```js
import { parse } from 'models/utils/app';
// ...
function initalize () {
    parse(containerEl);
}
```
### Enable Vue.js components

To enable Vue.js components in your project search for the following string in your `scripts` directory: "Uncomment to enable Vue.js components".
Then uncomment all three occurences of the code next to that string.

### Usage in .vue file
There is an `icon` component prepared to display the icon on the page.


Example use (inline mode):
```html
<template>
    <div class="vue-example-one">
        <icon class="vue-example-one__icon" type="inline" v-html="checkmarkInlineIconSvg"></icon>
    </div>
</template>
```

```js
import checkmarkInlineIcon from 'InlineIcons/checkmark-inline.svg';
export default {
    data () {
        return {
            checkmarkInlineIconSvg: checkmarkInlineIcon,
        };
    },
};
```

Example use (symbol mode):
```html
<template>
    <div class="vue-example-two">
        <icon class="vue-example-two__icon" name="checkmark-symbol" type="symbol"></icon>
    </div>
</template>
```
### Models

Models serve as a logic layer for components, which means you can reuse the same logic no mather what the component is (components serve as a "view" layer and models as "logic" layer).

I.e. a `articles` model can contain a method to fetch a list of articles from a remote server and return the list in a sorted order. This logic can now be shared by `article-teasers` and `featured-articles` components that provide a completely different layout but rely on the same underlying data. If the model exports a `fetchAndSortArticles` method it can be used in the component in a following way:

```js
import { fetchAndSortArticles } from 'models/articles';

...

function getArticles () {
    let articles = fetchAndSortArticles();
}
```

Models should be used to store the logic and make keep the component code clean even if the logic is not planned to be reused by other components.


### Store

Store provides a way to share data between various components and models in the system. The store is not included in the final script package until at least one script imports it to it's scope (`import store from Store`).

The store system is based on the `vuex` package. Check vuex documentation for more details.


### Directory aliases

System provides directory aliases for `import` statements in order to simplify the import structure.

I.e. you can use `import { fetchAndSortArticles } from 'Models/articles';` instead of `import { fetchAndSortArticles } from '/templates/src/assets/scripts/models/articles';`

| Alias | Path |
| --- | --- |
| Scripts | `templates/src/assets/scripts`|
| Models | `templates/src/assets/scripts/models`|
| Components | `templates/src/assets/scripts/components`|
| Bootstrap | `templates/src/assets/scripts/bootstrap`|
| Store | `templates/src/assets/scripts/store`|
| InlineIcons | `templates/src/assets/icons/inline`|



### Included models

#### Overlay

A full overlay (popup) system

Trigger overlay from HTML:

With `target="_top"` attribute:
```html
<a href="your-popup-content.php" target="_top">Open overlay</a>
```

With `js-overlay__link` class:
```html
<a href="your-popup-content.php" class="js-overlay__link">Open overlay</a>
```

Trigger overlay from JS:
```js
import { openOverlay } from 'Models/overlay';
...
openOverlay(url);
```

`openOverlay` can take a couple of parameters. The first one called `contentHolder` can be:
- url
- element (if the string starts with "#"). I.e. "#id-of-dom-block"
- html (you can supply html that should be displayed). In that case specify a second parameter as `'html'`. 

The overlay component has some more options. Please check the `overlay.js` file directly to check how it works in detail.

The content of the overlay should be wrapped in a following div:
```html
<div class="overlay__content overlay__content--default js-overlay__content">
    ...
</div>
```

where the `--default` modifier sets the width of the content box. Add your additional sizes in the css file.

If you want to show a "x" button in top right corner add this element in the overlay content area:
```php
echo generate_component_icon([
    'name' => 'close',
    'type' => 'symbol',
    'class' => 'overlay__close js-overlay__close'
]);
```

To simplify wrapping the overlay content in the html syntax described above there is a helper component called `overlay-wrapper`.

Example use:
```php
echo generate_component_overlay_wrapper([
	'content' => $content, // html inside the overlay
	'close_icon' => false, // default: true
	'size' => 'narrow', // default: 'default'
]);
```

Dev talks video: **Scripts - Overlay system**

![](https://docs.frontend.agentur-loop.com/assets/videos/scripts-overlay.mp4)
#### Global debounced events

`emit-debounced-events.js` model emits a `window-resized` event that is debounced. Listen to this event instead of the generic `window.onResize` event.

### Breakpoints

`breakpoints.js` model allows you to:
- get list of currently active media query breakpoints (`currentlyActiveBreakpoints`)
- listen to a `active-breakpoints-change` event that is triggered every time window width is reaching a new breakpoint. A list of active breakpoints is transmitted as a detail object of that event.

#### HTTP Request

Instead of using `fetch` directly use the `call` function imported from `http-request` model.

Example:
```js
import { call } from 'models/http-request';
...
try {
    const response = await call(url);
    if (response.status === 'success') {
        ...
    } else {
        ...error handling
    }
} catch (e) {
    console.error(e);
    ...error handling
}
```

#### Preloader

Show/hide a preloader inside an element

```js
import { showPreloader, hidePreloader } from 'models/preloader';
...
const options = {
    size: 'small',
    color: 'primary'
}
showPreloader(myDomElement, options)
```

`options` parameter is an object which can specify additional `color` and `size` parameters.
This will add classes to the main element, like so: `preloader--your-color` and `preloader--your-size` that you can later style in your `_preloader.scss` file.

#### Dimmer

Dim page (i.e. when you show a side drawer)

```js
import { dimPage, undimPage } from 'models/dimmer';
...
dimPage();
...
undimPage();
```
### Locker

Lock page scrolling (i.e. when you show a side drawer)

```js
import { lockPage, unlockPage } from 'models/locker';
...
lockPage();
...
unlockPage();
```


#### IE11 Support

By default Front-End Jumpstart supports only modern browsers. If you need to support IE11 open `templates/src/assets/scripts/bootstrap/vendor/index.js` file and uncomment the lines with `IE11` at the end.

#### Browsersync

Browsersync creates a small server for local development with live reloading. If Browsersync detects changes in code, it makes a local rebuild and reloads the page (complete or partial).

To start a project on a local web server with enabled livereload services use command:

```
gulp serve
```

To start the server without building the project, use the command:

```
gulp browsersync
```

In build configuration you can configure browsersync options.

[See Browsersync options](https://browsersync.io/docs).
