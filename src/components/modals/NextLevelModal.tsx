import { useHangman } from "../../contexts/HangManContext";
import type { Dispatch, SetStateAction } from "react";

interface ChildComponentProps {
  onNextLevel: Dispatch<SetStateAction<boolean>>;
}

function NextLevelModal({ onNextLevel }: ChildComponentProps) {
  const { level, dispatch } = useHangman();

  function goToNextLevel() {
    onNextLevel(false);
    dispatch({ type: "NEXT_GAME" });
  }

  return (
    <div className="fixed w-full h-screen flex items-center justify-center z-15">
      {/* dark background overlay */}
      <div className="absolute w-full h-screen inset-0 bg-black/40 z-16"></div>

      {/* main modal */}
      <div className="bg-[#C47C31] w-85 h-77 md:w-100 md:h-70 flex-col items-center justify-start rounded-2xl z-17">
        <div className="relative bg-[#E68929] text-white w-full h-1/4 flex items-center justify-center border-b-2 border-b-[#B0670B] p-2 text-xl font-bold rounded-t-2xl">
          LEVEL UP
          <button
            className="absolute right-4 cursor-pointer"
            onClick={() => onNextLevel(false)}
          >
            <img
              src="/src/assets/images/icons/cancel-btn.svg"
              alt="A cancel button"
              className="w-10 h-10"
            />
          </button>
        </div>

        <div className="w-full h-3/4 flex flex-col items-center justify-between p-4">
          <span className="text-white font-bold text-2xl">
            CONGRATULATIONS !
          </span>

          <div className="flex w-full items-center  justify-center gap-2">
            <div className="bg-[url('/src/assets/images/icons/prev-and-next-level-pad.svg')] w-21 h-21 text-white font-bold flex items-center justify-center text-4xl">
              {" "}
              {level < 10 ? `0${level - 1}` : level - 1}
            </div>
            <img
              src="/src/assets/images/icons/arrow.svg"
              alt="A circlular pad"
              className="w-15 h-15"
            />
            <div className="bg-[url('/src/assets/images/icons/prev-and-next-level-pad.svg')] w-21 h-21 text-white font-bold flex items-center justify-center text-4xl">
              {" "}
              {level < 10 ? `0${level}` : level}
            </div>
          </div>

          <button
            className="relative cursor-pointer"
            onClick={() => goToNextLevel()}
          >
            <img
              src="/src/assets/images/icons/difficulty-board.svg"
              alt="a booard"
              className="w-44 h-13"
            />
            <span className="absolute font-bold text-white text-2xl left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
              OK
            </span>
          </button>
        </div>
        {/*  */}
      </div>
    </div>
  );
}

export default NextLevelModal;
