import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionTitle from '@/components/SectionTitle';

gsap.registerPlugin(ScrollTrigger);

const members = [
  {
    name: 'DANY VILLARREAL',
    role: 'Voz & Guitarra',
    bio: 'La voz y la furia. Dany lidera el escenario con una presencia imparable, guitarra en mano y corazón en cada nota.',
    image: '/images/dany-portrait.jpg',
  },
  {
    name: 'PAU VILLARREAL',
    role: 'Batería & Voz',
    bio: 'El latido de la banda. Pau combina fuerza y precisión en la batería con una voz que eleva cada canción a otro nivel.',
    image: '/images/pau-portrait.jpg',
  },
  {
    name: 'ALE VILLARREAL',
    role: 'Bajo & Piano',
    bio: 'La profundidad del sonido. Ale ancla la música con líneas de bajo poderosas y una energía en el escenario que desafía su edad.',
    image: '/images/ale-portrait.jpg',
  },
];

export default function BandSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = cardsRef.current.filter(Boolean);

    // 3D flip entrance
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    cards.forEach((card, i) => {
      gsap.set(card, {
        opacity: 0,
        rotateY: 45,
        x: -60,
      });

      tl.to(
        card,
        {
          opacity: 1,
          rotateY: 0,
          x: 0,
          duration: 1,
          ease: 'power3.out',
        },
        i * 0.2
      );
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="band"
      className="relative bg-vantablack py-[120px] overflow-hidden"
      style={{ contain: 'layout style paint' }}
    >
      {/* Background radial gradient */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '80%',
          height: '80%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
          animation: 'led-pulse 6s ease-in-out infinite',
        }}
      />

      <div className="relative max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <SectionTitle label="// 02" title="BANDA" align="center" />

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 perspective-1000"
        >
          {members.map((member, i) => (
            <div
              key={member.name}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="group"
              style={{
                transformStyle: 'preserve-3d',
                opacity: 0,
              }}
            >
              {/* Image container */}
              <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-all duration-600 group-hover:scale-105 group-hover:brightness-110"
                  loading="lazy"
                />

                {/* Magenta gradient overlay at bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[30%] pointer-events-none"
                  style={{
                    background: 'linear-gradient(to top, rgba(255,0,85,0.15), transparent)',
                  }}
                />

                {/* Hover border lines */}
                <div className="absolute inset-0 pointer-events-none">
                  <span className="absolute top-0 left-0 w-full h-[2px] bg-magenta-burst origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-out" />
                  <span className="absolute top-0 right-0 w-[2px] h-full bg-magenta-burst origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-400 ease-out delay-75" />
                  <span className="absolute bottom-0 right-0 w-full h-[2px] bg-magenta-burst origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-out delay-150" />
                  <span className="absolute bottom-0 left-0 w-[2px] h-full bg-magenta-burst origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-400 ease-out delay-225" />
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: 'inset 0 0 40px rgba(255,0,85,0.2)' }}
                />
              </div>

              {/* Text block */}
              <div className="mt-6">
                <h3
                  className="font-bebas text-pure-white"
                  style={{
                    fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                    letterSpacing: '0.04em',
                  }}
                >
                  {member.name}
                </h3>
                <p className="font-inter text-sm text-magenta-burst tracking-[0.06em] uppercase mt-1">
                  {member.role}
                </p>
                <p className="font-inter text-base text-steel-gray leading-relaxed mt-3">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
