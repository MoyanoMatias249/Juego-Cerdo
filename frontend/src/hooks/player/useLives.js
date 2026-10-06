// src/hooks/player/useLives.js

import { useState, useRef, useCallback } from 'react';
import useGameSounds from '../useGameSounds';
 
const LIVES_BY_DIFFICULTY = {
  easy:   10,
  normal: 6,
  hard:   2,
};
 
function useLives(onGameOver, planeRef, difficulty = 'normal') {
  const initialLives = LIVES_BY_DIFFICULTY[difficulty] ?? 6;
 
  const [lives,    setLives]    = useState(initialLives);
  const [isImmune, setIsImmune] = useState(false);
  const [blink,    setBlink]    = useState(false);
 
  const isImmuneRef   = useRef(false);
  const blinkTimerRef = useRef(null);
  const onGameOverRef = useRef(onGameOver);
  onGameOverRef.current = onGameOver;
 
  const { playPigHurt } = useGameSounds();
  const playPigHurtRef  = useRef(playPigHurt);
  playPigHurtRef.current = playPigHurt;
 
  // Cancela cualquier blink en curso y restaura la inmunidad a false.
  // Usado internamente y desde Game.jsx (por ejemplo al activar un power-up
  // que interrumpe un blink a mitad, lo que dejaría isImmuneRef en true forever).
  const cancelBlink = useCallback(() => {
    if (blinkTimerRef.current) {
      clearInterval(blinkTimerRef.current);
      blinkTimerRef.current = null;
    }
    setBlink(false);
    isImmuneRef.current = false;
    setIsImmune(false);
  }, []);
 
  const triggerDamage = useCallback(() => {
    if (isImmuneRef.current) return;
 
    playPigHurtRef.current?.();
 
    setLives((prev) => {
      const newLives = Math.max(prev - 1, 0);
      if (newLives === 0) onGameOverRef.current?.();
      return newLives;
    });
 
    isImmuneRef.current = true;
    setIsImmune(true);
 
    if (blinkTimerRef.current) clearInterval(blinkTimerRef.current);
 
    // 8 ciclos × 250ms = 2000ms de inmunidad post-daño
    let blinkCount = 0;
    blinkTimerRef.current = setInterval(() => {
      setBlink((prev) => !prev);
      blinkCount++;
      if (blinkCount >= 8) {
        clearInterval(blinkTimerRef.current);
        blinkTimerRef.current = null;
        setBlink(false);
        isImmuneRef.current = false;
        setIsImmune(false);
      }
    }, 250);
  }, []);
 
  // Setea inmunidad de forma sincrónica (usado por power-up invulnerable).
  // Al activar inmunidad desde afuera, cancela el blink pendiente para que
  // isImmuneRef no quede en un estado inconsistente.
  const setIsImmuneSync = useCallback((value) => {
    isImmuneRef.current = value;
    setIsImmune(value);
    if (blinkTimerRef.current) {
      clearInterval(blinkTimerRef.current);
      blinkTimerRef.current = null;
      setBlink(false);
    }
  }, []);
 
  const resetLives = useCallback(() => {
    setLives(LIVES_BY_DIFFICULTY[difficulty] ?? 6);
    cancelBlink();
  }, [difficulty, cancelBlink]);
 
  return {
    lives,
    setLives,
    resetLives,
    initialLives,
    isImmune,
    isImmuneRef,
    blinkTimerRef,
    setIsImmune: setIsImmuneSync,
    blink,
    triggerDamage,
    cancelBlink,
  };
}
 
export default useLives;