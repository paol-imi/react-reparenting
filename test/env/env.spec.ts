import {Env, configure} from '../../src';

describe('How configure works', () => {
  test('The component provide a ParentFiber instance', () => {
    const configuration = {
      appendChildToContainer(container, child): void {
        container.appendChild(child);
      },
      insertInContainerBefore(container, child, before): void {
        container.insertBefore(child, before);
      },
      removeChildFromContainer(container, child): void {
        container.removeChild(child);
      },
      isElement(_, stateNode): boolean {
        return stateNode instanceof Element;
      },
    };

    configure(configuration);

    expect(Object.keys(configuration)).toEqual(Object.keys(Env));
  });
});
