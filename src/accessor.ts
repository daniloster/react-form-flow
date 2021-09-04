// @ts-nocheck
import { get as getter, set as setter } from 'mutation-helper';

type Getter = (object: Object, field: string) => any;
const get: Getter = getter;
type Setter = (object: Object, field: string, value: any) => Object;
const set: Setter = setter;

export { get };
export { set };
// eslint-disable-line
