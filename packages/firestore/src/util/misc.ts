/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { assert } from './assert';

export type EventHandler<E> = (value: E) => void;

/**
 * A union of all of the standard JS types, useful for cases where the type is
 * unknown. Unlike "any" this doesn't lose all type-safety, since the consuming
 * code must still cast to a particular type before using it.
 */
export type AnyJs = null | undefined | boolean | number | string | object;

/**
 * `Unknown` is a stand-in for Typescript 3's `unknown` type. It is similar to
 * `any` but forces code to check types before performing operations on a value
 * of type `Unknown`. See: https://blogs.msdn.microsoft.com/typescript/2018/07/30/announcing-typescript-3-0/#the-unknown-type
 */
export type Unknown = null | undefined | {} | void;

// TODO(b/66916745): AnyDuringMigration was used to suppress type check failures
// that were found during the upgrade to TypeScript 2.4. They need to be audited
// and fixed.
// tslint:disable-next-line:no-any
export type AnyDuringMigration = any;

// tslint:disable-next-line:class-as-namespace
export class AutoId {
  static newId(): string {
    // Alphanumeric characters
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let autoId = '';
    for (let i = 0; i < 20; i++) {
      autoId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    assert(autoId.length === 20, 'Invalid auto ID: ' + autoId);
    return autoId;
  }
}

export function primitiveComparator<T>(left: T, right: T): number {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

/** Duck-typed interface for objects that have an isEqual() method. */
export interface Equatable<T> {
  isEqual(other: T): boolean;
}

/** Helper to compare nullable (or undefined-able) objects using isEqual(). */
export function equals<T>(
  left: Equatable<T> | null | undefined,
  right: T | null | undefined
): boolean {
  if (left !== null && left !== undefined) {
    return !!(right && left.isEqual(right));
  } else {
    // HACK: Explicitly cast since TypeScript's type narrowing apparently isn't
    // smart enough.
    return (left as null | undefined) === right;
  }
}

/** Helper to compare arrays using isEqual(). */
export function arrayEquals<T>(left: Array<Equatable<T>>, right: T[]): boolean {
  if (left.length !== right.length) {
    return false;
  }

  for (let i = 0; i < left.length; i++) {
    if (!left[i].isEqual(right[i])) {
      return false;
    }
  }

  return true;
}
/**
 * Returns the immediate lexicographically-following string. This is useful to
 * construct an inclusive range for indexeddb iterators.
 */
export function immediateSuccessor(s: string): string {
  // Return the input string, with an additional NUL byte appended.
  return s + '\0';
}
