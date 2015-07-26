(function(root) {

  'use strict';

  function noop() {}

  // `transitionEnd` is the name of the event that is fired at the end of a
  // CSS transition.
  var transitionEnd = (function() {
    var transitions = {
      transition: 'transitionend',
      OTransition: 'oTransitionEnd',
      MozTransition: 'transitionend',
      WebkitTransition: 'webkitTransitionEnd'
    };
    var elem = document.createElement('b');
    var transition;
    for (transition in transitions) {
      if (elem.style[transition] != null) {
        return transitions[transition];
      }
    }
  })();

  // Binds the given `handler` to all elements that match the `selector`.
  function bindToClick(selector, handler) {
    var elems = document.querySelectorAll(selector);
    var i = -1;
    var len = elems.length;
    while (++i < len) {
      elems[i].addEventListener('click', handler);
    }
  }

  function Modal(elem, opts) {

    // Allow `Modal` to be called without the `new` keyword.
    var self = this;
    opts = opts || {};
    if (!(self instanceof Modal)) {
      return new Modal(elem, opts);
    }
    self.elem = elem;

    // Callbacks.
    self.onShow = opts.onShow || noop;
    self.onShowEnd = opts.onShowEnd || noop;
    self.onHide = opts.onHide || noop;
    var onHideEnd = opts.onHideEnd || noop;
    self.onHideEnd = function() {
      elem.style.display = 'none';
      onHideEnd(elem);
    };

    // Settings.
    var fade = self.fade = transitionEnd ? opts.fade : false;
    self.scrollTop = opts.scrollTop != null ? opts.scrollTop : true;
    self.isVisible = false;

    // Prepend a spacer element (for vertical centering) to `elem`.
    var spacer = document.createElement('b');
    elem.insertBefore(spacer, elem.firstChild);
    spacer.style.cssText = 'display:inline-block;margin:0;padding:0;border:0;outline:0;width:0;height:100%;vertical-align:middle;';

    // Assign styles to `dialog`.
    var dialog = elem.querySelector(opts.dialogSelector || '.modal__dialog');
    var textAlign = window.getComputedStyle(dialog)['text-align'];
    dialog.style.cssText += 'display:inline-block;text-align:' + textAlign + ';vertical-align:middle;';

    // Assign styles to `elem`.
    elem.style.cssText += 'display:none;position:fixed;top:0;right:0;bottom:0;left:0;overflow:auto;text-align:center;will-change:transform;';

    // Bind the `show` and `hide` methods to the click event of elements that
    // match `opts.showSelector` and `opts.hideSelector`.
    bindToClick(opts.showSelector || '.js-modal-show', function(e) {
      self.show(e.target);
    });
    bindToClick(opts.hideSelector || '.js-modal-hide', function(e) {
      self.hide(e.target);
    });

    // Bind the `hide` method to the `click` event on the `elem`. Only hide
    // the modal if we had clicked directly on `elem` (ie. the overlay).
    elem.addEventListener('click', function(e) {
      e.target === elem && self.hide(elem);
    });

    // Bind the `hide` method to the `keydown` event. Only hide the modal if
    // we had pressed the <Esc> key.
    document.addEventListener('keydown', function(e) {
      e.keyCode === 27 && self.hide(e.target);
    });

    // Add inline styles to create the fade effect to `elem`, and bind the
    // the `onShowEnd` and `onHideEnd` callbacks to the `transitionEnd` event.
    if (fade) {
      var transition = (fade.duration || '0.25s') + ' ' + (fade.timingFunction || 'ease') + ' opacity';
      elem.style.cssText += '-webkit-transition:' + transition + ';-moz-transition:' + transition + ';-o-transition:' + transition + ';transition:' + transition + ';';
      elem.addEventListener(transitionEnd, function() {
        (self.isVisible ? self.onShowEnd : self.onHideEnd)(elem);
      });
    }

  }

  Modal.prototype.show = function(triggerElem) {
    var self = this;
    var elem = self.elem;
    var elemStyle = elem.style;
    if (!self.isVisible) {
      // Disable scrolling on the window, and show the modal.
      document.body.style.overflow = 'hidden';
      // Set the initial opacity if fading in.
      if (self.fade) {
        elemStyle.opacity = 0;
      }
      elemStyle.display = 'block';
      // Scroll to the top of the modal.
      if (self.scrollTop) {
        elem.scrollTop = 0;
      }
      // Trigger fade-in only on the next tick.
      if (self.fade) {
        setTimeout(function() {
          elemStyle.opacity = 1;
        }, 0);
      }
      self.isVisible = true;
      self.onShow(elem, triggerElem);
      // If not fading, call `onShowEnd` immediately.
      !self.fade && self.onShowEnd(elem);
    }
  };

  Modal.prototype.hide = function(triggerElem) {
    var self = this;
    var elem = self.elem;
    if (self.isVisible) {
      // Enable scrolling on the window.
      document.body.style.overflow = '';
      // Trigger fade-out.
      if (self.fade) {
        elem.style.opacity = 0;
      }
      self.isVisible = false;
      self.onHide(elem, triggerElem);
      // If not fading, call `onHideEnd` immediately.
      !self.fade && self.onHideEnd(elem);
    }
  };

  if (typeof module === 'object') {
    module.exports = Modal;
  } else {
    root.modal = Modal;
  }

})(this);
