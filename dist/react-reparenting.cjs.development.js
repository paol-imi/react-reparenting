/**
* React-reparenting v0.3.0
* https://paol-imi.github.io/react-reparenting
* Copyright (c) 2020-present, Paol-imi
* Released under the MIT license
* https://github.com/Paol-imi/react-reparenting/blob/master/LICENSE
* @license MIT
*/

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _assertThisInitialized = _interopDefault(require('@babel/runtime/helpers/assertThisInitialized'));
var _inherits = _interopDefault(require('@babel/runtime/helpers/inherits'));
var _possibleConstructorReturn = _interopDefault(require('@babel/runtime/helpers/possibleConstructorReturn'));
var _getPrototypeOf = _interopDefault(require('@babel/runtime/helpers/getPrototypeOf'));
var _wrapNativeSuper = _interopDefault(require('@babel/runtime/helpers/wrapNativeSuper'));
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
var _typeof = _interopDefault(require('@babel/runtime/helpers/typeof'));
var react = require('react');

/**
 * Return the child fiber at the given index or null if the parent has no children.
 * If the index provided is greater than the number of children the last child is returned.
 *
 * @param parent  - The parent fiber.
 * @param index   - The index of the child fiber to find.
 * @returns       - The child fiber found or null.
 */
function findChildFiberAt(parent, index) {
  // The first child.
  var child = parent.child; // If the parent has no children.

  if (child === null) {
    return null;
  }

  if (index === -1) {
    // Find the last child.
    while (child.sibling) {
      child = child.sibling;
    }
  } else {
    // Find the child at the given index.
    while (child.sibling && index > 0) {
      index -= 1;
      child = child.sibling;
    }
  }

  return child;
}
/**
 * Return the child fiber with the given key or null if it is not found.
 *
 * @param parent  - The parent fiber.
 * @param key     - The key of the child fiber to find.
 * @returns       - The child fiber found or null.
 */

function findChildFiber(parent, key) {
  // The first child.
  var child = parent.child; // If the parent has no children.

  if (child === null) {
    return null;
  } // If the fiber to find is the first one.


  if (child.key === key) {
    return child;
  } // Find the fiber in the siblings.


  return findSiblingFiber(child, key);
}
/**
 * Return the fiber before the one with the given key or null if it is not found.
 * If the fiber with the given key is the first child of the parent, the parent is returned.
 *
 * @param parent  - The parent fiber.
 * @param key     - The key of the child fiber.
 * @returns       - The fiber found or null.
 */

function findPreviousFiber(parent, key) {
  var child = parent.child; // If the parent has no child.

  if (child === null) {
    return null;
  } // If the fiber to find is the first one.


  if (child.key === key) {
    return parent;
  }

  var _child = child,
      sibling = _child.sibling; // Find the previous sibling.

  while (sibling) {
    // If the fiber is found.
    if (sibling.key === key) {
      return child;
    }

    child = sibling;
    sibling = child.sibling;
  }

  return null;
}
/**
 * Return the child fiber with the given key or null if it is not found.
 *
 * @param parent  - The parent fiber.
 * @param key     - The key of the child fiber to find.
 * @returns       - The fiber found or null.
 */

function findSiblingFiber(fiber, key) {
  var sibling = fiber.sibling; // Find the child with the given key.

  while (sibling && sibling.key !== key) {
    sibling = sibling.sibling;
  }

  return sibling;
}

/**
 * Add a child fiber in a parent fiber at the given index and return the actual
 * index in which it is added.
 * If the index is -1 the fiber is added at the bottom.
 * If the index provided is greater than the number of children available the
 * fiber is added at the bottom.
 *
 * @param parent  - The parent fiber in which to add the child fiber.
 * @param child   - The child fiber to add.
 * @param index   - The index in which to add the fiber.
 * @returns       - The index in which the child fiber is added.
 */

function addChildFiberAt(parent, child, index) {
  // Add the fiber at the bottom.
  if (index === -1) return appendChildFiber(parent, child); // Add the fiber at the beginning.

  if (index === 0) return prependChildFiber(parent, child); // Find the previous sibling.
  // At this point we are sure that the index is greater than 0.

  var previousSibling = findChildFiberAt(parent, index - 1); // If the fiber is not found add the fiber at the bottom.

  if (previousSibling === null) {
    return prependChildFiber(parent, child);
  } // Add the fiber as sibling of the previous one.


  return addSiblingFiber(previousSibling, child);
}
/**
 * Add a child fiber in a parent fiber before the child fiber with the given
 * key and return the index in which it is added.
 * If the key is not found the fiber is added at the bottom.
 *
 * @param parent  - The parent fiber in which to add the child fiber.
 * @param child   - The child fiber to add.
 * @param key     - The key of the previous child fiber.
 * @returns       - The index in which the child fiber is added.
 */

function addChildFiberBefore(parent, child, key) {
  // Find the previous fiber.
  var previousFiber = findPreviousFiber(parent, key); // If the previous child fiber is not found add the child fiber at the bottom.

  if (previousFiber === null) {
    return appendChildFiber(parent, child);
  } // If the fiber with the given key is the first one.


  if (previousFiber === parent) {
    return prependChildFiber(parent, child);
  } // Add the fiber as sibling of the previous one.


  return addSiblingFiber(previousFiber, child);
}
/**
 * Add a child fiber at the bottom and return the index in which it is added.
 *
 * @param parent  - The parent fiber in which to add the child fiber.
 * @param child   - The child fiber to add.
 * @returns       - The index in which the fiber is added.
 */

function appendChildFiber(parent, child) {
  var previousFiber = findChildFiberAt(parent, -1); // If the parent fiber has no children.

  if (previousFiber === null) {
    return prependChildFiber(parent, child);
  }

  return addSiblingFiber(previousFiber, child);
}
/**
 * Add a sibling fiber after a fiber and return the index in which it is added.
 *
 * @param fiber   - The fiber.
 * @param sibling - The sibling fiber to add.
 * @returns       - The index in which the sibling fiber is added.
 */

function addSiblingFiber(fiber, sibling) {
  var oldSibling = fiber.sibling;
  var index = fiber.index + 1; // Update the sibling fiber fields.

  fiber.sibling = sibling;
  sibling["return"] = fiber["return"];
  sibling.sibling = oldSibling;
  return index;
}
/**
 * Add a child fiber at the beginning child and retun 0.
 *
 * @param parent  - The parent fiber.
 * @param child   - The child fiber.
 * @returns       - The index in which the fiber is added.
 */

function prependChildFiber(parent, child) {
  var oldFirstChild = parent.child; // Update the child fiber fields.

  parent.child = child;
  child.sibling = oldFirstChild;
  child["return"] = parent;
  return 0;
}

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var prefix = 'Invariant failed'; // Invariant error instance.

var Invariant = /*#__PURE__*/function (_Error) {
  _inherits(Invariant, _Error);

  var _super = _createSuper(Invariant);

  function Invariant() {
    var _this;

    _classCallCheck(this, Invariant);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "name", 'Invariant');

    return _this;
  }

  return Invariant;
}( /*#__PURE__*/_wrapNativeSuper(Error));
/**
 * Throw an error if the condition fails.
 * The message is tripped in production.
 *
 * @param condition - The condition.
 * @param message - The error message.
 */

function invariant(condition, message) {
  if (condition) return;

  {
    // When not in production we allow the message to pass through.
    throw new Invariant("".concat(prefix, ": ").concat(message || ''));
  }
}

/**
 * Update the indices of a fiber and its next siblings and return the last sibling index.
 *
 * @param fiber   - The fiber.
 * @param index   - The index of the fiber.
 * @returns       - The last sibling index.
 */

function updateFibersIndices(fiber, index) {
  while (fiber) {
    fiber.index = index;
    fiber = fiber.sibling;
    index += 1;
  }

  return index - 1;
}
/**
 * Update the debug fields.
 * I have not yet inquired about how the _debug fields are chosen.
 * For now only the owner and source are set based on the siblings/parent fields.
 * TODO:
 * - _debugID - does it need to be changed?
 * - _debugSource - is it ok like this?
 * - _debugOwner - is it ok like this?
 * - _debugHookTypes - does it need to be changed?
 *
 * @param child   - The child fiber.
 * @param parent  - The parent fiber.
 */

function updateFiberDebugFields(child, parent) {
  invariant(parent.child !== null);
  var fiberToCopy; // Try to find a sibling.

  if (parent.child === child) {
    if (child.sibling === null) {
      fiberToCopy = parent;
    } else {
      fiberToCopy = child.sibling;
    }
  } else {
    fiberToCopy = parent.child;
  }

  child._debugOwner = fiberToCopy._debugOwner;
  child._debugSource = fiberToCopy._debugSource;
}

/**
 * Prints a warning in the console.
 *
 * @param message - The warning message.
 */
function warning(message) {
  // Condition not passed.
  var text = "Warning: ".concat(message); // Check console for IE9 support which provides console
  // only with open devtools.

  if (typeof console !== 'undefined') {
    // eslint-disable-next-line no-console
    console.error(text);
  } // Throwing an error and catching it immediately
  // to improve debugging.
  // A consumer can use 'pause on caught exceptions'
  // https://github.com/facebook/react/issues/4216


  try {
    throw Error(text);
  } catch (x) {} // eslint-disable-line no-empty

}

/**
 * Add a child fiber in a parent fiber and return the index in which it is added.
 * The position can be chosen by providing a key (string) or by providing an index (number).
 * If a key (string) is provided the child will be added after the one with that key.
 * The child is added at the bottom if none of the children have that key.
 * If an index (number) is provided the child will be added in that position.
 * The child is added at the bottom if -1 is provided or the index is greater
 * than the number of children.
 *
 * @param parent    - The parent fiber in which to add the child fiber.
 * @param child     - The child fiber to add.
 * @param position  - The position in which to add the child fiber.
 * @returns         - The index in which the child fiber is added.
 */

function addChild(parent, child, position) {
  // The index in which the child is added.
  var index; // Add the child.

  if (typeof position === 'number') {
    index = addChildFiberAt(parent, child, position);
  } else {
    index = addChildFiberBefore(parent, child, position);
  }

  {
    if (typeof position === 'number') {
      // If the child is added in a different position.
      if (position !== -1 && index !== position) {
        warning("The index provided is greater than the number of children, " + "the child is added at the bottom.");
      }
    } else {
      // If no children have the provided key.
      if (findPreviousFiber(parent, position) === null) {
        warning("No child with the key: '".concat(position, "' has been found,") + "the child is added at the bottom.");
      }
    }
  } // Update the child fields.


  updateFibersIndices(child, index);

  {
    updateFiberDebugFields(child, parent);
  } // If There is no alternate we can return here.


  if (child.alternate === null || parent.alternate === null) {
    if (child.alternate !== null) {
      // The React team has done such a good job with the reconciler that we can simply
      // leave the alternate attached (although the parent does not yet exist)
      // and the reconciler will update it during the next render.
      // Removing it would take a lot of work (sync all the subtree and update the stateNodes references).
      child.alternate["return"] = null;
      child.alternate.sibling = null;
    }

    return index;
  } // Add the alternate child.


  if (typeof position === 'number') {
    addChildFiberAt(parent.alternate, child.alternate, position);
  } else {
    addChildFiberBefore(parent.alternate, child.alternate, position);
  } // Update the alternate child fields.


  updateFibersIndices(child.alternate, index);

  {
    updateFiberDebugFields(child.alternate, parent);
  }

  return index;
}

/**
 * Remove the child fiber at the given index and return it or null if it not exists.
 *
 * @param parent  - The parent fiber.
 * @param index   - The index of the child fiber to remove.
 * @returns       - The removed fiber or null.
 */

function removeChildFiberAt(parent, index) {
  invariant(index >= 0, "The index provided to find the child must be >= 0, found: ".concat(index, ".")); // Remove the first child fiber.

  if (index === 0) {
    return removeFirstChildFiber(parent);
  } // Find the previous fiber.
  // At this point we are shure that index > 0.


  var previousFiber = findChildFiberAt(parent, index - 1); // If the fiber is not found.

  if (previousFiber === null) {
    return null;
  } // Remove the sibling.


  return removeSiblingFiber(previousFiber);
}
/**
 * Remove the child fiber with the given key and return it or null if it not exists.
 *
 * @param parent  - The parent fiber.
 * @param key     - The key of the child fiber to remove.
 * @returns       - The removed fiber or null.
 */

function removeChildFiber(parent, key) {
  // Find the previous fiber.
  var previousFiber = findPreviousFiber(parent, key); // If the fiber is not found.

  if (previousFiber === null) {
    return null;
  } // If The fiber with the given key is the first one.


  if (previousFiber === parent) {
    return removeFirstChildFiber(parent);
  } // Add the fiber as sibling of the previous one.


  return removeSiblingFiber(previousFiber);
}
/**
 * Remove the first child fiber of the given parent and return it or null if it not exists.
 *
 * @param parent  - The parent fiber.
 * @returns       - The removed child fiber or null.
 */

function removeFirstChildFiber(parent) {
  var removed = parent.child; // If the parent has no children return null.

  if (removed === null) {
    return null;
  } // Update fiber references.


  parent.child = removed.sibling;
  return removed;
}
/**
 * Remove the next sibling from a fiber and return it or null if it not exist.
 *
 * @param fiber - The fiber.
 * @returns     - The removed sibling fiber or null.
 */

function removeSiblingFiber(fiber) {
  var removed = fiber.sibling; // If the fiber has no sibling return null.

  if (removed === null) {
    return null;
  } // Update fiber references.


  fiber.sibling = removed.sibling;
  return removed;
}

/**
 * Remove a child fiber from its parent fiber and return it.
 * The child to remove can be chosen by providing its key (string) or by
 * providing its index (number).
 * If the child is not found null is returned.
 *
 * @param parent        - The parent fiber from which to remove the child fiber.
 * @param childSelector - The child fiber selector.
 * @returns             - The removed child fiber or null.
 */

function removeChild(parent, childSelector) {
  // The removed fiber.
  var fiber = null; // Remove the fiber.

  if (typeof childSelector === 'number') {
    fiber = removeChildFiberAt(parent, childSelector);
  } else {
    fiber = removeChildFiber(parent, childSelector);
  } // If the fiber is not found return null.


  if (fiber === null) {
    {
      if (typeof childSelector === 'number') {
        // Invalid index.
        warning("Cannot find and remove the child at index: ".concat(childSelector, "."));
      } else {
        // Invalid key.
        warning("No child with the key: '".concat(childSelector, "' has been found, ") + "the child cannot be removed.");
      }
    }

    return null;
  } // If there are siblings their indices need to be updated.


  if (fiber.sibling !== null) {
    updateFibersIndices(fiber.sibling, fiber.index);
  } // If There is no alternate we can return here.


  if (fiber.alternate === null || parent.alternate === null) {
    return fiber;
  } // The alternate child.


  var alternate = null; // Remove the alternate child.

  if (typeof childSelector === 'number') {
    alternate = removeChildFiberAt(parent.alternate, childSelector);
  } else {
    alternate = removeChildFiber(parent.alternate, childSelector);
  } // We should find it because we are shure it exists.


  invariant(alternate !== null, 'The alternate child has not been removed.' + 'This is a bug in React-reparenting, please file an issue.'); // If there are siblings their indices need to be updated.

  if (alternate.sibling !== null) {
    updateFibersIndices(alternate.sibling, alternate.index);
  }

  return fiber;
}

/**
 * The host environment.
 * Default configuration to work with ReactDOM renderer.
 */
var Env = {
  appendChildToContainer: function appendChildToContainer(container, child) {
    container.appendChild(child);
  },
  insertInContainerBefore: function insertInContainerBefore(container, child, before) {
    container.insertBefore(child, before);
  },
  removeChildFromContainer: function removeChildFromContainer(container, child) {
    container.removeChild(child);
  },
  isElement: function isElement(_, stateNode) {
    return stateNode instanceof Element;
  }
};
/**
 * Configure the host environment.
 *
 * @param configuration - The configuration.
 */

function configure(configuration) {
  Object.assign(Env, configuration);
}

/**
 * Return the first valid fiber or null.
 *
 * @param fiber - The fiber.
 * @param next  - The callback to get the next fiber to iterate.
 * @param stop  - The callback to check if the fiber is found.
 * @returns     - The found fiber or null.
 */
function searchFiber(fiber, next, stop) {
  while (fiber) {
    if (stop(fiber)) {
      return fiber;
    } // Search in the next instance.


    fiber = next(fiber);
  }

  return null;
}

/**
 * Remove a child fiber from a parent fiber and add it to another parent fiber.
 * Return the index in which the child is added or -1 if the child is not found.
 * The child to remove can be chosen by providing its key (string) or by providing its index (number).
 * The position can be chosen by providing a key (string) or by providing an index (number).
 * If a key (string) is provided the child will be added after the one with that key.
 * The child is added at the bottom if none of the children have that key.
 * If an index (number) is provided the child will be added in that position.
 * The child is added at the bottom if -1 is provided or the index is greater than the number of children.
 * The method will also try to send the elements connected to the fibers (e.g. DOM elements),
 * to disable this function you can use the skipUpdate parameter.
 *
 * @param fromParent    - The parent fiber from which to remove the child fiber.
 * @param toParent      - The parent fiber in which to add the child fiber.
 * @param childSelector - The child fiber selector.
 * @param position      - The position in which to add the child fiber.
 * @param skipUpdate    - Whether to send or not the elements.
 * @returns             - The position in which the child fiber is sent or -1.
 */

function sendChild(fromParent, toParent, childSelector, position, skipUpdate) {
  // Remove the child fiber.
  var child = removeChild(fromParent, childSelector); // Return -1 if the child fiber does not exist.

  if (child === null) {
    return -1;
  } // Add the child fiber.


  var index = addChild(toParent, child, position); // If we don't have to send the elements we can return here.

  if (skipUpdate) {
    return index;
  } // Get the fibers that belong to the container elements.


  var fromContainer = searchFiber(fromParent, function (fiber) {
    return fiber["return"];
  }, function (fiber) {
    return Env.isElement(fiber.elementType, fiber.stateNode);
  });
  var toContainer = searchFiber(toParent, function (fiber) {
    return fiber["return"];
  }, function (fiber) {
    return Env.isElement(fiber.elementType, fiber.stateNode);
  }); // Containers elements not found.

  if (fromContainer === null || toContainer === null) {
    {
      warning('Cannot find the container element, neither the parent nor any' + 'component before it seems to generate an element instance.' + 'You should manually send the element and use the `skipUpdate` option.');
    }

    return index;
  } // Get the fibers that belong to the child element.


  var element = searchFiber(child, function (fiber) {
    return fiber.child;
  }, function (fiber) {
    return Env.isElement(fiber.elementType, fiber.stateNode);
  }); // Child element not found.

  if (element === null) {
    {
      warning('Cannot find the child element.' + 'You should manually send the element and use the `skipUpdate` option.');
    }

    return index;
  } // Add the child element.


  if (child.sibling === null) {
    // Remove the element instance.
    Env.removeChildFromContainer(fromContainer.stateNode, element.stateNode); // Append the child to the container.

    Env.appendChildToContainer(toContainer.stateNode, element.stateNode);
  } else {
    // Get the fibers that belong to the previous element.
    var before = searchFiber(child.sibling, function (fiber) {
      return fiber.child;
    }, function (fiber) {
      return Env.isElement(fiber.elementType, fiber.stateNode);
    });

    if (before !== null) {
      // Remove the element instance.
      Env.removeChildFromContainer(fromContainer.stateNode, element.stateNode); // Insert the child element in the container.

      Env.insertInContainerBefore(toContainer.stateNode, element.stateNode, before.stateNode);
    } // Previous elements not found.


    {
      if (before === null) {
        warning('Cannot find the previous element.' + 'You should manually send the element and use the `skipUpdate` option.');
      }
    }
  }

  return index;
}

/**
 * The fiber could be in the current tree or in the work-in-progress tree.
 * Return the fiber in the current tree, it could be the given fiber or its alternate.
 * For now, no special cases are handled (It doesn't make sense to manage
 * portals as this package was created to avoid them).
 *
 * @param fiber - The fiber.
 * @returns     - The current fiber.
 */

function getCurrentFiber(fiber) {
  // If there is no alternate we are shure that it is the current fiber.
  if (fiber.alternate === null) {
    return fiber;
  } // Get the top fiber.


  var topFiber = fiber;

  while (topFiber["return"] !== null) {
    topFiber = topFiber["return"];
  } // The top fiber must be an HoostRoot.


  invariant(topFiber.stateNode !== null && 'current' in topFiber.stateNode, 'Unable to find node on an unmounted component.');
  var rootFiber = topFiber.stateNode;
  var topCurrentFiber = rootFiber.current; // If true we are in the current tree.

  return topCurrentFiber === topFiber ? fiber : fiber.alternate;
}
/**
 * Returns the fiber of the given element (for now limited to DOM nodes).
 *
 * @param element - The element.
 * @returns       - The fiber.
 */

function getFiberFromElementInstance(element) {
  var internalKey = Object.keys(element).find(function (key) {
    return key.startsWith('__reactInternalInstance$');
  });
  invariant(typeof internalKey === 'string', 'Cannot find the __reactInternalInstance$. ' + 'This is a problem with React-reparenting, please file an issue.'); // __reactInternalInstance$* is not present in the types definition.
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore

  return element[internalKey];
}
/**
 * Returns the fiber of the given class component instance.
 *
 * @param instance  - The class component instance.
 * @returns         - The fiber.
 */

function getFiberFromClassInstance(instance) {
  invariant('_reactInternalFiber' in instance, 'Cannot find the _reactInternalFiber. ' + 'This is a problem with React-reparenting, please file an issue.'); // _reactInternalFiber is not present in the types definition.
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore

  return instance._reactInternalFiber;
}

/**
 * The ParentFiber implement the logic to manage a fiber of a parent component.
 * It provides simple methods for managing reparenting, such as add(), remove() and send().
 */

var ParentFiber = /*#__PURE__*/function () {
  function ParentFiber() {
    _classCallCheck(this, ParentFiber);

    _defineProperty(this, "fiber", null);

    _defineProperty(this, "findFiber", void 0);
  }

  _createClass(ParentFiber, [{
    key: "setFiber",

    /**
     * Parent fiber setter.
     *
     * @param fiber - The parent fiber to manage.
     */
    value: function setFiber(fiber) {
      this.fiber = fiber;
    }
    /**
     * FindFiber method setter.
     *
     * @param findFiber - The method.
     */

  }, {
    key: "setFinder",
    value: function setFinder(findFiber) {
      this.findFiber = findFiber;
    }
    /**
     * Parent fiber getter.
     * This is necessary to always get the
     * reference of the current fiber.
     *
     * @returns - The current parent fiber.
     */

  }, {
    key: "getCurrent",
    value: function getCurrent() {
      invariant(this.fiber !== null, 'Cannot call Parent methods before it is initialized.'); // Find the current fiber.

      var current = getCurrentFiber(this.fiber);
      return typeof this.findFiber === 'function' ? this.findFiber(current) : current;
    }
    /**
     * Add a child fiber in this instance and return the index in which it is added.
     * The position can be chosen by providing a key (string) or by providing an index (number).
     * If a key (string) is provided the child will be added after the one with that key.
     * The child is added at the bottom if none of the children have that key.
     * If an index (number) is provided the child will be added in that position.
     * The child is added at the bottom if -1 is provided or the index is greater
     * than the number of children.
     *
     * @param child     - The child fiber to add.
     * @param position  - The position in which to add the child fiber.
     * @returns         - The index in which the child fiber is added.
     */

  }, {
    key: "addChild",
    value: function addChild$1(child, position) {
      return addChild(this.getCurrent(), child, position);
    }
    /**
     * Remove a child fiber from this instance and return it.
     * The child to remove can be chosen by providing its key (string) or by
     * providing its index (number).
     * If the child is not found null is returned.
     *
     * @param childSelector - The child fiber selector.
     * @returns             - The removed child fiber or null.
     */

  }, {
    key: "removeChild",
    value: function removeChild$1(childSelector) {
      return removeChild(this.getCurrent(), childSelector);
    }
    /**
     * Remove a child fiber from this instance and add it to another parent fiber.
     * Return the index in which the child is added or -1 if the child is not found.
     * The child to remove can be chosen by providing its key (string) or by providing its index (number).
     * The position can be chosen by providing a key (string) or by providing an index (number).
     * If a key (string) is provided the child will be added after the one with that key.
     * The child is added at the bottom if none of the children have that key.
     * If an index (number) is provided the child will be added in that position.
     * The child is added at the bottom if -1 is provided or the index is greater than the number of children.
     * The method will also try to send the elements connected to the fibers (e.g. DOM elements),
     * to disable this function you can use the skipUpdate parameter.
     *
     * @param parent        - The ParentFiber instance in which to add the child fiber.
     * @param childSelector - The child fiber selector.
     * @param position      - The position in which to add the child fiber.
     * @param skipUpdate    - Whether to send or not the elements.
     * @returns             - The position in which the child fiber is sent or -1.
     */

  }, {
    key: "sendChild",
    value: function sendChild$1(parent, childSelector, position, skipUpdate) {
      return sendChild(this.getCurrent(), parent.getCurrent(), childSelector, position, skipUpdate);
    }
    /**
     * Clear the parent fiber.
     */

  }, {
    key: "clear",
    value: function clear() {
      this.fiber = null;
    }
  }]);

  return ParentFiber;
}();

/**
 * Generate a ParentFiber instance given a class instance of a component.
 * If the class component is not the parent, it is possible to provide
 * a function to get the correct parent given the class component fiber.
 *
 * @param instance  - The class instance.
 * @param findFiber - Get a different parent fiber.
 * @returns         - The ParentFiber instance.
 */

function createParent(instance, findFiber) {
  var parent = new ParentFiber();
  var componentDidMount = instance.componentDidMount,
      componentWillUnmount = instance.componentWillUnmount; // Wrap the componentDidMount method.

  instance.componentDidMount = function () {
    var fiber = getFiberFromClassInstance(instance); // Set the fiber.

    parent.setFiber(fiber);
    parent.setFinder(findFiber); // Call the original method.

    if (typeof componentDidMount === 'function') {
      componentDidMount.call(this);
    }
  }; // Wrap the componentDidMount method.


  instance.componentWillUnmount = function () {
    // Call the original method.
    if (typeof componentWillUnmount === 'function') {
      componentWillUnmount.call(this);
    } // Clear the parent.


    parent.clear();
  };

  return parent;
}

function _createSuper$1(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct$1()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
/**
 * It is a simple wrapper that generate internally a
 * ParentFiber and allow to access it through a React.Ref.
 * The children in which to enable reparenting must belong to this component.
 */

var Parent = /*#__PURE__*/function (_Component) {
  _inherits(Parent, _Component);

  var _super = _createSuper$1(Parent);

  function Parent() {
    var _this;

    _classCallCheck(this, Parent);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "parent", new ParentFiber());

    return _this;
  }

  _createClass(Parent, [{
    key: "componentDidMount",

    /**
     * The class instance contains the fiber data
     * only after the component is mounted.
     */
    value: function componentDidMount() {
      var _this$props = this.props,
          parentRef = _this$props.parentRef,
          findFiber = _this$props.findFiber;
      var fiber = getFiberFromClassInstance(this); // Ensure a ref is passed.

      invariant(parentRef !== null && (typeof parentRef === 'function' || _typeof(parentRef) === 'object'), 'You must provide a parentRef to the <Parent> component.'); // Set the fiber.

      this.parent.setFiber(fiber);
      this.parent.setFinder(findFiber); // Set the ref.

      if (typeof parentRef === 'function') {
        parentRef(this.parent);
      }

      if (_typeof(parentRef) === 'object' && parentRef !== null) {
        // TODO: Not so pretty solution with @ts-ignore,
        // maybe I should try the MutableRefObject interface.
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        parentRef.current = this.parent;
      }
    }
    /** Update the findFiber method. */

  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var findFiber = this.props.findFiber;
      this.parent.setFinder(findFiber);
    }
    /**
     * Clear on unmount.
     */

  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.parent.clear();
    }
    /**
     * Render only the children.
     * In this way the component (and therefore its fiber)
     * will be the direct parent of the children.
     */

  }, {
    key: "render",
    value: function render() {
      var children = this.props.children;
      return children;
    }
  }]);

  return Parent;
}(react.Component);
/* Parent props. */

function _createSuper$2(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct$2()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
/** Reparentable map. */

var ReparentableMap = new Map();
/**
 * Remove a child fiber from a <Reparentable> component and add it to another <Reparentable> component.
 * Return the index in which the child is added or -1 if the child is not found.
 * The child to remove can be chosen by providing its key (string) or by providing its index (number).
 * The position can be chosen by providing a key (string) or by providing an index (number).
 * If a key (string) is provided the child will be added after the one with that key.
 * The child is added at the bottom if none of the children have that key.
 * If an index (number) is provided the child will be added in that position.
 * The child is added at the bottom if -1 is provided or the index is greater than the number of children.
 * The method will also try to send the elements connected to the fibers (e.g. DOM elements),
 * to disable this function you can use the skipUpdate parameter.
 *
 * @param fromParentId  - The id of the <Reparentable> from whuch to remove the child.
 * @param toParentId    - The id of the <Reparentable> in which to add the child.
 * @param childSelector - The child fiber selector.
 * @param position      - The position in which to add the child fiber.
 * @param skipUpdate    - Whether to send or not the elements.
 * @returns             - The position in which the child fiber is sent or -1.
 */

function sendReparentableChild(fromParentId, toParentId, childSelector, position, skipUpdate) {
  // Get the ParetFiber instances.
  var fromParent = ReparentableMap.get(fromParentId);
  var toParent = ReparentableMap.get(toParentId);

  {
    if (fromParent === undefined) {
      warning("Cannot find a <Reparentable> with the id: '".concat(fromParentId, "'."));
    }

    if (toParent === undefined) {
      warning("Cannot find a <Reparentable> with the id: '".concat(toParentId, "'."));
    }
  } // Parents ids not valid.


  if (fromParent === undefined || toParent === undefined) {
    return -1;
  } // Send the child.


  return fromParent.sendChild(toParent, childSelector, position, skipUpdate);
}
/**
 * It is a simple wrapper that generate internally a
 * ParentFiber and allow to access it through a global provided map.
 * The children in which to enable reparenting must belong to this component.
 */

var Reparentable = /*#__PURE__*/function (_Component) {
  _inherits(Reparentable, _Component);

  var _super = _createSuper$2(Reparentable);

  function Reparentable() {
    var _this;

    _classCallCheck(this, Reparentable);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "parent", new ParentFiber());

    return _this;
  }

  _createClass(Reparentable, [{
    key: "componentDidMount",

    /**
     * The class instance contains the fiber data
     * only after the component did mount.
     */
    value: function componentDidMount() {
      var _this$props = this.props,
          id = _this$props.id,
          findFiber = _this$props.findFiber;
      var fiber = getFiberFromClassInstance(this); // Ensure the id is a string.

      invariant(typeof id === 'string', 'You must provide an id to the <Reparentable> component.'); // Set the fiber.

      this.parent.setFiber(fiber);
      this.parent.setFinder(findFiber);

      {
        if (ReparentableMap.has(id)) {
          warning("It seems that a new <Reparentable> has been mounted with the id: '".concat(id, "', ") + "while there is another <Reparentable> with that id.");
        }
      } // Set the ParentFiber instance in the map.


      ReparentableMap.set(id, this.parent);
    }
    /** Update the findFiber method. */

  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var findFiber = this.props.findFiber;
      this.parent.setFinder(findFiber);
    }
    /**
     * Clear on unmount.
     */

  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var id = this.props.id; // Remove the ParentFiber instance from the map.

      ReparentableMap["delete"](id); // Clear the ParentFiber instance.

      this.parent.clear();
    }
    /**
     * Render only the children.
     * In this way the component (and therefore its fiber)
     * will be the direct parent of the children.
     */

  }, {
    key: "render",
    value: function render() {
      var children = this.props.children;
      return children;
    }
  }]);

  return Reparentable;
}(react.Component);
/* Reparentable props. */

/**
 * An hook to easily use a ParentFiber inside a function component.
 * The ref returned must reference the element that is the parent
 * of the children to reparent.
 *
 * @param findFiber - Get a different parent fiber.
 * @returns - [The ParentFiber instance, the element ref].
 */

function useParent(findFiber) {
  // The parent instance.
  var parentRef = react.useRef(null); // The element ref.

  var ref = react.useRef(null); // Generate the instance.

  if (parentRef.current === null) {
    // TODO: Not so pretty solution with @ts-ignore,
    // maybe I should try the MutableRefObject interface.
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    parentRef.current = new ParentFiber();
  } // Get a reference.


  var parent = parentRef.current;
  parent.setFinder(findFiber); // When the component is mounted the fiber is setted.

  react.useEffect(function () {
    invariant(ref.current !== null, 'You must set the ref returned by the useParent hook.'); // The element fiber.

    parent.setFiber(getFiberFromElementInstance(ref.current)); // Clean up.

    return function () {
      parent.clear();
    };
  }, []);
  return [parent, ref];
}

exports.Env = Env;
exports.Parent = Parent;
exports.ParentFiber = ParentFiber;
exports.Reparentable = Reparentable;
exports.ReparentableMap = ReparentableMap;
exports.addChild = addChild;
exports.addChildFiberAt = addChildFiberAt;
exports.addChildFiberBefore = addChildFiberBefore;
exports.addSiblingFiber = addSiblingFiber;
exports.appendChildFiber = appendChildFiber;
exports.configure = configure;
exports.createParent = createParent;
exports.findChildFiber = findChildFiber;
exports.findChildFiberAt = findChildFiberAt;
exports.findPreviousFiber = findPreviousFiber;
exports.findSiblingFiber = findSiblingFiber;
exports.getCurrentFiber = getCurrentFiber;
exports.getFiberFromClassInstance = getFiberFromClassInstance;
exports.getFiberFromElementInstance = getFiberFromElementInstance;
exports.prependChildFiber = prependChildFiber;
exports.removeChild = removeChild;
exports.removeChildFiber = removeChildFiber;
exports.removeChildFiberAt = removeChildFiberAt;
exports.removeFirstChildFiber = removeFirstChildFiber;
exports.removeSiblingFiber = removeSiblingFiber;
exports.searchFiber = searchFiber;
exports.sendChild = sendChild;
exports.sendReparentableChild = sendReparentableChild;
exports.updateFiberDebugFields = updateFiberDebugFields;
exports.updateFibersIndices = updateFibersIndices;
exports.useParent = useParent;
