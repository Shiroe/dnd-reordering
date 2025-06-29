import { StateCreator } from "zustand";

import { AppState } from "./useStore";

type PageNavigationState = {
  activePage: number;
  pages?: PageNavItem[];
};

export interface PageNavItem {
  name: string;
  label: string;
  position: number;
  icon: string;
}

export interface IPageNavigationSlice {
  pageNavigation: PageNavigationState;
  // tipsCreator: TipCreatorState;
  // /**
  //  *
  //  * @param newState sets the state of the tips creator
  //  * otherwise toggles the state based on the previous status
  //  * @returns
  //  */
  // toggleTipsCreator: (newState: Partial<TipCreatorState>) => void;
  //
  // /**
  //  *
  //  * @param newState sets the state of the tips creator
  //  * with any data available at a time on the tip to be submitted
  //  * @returns
  //  */
  // updateTipCreatorState: (newState: Partial<TipCreatorState>) => void;
  //
  // /**
  //  * Resets the tips creator state to default
  //  * @returns
  //  */
  // resetTipsCreator: () => void;
}

// const DEFAULT_CREATOR_STATE: Partial<PageNavigationState> = {
//   activePage: 0,
//   pages: [],
// };

export const createPageNavigationSlice: StateCreator<
  AppState,
  [],
  [],
  IPageNavigationSlice
> = (set, get) => ({
  pageNavigation: {
    activePage: 0,
    pages: [],
  },
});
