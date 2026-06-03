import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionTitleProps {
  label: string;
  title: string;
  align?: 'left' | 'center';
}

export default function SectionTitle({ label, title, align = 'left' }: SectionTitleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const titleEl = titleRef.current;
    const line = lineRef.current;
    if (!container || !titleEl || !line) return;

    // Split title into characters
    const text = titleEl.textContent || '';
    titleEl.innerHTML = '';
    const chars: HTMLSpanElement[] = [];

    text.split('').forEach((char) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      span.style.filter = 'blur(12px)';
      span.style.opacity = '0';
      titleEl.appendChild(span);
      chars.push(span);
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    // Label fade in
    const labelEl = container.querySelector('.section-label');
    if (labelEl) {
      gsap.set(labelEl, { opacity: 0, y: 10 });
      tl.to(labelEl, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    }

    // Character blur reveal
    tl.to(
      chars,
      {
        filter: 'blur(0px)',
        opacity: 1,
        duration: 0.6,
        stagger: 0.04,
        ease: 'power2.out',
      },
      '-=0.2'
    );

    // Accent line draw
    tl.to(
      line,
      {
        scaleX: 1,
        duration: 0.5,
        ease: 'power2.out',
      },
      '-=0.2'
    );

    return () => {
      tl.kill();
    };
  }, [title]);

  return (
    <div
      ref={containerRef}
      className={`mb-16 ${align === 'center' ? 'text-center flex flex-col items-center' : ''}`}
    >
      <span className="section-label font-inter text-xs tracking-[0.1em] text-steel-gray uppercase block mb-3">
        {label}
      </span>
      <h2
        ref={titleRef}
        className="font-bebas text-pure-white uppercase neon-text"
        style={{
          fontSize: 'clamp(3rem, 6vw, 5rem)',
          letterSpacing: '0.05em',
        }}
      >
        {title}
      </h2>
      <div
        ref={lineRef}
        className="w-[60px] h-[2px] bg-magenta-burst mt-4"
        style={{
          transformOrigin: 'left',
          transform: 'scaleX(0)',
        }}
      />
    </div>
  );
}
