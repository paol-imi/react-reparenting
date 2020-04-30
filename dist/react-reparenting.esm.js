/**
* React-reparenting v0.2.0
* https://paol-imi.github.io/react-reparenting
* Copyright (c) 2020-present, Paol-imi
* Released under the MIT license
* https://github.com/Paol-imi/react-reparenting/blob/master/LICENSE
* @license MIT
*/

import _classCallCheck from '@babel/runtime/helpers/esm/classCallCheck';
import _createClass from '@babel/runtime/helpers/esm/createClass';
import _defineProperty from '@babel/runtime/helpers/esm/defineProperty';
import _typeof from '@babel/runtime/helpers/esm/typeof';
import _assertThisInitialized from '@babel/runtime/helpers/esm/assertThisInitialized';
import _inherits from '@babel/runtime/helpers/esm/inherits';
import _possibleConstructorReturn from '@babel/runtime/helpers/esm/possibleConstructorReturn';
import _getPrototypeOf from '@babel/runtime/helpers/esm/getPrototypeOf';
import _wrapNativeSuper from '@babel/runtime/helpers/esm/wrapNativeSuper';
import React, { Component, createContext, useContext, useRef, useEffect } from 'react';
import _get from '@babel/runtime/helpers/esm/get';

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

function configure(configuration) {
  Object.assign(ENV, configuration);
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
    // In production we strip the message but still throw.
    throw new Invariant(prefix);
  }
}

/**
 * The fiber could be in the current tree or in the work-in-progress tree.
 * Returns the fiber in the current tree, it could be the given fiber or its alternate.
 * For now, no special cases are handled:
 * - It doesn't make sense to manage portals as this package was created to avoid them.
 *
 * @param fiber - The fiber.
 * @returns - The current fiber.
 */

function getCurrentFiber(fiber) {
  // If there is no alternate we are shure that it is the current fiber.
  if (!fiber.alternate) {
    return fiber;
  } // Get the top fiber.


  var topFiber = fiber;

  while (topFiber["return"]) {
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
 * @returns - The fiber.
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
 * @param instance - The class component instance.
 * @returns - The fiber.
 */

function getFiberFromClassInstance(instance) {
  invariant(_typeof(instance) === 'object' && '_reactInternalFiber' in instance); // _reactInternalFiber is not present in the types definition.
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore

  return instance._reactInternalFiber;
}

/**
 * Returns the child fiber in the given index or if the paremt has no children.
 * If the index provided is greater than the number of children the last child is returned.
 *
 * @param parent - The parent fiber.
 * @param index - The index of the child fiber to find.
 * @returns - The fiber found or null.
 */

function findChildFiberAt(parent, index) {
  invariant(index >= -1); // The first child.

  var child = parent.child;


  if (child === null) {
    return null;
  }

  if (index === -1) {
    var _child = child,
        sibling = _child.sibling; // Find the last child.

    while (sibling) {
      child = sibling;
      sibling = child.sibling;
    }
  } else {
    var _child2 = child,
        _sibling = _child2.sibling; // Find the child at the given index.

    while (_sibling && index > 0) {
      index -= 1;
      child = _sibling;
      _sibling = child.sibling;
    }
  }

  return child;
}
/**
 * Returns the child fiber with the given key or null if it is not found.
 *
 * @param parent - The parent fiber.
 * @param key - The key of the child fiber to find.
 * @returns - The fiber found or null.
 */

function findChildFiber(parent, key) {
  var child = parent.child;


  while (child && child.key !== key) {
    child = child.sibling;
  }

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
  var child = parent.child; // If the parent has no child.

  if (child === null) {

    return null;
  } // If the fiber to find is the first one.


  if (child.key === key) {
    return parent;
  }

  var _child3 = child,
      sibling = _child3.sibling; // Find the previous sibling.

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
 * Returns the first instance found in the parent fibers.
 *
 * @param fiber - The fiber.
 * @returns - The container instance or null.
 */

function findContainerInstanceFiber(fiber, isElement) {
  while (fiber) {
    if (isElement(fiber.elementType, fiber.stateNode)) {
      return fiber;
    } // Search in the next parent.


    fiber = fiber["return"];
  }

  return null;
}
/**
 * Returns the first instance found in the parent fibers.
 *
 * @param fiber - The fiber.
 * @returns - The instance or null.
 */

function findInstanceFiber(fiber, isElement) {
  while (fiber) {
    // If this fiber contains the instance.
    if (isElement(fiber.elementType, fiber.stateNode)) {
      return fiber;
    }


    fiber = fiber.child;
  }

  return null;
}
/** Fiber of an Instance. */

/**
 * Add a child fiber in the parent at the given index and return its index.
 * If the index is -1 the fiber is added at the bottom.
 * If the index provided is greater than the number of children available the fiber is added at the bottom.
 *
 * @param parent - The parent fiber.
 * @param child - The child fiber.
 * @param index - The index in which to add the fiber.
 * @returns - The index in which the fiber is added.
 */

function addChildFiberAt(parent, child, index) {
  // If the fiber is not found add the fiber at the bottom.
  if (index === -1) return appendChildFiber(parent, child); // Add the fiber in the first index.

  if (index === 0) return prependChildFiber(parent, child); // Find the previous sibling.
  // At this point we are sure that the index is greater than 0.

  var previousSibling = findChildFiberAt(parent, index - 1); // If the fiber is not found add the fiber at the bottom.

  if (previousSibling === null) {

    return appendChildFiber(parent, child);
  }


  return addSiblingFiber(previousSibling, child);
}
/**
 * Add the child fiber in the parent before the fiber with the given key and return its index.
 * If the key is not found the fiber is added at the bottom.
 *
 * @param parent - The parent fiber.
 * @param child - The child fiber.
 * @param key - The key of the previous fiber.
 * @returns - The index in which the fiber is added.
 */

function addChildFiberBefore(parent, child, key) {
  // Find the previous fiber.
  var previousFiber = findPreviousFiber(parent, key); // If the fiber is not found add the fiber at the bottom.

  if (previousFiber === null) {

    return appendChildFiber(parent, child);
  } // If The fiber with the given key is the first one.


  if (previousFiber === parent) {
    return prependChildFiber(parent, child);
  } // Add the fiber as sibling of the previous one.


  return addSiblingFiber(previousFiber, child);
}
/**
 * Add the fiber at the bottom and return its index.
 *
 * @param parent - The parent fiber.
 * @param child - The child fiber.
 * @returns - The index in which the fiber is added.
 */

function appendChildFiber(parent, child) {
  var previousFiber = findChildFiberAt(parent, -1); // The parent has no children.

  if (previousFiber === null) {
    return prependChildFiber(parent, child);
  }

  return addSiblingFiber(previousFiber, child);
}
/**
 * Add the fiber after the given sibling and return its index.
 *
 * @param fiber - The fiber.
 * @param sibling - The fiber to add as sibling.
 * @returns - The index in which the fiber is added.
 */

function addSiblingFiber(fiber, sibling) {
  var oldSibling = fiber.sibling;
  var index = fiber.index + 1; // Update fiber references.

  fiber.sibling = sibling;
  sibling.sibling = oldSibling;
  sibling["return"] = fiber["return"];
  return index;
}
/**
 * Add the fiber as first child and retun 0.
 *
 * @param parent - The parent fiber.
 * @param child - The child fiber.
 * @returns - The index in which the fiber is added.
 */

function prependChildFiber(parent, child) {
  var oldFirstChild = parent.child; // Update fiber references.

  parent.child = child;
  child.sibling = oldFirstChild;
  child["return"] = parent;
  return 0;
}

/**
 * Remove the child fiber at the given index and return it or null if it not exists.
 *
 * @param parent - The parent fiber.
 * @param index - The index of the child fiber to remove.
 * @returns - The removed fiber or null.
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
 * @param parent - The parent fiber.
 * @param key - The key of the child fiber to remove.
 * @returns - The removed fiber or null.
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
 * Remove the next sibling from a fiber and return it or null if it not exist.
 *
 * @param fiber - The fiber.
 * @returns - The removed sibling fiber or null.
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
 * Remove the first child fiber of the given parent and return it or null if it not exists.
 *
 * @param parent - The parent fiber.
 * @returns - The removed child fiber or null.
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
 * Update the indices of a fiber and its next siblings.
 *
 * @param fiber - The fiber.
 * @param index - The index of the fiber.
 * @returns - The last sibling index.
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
 * Update the debug owner.
 * I have not yet inquired about how the _debug fields are chosen.
 * For now only the debug owner and source if there is at least one sibling from which to copy those properties.
 * TODO:
 * - _debugID - does it need to be changed?
 * - _debugSource - is it ok like this?
 * - _debugOwner - is it ok like this?
 * - _debugHookTypes - does it need to be changed?
 *
 * @param child - The child fiber.
 * @param parent - The parent fiber.
 */

function updateFiberDebugFields(child, parent) {
  var fiberToCopy; // Try to find a sibling.

  if (parent.child === child && child.sibling !== null) {
    fiberToCopy = child.sibling;
  } else if (parent.child !== null) {
    fiberToCopy = parent.child;
  } else {
    fiberToCopy = parent;
  }

  child._debugOwner = fiberToCopy._debugOwner;
  child._debugSource = fiberToCopy._debugSource;
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

    if (fiber) this.set(fiber);
  }
  /**
   * Parent fiber setter.
   *
   * @param fiber - The parent fiber to manage.
   */


  _createClass(ParentFiber, [{
    key: "set",
    value: function set(fiber) {

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
    key: "getCurrent",
    value: function getCurrent() {
      invariant(this.fiber !== null);
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
      var parentFiber = this.getCurrent();
      var index; // Add the fiber.

      if (typeof position === 'number') {
        index = addChildFiberAt(parentFiber, child, position);
      } else {
        index = addChildFiberBefore(parentFiber, child, position);
      } // Update fiber properties.


      updateFibersIndices(child, index);


      if (child.alternate === null || parentFiber.alternate === null) {
        child.alternate = null;
        return index;
      } // Add the alternate


      if (typeof position === 'number') {
        addChildFiberAt(parentFiber.alternate, child.alternate, position);
      } else {
        addChildFiberBefore(parentFiber.alternate, child.alternate, position);
      } // Update fiber properties.


      updateFibersIndices(child.alternate, index);

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
      var parentFiber = this.getCurrent();
      var fiber = null; // Remove the fiber.

      if (typeof child === 'number') {
        fiber = removeChildFiberAt(parentFiber, child);
      } else {
        fiber = removeChildFiber(parentFiber, child);
      } // If the fiber is not found return null.


      if (fiber === null) {
        return null;
      } // If there are siblings their indices need to be adjusted.


      if (fiber.sibling !== null) {
        updateFibersIndices(fiber.sibling, fiber.index);
      } // If There is no alternate we can return here.


      if (fiber.alternate === null || parentFiber.alternate === null) {
        return fiber;
      } // If we are here we can handle the alternate.


      var alternate = null; // Remove the alternate.

      if (typeof child === 'number') {
        alternate = removeChildFiberAt(parentFiber.alternate, child);
      } else {
        alternate = removeChildFiber(parentFiber.alternate, child);
      } // If the fiber is not found return null.


      invariant(alternate !== null); // If there are siblings their indices need to be adjusted.

      if (alternate.sibling !== null) {
        updateFibersIndices(alternate.sibling, alternate.index);
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
      if (skipUpdate) return index; // Container instances

      var fromContainer = findContainerInstanceFiber(this.fiber, ENV.isElement);
      var toContainer = findContainerInstanceFiber(toParent.fiber, ENV.isElement); // Container not found.

      if (fromContainer === null || toContainer === null) {

        return index;
      } // Elements instances.


      var element = findInstanceFiber(fiber, ENV.isElement); // Elements not found.

      if (element === null) {

        return index;
      } // Remove the element instance.


      ENV.removeChildFromContainer(fromContainer.stateNode, element.stateNode);

      if (fiber.sibling === null) {
        ENV.appendChildToContainer(toContainer.stateNode, element.stateNode);
      } else {
        var sibling = findInstanceFiber(fiber.sibling, ENV.isElement); // Elements not found.

        if (sibling === null) {

          return index;
        }

        ENV.insertInContainerBefore(toContainer.stateNode, element.stateNode, sibling.stateNode);
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
      parent.set(findFiber(fiber));
    } else {
      parent.set(fiber);
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

      invariant(parentRef !== null && (typeof parentRef === 'function' || _typeof(parentRef) === 'object')); // Set the fiber.

      if (typeof findFiber === 'function') {
        this.parent.set(findFiber(fiber));
      } else {
        this.parent.set(fiber);
      } // Set the ref.


      if (typeof parentRef === 'function') {
        parentRef(this.parent);
      }

      if (_typeof(parentRef) === 'object' && parentRef !== null) {
        // TODO: Not so pretty solution,
        // when I will have time I'll try and implement the interface MutableRefObject.
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        parentRef.current = this.parent;
      }
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

function _createSuper$2(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct$2()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
/** Reparentable context. */

var ReparentableContext = createContext(null);
ReparentableContext.displayName = 'Reparentable';
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

      return _get(_getPrototypeOf(ReparentableMap.prototype), "set", _assertThisInitialized(_this)).call(_assertThisInitialized(_this), key, value);
    });

    _defineProperty(_assertThisInitialized(_this), "send", function (fromParentId, toParentId, child, position, skipUpdate) {
      var fromParent = _this.get(fromParentId);

      var toParent = _this.get(toParentId);


      if (fromParent === undefined || toParent === undefined) {
        return -1;
      } // Send the child.


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
      var reparentableMapRef = this.props.reparentableMapRef; // Set the ref.

      if (typeof reparentableMapRef === 'function') {
        reparentableMapRef(this.map);
      }

      if (_typeof(reparentableMapRef) === 'object' && reparentableMapRef !== null) {
        // TODO: Not so pretty solution,
        // when I will have time I'll try and implement the interface MutableRefObject.
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        reparentableMapRef.current = this.map;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var children = this.props.children;
      return /*#__PURE__*/React.createElement(ReparentableContext.Provider, {
        value: this.map
      }, children);
    }
  }]);

  return ReparentableProvider;
}(Component);
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
      invariant(this.context !== null);
      var set = this.context.set;
      var _this$props = this.props,
          id = _this$props.id,
          findFiber = _this$props.findFiber;
      var fiber = getFiberFromClassInstance(this); // Ensure the id is a string.

      invariant(typeof id === 'string'); // Set the fiber.

      if (typeof findFiber === 'function') {
        this.parent.set(findFiber(fiber));
      } else {
        this.parent.set(fiber);
      } // Set the ParentFiber instance in context map.


      set(id, this.parent);
    }
    /**
     * Clear on unmount.
     */

  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      invariant(this.context !== null);
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
}(Component);
/** Reparentable hook. */

_defineProperty(Reparentable, "Context", ReparentableContext);

_defineProperty(Reparentable, "Provider", ReparentableProvider);

_defineProperty(Reparentable, "contextType", ReparentableContext);

var useReparentable = function useReparentable() {
  var context = useContext(ReparentableContext);
  invariant(context !== null);
  return context;
};
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
  var parentRef = useRef(null); // The element ref.

  var ref = useRef(null); // Generate the instance.

  if (parentRef.current === null) {
    // TODO: Not so pretty solution,
    // when I will have time I'll try and implement the interface MutableRefObject.
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    parentRef.current = new ParentFiber();
  } // Get a reference.


  var parent = parentRef.current; // When the component is mounted the fiber is setted.

  useEffect(function () {
    invariant(ref.current !== null);
    invariant(parentRef.current !== null); // The element fiber.

    var elementFiber = getFiberFromElementInstance(ref.current); // Set the fiber.

    if (typeof findFiber === 'function') {
      parent.set(findFiber(elementFiber));
    } else {
      parent.set(elementFiber);
    } // Clean up.


    return function () {
      parent.clear();
    };
  }, []);
  return [parent, ref];
}

export { ENV, Parent, ParentFiber, Reparentable, ReparentableContext, ReparentableMap, ReparentableProvider, addChildFiberAt, addChildFiberBefore, addSiblingFiber, appendChildFiber, configure, createParent, findChildFiber, findChildFiberAt, findContainerInstanceFiber, findInstanceFiber, findPreviousFiber, getCurrentFiber, getFiberFromClassInstance, getFiberFromElementInstance, prependChildFiber, removeChildFiber, removeChildFiberAt, removeFirstChildFiber, removeSiblingFiber, updateFiberDebugFields, updateFibersIndices, useParent, useReparentable };
