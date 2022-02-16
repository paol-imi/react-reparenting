import { Key, ReactElement, useRef } from 'react';
import { Fiber } from 'react-reconciler';

export type SpaceSlice = ReactElement | ReactElement[];

export function useOwnerSpace(e: SpaceSlice, ...r: SpaceSlice[]): SpaceSlice[];
export function useOwnerSpace(...elements: SpaceSlice[]): SpaceSlice[] {
  const map = useRef(new Map<Key, Fiber>()).current;

  return elements.map((element, index) => (
    <Parent map={map} key={index}>
      {element}
    </Parent>
  ));
}

const Parent = () => null;
