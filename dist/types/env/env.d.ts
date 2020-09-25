export interface ENV<Instance> {
    /**
     * Append a child inside a container.
     *
     * @param container - The container instance.
     * @param child     - The child instance.
     */
    appendChildToContainer(container: Instance, child: Instance): void;
    /**
     * Insert a child in a container before another child.
     *
     * @param container - The container instance.
     * @param child     - The child instance.
     * @param before    - The child instance to reference.
     */
    insertInContainerBefore(container: Instance, child: Instance, before: Instance): void;
    /**
     * Remove a child from a container.
     *
     * @param container - The container instance.
     * @param child     - The child instance.
     */
    removeChildFromContainer(container: Instance, child: Instance): void;
    /**
     * Get if the given element is a valid instance.
     *
     * @param type      - The element type.
     * @param stateNode - The state node.
     * @returns         - If the given type is a valid element type.
     */
    isElement(type: any, stateNode?: Instance | any): boolean;
}
/**
 * The host environment.
 * Default configuration to work with ReactDOM renderer.
 */
export declare const Env: ENV<any>;
/**
 * Configure the host environment.
 *
 * @param configuration - The configuration.
 */
export declare function configure<T>(configuration: Partial<ENV<T>>): ENV<T>;
