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
  addPage: () => void;
  removePage: (index: number) => void;
  setPageOrder: (p: PageNavItem, index: number) => void;
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
> = (set, get) => ({
  pageNavigation: {
    activePage: 0,
    pages: DEFAULT_PAGES,
  },
  addPage() {
    set((state) => ({
      pageNavigation: {
        ...state.pageNavigation,
        pages: [
          ...state.pageNavigation.pages,
          {
            name: "new_page",
            label: "New Page",
            icon: "file",
            position: state.pageNavigation.pages?.length,
          },
        ],
      },
    }));
  },
  removePage(index) {},
  setPageOrder(p, index) {},
});
