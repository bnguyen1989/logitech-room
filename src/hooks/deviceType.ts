import { useState, useEffect } from "react";

export const useDeviceType = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDeviceType = () => {
      const isMobileWidth = window.innerWidth <= 992;
      setIsMobile(isMobileWidth);
    };

    checkDeviceType();

    window.addEventListener("resize", checkDeviceType);
    window.addEventListener("orientationchange", checkDeviceType);

    return () => {
      window.removeEventListener("resize", checkDeviceType);
      window.removeEventListener("orientationchange", checkDeviceType);
    };
  }, []);

  return {
    isMobile,
  };
};
