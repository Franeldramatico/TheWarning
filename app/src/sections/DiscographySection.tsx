import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import SectionTitle from '@/components/SectionTitle';
import { asset } from '@/lib/assets';

gsap.registerPlugin(ScrollTrigger);

const albums = [
  {
    title: 'KEEP ME FED',
    year: '2024',
    type: 'ÁLBUM',
    image: asset('/images/album-keep-me-fed.jpg'),
  },
  {
    title: 'ERROR',
    year: '2022',
    type: 'ÁLBUM',
    image: asset('/images/album-error.jpg'),
  },
  {
    title: 'MAYDAY',
    year: '2021',
    type: 'EP',
    image: asset('/images/album-mayday.jpg'),
  },
  {
    title: 'QUEEN OF THE MURDER SCENE',
    year: '2018',
    type: 'ÁLBUM',
    image: asset('/images/album-queen-murder.jpg'),
  },
  {
    title: 'XXI CENTURY BLOOD',
    year: '2017',
    type: 'ÁLBUM',
    image: asset('/images/album-xxi-century.jpg'),
  },
  {
    title: 'ESCAPE THE MIND',
    year: '2015',
    type: 'EP',
    image: asset('/images/album-escape-mind.jpg'),
  },
];

const CARD_WIDTH = 320;
const CARD_GAP = 40;

export default function DiscographySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Drag state refs
  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const rafId = useRef(0);

  const getMaxOffset = useCallback(() => {
    const containerWidth = trackRef.current?.parentElement?.clientWidth || window.innerWidth;
    const totalWidth = albums.length * (CARD_WIDTH + CARD_GAP) - CARD_GAP;
    return Math.max(0, totalWidth - containerWidth + 80);
  }, []);

  const clampOffset = useCallback((offset: number) => {
    const max = getMaxOffset();
    if (offset > 0) return offset * 0.3;
    if (offset < -max) return -max + (offset + max) * 0.3;
    return offset;
  }, [getMaxOffset]);

  const applyOffset = useCallback((offset: number) => {
    if (!trackRef.current) return;
    trackRef.current.style.transform = `translateX(${offset}px)`;
  }, []);

  const snapToIndex = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, albums.length - 1));
    setActiveIndex(clamped);
    const targetOffset = -(clamped * (CARD_WIDTH + CARD_GAP));
    const max = getMaxOffset();
    const finalOffset = Math.max(-max, Math.min(0, targetOffset));

    gsap.to(currentX, {
      current: finalOffset,
      duration: 0.5,
      ease: 'power3.inOut',
      onUpdate: () => applyOffset(currentX.current),
    });
  }, [getMaxOffset, applyOffset]);

  const momentum = useCallback(() => {
    const max = getMaxOffset();

    if (Math.abs(velocity.current) > 0.5) {
      velocity.current *= 0.95;
      currentX.current += velocity.current;

      // Elastic bounce back
      if (currentX.current > 0) {
        currentX.current *= 0.8;
        velocity.current *= 0.5;
      }
      if (currentX.current < -max) {
        const over = currentX.current + max;
        currentX.current = -max + over * 0.8;
        velocity.current *= 0.5;
      }

      applyOffset(currentX.current);
      rafId.current = requestAnimationFrame(momentum);
    } else {
      // Snap
      const nearestIndex = Math.round(-currentX.current / (CARD_WIDTH + CARD_GAP));
      snapToIndex(nearestIndex);
    }
  }, [getMaxOffset, applyOffset, snapToIndex]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX - currentX.current;
    lastX.current = e.clientX;
    lastTime.current = Date.now();
    velocity.current = 0;
    cancelAnimationFrame(rafId.current);
    if (trackRef.current) trackRef.current.style.cursor = 'grabbing';
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const now = Date.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      velocity.current = (e.clientX - lastX.current) / dt * 16;
    }
    lastX.current = e.clientX;
    lastTime.current = now;

    const rawOffset = e.clientX - startX.current;
    currentX.current = clampOffset(rawOffset);
    applyOffset(currentX.current);
  }, [clampOffset, applyOffset]);

  const handlePointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = 'grab';

    // Spring back if overscrolled
    const max = getMaxOffset();
    if (currentX.current > 0) {
      gsap.to(currentX, {
        current: 0,
        duration: 0.4,
        ease: 'power2.out',
        onUpdate: () => applyOffset(currentX.current),
      });
      setActiveIndex(0);
      return;
    }
    if (currentX.current < -max) {
      gsap.to(currentX, {
        current: -max,
        duration: 0.4,
        ease: 'power2.out',
        onUpdate: () => applyOffset(currentX.current),
      });
      return;
    }

    rafId.current = requestAnimationFrame(momentum);
  }, [getMaxOffset, applyOffset, momentum]);

  const slide = useCallback((direction: number) => {
    snapToIndex(activeIndex + direction);
  }, [activeIndex, snapToIndex]);

  // Entrance animation
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll('.album-card');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    tl.from(cards, {
      opacity: 0,
      x: 100,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
    });

    return () => { tl.kill(); };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="music"
      className="relative bg-vantablack py-[120px] overflow-hidden"
      style={{ contain: 'layout style paint' }}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <SectionTitle label="// 03" title="DISCOGRAFÍA" />

        {/* Carousel */}
        <div className="relative">
          {/* Navigation arrows */}
          <button
            onClick={() => slide(-1)}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 items-center justify-center text-steel-gray hover:text-magenta-burst transition-colors duration-300"
            aria-label="Previous album"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={() => slide(1)}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 items-center justify-center text-steel-gray hover:text-magenta-burst transition-colors duration-300"
            aria-label="Next album"
          >
            <ChevronRight size={32} />
          </button>

          {/* Track */}
          <div className="overflow-hidden">
            <div
              ref={trackRef}
              className="flex gap-10 select-none"
              style={{ cursor: 'grab', touchAction: 'pan-y' }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {albums.map((album) => (
                <div
                  key={album.title}
                  className="album-card group flex-shrink-0"
                  style={{ width: CARD_WIDTH }}
                >
                  {/* Artwork */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
                    <img
                      src={album.image}
                      alt={album.title}
                      className="w-full h-full object-cover transition-all duration-400 group-hover:scale-[1.03]"
                      draggable={false}
                      loading="lazy"
                    />

                    {/* Hover glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        boxShadow: 'inset 0 0 30px rgba(255,0,85,0.3), 0 0 40px rgba(255,0,85,0.25), 0 8px 24px rgba(0,0,0,0.4)',
                      }}
                    />

                    {/* Play overlay */}
                    <div className="absolute inset-0 bg-vantablack/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div
                        className="w-14 h-14 rounded-full bg-magenta-burst/90 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300"
                        style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                      >
                        <Play size={20} className="text-pure-white ml-1" fill="white" />
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="mt-4">
                    <h3 className="font-bebas text-2xl text-pure-white tracking-[0.04em]">
                      {album.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="font-inter text-sm text-steel-gray">{album.year}</span>
                      <span className="font-inter text-xs text-magenta-burst tracking-[0.1em] uppercase">
                        {album.type}
                      </span>
                    </div>

                    {/* Streaming links - show on hover */}
                    <div className="flex items-center gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <a
                        href="#"
                        className="text-steel-gray hover:text-white transition-colors duration-200"
                        aria-label="Listen on Spotify"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DB954">
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                        </svg>
                      </a>
                      <a
                        href="#"
                        className="text-steel-gray hover:text-white transition-colors duration-200"
                        aria-label="Listen on Apple Music"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24">
                          <defs>
                            <linearGradient id="appleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#FA57C1" />
                              <stop offset="100%" stopColor="#F44336" />
                            </linearGradient>
                          </defs>
                          <circle cx="12" cy="12" r="12" fill="url(#appleGrad)" />
                          <path d="M15.97 5.04c-.53.63-1.38 1.12-2.22 1.05-.11-.88.35-1.78.82-2.36.53-.64 1.42-1.12 2.17-1.05.1.85-.28 1.76-.77 2.36zm-1.08 2.53c-.92-.05-1.71.53-2.22.53-.54 0-1.31-.51-2.17-.49-1.12.02-2.17.66-2.74 1.66-1.18 2.04-.31 5.07.83 6.72.56.79 1.22 1.68 2.09 1.65.84-.03 1.16-.54 2.18-.54 1.01 0 1.31.54 2.19.52.91-.02 1.48-.82 2.03-1.61.64-.92.9-1.81.91-1.86-.02-.02-1.76-.68-1.78-2.68-.02-1.67 1.38-2.48 1.44-2.51-.8-1.16-2.03-1.29-2.46-1.31-.02 0-.04-.01-.06-.01z" fill="white" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
