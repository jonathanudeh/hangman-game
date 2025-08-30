import { type Dispatch, type SetStateAction } from "react";

interface ChildComponentProps {
  onIsHelpShowing: Dispatch<SetStateAction<boolean>>;
}

function HelpModal({ onIsHelpShowing }: ChildComponentProps) {
  return (
    <div className="fixed w-full h-screen flex items-center justify-center z-2">
      <div className="absolute w-full h-screen inset-0 bg-black/30 z-3"></div>

      <div className="bg-[#C47C31] w-80 md:w-150 h-140 md:h-120 flex flex-col items-center justify-start rounded-2xl z-5">
        <div className="relative text-white w-full h-19 flex items-center justify-center border-b-2 border-b-[#B0670B] p-2 text-2xl">
          HELP
          <button
            className="absolute right-4"
            onClick={() => onIsHelpShowing(() => false)}
          >
            <img
              src="/src/assets/images/icons/cancel-btn.svg"
              alt="A cancel button"
              className="w-10 h-10"
            />
          </button>
        </div>

        <div
          className="bg-red- w-full h-2/2 p-4 text-white overflow-y-scroll flex flex-col gap-3"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <h1 className="text-2xl font-bold">How to Play</h1>
          <p>
            Welcome to the Hangman game! Who has not played this game in school?
          </p>
          <p>
            {" "}
            Will you be able to find the secret word before the man get hanged?
            If you can't find a word, don't worry, you can use hints that will
            help you discover the word.
          </p>{" "}
          <h1 className="text-2xl font-bold">WAIT!, THERE'S MORE!</h1>
          <p>
            There are three game modes which is you can change according to your
            skill level.
          </p>
          <p>
            The difficulty is increasing step by step according to levels. You
            can up your level by win the game five times.
          </p>
          <h2 className="text-xl font-bold">Just one more thing</h2>
          <p>Enjoy !!!</p>
        </div>
      </div>
    </div>
  );
}

export default HelpModal;
