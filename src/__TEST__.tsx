import { startTransition, useEffect, useRef, useState } from 'react';
import { simulateDiscreteEvent } from './simulateDiscreteEvent';

/**
 * TODO: MY CURRENT MODEL OF REACT IS
 * https://github.com/reactwg/react-18/discussions/27
 *
 * SYncronous updates -> result of a dispatching in a discrete event
 * asyncronous updates (with priority levels) -> anithing else
 *  - this render a components, and every 5ms yelds to the next task so events can be captured.
 *    this means it can be interrupted.
 *
 * FOrce the update to not be interruptable: 2 main solution:
 *  - undertsand the way it can be interrupted, and eventually resumed, so we could rollback -> SEEMS WAY TO COMPLEX
 *  - force sync updates, need to explore this more
 *      https://github.com/facebook/react/blob/8e35b5060875c875f468878f94bc3c0d7d45c52d/packages/react-dom/src/client/ReactDOMHostConfig.js#L368
 *      simulate discrete event
 */

const [parentA, parentB] = useOwner([
  // somejsx,
  // some other jsx,
]);

type Update = {
  id: string;
  useTransition: boolean;
  discrete: boolean;
};

// Creates an owner and a component that can be used to schedule updates
// in a specific order.

export function scheduleSequentialUpdates(
  firstUpdate: Update,
  concurrentUpdate: Update & { afterRenderOf: string }
) {
  const history: Array<
    { render: string } | { update: string } | { mount: string }
  > = [];
  const map: Record<string, () => void> = {};

  function Component({ id, children }: { id: string; children?: any }) {
    const setState = useState<any>()[1];

    if (!(id in map)) {
      map[id] = () => setState({});
    } else {
      history.push({ render: id });

      if (id === concurrentUpdate.afterRenderOf) {
        history.push({ update: id });

        const update = concurrentUpdate.useTransition
          ? () => startTransition(map[concurrentUpdate.id])
          : map[concurrentUpdate.id];

        queueMicrotask(() => {
          if (concurrentUpdate.discrete) {
            simulateDiscreteEvent(update);
          } else {
            update();
          }
        });
      }
    }

    const ref = useRef(false);
    const l = Object.keys(map).length;
    useEffect(() => {
      if (l === Object.keys(map).length) queueMicrotask(() => setState({}));

      if (ref.current) history.push({ mount: id });
      ref.current = true;
    });

    return children as any;
  }

  function getHistory() {
    return history;
  }

  return { Component, getHistory };
}

const { Component, getHistory } = scheduleSequentialUpdates(
  { id: '1', useTransition: true, discrete: true },
  { id: '2', useTransition: true, discrete: true, afterRenderOf: '1' }
);

act(() => (
  <Component id="1">
    <Component id="2">
      <Component id="3" />
    </Component>
  </Component>
));

expect(getHistory()).toEqual([
  { render: '1' },
  { render: '2' },
  { update: '2' },
  { mount: '1' },
  { mount: '2' },
]);
