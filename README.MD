## Quick start

### Setup

Make sure you have Node v.11 or above installed.

```
npm install
```

Copy `.env.default` to `.env` if it exists.


### Production

To build an optimized version of the application in `/dist/` use command:

```
gulp build:production
```

or just use shortcut:

```
gulp
```

### Development

Deploy the app and start the middleware server with live reload:

```
gulp serve
```

### Basic configuration

Build settings located in `config.development.js` and `config.production.js`.

Webpack configuration located in `webpackConfig.development.js` and `webpackConfig.production.js`.

The locale can be switched using the `pug.locale` parameter in build config and can override with `FORCE_LOCALE` environment variable.

The configuration files can be switched using the `NODE_ENV` environment variable.

### File structure

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

### Gulp tasks

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

## Advanced configuration

### HTML

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

#### Locales

All locales should be stored in `./src/locales/{LANG}/*.json`.

Builder merges all `.json` files from current locale directory into one object, and you can access it from `__` constant in each template.

The locale can be switched using `locale` parameter in build config and can override with `FORCE_LOCALE` environment variable.

#### Fetch

Builder can receive additional dynamic data to generate pages using `fetch`. This implements a simple Jamstack architecture and "Static Site Generation".

Callable function can be async.

The received data will be available in `$$` constant in each pug template.

**Example**:

```javascript
const axios = require('axios');

const fetchBackendData = async(locals, config) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://api.example.com/posts/`).then((response) => {
            resolve(response.data);
        });
    })
};

module.exports = {
    // ..... //
    pug: {
        src: ['./src/pug/**/*.pug', '!./src/pug/_includes/**/*'],
        dest: "./tmp/",
        locale: "en",
        ext: false,
        fetch: fetchBackendData
    }
    // .... //
}
```

#### Templates

The builder can dynamically generate pages based on any object (locales, fetched data, array, etc..).

| variable | type | description |
| :--- | :---: | :--- |
| `src` | `string` | template path |
| `target` | `any` | iterable target |
| `key` | `string` | iterable target key (optional) |
| `dirname` | `string` | destination directory (`$` - replaced with a current key) |
| `basename` | `string` | destination filename (`$` - replaced with a current key) |

**Examples**:

```javascript
// Generate posts from array
templates: [
    {
        src: "./src/pug/_includes/templates/post.pug",
        target: [
            {
                "id": 1,
                "title": "Post #1"
            },
            {
                "id": 2,
                "title": "Post #2"
            }
        ],
        key: "id",
        dirname: "posts/$",
        basename: "index"
    }
]
```

```javascript
// Generate posts from locales
templates: [
    {
        src: "./src/pug/_includes/templates/post.pug",
        target: "__.posts",
        key: "id",
        dirname: "posts/$",
        basename: "index"
    }
]
```

```javascript
// Generate posts from fetched data
fetch: fetchBackendData,
templates: [
    {
        src: "./src/pug/_includes/templates/post.pug",
        target: "$$.posts",
        key: "id",
        dirname: "posts/$",
        basename: "index"
    }
]
```

```javascript
// Generate posts from array
templates: [
    {
        src: "./src/pug/_includes/templates/post.pug",
        target: [1,3,4,5],
        dirname: "tutorials",
        basename: "$"
    }
]
```

### Styles

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

#### Media Queries

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

#### Grid

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

### SVG Sprites

All svg icons should be stored in `./src/icons/`.

Make sure the shapes do not use a `fill` property, so that you can dynamically change the color in css.

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

### Sprites

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

### JS

All javascript proceeds with [webpackConfig](https://webpackConfig.js.org/) + [Babel](https://babeljs.io/).

Webpack config localed in `./webpackConfig.{NODE_ENV}.js`.

Babel config located in `./babel.config.js`.

Entrypoint, by default: `./src/js/app.js`.

To directly compile js use command:

```
gulp js
```

[Read webpackConfig docs](https://webpackConfig.js.org/concepts/).

[Read Babel docs](https://babeljs.io/docs/en/).


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

#### Bootstrap

Use `init` folder to register your components and global models.

Each component (vanilla or vue) can be registered as a static or async component. Async components will be downloaded as separate files which helps to keep the main.js filesize down but results in a longer time until the script is initiated, so choose what's the best option on a case-by-case basis.

Most of the models will be imported in one of the components, as they are mostly used to add a logic layer to the component. In case you need a model that's not connected to any component but it's required to run at the page load - you may import it in the `init/global-models.js` file.

Use `vendor` folder to register all the external dependencies, like polyfills or global libraries.

#### Components

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

#### Models

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


#### Global debounced events

`emit-debounced-events.js` model emits a `window-resized` event that is debounced. Listen to this event instead of the generic `window.onResize` event.

#### Breakpoints

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
#### Locker

Lock page scrolling (i.e. when you show a side drawer)

```js
import { lockPage, unlockPage } from 'models/locker';
...
lockPage();
...
unlockPage();
```


### IE11 Support

By default Front-End Jumpstart supports only modern browsers. If you need to support IE11 open `templates/src/assets/scripts/bootstrap/vendor/index.js` file and uncomment the lines with `IE11` at the end.

### Browsersync

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
