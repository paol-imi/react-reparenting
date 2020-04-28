import type { Fiber } from 'react-reconciler';
/**
 * The ParentFiber implement the logic manage a fiber of a parent component.
 * It provides simple methods for managing reparenting, such as add(), remove() and send().
 */
export declare class ParentFiber {
    /** The parent fiber. */
    fiber: Fiber | null;
    /**
     * The fiber can be setted in the constructor.
     *
     * @param fiber - The parent fiber to manage.
     */
    constructor(fiber?: Fiber);
    /**
     * Parent fiber setter.
     *
     * @param fiber - The parent fiber to manage.
     */
    setFiber(fiber: Fiber): void;
    /**
     * Parent fiber getter.
     * This is necessary to always get the
     * reference of the current fiber.
     *
     * @returns - The current parent fiber.
     */
    getFiber(): Fiber;
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
    add(child: Fiber, position: string | number): number;
    /**
     * Remove a child from the parent and return it.
     * The child to remove can be chosen by providing its key (string)
     * or by providing its index (number).
     * If the child is not found null is returned.
     *
     * @param child - The child identifier.
     * @returns - The removed child or null.
     */
    remove(child: string | number): Fiber | null;
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
    send(child: string | number, toParent: ParentFiber, position: string | number, skipUpdate?: boolean): number;
    /**
     * Clear the parent fiber.
     */
    clear(): void;
}
