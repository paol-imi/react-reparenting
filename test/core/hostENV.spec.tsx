import {ENV, config} from '../../src';

describe('How config works', () => {
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

    config(configuration);

    expect(Object.keys(configuration)).toEqual(Object.keys(ENV));
  });
});
