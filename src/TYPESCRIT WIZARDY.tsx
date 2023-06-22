import type { ReactElement } from 'react';
import { useEffect, useRef } from 'react';
import { useMemoMap } from './useMemoMap';

// https://github.com/microsoft/TypeScript/issues/30680#issuecomment-752725353
export type OwnerSlot = ReactElement | ReactElement[];

// Best effor typing wizardy
// it works but I dont fully understand how
type Cast<A, B> = A extends B ? A : B;
type AsConst<A, B> = Cast<A, { [K in keyof A]: B } | []>;

export type MaybeMap<C extends Array<Input | null>, Input, Output> = C extends [
  infer R extends Input | null,
  ...infer Rest extends any[]
]
  ? [R extends Input ? Output : null, ...MaybeMap<Rest, Input, Output>]
  : [];

type E = MaybeMap<['3', null, '4', '4', null], string, number>;

const p: AsConst<['a', 'b', 'c'], string> = null as any;

const e = p;

function map<T extends Array<any>>(
  t: AsConst<T, ReactElement | ReactElement[]>
): Exclude<AsConst<T, ReactElement>, []> {
  t.map();
  return null as any;
}

const [parentA, parentB, SHOULD_ERROR] = map([
  <div key="" />,
  [<div key="" />],
]);
const bbb = map(['', 4, [<div key="" />]]);

//
//
//
//

export type Map<C extends Array<any> | readonly any[]> = C extends [
  infer R extends string,
  ...infer Rest extends any[] | readonly any[]
]
  ? [boolean, ...Map<Rest>]
  : [];

type e = Map<['', '']>;

const ff: <T extends Array<string> | readonly string[]>(
  e: AsConst<T, string>
) => (m: Map<T>) => void = '' as any;

const rett = ff(['', '', '']);

rett([true, false, false]);

type AA = [string] | [string, ...string[]];

type EXTR<A> = A extends [a: string, b: infer B, ...c: infer C]
  ? [B, ...C]
  : [];

const ff2: <T extends AA>(
  e: AsConst<T, string>
) => (m: Map<EXTR<typeof e>>) => void = '' as any;

ff2(['']);
