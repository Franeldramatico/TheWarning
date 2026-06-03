import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionTitle from '@/components/SectionTitle';
import Button from '@/components/Button';

gsap.registerPlugin(ScrollTrigger);

const tourDates = [
  { day: '19', month: 'MAY', year: '2026', venue: 'PH Live at Planet Hollywood', city: 'Las Vegas, NV', country: 'USA' },
  { day: '22', month: 'MAY', year: '2026', venue: 'Greek Theatre', city: 'Los Angeles, CA', country: 'USA' },
  { day: '29', month: 'MAY', year: '2026', venue: 'Moody Amphitheater', city: 'Austin, TX', country: 'USA' },
  { day: '10', month: 'JUN', year: '2026', venue: 'Radio City Music Hall', city: 'New York, NY', country: 'USA' },
  { day: '13', month: 'JUN', year: '2026', venue: 'Synovus Bank Amphitheater', city: 'Atlanta, GA', country: 'USA' },
  { day: '28', month: 'JUN', year: '2026', venue: 'Amager Bio', city: 'København', country: 'Denmark' },
];

export default function TourSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Sub-header animation
    const subHeader = section.querySelector('.tour-subheader');
    if (subHeader) {
      gsap.from(subHeader, {
        opacity: 0,
        x: -30,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    }

    // Row stagger entrance
    const rows = rowsRef.current.filter(Boolean);
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    rows.forEach((row, i) => {
      gsap.set(row, { opacity: 0, x: -40 });
      tl.to(row, {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: 'power3.out',
      }, i * 0.08);
    });

    return () => { tl.kill(); };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="tour"
      className="relative bg-vantablack py-[120px] overflow-hidden"
      style={{
        contain: 'layout style paint',
        backgroundImage: `linear-gradient(rgba(255,0,85,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,85,0.06) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }}
    >
      {/* Warm background glow */}
      <div
        ref={glowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '80%',
          height: '80%',
          background: 'radial-gradient(circle, rgba(255,0,85,0.08) 0%, rgba(139,92,246,0.04) 40%, transparent 70%)',
        }}
      />

      <div className="relative max-w-[1000px] mx-auto px-6 md:px-12 lg:px-20">
        <SectionTitle label="// 04" title="TOUR" />

        {/* Sub-header */}
        <div className="tour-subheader flex items-center gap-4 mb-10">
          <div className="w-12 h-[3px] bg-magenta-burst rounded-full" />
          <span className="font-bebas text-lg text-magenta-burst tracking-[0.15em]">
            NORTH AMERICA 2026
          </span>
        </div>

        {/* Tour dates list */}
        <div className="flex flex-col">
          {tourDates.map((date, i) => (
            <div
              key={`${date.venue}-${date.day}`}
              ref={(el) => { rowsRef.current[i] = el; }}
              className="group relative grid grid-cols-1 md:grid-cols-[100px_1fr_120px_140px] gap-4 items-center py-6 border-b border-white/[0.06] transition-all duration-300 hover:bg-[rgba(255,0,85,0.06)]"
              style={{ opacity: 0 }}
            >
              {/* Left accent line on hover */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-magenta-burst origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />

              {/* Date block */}
              <div className="flex md:flex-col items-baseline md:items-start gap-2 md:gap-0">
                <span
                  className="font-bebas transition-colors duration-300"
                  style={{
                    fontSize: 'clamp(2rem, 3vw, 3rem)',
                    lineHeight: 1,
                    color: '#F5F5F5',
                    textShadow: '0 0 20px rgba(255,0,85,0.1)',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.color = '#FF0055';
                    el.style.textShadow = '0 0 30px rgba(255,0,85,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.color = '#F5F5F5';
                    el.style.textShadow = '0 0 20px rgba(255,0,85,0.1)';
                  }}
                >
                  {date.day}
                </span>
                <div className="flex md:flex-col gap-1 md:gap-0">
                  <span className="font-inter text-sm text-magenta-burst tracking-[0.08em] uppercase">
                    {date.month}
                  </span>
                  <span className="font-inter text-xs text-white/50">{date.year}</span>
                </div>
              </div>

              {/* Venue & City */}
              <div>
                <h3
                  className="font-bebas tracking-[0.02em] transition-colors duration-300"
                  style={{
                    fontSize: 'clamp(1.25rem, 1.5vw, 1.5rem)',
                    color: '#F5F5F5',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FF0055';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#F5F5F5';
                  }}
                >
                  {date.venue}
                </h3>
                <p
                  className="font-inter text-sm transition-colors duration-300"
                  style={{ color: 'rgba(245,245,245,0.55)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'rgba(255,0,85,0.7)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(245,245,245,0.55)';
                  }}
                >
                  {date.city}
                </p>
              </div>

              {/* Country */}
              <span
                className="font-inter text-sm tracking-[0.04em] hidden md:block transition-colors duration-300"
                style={{ color: 'rgba(245,245,245,0.45)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'rgba(255,0,85,0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(245,245,245,0.45)';
                }}
              >
                {date.country}
              </span>

              {/* Ticket button */}
              <div className="md:text-right">
                <Button variant="ticket" href="#" className="w-full md:w-auto">
                  BOLETOS
                </Button>
              </div>

              {/* Sibling dim effect */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,0,85,0.02) 50%, transparent 100%)',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
