// src/hooks/useViewport.js
import { useEffect, useState } from "react";

export default function useViewport() {
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const onResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return {
    width: viewport.width,
    height: viewport.height,
    isMobile: viewport.width < 768,
    isTablet: viewport.width >= 768 && viewport.width < 1200,
    isDesktop: viewport.width >= 1200,
    isShortScreen: viewport.height < 850,
  };
}