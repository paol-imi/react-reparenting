import type { Fiber } from 'react-reconciler';
/**
 * The ParentFiber implement the logic to manage a fiber of a parent component.
 * It provides simple methods for managing reparenting, such as add(), remove() and send().
 */
export declare class ParentFiber {
    /** The parent fiber. */
    fiber: Fiber | null;
    /** Find fiber method. */
    findFiber?: (fiber: Fiber) => Fiber;
    /**
     * Parent fiber setter.
     *
     * @param fiber - The parent fiber to manage.
     */
    setFiber(fiber: Fiber): void;
    /**
     * FindFiber method setter.
     *
     * @param findFiber - The method.
     */
    setFinder(findFiber?: (fiber: Fiber) => Fiber): void;
    /**
     * Parent fiber getter.
     * This is necessary to always get the
     * reference of the current fiber.
     *
     * @returns - The current parent fiber.
     */
    getCurrent(): Fiber;
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
    addChild(child: Fiber, position: string | number, skipUpdate?: boolean): number;
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
    removeChild(childSelector: string | number, skipUpdate?: boolean): Fiber | null;
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
     * @param toParent      - The ParentFiber instance in which to send the child fiber.
     * @param childSelector - The child fiber selector.
     * @param position      - The position in which to add the child fiber.
     * @param skipUpdate    - Whether to send or not the elements.
     * @returns             - The position in which the child fiber is sent or -1.
     */
    sendChild(toParent: ParentFiber, childSelector: string | number, position: string | number, skipUpdate?: boolean): number;
    /**
     * Clear the parent fiber.
     */
    clear(): void;
}
