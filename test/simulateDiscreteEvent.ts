import * as React from 'react';
// some useful links
// https://github.com/reactwg/react-18/discussions/21
// https://github.com/facebook/react/issues/22506
// this trick is also used in REACTDOM TESTING (guarda screenshot)

/*
function dispatchAndSetCurrentEvent(el, event) {
  try {
    window.event = event;
    el.dispatchEvent(event);
  } finally {
    window.event = undefined;
  }
}*/

const discreteEvent = typeof Event !== 'undefined' && new Event('click');

export function simulateDiscreteEvent(cb: () => void) {
  if (React.version.startsWith('18')) {
    const previousEvent = window.event;

    //try {
    Object.defineProperty(window, 'event', {
      value: discreteEvent,
      configurable: true,
      writable: true,
    });
    cb();
    Object.defineProperty(window, 'event', {
      value: previousEvent,
      configurable: true,
      writable: true,
    });
    //} catch (error) {
    //  cb();
    //}
  } else {
    // NOTE: THIS IS EUIVALENT OF then() => FLUSH_SYNC! VERY AGGRESSIVE
    // In react < 18, updates are not batched.
    Promise.resolve().then(cb);
  }
}

// meh....
let isInsideBatch = false;
export function batchedUpdates(cb: () => void) {
  if (!isInsideBatch) {
    isInsideBatch = true;
    simulateDiscreteEvent(() => cb());
    isInsideBatch = false;
  } else {
    cb();
  }
}
