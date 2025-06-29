"use client";

import { useState } from "react";

const DEFAULT_PAGES = ["info", "details", "other", "ending"];

export default function PageNavigation() {
  const [pages, setPages] = useState<string[]>(DEFAULT_PAGES);
  const [activePage, setActivePage] = useState<string>(pages[0] || "");

  return (
    <div
      className={"bg-white w-full p-5 flex justify-start items-center gap-5"}
    >
      {pages.map((p) => {
        return (
          <div
            key={p}
            className={`
              cursor-pointer active:cursor-grabbing
              text-black border px-[10px] py-[6px] rounded-[8px]
              ${activePage === p ? "bg-pure-white" : "bg-gray hover:bg-gray-dark"}
            `}
            onClick={() => setActivePage(p)}
          >
            {p}
          </div>
        );
      })}
    </div>
  );
}
