import {
  startTransition,
  useEffect,
  useRef,
  useState,
  Children,
  cloneElement,
  version,
} from 'react';
import { createRoot } from 'react-dom/client';

import { flushSync, unstable_batchedUpdates } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { simulateDiscreteEvent } from './simulateDiscreteEvent';

/**
 * TODO: MY CURRENT MODEL OF REACT IS
 * https://github.com/reactwg/react-18/discussions/27
 *
 * JUST FORBID IN THE DOCUMENTATION TO USE START_TRANSITION!! il resto funziona
 *
 *
 */

let container: HTMLElement | null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container!);
  container = null;
});

const render = (a: any) => createRoot(container!).render(a);

type Update = {
  id: string;
  useTransition: boolean;
  discrete: boolean;
};

function scheduleSequentialUpdates(
  firstUpdate: Update,
  concurrentUpdate: Update & { afterRenderOf: string }
) {
  const history: Array<
    { render: string } | { UPDATE: string } | { mount: string }
  > = [];

  const map: Record<string, () => void> = {};
  let update = null as null | 'first' | 'concurrent';

  function HeavyComponent({ id, children }: { id: string; children?: any }) {
    const setState = useState<any>()[1];

    console.log('render', id);

    if (!(id in map)) {
      map[id] = () => setState({});
    } else {
      history.push({ render: id });

      if (id === concurrentUpdate.afterRenderOf) {
        concurrentUpdate.afterRenderOf = null as any;
        const UPDATE = concurrentUpdate.useTransition
          ? () => startTransition(map[concurrentUpdate.id])
          : map[concurrentUpdate.id];

        queueMicrotask(() => {
          history.push({ UPDATE: concurrentUpdate.id });

          if (concurrentUpdate.discrete) {
            simulateDiscreteEvent(UPDATE);
          } else {
            UPDATE();
          }
        });
      }
    }

    // TODO: WE MUST USE MORE THAN 5ms SO THAT WE ARE SURE REACTS WILL YELD
    const endTime = new Date();
    while (new Date().getTime() - endTime.getTime() < 5);

    const ref = useRef(false);
    const l = Object.keys(map).length;
    useEffect(() => {
      if (firstUpdate.id === id && !ref.current) {
        console.log(id);
        const UPDATE = firstUpdate.useTransition
          ? () => {
              console.log('miao');
              startTransition(map[firstUpdate.id]);
            }
          : map[firstUpdate.id];

        queueMicrotask(() => {
          history.push({ UPDATE: id });
          if (firstUpdate.discrete) {
            simulateDiscreteEvent(UPDATE);
          } else {
            UPDATE();
          }
        });
      }

      if (ref.current) history.push({ mount: id });
      ref.current = true;
    });

    return Children.map(children, (child) => cloneElement(child));
  }

  function getHistory() {
    return history;
  }

  return { HeavyComponent, getHistory };
}

console.log(window.event);

it('miao2', async () => {
  const { HeavyComponent, getHistory } = scheduleSequentialUpdates(
    { id: '1', useTransition: true, discrete: false },
    { id: '2', useTransition: false, discrete: true, afterRenderOf: '2' }
  );

  //  flushSync(() => {
  render(
    <HeavyComponent id="1">
      <HeavyComponent id="2">
        <HeavyComponent id="3" />
      </HeavyComponent>
    </HeavyComponent>
  );
  //  });

  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });

  expect(getHistory()).toEqual([
    { UPDATE: '1' },
    { render: '1' },
    { render: '2' },
    { UPDATE: '2' },
    { render: '2' },
    { render: '3' },
    { mount: '3' },
    { mount: '2' },
    { render: '1' },
    { render: '2' },
    { render: '3' },
    { mount: '3' },
    { mount: '2' },
    { mount: '1' },
  ]);
});

it('miao', async () => {
  const { HeavyComponent, getHistory } = scheduleSequentialUpdates(
    { id: '1', useTransition: false, discrete: false },
    { id: '2', useTransition: false, discrete: true, afterRenderOf: '1' }
  );

  // flushSync(() => {
  render(
    <HeavyComponent id="1">
      <HeavyComponent id="2">
        <HeavyComponent id="3" />
      </HeavyComponent>
    </HeavyComponent>
  );
  // });

  await new Promise((resolve) => {
    setTimeout(resolve, 200);
  });

  expect(getHistory()).toEqual([
    { UPDATE: '1' },
    { render: '1' },
    { render: '2' },
    { render: '3' },
    { UPDATE: '2' },
    { mount: '3' },
    { mount: '2' },
    { mount: '1' },
    { render: '2' },
    { render: '3' },
    { mount: '3' },
    { mount: '2' },
  ]);
});
