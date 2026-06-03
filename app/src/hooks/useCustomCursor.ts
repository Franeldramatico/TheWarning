import { useEffect, useRef } from 'react';

export function useCustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;

    const ring = ringRef.current;
    const dot = cursorRef.current;
    if (!ring || !dot) return;

    const onMouseMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-cursor-hover]')
      ) {
        isHoveringRef.current = true;
        ring.style.width = '48px';
        ring.style.height = '48px';
        ring.style.borderColor = '#8B5CF6';
        dot.style.backgroundColor = '#FF0055';
        dot.style.boxShadow = '0 0 10px #FF0055';
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-cursor-hover]')
      ) {
        isHoveringRef.current = false;
        ring.style.width = '24px';
        ring.style.height = '24px';
        ring.style.borderColor = '#FF0055';
        dot.style.backgroundColor = '#F5F5F5';
        dot.style.boxShadow = 'none';
      }
    };

    let rafId: number;
    const animate = () => {
      posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.15;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.15;

      ring.style.transform = `translate(${posRef.current.x - (isHoveringRef.current ? 24 : 12)}px, ${posRef.current.y - (isHoveringRef.current ? 24 : 12)}px)`;
      dot.style.transform = `translate(${posRef.current.x - 2}px, ${posRef.current.y - 2}px)`;

      rafId = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    rafId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return { cursorRef, ringRef };
}
