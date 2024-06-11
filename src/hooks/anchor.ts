import { useRef } from "react";

export const useAnchor = <T extends HTMLDivElement>() => {
  const ref = useRef<T>(null);

  const handleAnchor = () => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return { handleAnchor, ref };
};
