import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const useOutsideClick = <T extends HTMLElement>(handler?: () => void) => {
  const [isOpen, setIsOpen] = useState(false);
  const el = useRef<T>(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (isOpen && !el.current?.contains(e.target as T)) {
        close();
        handler?.();
      }
    };
    window.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("touchstart", handleOutsideClick);
    return () => {
      window.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [handler, isOpen, close]);

  return useMemo(() => ({ el, isOpen, open, close, toggle }), [isOpen, open, close, toggle]);
};
export default useOutsideClick;
