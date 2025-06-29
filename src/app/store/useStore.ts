/*
 * the idea is that when having multiple slices AppState
 * get the full union type so no does not make much sense
 * but to demonstrate the how to have type currying */

/* eslint-disable @typescript-eslint/no-empty-object-type */
import { create } from "zustand";

import {
  IPageNavigationSlice,
  createPageNavigationSlice,
} from "./pageNavigationSlice";

/* disable warning */
export interface AppState extends IPageNavigationSlice {}

/**
 * This is the main store of the app.
 * used with curied function `()(() => {})`
 * to allow for type inference.
 * **currying** should be replaced if store
 * middleware is used (e.g. combine).
 * @returns {AppState} the state of the app
 */
export const useBoundStore = create<AppState>()((...a) => ({
  ...createPageNavigationSlice(...a),
}));
