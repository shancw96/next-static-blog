import { useEffect, useMemo } from "react";

const HotkeyDict: { [key: string]: number } = {
  backspace: 8,
  tab: 9,
  enter: 13,
  shift: 16,
  ctrl: 17,
  alt: 18,
  command: 91,
  "caps-lock": 20,
  escape: 27,
  space: 32,
  "page-down": 34,
  end: 35,
  "arrow-left": 37,
  "arrow-up": 38,
  "arrow-right": 39,
  "arrow-down": 40,
  insert: 45,
  delete: 46,
  "0": 48,
  "1": 49,
  "2": 50,
  "3": 51,
  "4": 52,
  "5": 53,
  "6": 54,
  "7": 55,
  "8": 56,
  "9": 57,
  "numpad-0": 96,
  "numpad-1": 97,
  "numpad-2": 98,
  "numpad-3": 99,
  "numpad-4": 100,
  "numpad-5": 101,
  "numpad-6": 102,
  "numpad-7": 103,
  "numpad-8": 104,
  "numpad-9": 105,
  a: 65,
  b: 66,
  c: 67,
  d: 68,
  e: 69,
  f: 70,
  g: 71,
  h: 72,
  i: 73,
  j: 74,
  k: 75,
  l: 76,
  m: 77,
  n: 78,
  o: 79,
  p: 80,
  q: 81,
  r: 82,
  s: 83,
  t: 84,
  u: 85,
  v: 86,
  w: 87,
  x: 88,
  y: 89,
  z: 90
};
class KeyManager {
  queue: Set<number>;
  target: number[];
  constructor(
    combineAlias: string,
    hotKeyDict: { [key: string]: number } = HotkeyDict
  ) {
    this.queue = new Set();
    this.target = KeyManager.extractKeyAlias(combineAlias, hotKeyDict);
  }
  get isValid(): boolean {
    return (
      this.target.every((targetKeyCode) => this.queue.has(targetKeyCode)) &&
      this.queue.size === this.target.length
    );
  }
  public add(keyCode: number) {
    this.queue.add(keyCode);
  }
  public remove(keyCode: number) {
    this.queue.delete(keyCode);
  }
  public reset() {
    this.queue.clear();
  }

  static extractKeyAlias(
    combineAlias: string,
    hotKeyDict: { [key: string]: number }
  ) {
    return combineAlias
      .replace(/\s/g, "")
      .split("+")
      .map((keyAlias) => {
        if (isNaN(hotKeyDict[keyAlias])) {
          throw new Error("nonsupport key alias");
        }
        return hotKeyDict[keyAlias];
      });
  }
}
/**
 *
 * @param combineAlias key + key + key + ... + key
 * @param callback 回调函数
 */
export function useHotKey(
  combineAlias: string,
  callback: () => void
): KeyManager {
  const keyManager = useMemo(() => {
    return new KeyManager(combineAlias);
  }, [combineAlias]);
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      keyManager.add(e.keyCode);
      if (keyManager.isValid) {
        callback?.();
      }
    }
    function handleKeyUp(e: KeyboardEvent) {
      keyManager.remove(e.keyCode);
    }
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [keyManager, callback]);
  return keyManager;
}
