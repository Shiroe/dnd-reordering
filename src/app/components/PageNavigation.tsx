"use client";

import { ReactNode, useState } from "react";

import PageNavigationButton from "@/components/PageNavigationButton";
import GapHiddenButton from "@/components/GapHiddenButton";

import type { PageNavItem } from "@/store/pageNavigationSlice";

import PlusSvg from "@/assets/plus.svg";

const DEFAULT_PAGES: PageNavItem[] = [
  { name: "info", label: "Info", position: 0, icon: "info" },
  { name: "details", label: "Details", position: 1, icon: "file" },
  { name: "other", label: "Other", position: 2, icon: "file" },
  { name: "ending", label: "Ending", position: 0, icon: "check" },
];

export default function PageNavigation() {
  const [pages, setPages] = useState<PageNavItem[]>(DEFAULT_PAGES);
  const [activePage, setActivePage] = useState<string>(pages[0].name || "");
  const [hoveredGap, setHoveredGap] = useState<number | null>(null);

  return (
    <div className={"bg-white w-full p-5 relative"}>
      <div className="flex justify-start items-center w-fit relative">
        <div className="absolute inset-0 flex items-center -z-10">
          <div className="w-full border-t border-dashed border-black"></div>
        </div>
        {pages.reduce<ReactNode[]>((acc, p, idx) => {
          if (idx < pages.length - 1) {
            acc.push(
              <PageNavigationButton
                key={p.name}
                page={p}
                activePage={activePage}
                onClick={() => setActivePage(p.name)}
              />,
            );

            acc.push(
              <GapHiddenButton
                key={`${p.name}-gap`}
                isHovered={hoveredGap !== null && hoveredGap === idx}
                onBtnClick={() => console.log("add page after: ", idx)}
                onMouseEnter={() => setHoveredGap(idx)}
                onMouseLeave={() => setHoveredGap(null)}
              />,
            );
          } else {
            acc.push(
              <PageNavigationButton
                key={p.name}
                page={p}
                activePage={activePage}
                onClick={() => setActivePage(p.name)}
              />,
            );

            acc.push(
              <button
                key={`add-page-btn`}
                className={`
                  flex justify-center items-center gap-2
                  cursor-pointer active:cursor-grabbing
                  px-[10px] py-[6px] rounded-[8px] shadow-sm
                  bg-pure-white text-dark ml-5
                  outline-transparent focus:outline-blue/50
                `}
              >
                <div
                  className={`flex justify-center items-center min-w-4 min-h-4 text-black bg-white`}
                >
                  <PlusSvg />
                </div>
                <span>Add page</span>
              </button>,
            );
          }

          return acc;
        }, [])}
      </div>
    </div>
  );
}
