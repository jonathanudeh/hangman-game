import { useHangman } from "../../contexts/HangManContext";
import type { Dispatch, SetStateAction } from "react";

interface ChildComponentProps {
  onSettings: Dispatch<SetStateAction<boolean>>;
  onPause?: Dispatch<SetStateAction<boolean>>;
}

function SettingsModal({ onSettings, onPause }: ChildComponentProps) {
  const { sound, music, dispatch } = useHangman();

  return (
    <div className="fixed w-full h-screen flex items-center justify-center z-15">
      {/* dark background overlay */}
      <div className="absolute w-full h-screen inset-0 bg-black/40 z-16"></div>

      {/* main modal */}
      <div className="bg-[#C47C31] w-70 h-52 md:w-100 md:h-70 flex-col items-center justify-start rounded-2xl z-17">
        <div className="relative bg-[#E68929] text-white w-full h-1/4 flex items-center justify-center border-b-2 border-b-[#B0670B] p-2 text-xl font-bold rounded-t-2xl">
          SETTINGS
          <button
            className="absolute right-4 cursor-pointer"
            onClick={() => {
              onSettings(false);
              onPause?.(true);
            }}
          >
            <img
              src="/assets/images/icons/cancel-btn.svg"
              alt="A cancel button"
              className="w-7 h-7"
            />
          </button>
        </div>

        <div className="w-full h-3/4 flex flex-col items-center justify-around p-4">
          {/* sound control */}
          <div className="w-full flex justify-between">
            <div className="flex gap-2 text-white font-bold">
              <img
                src="/assets/images/icons/settings-sound-icon.svg"
                alt="Sound icon"
              />
              <span>Sound</span>
            </div>
            <button
              className={`relative border-2 border-white w-20 flex items-center  text-white text-xs font-bold px-1 ${
                sound
                  ? "bg-[#147B05] justify-start"
                  : "bg-[#803B09] justify-end"
              }`}
              onClick={() => dispatch({ type: "SET_SOUND" })}
            >
              <div
                className={`w-10 h-full bg-yellow-400 absolute ${
                  sound ? "right-0" : "left-0"
                }`}
              ></div>
              <span>{sound ? "ON" : "OFF"}</span>
            </button>
          </div>

          {/* music control */}
          <div className="w-full flex justify-between">
            <div className="flex gap-2 text-white font-bold ">
              <img src="/assets/images/icons/music-icon.svg" alt="Sound icon" />
              <span>Music</span>
            </div>
            <button
              className={`relative border-2 border-white w-20 flex items-center  text-white text-xs font-bold px-1 ${
                music
                  ? "bg-[#147B05] justify-start"
                  : "bg-[#803B09] justify-end"
              }`}
              onClick={() => dispatch({ type: "SET_MUSIC" })}
            >
              <div
                className={`w-10 h-full bg-yellow-400  absolute ${
                  music ? "right-0" : "left-0"
                }`}
              ></div>
              <span>{music ? "ON" : "OFF"}</span>
            </button>
          </div>
        </div>
        {/*  */}
      </div>
    </div>
  );
}

export default SettingsModal;
