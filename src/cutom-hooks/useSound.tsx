import { useEffect, useRef } from "react";
import { useHangman } from "../contexts/HangManContext";

export const useSound = () => {
  const { sound, music, gameStatus } = useHangman();

  // audio refs
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const keyPressRef = useRef<HTMLAudioElement | null>(null);
  const hintRef = useRef<HTMLAudioElement | null>(null);
  const winRef = useRef<HTMLAudioElement | null>(null);
  const loseRef = useRef<HTMLAudioElement | null>(null);

  // initialize audio files once
  useEffect(() => {
    if (!backgroundMusicRef.current && music) {
      backgroundMusicRef.current = new Audio("/assets/sounds/background.mp3");
      backgroundMusicRef.current.loop = true;
      backgroundMusicRef.current.volume = 0.2;
    }

    if (!keyPressRef.current) {
      keyPressRef.current = new Audio("/assets/sounds/keypress.ogg");
      keyPressRef.current.volume = 0.5;
    }

    if (!hintRef.current) {
      hintRef.current = new Audio("/assets/sounds/hint.wav");
      hintRef.current.volume = 0.5;
    }

    if (!winRef.current) {
      winRef.current = new Audio("/assets/sounds/win.wav");
      winRef.current.volume = 0.6;
    }

    if (!loseRef.current) {
      loseRef.current = new Audio("/assets/sounds/lose.wav");
      loseRef.current.volume = 0.6;
    }
  }, [music]);

  // Handle background music
  useEffect(() => {
    if (!backgroundMusicRef.current) return;

    if (music) {
      backgroundMusicRef.current.currentTime = 0;
      backgroundMusicRef.current.play().catch(() => {});
    } else {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
    }
  }, [music]);

  //  win or lose sounds
  useEffect(() => {
    if (gameStatus === "won" && sound && winRef.current) {
      winRef.current.play().catch(() => {});
    } else if (gameStatus === "lost" && sound && loseRef.current) {
      loseRef.current.play().catch(() => {});
    }
  }, [gameStatus, sound]);

  const playKeyPress = () => {
    if (sound && keyPressRef.current) {
      keyPressRef.current.currentTime = 0;
      keyPressRef.current.play().catch(() => {});
    }
  };

  const playHint = () => {
    if (sound && hintRef.current) {
      hintRef.current.currentTime = 0;
      hintRef.current.play().catch(() => {});
    }
  };

  return {
    playKeyPress,
    playHint,
  };
};
