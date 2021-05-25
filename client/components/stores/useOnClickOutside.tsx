import React, { RefObject, useEffect } from "react";

const useOnClickOutside = (ref: RefObject<any>, onClick: (event: MouseEvent) => void) => {
  const onMouseDownListener = (event: MouseEvent) => {
    if (!ref.current || ref.current.contains(event.target)) return;

    onClick(event);
  };

  useEffect(() => {
    document.addEventListener("mousedown", onMouseDownListener);

    return () => {
      document.removeEventListener("mousedown", onMouseDownListener);
    };
  }, [ref, onClick]);
};

export default useOnClickOutside;
