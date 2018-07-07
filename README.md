# URL

Polyfill for URL and URLSearchParams. Totally following the implementation of Google Chrome.

## Installation

```js
$ npm i @lvchengbin/url --save
```

## Usage

```js
const { URL, URLSearchParams } = require( '@lvchengbin/url' );
```

### ES6

```js
import { URL, URLSearchParams } from '@lvchengbin/url';
```

### Loading with `<SCRIPT>` tag

If you want to use this library in browsers and to load it with `<SCRIPT>` tag, you should use [url.js](https://raw.githubusercontent.com/LvChengbin/url/master/dist/url.js), and if you want to use the library in browsers which do not support ES6 syntax, you should use [url.bc.js](https://raw.githubusercontent.com/LvChengbin/url/master/dist/url.bc.js) instead.

```html
<script src="./url.bc.js"></script>
<script>
    var url = new JURL.URL( 'http://www.google.com/path?x=1&y=2' );        
    var params = new JURL.URLSearchParams( 'x=1&y=2' );
    console.log( 'url', url );
    console.log( 'params', params );
</script>
```
