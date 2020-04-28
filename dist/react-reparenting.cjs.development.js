/**
* React-reparenting v0.1.0
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
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
var _typeof = _interopDefault(require('@babel/runtime/helpers/typeof'));
var _assertThisInitialized = _interopDefault(require('@babel/runtime/helpers/assertThisInitialized'));
var _inherits = _interopDefault(require('@babel/runtime/helpers/inherits'));
var _possibleConstructorReturn = _interopDefault(require('@babel/runtime/helpers/possibleConstructorReturn'));
var _getPrototypeOf = _interopDefault(require('@babel/runtime/helpers/getPrototypeOf'));
var _wrapNativeSuper = _interopDefault(require('@babel/runtime/helpers/wrapNativeSuper'));
var React = require('react');
var React__default = _interopDefault(React);
var _get = _interopDefault(require('@babel/runtime/helpers/get'));
var _slicedToArray = _interopDefault(require('@babel/runtime/helpers/slicedToArray'));

/**
 * The host environment.
 * Default configuration to work with ReactDOM renderer.
 */
var ENV = {
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

function config(configuration) {
  Object.assign(ENV, configuration);
}

/**
 * Prints a warning in the console if the condition fails.
 *
 * @param condition - The condition.
 * @param message - The message.
 */
function warning(condition, message) {
  // condition passed: do not log.
  if (condition) {
    return;
  } // Condition not passed.


  var text = "Warning: ".concat(message); // check console for IE9 support which provides console
  // only with open devtools.

  if (typeof console !== 'undefined') {
    // eslint-disable-next-line
    console.error(text);
  } // Throwing an error and catching it immediately
  // to improve debugging.
  // A consumer can use 'pause on caught exceptions'
  // https://github.com/facebook/react/issues/4216


  try {
    throw Error(text);
  } catch (x) {} // eslint-disable-line

}

// eslint-disable-line
/**
 * Returns the child fiber in the given index.
 * If the paremt has no children, or the index provided is
 * greater than the number of children null is returned.
 *
 * @param parent - The parent fiber.
 * @param index - The index of the fiber to find.
 * @returns - The fiber found or null.
 */

function findChildFiberAt(parent, index) {
  // The warnings are removed in production.
  warning(index >= -1, 'The index of the fiber to find must be >= -1, the last child is returned'); // The first child.

  var child = parent.child; // The warnings are removed in production.

  warning(index === -1 || child !== null, 'The parent fiber has no children'); // If the parent has no child return null.

  if (child === null) return null;

  if (index === -1) {
    // Find the last child.
    while (child.sibling) {
      child = child.sibling;
    }
  } else {
    // Find the child in index.
    while (child && index-- > 0) {
      child = child.sibling;
    }
  } // The warnings are removed in production.


  warning(child !== null, 'The index provided is greater than the number of children, null is returned');
  return child;
}
/**
 * Returns the child fiber with the given key or null if it is not found.
 *
 * @param parent - The parent fiber.
 * @param key - The key of the child fiber.
 * @returns - The fiber found or null.
 */

function findChildFiber(parent, key) {
  var child = parent.child; // The warnings are removed in production.

  warning(child !== null, 'The parent fiber has no children'); // Find the child with the given key.

  while (child && child.key !== key) {
    child = child.sibling;
  } // The warnings are removed in production.


  warning(child !== null, "No child found with the key: '".concat(key, "'"));
  return child;
}
/**
 * Returns the fiber before the one with the given key or null if it is not found.
 * If the fiber with the given key is the first child of the parent, the parent is returned.
 *
 * @param parent - The parent fiber.
 * @param key - The key of the child fiber.
 * @returns - The fiber found or null.
 */

function findPreviousFiber(parent, key) {
  var child = parent.child;
  var sibling; // The warnings are removed in production.

  warning(child !== null, 'The parent fiber has no children'); // If the parent has no child return null.

  if (child === null) return null; // Return the parent if the fiber to find is the first one.

  if (child.key === key) return parent; // Find the previous sibling.

  while (child) {
    sibling = child.sibling;
    if (sibling && sibling.key === key) return child;
    child = sibling;
  } // The warnings are removed in production.


  warning(child !== null, "No child found with the key: '".concat(key, "'"));
  return child;
}
/**
 * Return the first instance found in the parent fibers.
 *
 * @param fiber - The fiber.
 * @returns - The instance or null.
 */

function findContainerInstanceFiber(fiber, isElement) {
  while (fiber) {
    if (isElement(fiber.elementType, fiber.stateNode)) {
      return fiber;
    } // Search in the next parent.


    fiber = fiber["return"];
  }

  warning(true, 'Cannot find the container instance');
  return null;
}
/**
 * Return the first instance found in the parent fibers.
 *
 * @param fiber - The fiber.
 * @returns - The instance or null.
 */

function findInstanceFiber(fiber, isElement) {
  while (fiber) {
    // If this fiber contains the instance.
    if (isElement(fiber.elementType, fiber.stateNode)) {
      return fiber;
    } // Search in the next descendant.


    fiber = fiber.child; // The descendants before the instance must be single children.

    warning(fiber === null || fiber.sibling === null, 'The structure of the child component does not allow to determine the child instance with certainty');
  }

  warning(true, 'Cannot find the instance');
  return null;
}
/** Fiber of an Instance. */

// eslint-disable-line

/**
 * Update the indices of a fiber and its next siblings.
 *
 * @param fiber - The fiber.
 * @param index - The index of the fiber.
 */
function updateFibersIndices(fiber, index) {
  while (fiber) {
    fiber.index = index;
    fiber = fiber.sibling;
    index += 1;
  }
}
/**
 * Update the debug owner.
 * I have not yet inquired about how the _debugOwner is chosen.
 * For now it is updated only if there is at least one sibling from which to copy this property.
 * This method is removed in production.
 *
 * @param child - The child fiber.
 * @param parent - The parent fiber.
 */

function updateFiberDebugOwner(child, parent) {
  if (parent === null) return; // Try to find a sibling with the debug owner.

  if (parent.child === child) {
    var sibling = child.sibling;

    if (sibling !== null) {
      child._debugOwner = sibling._debugOwner;
    }
  } else {
    child._debugOwner = parent.child && parent.child._debugOwner;
  }
}

// eslint-disable-line
/**
 * Add a child fiber in the parent at the given index.
 * If index is -1 the fiber is added at the bottom.
 * If the index provided is greater than the number of children available
 * the fiber is added at the bottom.
 *
 * @param parent - The parent fiber.
 * @param child - The child fiber.
 * @param index - The index in which to add the fiber.
 * @param skipUpdate - Whether to skip updating computed properties.
 * @returns - The index in which the fiber is added.
 */

function addChildFiberAt(parent, child, index, skipUpdate) {
  // If the fiber is not found add the fiber at the bottom.
  if (index === -1) return appendChildFiber(parent, child, skipUpdate); // Add the fiber in the first index.

  if (index === 0) return prependChildFiber(parent, child, skipUpdate); // Find the previous sibling.
  // At this point we are sure that the index is greater than 0.

  var previousFiber = findChildFiberAt(parent, index - 1); // Warning if the fiber is not found.
  // The warnings are removed in production.

  warning(previousFiber !== null, "The fiber cannot be added at index: '".concat(index, "', it is added at the bottom")); // If the fiber is not found add the fiber at the bottom.

  if (previousFiber === null) {
    return appendChildFiber(parent, child, skipUpdate);
  } // Add the fiber as sibling of the previous one.


  return addSiblingFiber(previousFiber, child, skipUpdate);
}
/**
 * Add the child fiber in the parent before the fiber with the given key.
 * If the key is not found the fiber is added at the bottom.
 *
 * @param parent - The parent fiber.
 * @param child - The child fiber.
 * @param key - The key of the previous fiber.
 * @param skipUpdate - Whether to skip updating computed properties.
 * @returns - The index in which the fiber is added.
 */

function addChildFiberBefore(parent, child, key, skipUpdate) {
  // Find the previous fiber.
  var previousFiber = findPreviousFiber(parent, key); // Warning if the fiber was not found.
  // The warnings are removed in production.

  warning(previousFiber !== null, "No fiber with the key: '".concat(key, "' has been found, the fiber is added at the bottom")); // If the fiber is not found add the fiber at the bottom.

  if (previousFiber === null) {
    return appendChildFiber(parent, child, skipUpdate);
  } // If The fiber with the given key is the first one.


  if (previousFiber === parent) {
    return prependChildFiber(parent, child, skipUpdate);
  } // Add the fiber as sibling of the previous one.


  return addSiblingFiber(previousFiber, child, skipUpdate);
}
/**
 * Add the fiber at the bottom.
 *
 * @param parent - The parent fiber.
 * @param child - The child fiber.
 * @param skipUpdate - Whether to skip updating computed properties.
 * @returns - The index in which the fiber is added.
 */

function appendChildFiber(parent, child, skipUpdate) {
  var previousFiber = findChildFiberAt(parent, -1); // The parent has no children.

  if (previousFiber === null) {
    return prependChildFiber(parent, child, skipUpdate);
  }

  return addSiblingFiber(previousFiber, child, skipUpdate);
}
/**
 * Add the fiber after the given sibling fiber.
 *
 * @param fiber - The fiber.
 * @param sibling - The fiber to add as sibling.
 * @param skipUpdate - Whether to skip updating computed properties.
 * @returns - The index in which the fiber is added.
 */

function addSiblingFiber(fiber, sibling, skipUpdate) {
  var oldSibling = fiber.sibling;
  var index = fiber.index + 1; // Update fiber references.

  fiber.sibling = sibling;
  sibling.sibling = oldSibling;
  sibling["return"] = fiber["return"]; // Update computed fiber properties.

  if (!skipUpdate) {
    updateFibersIndices(sibling, index); // Removed in production.

    updateFiberDebugOwner(sibling, fiber["return"]);
  }

  return index;
}
/**
 * Add the fiber as first child.
 *
 * @param parent - The parent fiber.
 * @param child - The child fiber.
 * @returns - The index in which the fiber is added.
 */

function prependChildFiber(parent, child, skipUpdate) {
  var oldFirstChild = parent.child; // Update fiber references.

  parent.child = child;
  child.sibling = oldFirstChild;
  child["return"] = parent; // Update computed fiber properties.

  if (!skipUpdate) {
    updateFibersIndices(child, 0); // Removed in production.

    updateFiberDebugOwner(child, parent);
  }

  return 0;
}

// eslint-disable-line
/**
 * Remove the child fiber at the given index and return it or null if it not exists.
 *
 * @param parent - The parent fiber.
 * @param index - The index of the fiber.
 * @param skipUpdate - Whether to skip updating computed properties.
 * @returns - The removed fiber or null.
 */

function removeChildFiberAt(parent, index, skipUpdate) {
  // The warnings are removed in production.
  warning(index >= 0, "The index provided to find the fiber must be >= of 0, found '".concat(index, "'")); // Invalid index.

  if (index < 0) return null; // Remove the first child fiber.

  if (index === 0) return removeFirstChildFiber(parent, skipUpdate); // Find the previous fiber.
  // At this point we are shure that index > 0.

  var previousFiber = findChildFiberAt(parent, index - 1); // The warnings are removed in production.

  warning(previousFiber !== null, "Cannot find and remove the fiber at index: '".concat(index, "'")); // If the fiber is not found.

  if (previousFiber === null) return null; // Remove the sibling.

  return removeSiblingFiber(previousFiber, skipUpdate);
}
/**
 * Remove the child fiber with the given key and return it or null if it not exists.
 *
 * @param parent - The parent fiber.
 * @param key - The key of the fiber.
 * @param skipUpdate - Whether to skip updating computed properties.
 * @returns - The removed fiber or null.
 */

function removeChildFiber(parent, key, skipUpdate) {
  // Find the previous fiber.
  var previousFiber = findPreviousFiber(parent, key); // The warnings are removed in production.

  warning(previousFiber !== null, "No fiber with the key: '".concat(key, "' has been found, the fiber cannot be removed")); // If the fiber is not found.

  if (previousFiber === null) return null; // If The fiber with the given key is the first one.

  if (previousFiber === parent) return removeFirstChildFiber(parent, skipUpdate); // Add the fiber as sibling of the previous one.

  return removeSiblingFiber(previousFiber, skipUpdate);
}
/**
 * Remove the next sibling from a fiber and return it or null if it not exist.
 *
 * @param fiber - The fiber.
 * @param skipUpdate - Whether to skip updating computed properties.
 * @returns - The removed sibling or null.
 */

function removeSiblingFiber(fiber, skipUpdate) {
  var removed = fiber.sibling; // If the fiber has no sibling return null.

  if (removed === null) return null; // Update fiber references.

  fiber.sibling = removed.sibling;
  removed["return"] = null;
  removed.sibling = null; // Update computed fiber properties.

  if (!skipUpdate) {
    updateFibersIndices(fiber, fiber.index);
  }

  return removed;
}
/**
 * Remove the first child fiber of the given parent and return it or null if it not exists.
 *
 * @param parent - The parent fiber.
 * @param skipUpdate - Whether to skip updating computed properties.
 * @returns - The removed fiber or null.
 */

function removeFirstChildFiber(parent, skipUpdate) {
  var removed = parent.child; // If the parent has no children return null.

  if (removed === null) return null; // Update the child

  parent.child = removed.sibling;
  removed["return"] = null;
  removed.sibling = null; // Update computed fiber properties.

  if (!skipUpdate) {
    updateFibersIndices(parent.child, 0);
  }

  return removed;
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
 * The fiber could be in the current tree or in the work-in-progress tree.
 * Return the fiber in the current tree, it could be the given fiber or its alternate.
 *
 * @param fiber - The fiber.
 * @returns - The current fiber.
 */

function getCurrentFiber(fiber) {
  // If there is no alternate we are shure that it is the current fiber.
  if (!fiber.alternate) return fiber; // Get the top fiber.

  var topFiber = fiber;

  while (topFiber["return"]) {
    topFiber = topFiber["return"];
  } // Fibers.


  var rootFiber = topFiber.stateNode;
  var topCurrentFiber = rootFiber.current; // If true we are in the current tree.

  return topCurrentFiber === topFiber ? fiber : fiber.alternate;
}
/**
 * Get the fiber of the given element.
 *
 * @param element - The element.
 * @returns - The fiber.
 */

function getFiberFromElementInstance(element) {
  var internalKey = Object.keys(element).find(function (key) {
    return key.startsWith('__reactInternalInstance$');
  });
  invariant(typeof internalKey === 'string', 'Cannot find the __reactInternalInstance$'); // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  // The __reactInternalInstance$* is not present in the types definition.

  return element[internalKey];
}
/**
 * Get the fiber of the given class component instance.
 *
 * @param instance - The class component instance.
 * @returns - The fiber.
 */

function getFiberFromClassInstance(instance) {
  invariant(_typeof(instance) === 'object' && '_reactInternalFiber' in instance, 'Cannot find the _reactInternalFiber'); // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  // The _reactInternalFiber is not present in the types definition.

  return instance._reactInternalFiber;
}

/**
 * The ParentFiber implement the logic manage a fiber of a parent component.
 * It provides simple methods for managing reparenting, such as add(), remove() and send().
 */

var ParentFiber = /*#__PURE__*/function () {
  /** The parent fiber. */

  /**
   * The fiber can be setted in the constructor.
   *
   * @param fiber - The parent fiber to manage.
   */
  function ParentFiber(fiber) {
    _classCallCheck(this, ParentFiber);

    _defineProperty(this, "fiber", null);

    if (fiber) this.setFiber(fiber);
  }
  /**
   * Parent fiber setter.
   *
   * @param fiber - The parent fiber to manage.
   */


  _createClass(ParentFiber, [{
    key: "setFiber",
    value: function setFiber(fiber) {
      // Warnings are removed in production.
      warning(fiber !== null, 'The fiber you have provided is null');
      this.fiber = fiber;
    }
    /**
     * Parent fiber getter.
     * This is necessary to always get the
     * reference of the current fiber.
     *
     * @returns - The current parent fiber.
     */

  }, {
    key: "getFiber",
    value: function getFiber() {
      invariant(this.fiber !== null, 'Cannot call Parent methods before it is initialized');
      return getCurrentFiber(this.fiber);
    }
    /**
     * Add a child fiber in the parent and return the index in which it is added.
     * The position can be chosen by providing a key (string) or by providing an index (number).
     * If a key (string) is provided the child will be added after the one with that key.
     * - The child is added at the bottom if none of the children have that key.
     * If an index (number) is provided the child will be added in that position.
     * - The child is added at the bottom if -1 is provided or the index is greater than the number of children.
     *
     * @param child - The child to add.
     * @param position - The position in which to add the child.
     * @returns - The index in which the child is added.
     */

  }, {
    key: "add",
    value: function add(child, position) {
      var parentFiber = this.getFiber();
      var index; // Add the fiber.

      if (typeof position === 'number') {
        index = addChildFiberAt(parentFiber, child, position);
      } else {
        index = addChildFiberBefore(parentFiber, child, position);
      } // If There is no alternate we can return here.


      if (child.alternate === null || parentFiber.alternate === null) {
        child.alternate = null;
        return index;
      } // Add the alternate


      if (typeof position === 'number') {
        addChildFiberAt(parentFiber.alternate, child.alternate, position);
      } else {
        addChildFiberBefore(parentFiber.alternate, child.alternate, position);
      }

      return index;
    }
    /**
     * Remove a child from the parent and return it.
     * The child to remove can be chosen by providing its key (string)
     * or by providing its index (number).
     * If the child is not found null is returned.
     *
     * @param child - The child identifier.
     * @returns - The removed child or null.
     */

  }, {
    key: "remove",
    value: function remove(child) {
      var parentFiber = this.getFiber();
      var fiber = null; // Remove the fiber.

      if (typeof child === 'number') {
        fiber = removeChildFiberAt(parentFiber, child);
      } else {
        fiber = removeChildFiber(parentFiber, child);
      } // If the fiber is not found return null.


      if (fiber === null) return null; // If There is no alternate we can return here.

      if (fiber.alternate === null || parentFiber.alternate === null) {
        return fiber;
      } // Remove the alternate.


      if (typeof child === 'number') {
        removeChildFiberAt(parentFiber.alternate, child);
      } else {
        removeChildFiber(parentFiber.alternate, child);
      }

      return fiber;
    }
    /**
     * Remove a child from this instance and add it to the provided ParentFiber instance.
     * Return the index in which the child is added (or -1).
     * The child to remove can be chosen by providing its key (string) or by providing its index (number).
     * Return -1 if the child is not found.
     * The position can be chosen by providing a key (string) or by providing an index (number).
     * If a key (string) is provided the child will be added after the one with that key.
     * - The child is added at the bottom if none of the children have that key.
     * If an index (number) is provided the child will be added in that position.
     * - The child is added at the bottom if -1 is provided or the index is greater than the number of children.
     * If skipUpdate is not used, this method will also send the element instance.
     *
     * @param child - The child identifier.
     * @param toParent - The ParentFiber instance to sent the child to.
     * @param position - The position to send the child to.
     * @param skipUpdate - Whether to send or not the element instance.
     * @returns - The position in which the fiber is sent or -1.
     */

  }, {
    key: "send",
    value: function send(child, toParent, position, skipUpdate) {
      // Remove the fiber.
      var fiber = this.remove(child); // Return -1 if the fiber does not exist.

      if (fiber === null) return -1; // Add the fiber.

      var index = toParent.add(fiber, position);

      if (!skipUpdate) {
        // Container instances
        var fromContainer = findContainerInstanceFiber(this.fiber, ENV.isElement);
        var toContainer = findContainerInstanceFiber(toParent.fiber, ENV.isElement); // Warnings are removed in production.

        warning(fromContainer !== null && toContainer !== null, 'Cannot find a container element, neither the parent nor any component before it seems to generate an element instance. ' + 'You should manually send the element and use the "skipUpdate" option'); // Container not found.

        if (fromContainer === null || toContainer === null) return index; // Elements instances.

        var element = findInstanceFiber(fiber, ENV.isElement);
        var sibling = findInstanceFiber(fiber.sibling, ENV.isElement); // Warnings are removed in production.

        warning(element !== null && (fiber.sibling === null || sibling !== null), 'Cannot find the child element instance. ' + 'You should manually move the elements you are trying to send and use the "skipUpdate" option.'); // Elements not found.

        if (element === null || fiber.sibling !== null && sibling === null) return index; // Remove the element instance.

        ENV.removeChildFromContainer(fromContainer.stateNode, element.stateNode); // Add the element instance

        if (sibling === null) {
          ENV.appendChildToContainer(toContainer.stateNode, element.stateNode);
        } else {
          ENV.insertInContainerBefore(toContainer.stateNode, element.stateNode, sibling.stateNode);
        }
      }

      return index;
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

// eslint-disable-line
/**
 * Generate a ParentFiber instance given a class instance of a component.
 * If the class component is not the parent, it is possible to provide
 * a function to get the correct parent given the class component fiber.
 *
 * @param instance - The class instance.
 * @param findFiber - Get a different parent fiber.
 * @returns - The ParentFiber instance.
 */

function createParent(instance, findFiber) {
  var parent = new ParentFiber();
  var componentDidMount = instance.componentDidMount,
      componentWillUnmount = instance.componentWillUnmount; // Wrap the componentDidMount method.

  instance.componentDidMount = function () {
    var fiber = getFiberFromClassInstance(instance); // Set the fiber.

    if (typeof findFiber === 'function') {
      parent.setFiber(findFiber(fiber));
    } else {
      parent.setFiber(fiber);
    } // Call the original method.


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
 * Parent component.
 *
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
     * only after the component did mount.
     */
    value: function componentDidMount() {
      var _this$props = this.props,
          parentRef = _this$props.parentRef,
          findFiber = _this$props.findFiber;
      var fiber = getFiberFromClassInstance(this); // Ensure a ref is passed.

      invariant(parentRef && (typeof parentRef === 'function' || _typeof(parentRef) === 'object'), 'You must provide a parentRef to the <Parent> component'); // Set the fiber.

      if (typeof findFiber === 'function') {
        this.parent.setFiber(findFiber(fiber));
      } else {
        this.parent.setFiber(fiber);
      } // Set the ref.


      if (typeof parentRef === 'function') parentRef(this.parent);
      if (_typeof(parentRef) === 'object') parentRef.current = this.parent;
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
}(React.Component);
/* Parent props. */

function _createSuper$2(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct$2()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
/** Reparentable context. */

var ReparentableContext = React.createContext(null);
ReparentableContext.displayName = 'Reparentable';
/** Reparentable hook. */

var useReparentable = function useReparentable() {
  var context = React.useContext(ReparentableContext);
  invariant(context !== null, 'It looks like you have not used a <Reparentable.Provider> in the top of your app');
  return context;
};
/** Reparentable map. */

var ReparentableMap = /*#__PURE__*/function (_Map) {
  _inherits(ReparentableMap, _Map);

  var _super = _createSuper$2(ReparentableMap);

  function ReparentableMap() {
    var _this;

    _classCallCheck(this, ReparentableMap);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "set", function (key, value) {
      // Warnings are removed in production.
      warning(!_this.has(key), "It seems that a new <Reparentable> component has been mounted with the id: \"".concat(key, "\", ") + "while there is another <Reparentable> component with that id");
      return _get(_getPrototypeOf(ReparentableMap.prototype), "set", _assertThisInitialized(_this)).call(_assertThisInitialized(_this), key, value);
    });

    _defineProperty(_assertThisInitialized(_this), "send", function (fromParentId, toParentId, child, position, skipUpdate) {
      var fromParent = _this.get(fromParentId);

      var toParent = _this.get(toParentId); // Warnings are removed in production.


      warning(fromParent !== undefined, "Cannot find a <Reparentable> with the id: \"".concat(fromParentId, "\"")); // Warnings are removed in production.

      warning(toParent !== undefined, "Cannot find a <Reparentable> with the id: \"".concat(toParentId, "\""));
      if (fromParent === undefined || toParent === undefined) return -1; // Send the child.

      return fromParent.send(child, toParent, position, skipUpdate);
    });

    _defineProperty(_assertThisInitialized(_this), "remove", function (key) {
      return _this["delete"](key);
    });

    return _this;
  }

  return ReparentableMap;
}( /*#__PURE__*/_wrapNativeSuper(Map));
/** Reparentable Provider. */

var ReparentableProvider = /*#__PURE__*/function (_Component) {
  _inherits(ReparentableProvider, _Component);

  var _super2 = _createSuper$2(ReparentableProvider);

  function ReparentableProvider() {
    var _this2;

    _classCallCheck(this, ReparentableProvider);

    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    _this2 = _super2.call.apply(_super2, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this2), "map", new ReparentableMap());

    return _this2;
  }

  _createClass(ReparentableProvider, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var reparentableMapRef = this.props.reparentableMapRef;
      if (reparentableMapRef === null) return; // Set the ref.

      if (typeof reparentableMapRef === 'function') reparentableMapRef(this.map);
      if (_typeof(reparentableMapRef) === 'object') reparentableMapRef.current = this.map;
    }
  }, {
    key: "render",
    value: function render() {
      var children = this.props.children;
      return /*#__PURE__*/React__default.createElement(ReparentableContext.Provider, {
        value: this.map
      }, children);
    }
  }]);

  return ReparentableProvider;
}(React.Component);
/**
 * Parent component.
 *
 * It is a simple wrapper that generate internally a
 * ParentFiber and allow to access it through a global provided map.
 * The children in which to enable reparenting must belong to this component.
 */

var Reparentable = /*#__PURE__*/function (_Component2) {
  _inherits(Reparentable, _Component2);

  var _super3 = _createSuper$2(Reparentable);

  function Reparentable() {
    var _this3;

    _classCallCheck(this, Reparentable);

    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    _this3 = _super3.call.apply(_super3, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this3), "context", null);

    _defineProperty(_assertThisInitialized(_this3), "parent", new ParentFiber());

    return _this3;
  }

  _createClass(Reparentable, [{
    key: "componentDidMount",

    /**
     * The class instance contains the fiber data
     * only after the component did mount.
     */
    value: function componentDidMount() {
      invariant(this.context !== null, 'It looks like you have not used a <Reparentable.Provider> in the top of your app');
      var set = this.context.set;
      var _this$props = this.props,
          id = _this$props.id,
          findFiber = _this$props.findFiber;
      var fiber = getFiberFromClassInstance(this); // Ensure the id is a string.

      invariant(typeof id === 'string', 'You must provide an id to the <Reparentable> component'); // Set the fiber.

      if (typeof findFiber === 'function') {
        this.parent.setFiber(findFiber(fiber));
      } else {
        this.parent.setFiber(fiber);
      } // Set the ParentFiber instance in context map.


      set(id, this.parent);
    }
    /**
     * Clear on unmount.
     */

  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      invariant(this.context !== null, 'It looks like you have not used a <Reparentable.Provider> in the top of your app');
      var remove = this.context.remove;
      var id = this.props.id; // Remove the ParentFiber instance from the context map.

      remove(id); // Clear the ParentFiber instance.

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
}(React.Component);
/* Reparentable props. */

_defineProperty(Reparentable, "Context", ReparentableContext);

_defineProperty(Reparentable, "Provider", ReparentableProvider);

_defineProperty(Reparentable, "contextType", ReparentableContext);

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
  var _useState = React.useState(function () {
    return new ParentFiber();
  }),
      _useState2 = _slicedToArray(_useState, 1),
      parent = _useState2[0]; // The element ref.


  var ref = React.useRef(null); // When the component is mounted the fiber is setted.

  React.useEffect(function () {
    invariant(ref.current !== null, 'You must set the ref returned by the useParent hook'); // The element fiber.

    var elementFiber = getFiberFromElementInstance(ref.current); // Set the fiber.

    if (typeof findFiber === 'function') {
      parent.setFiber(findFiber(elementFiber));
    } else {
      parent.setFiber(elementFiber);
    } // Clean up.


    return function () {
      parent.clear();
    };
  }, []);
  return [parent, ref];
}

exports.ENV = ENV;
exports.Parent = Parent;
exports.ParentFiber = ParentFiber;
exports.Reparentable = Reparentable;
exports.ReparentableContext = ReparentableContext;
exports.ReparentableMap = ReparentableMap;
exports.ReparentableProvider = ReparentableProvider;
exports.addChildFiberAt = addChildFiberAt;
exports.addChildFiberBefore = addChildFiberBefore;
exports.addSiblingFiber = addSiblingFiber;
exports.appendChildFiber = appendChildFiber;
exports.config = config;
exports.createParent = createParent;
exports.findChildFiber = findChildFiber;
exports.findChildFiberAt = findChildFiberAt;
exports.findContainerInstanceFiber = findContainerInstanceFiber;
exports.findInstanceFiber = findInstanceFiber;
exports.findPreviousFiber = findPreviousFiber;
exports.getCurrentFiber = getCurrentFiber;
exports.getFiberFromClassInstance = getFiberFromClassInstance;
exports.getFiberFromElementInstance = getFiberFromElementInstance;
exports.prependChildFiber = prependChildFiber;
exports.removeChildFiber = removeChildFiber;
exports.removeChildFiberAt = removeChildFiberAt;
exports.removeFirstChildFiber = removeFirstChildFiber;
exports.removeSiblingFiber = removeSiblingFiber;
exports.updateFiberDebugOwner = updateFiberDebugOwner;
exports.updateFibersIndices = updateFibersIndices;
exports.useParent = useParent;
exports.useReparentable = useReparentable;
