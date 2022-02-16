import { ReactElement } from 'react';
import { SpaceSlice } from './useOwner';

export type ParentProps = {
  children: SpaceSlice;
};

export function Parent({ map, children }) {}
