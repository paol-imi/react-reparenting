/**
* React-reparenting v0.3.0
* https://paol-imi.github.io/react-reparenting
* Copyright (c) 2020-present, Paol-imi
* Released under the MIT license
* https://github.com/Paol-imi/react-reparenting/blob/master/LICENSE
* @license MIT
*/

import _classCallCheck from '@babel/runtime/helpers/esm/classCallCheck';
import _assertThisInitialized from '@babel/runtime/helpers/esm/assertThisInitialized';
import _inherits from '@babel/runtime/helpers/esm/inherits';
import _possibleConstructorReturn from '@babel/runtime/helpers/esm/possibleConstructorReturn';
import _getPrototypeOf from '@babel/runtime/helpers/esm/getPrototypeOf';
import _wrapNativeSuper from '@babel/runtime/helpers/esm/wrapNativeSuper';
import _defineProperty from '@babel/runtime/helpers/esm/defineProperty';
import _createClass from '@babel/runtime/helpers/esm/createClass';
import _typeof from '@babel/runtime/helpers/esm/typeof';
import { Component, useRef, useEffect } from 'react';

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

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

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
 * @param message   - The error message.
 */

function invariant(condition, message) {
  if (condition) return;

  {
    // In production we strip the message but still throw.
    throw new Invariant(prefix);
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
 * - _debugID:        does it need to be changed?
 * - _debugHookTypes: does it need to be changed?
 * - _debugSource:    is it ok like this?
 * - _debugOwner:     is it ok like this?
 *
 * @param child   - The child fiber.
 * @param parent  - The parent fiber.
 */

function updateFiberDebugFields(child, parent) {
  invariant(parent.child !== null);
  var fiberToCopy; // Try to find a fiber to copy.

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
 * Return the first valid fiber or null.
 *
 * @param fiber - The fiber to start looking for.
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
 * Add a child fiber in a parent fiber and return the index in which it is added.
 * The position can be chosen by providing a key (string) or by providing an index (number).
 * If a key (string) is provided the child will be added after the one with that key.
 * The child is added at the bottom if none of the children have that key.
 * If an index (number) is provided the child will be added in that position.
 * The child is added at the bottom if -1 is provided or the index is greater
 * than the number of children.
 * The method will also try to add the elements connected to the fibers (e.g. DOM elements),
 * to disable this function you can use the skipUpdate parameter.
 *
 * @param parent      - The parent fiber in which to add the child fiber.
 * @param child       - The child fiber to add.
 * @param position    - The position in which to add the child fiber.
 * @param skipUpdate  - Whether to add or not the elements.
 * @returns           - The index in which the child fiber is added.
 */

function addChild(parent, child, position, skipUpdate) {
  // The index in which the child is added.
  var index; // Add the child.

  if (typeof position === 'number') {
    index = addChildFiberAt(parent, child, position);
  } else {
    index = addChildFiberBefore(parent, child, position);
  }


  updateFibersIndices(child, index);


  if (child.alternate === null || parent.alternate === null) {
    if (child.alternate !== null) {
      // The React team has done such a good job with the reconciler that we can simply
      // leave the alternate attached (although the parent does not yet exist)
      // and the reconciler will update it during the next render.
      // Removing it would take a lot of work (sync all the subtree and update the stateNodes references).
      child.alternate["return"] = null;
      child.alternate.sibling = null;
    }
  } else {
    // Add the alternate child.
    if (typeof position === 'number') {
      addChildFiberAt(parent.alternate, child.alternate, position);
    } else {
      addChildFiberBefore(parent.alternate, child.alternate, position);
    } // Update the alternate child fields.


    updateFibersIndices(child.alternate, index);
  } // If we don't have to send the elements we can return here.


  if (skipUpdate) {
    return index;
  } // Get the fibers that belong to the container elements.


  var containerFiber = searchFiber(parent, function (fiber) {
    return fiber["return"];
  }, function (fiber) {
    return Env.isElement(fiber.elementType, fiber.stateNode);
  }); // Get the fibers that belong to the child element.

  var elementFiber = searchFiber(child, function (fiber) {
    return fiber.child;
  }, function (fiber) {
    return Env.isElement(fiber.elementType, fiber.stateNode);
  }); // Containers elements not found.

  if (containerFiber === null) {

    return index;
  } // Child element not found.


  if (elementFiber === null) {

    return index;
  } // Get the elements instances.


  var container = containerFiber.stateNode;
  var element = elementFiber.stateNode; // Add the child element.

  if (child.sibling === null) {
    // Append the child to the container.
    Env.appendChildToContainer(container, element);
  } else {
    // Get the fibers that belong to the previous element.
    var beforeFiber = searchFiber(child.sibling, function (fiber) {
      return fiber.child;
    }, function (fiber) {
      return Env.isElement(fiber.elementType, fiber.stateNode);
    });

    if (beforeFiber !== null) {
      var before = beforeFiber.stateNode; // Insert the child element in the container.

      Env.insertInContainerBefore(container, element, before);
    } // Previous elements not found.
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
  invariant(index >= 0); // Remove the first child fiber.

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
 * The method will also try to remove the elements connected to the fibers (e.g. DOM elements),
 * to disable this function you can use the skipUpdate parameter.
 * If the child is not found null is returned.
 *
 * @param parent        - The parent fiber from which to remove the child fiber.
 * @param childSelector - The child fiber selector.
 * @param skipUpdate    - Whether to add or not the elements.
 * @returns             - The removed child fiber or null.
 */

function removeChild(parent, childSelector, skipUpdate) {
  // The removed fiber.
  var child = null; // Remove the fiber.

  if (typeof childSelector === 'number') {
    child = removeChildFiberAt(parent, childSelector);
  } else {
    child = removeChildFiber(parent, childSelector);
  } // If the fiber is not found return null.


  if (child === null) {

    return null;
  } // If there are siblings their indices need to be updated.


  if (child.sibling !== null) {
    updateFibersIndices(child.sibling, child.index);
  } // If There is no alternate we can return here.


  if (child.alternate !== null && parent.alternate !== null) {
    // The alternate child.
    var alternate = null; // Remove the alternate child.

    if (typeof childSelector === 'number') {
      alternate = removeChildFiberAt(parent.alternate, childSelector);
    } else {
      alternate = removeChildFiber(parent.alternate, childSelector);
    } // We should find it because we are shure it exists.


    invariant(alternate !== null); // If there are siblings their indices need to be updated.

    if (alternate.sibling !== null) {
      updateFibersIndices(alternate.sibling, alternate.index);
    }
  } // If we don't have to send the elements we can return here.


  if (skipUpdate) {
    return child;
  } // Get the fibers that belong to the container elements.


  var containerFiber = searchFiber(parent, function (fiber) {
    return fiber["return"];
  }, function (fiber) {
    return Env.isElement(fiber.elementType, fiber.stateNode);
  }); // Get the fibers that belong to the child element.

  var elementFiber = searchFiber(child, function (fiber) {
    return fiber.child;
  }, function (fiber) {
    return Env.isElement(fiber.elementType, fiber.stateNode);
  }); // Containers elements not found.

  if (containerFiber === null) {

    return child;
  } // Child element not found.


  if (elementFiber === null) {

    return child;
  } // Get the elements instances.


  var container = containerFiber.stateNode;
  var element = elementFiber.stateNode; // Remove the element instance.

  Env.removeChildFromContainer(container, element);
  return child;
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


  invariant(topFiber.stateNode !== null && 'current' in topFiber.stateNode);
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
  invariant(typeof internalKey === 'string'); // __reactInternalInstance$* is not present in the types definition.
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
  invariant('_reactInternalFiber' in instance); // _reactInternalFiber is not present in the types definition.
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
      invariant(this.fiber !== null); // Find the current fiber.

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
     * The method will also try to add the elements connected to the fibers (e.g. DOM elements),
     * to disable this function you can use the skipUpdate parameter.
     *
     * @param child       - The child fiber to add.
     * @param position    - The position in which to add the child fiber.
     * @param skipUpdate  - Whether to add or not the elements.
     * @returns           - The index in which the child fiber is added.
     */

  }, {
    key: "addChild",
    value: function addChild$1(child, position, skipUpdate) {
      return addChild(this.getCurrent(), child, position, skipUpdate);
    }
    /**
     * Remove a child fiber from this instance and return it.
     * The child to remove can be chosen by providing its key (string) or by
     * providing its index (number).
     * The method will also try to remove the elements connected to the fibers (e.g. DOM elements),
     * to disable this function you can use the skipUpdate parameter.
     * If the child is not found null is returned.
     *
     * @param childSelector - The child fiber selector.
     * @param skipUpdate    - Whether to remove or not the elements.
     * @returns             - The removed child fiber or null.
     */

  }, {
    key: "removeChild",
    value: function removeChild$1(childSelector, skipUpdate) {
      return removeChild(this.getCurrent(), childSelector, skipUpdate);
    }
    /**
     * Remove a child fiber from this instance and add it to another ParentFiber instance.
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
     * @param toParentFiber - The ParentFiber instance in which to send the child fiber.
     * @param childSelector - The child fiber selector.
     * @param position      - The position in which to add the child fiber.
     * @param skipUpdate    - Whether to send or not the elements.
     * @returns             - The position in which the child fiber is sent or -1.
     */

  }, {
    key: "sendChild",
    value: function sendChild(toParentFiber, childSelector, position, skipUpdate) {
      // Remove the child fiber.
      var child = this.removeChild(childSelector, skipUpdate); // Return -1 if the child fiber does not exist.

      if (child === null) {
        return -1;
      } // Add the child fiber.


      return toParentFiber.addChild(child, position, skipUpdate);
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

function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

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

      invariant(parentRef !== null && (typeof parentRef === 'function' || _typeof(parentRef) === 'object')); // Set the fiber.

      this.parent.setFiber(fiber);
      this.parent.setFinder(findFiber); // Set the ref.

      if (typeof parentRef === 'function') {
        parentRef(this.parent);
      }

      if (_typeof(parentRef) === 'object' && parentRef !== null) {
        // The type of ref that is normally returned by useRef and createRef
        // is not mutable, and the user may not know how to obtain a mutable one,
        // causing annoying problems. Plus, it makes sense that this property is
        // immutable, so I just use the refObject interface (and not
        // the MutableRefObject interface) with the @ts-ignore.
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
}(Component);
/* Parent props. */

function _createSuper$2(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$2(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

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


  if (fromParent === undefined || toParent === undefined) {
    return -1;
  } // Send the child.


  return fromParent.sendChild(toParent, childSelector, position, skipUpdate);
}
/**
 * This component generate internally a
 * ParentFiber and allow to access it through a global provided map.
 * This component must be the parent of the children to reparent
 * (it is possible to get around this by providing a findFiber method).
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

      invariant(typeof id === 'string'); // Set the fiber.

      this.parent.setFiber(fiber);
      this.parent.setFinder(findFiber);


      ReparentableMap.set(id, this.parent);
    }
    /**
     * Update the findFiber method.
     */

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
}(Component);
/* Reparentable props. */

/**
 * An hook to get a ParentFiber instance in a function component.
 * The ref returned must reference the element that is the parent
 * of the children to reparent (it is possible to get around this by providing a findFiber method).
 *
 * @param findFiber - Get a different parent fiber.
 * @returns - [The ParentFiber instance, the element ref].
 */

function useParent(findFiber) {
  // The parent instance.
  var parentRef = useRef(null); // The element ref.

  var ref = useRef(null); // Generate the instance.

  if (parentRef.current === null) {
    parentRef.current = new ParentFiber();
  } // Get a reference.


  var parent = parentRef.current;
  parent.setFinder(findFiber); // When the component is mounted the fiber is setted.

  useEffect(function () {
    invariant(ref.current !== null); // The element fiber.

    parent.setFiber(getFiberFromElementInstance(ref.current)); // Clean up.

    return function () {
      parent.clear();
    };
  }, []);
  return [parent, ref];
}

export { Env, Parent, ParentFiber, Reparentable, ReparentableMap, addChild, addChildFiberAt, addChildFiberBefore, addSiblingFiber, appendChildFiber, configure, createParent, findChildFiber, findChildFiberAt, findPreviousFiber, findSiblingFiber, getCurrentFiber, getFiberFromClassInstance, getFiberFromElementInstance, prependChildFiber, removeChild, removeChildFiber, removeChildFiberAt, removeFirstChildFiber, removeSiblingFiber, searchFiber, sendReparentableChild, updateFiberDebugFields, updateFibersIndices, useParent };
