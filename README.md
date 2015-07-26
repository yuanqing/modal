# modal.js [![npm Version](http://img.shields.io/npm/v/@yuanqing/modal.svg?style=flat)](https://www.npmjs.com/package/@yuanqing/modal) [![Build Status](https://img.shields.io/travis/yuanqing/modal.svg?branch=master&style=flat)](https://travis-ci.org/yuanqing/modal)

> Super-simple modals in vanilla JavaScript.

## Features

- Define DOM elements on which to trigger show and hide on `click`
- Trigger show and hide programmatically
- Apply a fade effect
- Vertically centre the modal dialog box on the page
- Hide the modal on hitting the `<Esc>` key
- Zero dependencies; 2.3 KB [minified](modal.min.js) or 1.0 KB minified and gzipped

## Usage

> [**Editable demo**](https://jsfiddle.net/ms31msb0/)

```html
<!DOCTYPE html>
<html>
  <head>
    <title>modal</title>
    <meta charset="utf-8">
    <style>
      .modal {background: rgba(0,0,0,.25); }
      .modal__dialog {width: 300px; margin: 25px 0; background: #fff; }
    </style>
  </head>
  <body>

    <button class="js-modal-show">Show</button>
    <div style="height: 1000px;"><!-- page content --></div>

    <div class="modal">
      <div class="modal__dialog">
        <button class="js-modal-hide">Hide</button>
        <div style="height: 1000px;"><!-- modal content --></div>
      </div>
    </div>

    <script src="path/to/modal.min.js"></script>
    <script>
      var elem = document.querySelector('.modal');
      var opts = {
        showSelector: '.js-modal-show',
        hideSelector: '.js-modal-hide',
        dialogSelector: '.modal__dialog',
        fade: {
          duration: '.2s',
          timingFunction: 'ease'
        }
      };
      modal(elem, opts);
    </script>

  </body>
</html>
```

In the browser, the `modal` function is a global variable. In Node, do:

```js
var modal = require('@yuanqing/modal');
```

### var m = modal(elem [, opts])

- `elem` &mdash; A DOM element.

- `opts` &mdash; An object literal:

  Key | Description | Default
  :--|:--|:--
  `dialogSelector` | Selector for the dialog box DOM element | `.modal__dialog`
  `showSelector` | Clicking on elements that match this selector will show the modal | `.js-modal-show`
  `hideSelector` | Clicking on elements that match this selector will hide the modal | `.js-modal-hide`
  `scrollTop` | Whether to always scroll to the top of the modal when it is shown | `true`
  `fade` | Whether to apply a fade effect | If truthy, `{ duration: .2s, timingFunction: 'ease' }`, else `false`
  `onShow` | Called when the modal is shown | `function() {}`
  `onShowEnd` | Called at the end of the fade-in effect | `function() {}`
  `onHide` | Called when the modal is hidden | `function() {}`
  `onShowEnd` | Called at the end of the fade-out effect | `function() {}`

  - The signature of the `onShow` and `onHide` callbacks is `(elem, triggerElem)`, where `triggerElem` is the particular DOM element that triggered the show or hide.
  - The signature of the `onShowEnd` and `onHideEnd` callbacks is `(elem)`. If `fade` is `false`, these callbacks are invoked immediately after `onShow` and `onHide` respectively.

### m.show()

Shows the modal.

### m.hide()

Hides the modal.

### m.isVisible

Is `true` when the modal is visible, else is `false`.

## Implementation details

- Vertically centering the modal dialog box is achieved using the technique described in the CSS Tricks article [Centering In the Unknown](https://css-tricks.com/centering-in-the-unknown/). The

- These are the initial [inline styles](https://github.com/jonathanong/component-style-guide#inline-css-if-possible) applied on the modal `elem`:

  ```
  display: none;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  text-align: center;
  will-change: transform;
  ```

- When fading in:

  1. Set `overflow: hidden` on `body`
  2. Set `opacity: 0` and `display: block` on the modal `elem`
  3. On the next tick, set `opacity: 1` on `elem`

- When fading out:

  1. Unset `overflow: hidden` on `body`
  2. Set `opacity: 0` on the modal `elem`
  3. At the end of the CSS transition, set `display: none` on `elem`

## Installation

Install via [npm](https://www.npmjs.com):

```
$ npm i --save @yuanqing/modal
```

Install via [bower](http://bower.io):

```
$ bower i --save yuanqing/modal
```

## Changelog

- 0.0.1
  - Initial release

## License

[MIT](LICENSE)
