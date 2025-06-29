"use client";

import { ReactNode, useState } from "react";

import type { PageNavItem } from "@/store/pageNavigationSlice";

import InfoSvg from "@/assets/info.svg";
import FileSvg from "@/assets/file.svg";
import CheckSvg from "@/assets/check.svg";
import PlusSvg from "@/assets/plus.svg";
import DotsSvg from "@/assets/dots.svg";

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

  const getIconSvg = (page: PageNavItem) => {
    if (page.icon === "info")
      return (
        <InfoSvg
          className={`${activePage === page.name ? "text-orange" : "text-gray hover:text-gray"}`}
        />
      );
    if (page.icon === "file") return <FileSvg />;
    if (page.icon === "check")
      return (
        <CheckSvg
          className={`${activePage === page.name ? "text-green-600" : "text-gray hover:text-gray"}`}
        />
      );
  };

  return (
    <div className={"bg-white w-full p-5 relative"}>
      <div className="flex justify-start items-center w-fit relative">
        <div className="absolute inset-0 flex items-center -z-10">
          <div className="w-full border-t border-dashed border-black"></div>
        </div>
        {pages.reduce<ReactNode[]>((acc, p, idx, arr) => {
          if (idx < pages.length - 1) {
            acc.push(
              <button
                key={p.name}
                className={`
                  transition-colors ease-linear delay-[50] duration-100
                  flex justify-center items-center gap-2 relative
                  active:cursor-grabbing
                  px-[10px] py-[6px] rounded-[8px] shadow-sm
                  border border-transparent z-10 
                  outline-transparent focus:outline-blue/50
                  ${
                    activePage === p.name
                      ? "bg-pure-white text-dark"
                      : "bg-gray-faint/15 hover:bg-gray-faint/35 text-gray-darker"
                  }
                `}
                onClick={() => setActivePage(p.name)}
              >
                <div className="flex justify-center items-center min-w-5 min-h-5">
                  {getIconSvg(p)}
                </div>
                <span>{p.label}</span>
                {activePage === p.name && (
                  <DotsSvg
                    className="w-4 h-4 text-gray-faint cursor-pointer"
                    onClick={() => console.log("open menu")}
                  />
                )}
              </button>,
            );

            acc.push(
              <div
                key={`${p.name}-gap`}
                className={`
                  transition-all delay-75 duration-150 ease-in-out
                  flex justify-center items-center min-h-8 ${
                    hoveredGap === idx ? "min-w-10" : "min-w-5"
                  }
                `}
                onMouseEnter={() => setHoveredGap(idx)}
                onMouseLeave={() => setHoveredGap(null)}
              >
                <div
                  className={`
                    shadow-sm cursor-pointer min-w-4 min-h-4 text-black bg-white 
                    rounded-full justify-center items-center p-1 ${
                      hoveredGap !== null && hoveredGap === idx
                        ? "flex"
                        : "hidden"
                    }
                  `}
                  onClick={() => console.log("add page after: ", idx)}
                >
                  <PlusSvg />
                </div>
              </div>,
            );
          } else {
            acc.push(
              <button
                key={p.name}
                className={`
                  transition-colors ease-linear delay-[50] duration-100
                  flex justify-center items-center gap-2
                  cursor-pointer active:cursor-grabbing
                  px-[10px] py-[6px] rounded-[8px] shadow-sm
                  outline-transparent focus:outline-blue/50
                  ${
                    activePage === p.name
                      ? "bg-pure-white text-dark"
                      : "bg-gray-faint/15 hover:bg-gray-faint/35 text-gray-darker"
                  }
                `}
                onClick={() => setActivePage(p.name)}
              >
                <div className="flex justify-center items-center min-w-5 min-h-5">
                  {getIconSvg(p)}
                </div>
                <span>{p.label}</span>
              </button>,
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
