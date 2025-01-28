import { useRef } from "react";

export const useAnchor = <T extends HTMLDivElement>() => {
  const ref = useRef<T>(null);

  const handleBottomAnchor = () => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };
  const handleTopAnchor = () => {
     
    if (ref.current) {
       
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return { handleBottomAnchor, handleTopAnchor, ref };
};
