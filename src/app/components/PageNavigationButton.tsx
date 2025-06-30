import { useState, useRef, useEffect } from "react";

import type { PageNavItem } from "@/store/pageNavigationSlice";

import InfoSvg from "@/assets/info.svg";
import FileSvg from "@/assets/file.svg";
import CheckSvg from "@/assets/check.svg";
import DotsSvg from "@/assets/dots.svg";

import FlagSvg from "@/assets/flag.svg";
import PencilSvg from "@/assets/pencil.svg";
import ClipboardSvg from "@/assets/clipboard.svg";
import DuplicateSvg from "@/assets/duplicate.svg";
import TrashSvg from "@/assets/trash.svg";

import { useBoundStore } from "@/store/useStore";
import { useShallow } from "zustand/react/shallow";

interface PageNavigationButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  page: PageNavItem;
  isActivePage: boolean;
  index: number;
}

export default function PageNavigationButton({
  page: p,
  isActivePage,
  index,
  className,
  ...rest
}: PageNavigationButtonProps) {
  const [pages, setPageOrder, removePage] = useBoundStore(
    useShallow((state) => [
      state.pageNavigation.pages,
      state.setPageOrder,
      state.removePage,
    ]),
  );

  const [isContextMenuOpen, setIsContextMenuOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        ref.current &&
        event.target instanceof Node &&
        !ref.current.contains(event?.target)
      ) {
        setIsContextMenuOpen(false);
      }
    }

    if (isContextMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isContextMenuOpen]);

  const getIconSvg = (page: PageNavItem) => {
    if (page.icon === "info")
      return (
        <InfoSvg
          className={`${isActivePage ? "text-orange" : "text-gray hover:text-gray"}`}
        />
      );
    if (page.icon === "file") return <FileSvg />;
    if (page.icon === "check")
      return (
        <CheckSvg
          className={`${isActivePage ? "text-green-600" : "text-gray hover:text-gray"}`}
        />
      );
  };

  const openContextMenu = () => {
    setIsContextMenuOpen(true);
  };

  const closeContextMenu = () => {
    setIsContextMenuOpen(false);
  };

  const setAsFirstPage = () => {
    console.log("INDEX:", index);
    if (index === 0) return;

    const rest = [...pages];
    rest.splice(index, 1);
    const newOrder = [p, ...rest];
    newOrder.map((pe, idx) => ({
      ...pe,
      position: idx,
    }));

    setPageOrder(newOrder);
    closeContextMenu();
  };

  const duplicatePage = () => {
    const newPages = [
      ...pages,
      {
        ...p,
        position: pages.length,
      },
    ];

    setPageOrder(newPages);
    closeContextMenu();
  };

  const deletePage = () => {
    removePage(index);
    closeContextMenu();
  };

  return (
    <button
      key={p.name}
      className={`
                  transition-colors ease-linear delay-[50] duration-100
                  flex justify-center items-center gap-2 relative
                  active:cursor-grabbing px-[10px] py-[6px] rounded-[8px]
                  shadow-sm border border-transparent z-10 
                  outline-transparent focus:outline-blue/50
                  ${
                    isActivePage
                      ? "bg-pure-white text-dark"
                      : "bg-gray-faint/15 hover:bg-gray-faint/35 text-gray-darker"
                  }
                  ${className}
                `}
      {...rest}
    >
      <div className="flex justify-center items-center min-w-5 min-h-5">
        {getIconSvg(p)}
      </div>
      <span className="text-sm">{p.label}</span>
      {isActivePage && (
        <DotsSvg
          className="w-4 h-4 text-gray-faint cursor-pointer active:text-gray-darker"
          onMouseDown={(e: Event) => {
            e.stopPropagation();
            return isContextMenuOpen ? closeContextMenu() : openContextMenu();
          }}
        />
      )}

      {isContextMenuOpen && (
        <div
          ref={ref}
          className={`
          absolute bottom-[calc(100%+10px)] left-0 w-[240px]
          rounded-[12px] bg-white shadow-md overflow-hidden
        `}
        >
          <h6
            className={`
              p-3 text-md font-medium text-dark bg-cream border-b
              border-b-light-gray text-left
            `}
          >
            Settings
          </h6>
          <div
            className={`flex flex-col justify-start items-stretch p-3 gap-[14px]`}
          >
            <div
              className={`
                flex justify-start items-center gap-2 cursor-pointer
                ${index === 0 ? "opacity-50" : ""}
              `}
              onClick={setAsFirstPage}
            >
              <FlagSvg className="text-blue w-4 h-4" />
              <span>Set as first page</span>
            </div>
            <div className="flex justify-start items-center gap-2 cursor-pointer">
              <PencilSvg className="text-gray-faint w-4 h-4" />
              <span>Rename</span>
            </div>
            <div className="flex justify-start items-center gap-2 cursor-pointer">
              <ClipboardSvg className="text-gray-faint w-4 h-4" />
              <span>Copy</span>
            </div>
            <div
              className="flex justify-start items-center gap-2 cursor-pointer active:text-light-gray hover:text-gray"
              onClick={duplicatePage}
            >
              <DuplicateSvg className="text-gray-faint w-4 h-4" />
              <span>Duplicate</span>
            </div>
            <hr className="text-light-gray" />
            <div
              className="flex justify-start items-center gap-2 text-red cursor-pointer active:text-red/45 hover:text-red/75"
              onClick={deletePage}
            >
              <TrashSvg className="w-4 h-4 " />
              <span className="">Delete</span>
            </div>
          </div>
        </div>
      )}
    </button>
  );
}
