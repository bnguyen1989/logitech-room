import React, { useEffect } from "react";

export const MunchkinScript: React.FC = () => {
  useEffect(() => {
    const initMunchkin = () => {
      if (!window.didInit) {
        window.didInit = true;
        window.Munchkin.init("201-WGH-889");
      }
    };

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = "//munchkin.marketo.net/munchkin.js";
    script.onload = initMunchkin;
    script.onerror = () => {
      console.error("Failed to load the Munchkin script");
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
};
