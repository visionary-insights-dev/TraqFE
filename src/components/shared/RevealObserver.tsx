"use client";

import { useEffect, useRef } from "react";

interface RevealObserverProps {
  rootMargin?: string;
  threshold?: number | number[];
}

export function RevealObserver({
  rootMargin = "0px",
  threshold = 0.1,
}: RevealObserverProps = {}) {
  const handleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!handleRef.current) return;

    const element = handleRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-active");
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold]);

  return <div ref={handleRef} className="reveal" style={{ visibility: "hidden" }} />;
}