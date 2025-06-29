import PlusSvg from "@/assets/plus.svg";

interface GapHiddenButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  isHovered: boolean;
  onBtnClick: () => void;
}

export default function GapHiddenButton({
  isHovered,
  onBtnClick,
  ...rest
}: GapHiddenButtonProps) {
  return (
    <div
      className={`
                  transition-all delay-75 duration-150 ease-in-out
                  flex justify-center items-center min-h-8 ${
                    isHovered ? "min-w-10" : "min-w-5"
                  }
                `}
      {...rest}
    >
      <div
        className={`
                    shadow-sm cursor-pointer min-w-4 min-h-4 text-black bg-white 
                    rounded-full justify-center items-center p-1 ${
                      isHovered ? "flex" : "hidden"
                    }
                  `}
        onClick={() => onBtnClick()}
      >
        <PlusSvg />
      </div>
    </div>
  );
}
