import { StateCreator } from "zustand";

import { AppState } from "./useStore";

type PageNavigationState = {
  activePage: number;
  pages: PageNavItem[] | [];
};

export interface PageNavItem {
  name: string;
  label: string;
  position: number;
  icon: string;
}

export interface IPageNavigationSlice {
  pageNavigation: PageNavigationState;
  setActivePage: (index: number) => void;
  addPage: (index?: number) => void;
  removePage: (index: number) => void;
  setPageOrder: (newPages: PageNavItem[]) => void;
}

const DEFAULT_PAGES: PageNavItem[] = [
  { name: "info", label: "Info", position: 0, icon: "info" },
  { name: "details", label: "Details", position: 1, icon: "file" },
  { name: "other", label: "Other", position: 2, icon: "file" },
  { name: "ending", label: "Ending", position: 3, icon: "check" },
];

export const createPageNavigationSlice: StateCreator<
  AppState,
  [],
  [],
  IPageNavigationSlice
> = (set) => ({
  pageNavigation: {
    activePage: 0,
    pages: DEFAULT_PAGES,
  },
  setActivePage(index: number) {
    set((state) => ({
      pageNavigation: {
        ...state.pageNavigation,
        activePage: index,
      },
    }));
  },
  addPage(index?: number) {
    set((state) => {
      const newPage = {
        name: "new_page",
        label: "New Page",
        icon: "file",
        position: 0, // Will be updated below
      };

      let newPages;
      const insertIndex = index ?? state.pageNavigation.pages.length;

      // Insert at specified index or at the end
      newPages = [
        ...state.pageNavigation.pages.slice(0, insertIndex),
        newPage,
        ...state.pageNavigation.pages.slice(insertIndex),
      ];

      // Update positions for all pages
      newPages = newPages.map((page, i) => ({ ...page, position: i }));

      // Adjust active page if necessary
      let newActivePage = state.pageNavigation.activePage;
      if (index !== undefined && index <= state.pageNavigation.activePage) {
        newActivePage = state.pageNavigation.activePage + 1;
      }

      return {
        pageNavigation: {
          ...state.pageNavigation,
          pages: newPages,
          activePage: newActivePage,
        },
      };
    });
  },
  removePage(index) {
    set((state) => {
      const newPages = state.pageNavigation.pages
        .filter((_, i) => i !== index)
        .map((page, i) => ({ ...page, position: i })); // Update positions

      let newActivePage = state.pageNavigation.activePage;

      // Adjust active page index
      if (index === state.pageNavigation.activePage) {
        // If removing the active page, move to previous page or stay at 0
        newActivePage = Math.max(0, index - 1);
      } else if (index < state.pageNavigation.activePage) {
        // If removing a page before the active page, decrement active index
        newActivePage = state.pageNavigation.activePage - 1;
      }

      return {
        pageNavigation: {
          ...state.pageNavigation,
          pages: newPages,
          activePage: newActivePage,
        },
      };
    });
  },
  setPageOrder(newPages) {
    set((state) => ({
      pageNavigation: {
        ...state.pageNavigation,
        pages: newPages,
      },
    }));
  },
});
