import type { PageNavItem } from "@/store/pageNavigationSlice";

import InfoSvg from "@/assets/info.svg";
import FileSvg from "@/assets/file.svg";
import CheckSvg from "@/assets/check.svg";
import DotsSvg from "@/assets/dots.svg";

interface PageNavigationButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  page: PageNavItem;
  activePage: string;
}

export default function PageNavigationButton({
  page: p,
  activePage,
  ...rest
}: PageNavigationButtonProps) {
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
      {...rest}
    >
      <div className="flex justify-center items-center min-w-5 min-h-5">
        {getIconSvg(p)}
      </div>
      <span className="text-sm">{p.label}</span>
      {activePage === p.name && (
        <DotsSvg
          className="w-4 h-4 text-gray-faint cursor-pointer"
          onClick={() => console.log("open menu")}
        />
      )}
    </button>
  );
}
