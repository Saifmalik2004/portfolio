// src/hooks/use-section-in-view.jsx
import { useEffect, useState } from "react";

interface UseSectionInViewOptions {
  threshold?: number;
}

export function useSectionInView(
  ref: React.RefObject<Element>,
  threshold: number = 0.5
): boolean {
  const [inView, setInView] = useState<boolean>(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        setInView(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, threshold]);

  return inView;
}