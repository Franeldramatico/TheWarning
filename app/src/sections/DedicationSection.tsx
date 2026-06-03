import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionTitle from '@/components/SectionTitle';
import { Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function DedicationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    tl.from(heartRef.current, {
      scale: 0,
      opacity: 0,
      duration: 1,
      ease: 'back.out(1.7)',
    });

    tl.from(textRef.current?.children || [], {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
    }, '-=0.5');

    // Heartbeat animation
    gsap.to(heartRef.current, {
      scale: 1.1,
      duration: 0.6,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="dedication"
      className="relative bg-vantablack py-[120px] overflow-hidden"
    >
      {/* Warm background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '80%',
          height: '80%',
          background: 'radial-gradient(circle, rgba(255,0,85,0.1) 0%, rgba(139,92,246,0.05) 40%, transparent 70%)',
        }}
      />

      {/* Floating hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-magenta-burst/20"
            style={{
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 30}%`,
              fontSize: `${1 + (i % 3) * 0.5}rem`,
              animation: `float-heart ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.7}s`,
            }}
          >
            ♥
          </div>
        ))}
      </div>

      <div className="relative max-w-[900px] mx-auto px-6 text-center">
        <SectionTitle label="// 01" title="DEDICATORIA" align="center" />

        <div ref={heartRef} className="flex justify-center mb-10 text-magenta-burst">
          <Heart size={64} fill="currentColor" />
        </div>

        <div ref={textRef} className="space-y-6">
          <h3 className="font-bebas text-3xl md:text-5xl text-pure-white tracking-wide"
            style={{ textShadow: '0 0 30px rgba(255,0,85,0.2)' }}
          >
            PARA MI ARANXITA 💕
          </h3>
          <div className="flex items-center justify-center gap-4 text-steel-gray">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-magenta-burst/50" />
            <span className="font-inter text-xs tracking-[0.2em] uppercase">Con todo mi amor</span>
            <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-magenta-burst/50" />
          </div>
          <p className="font-inter text-lg md:text-xl text-pure-white/80 leading-relaxed max-w-2xl mx-auto">
            Esta página está dedicada a ti, mi amor. Eres la fan número uno de The Warning,
            y cada nota de esta banda resuena en mi corazón porque sé cuánto la amas.
          </p>
          <p className="font-inter text-base text-pure-white/60 leading-relaxed max-w-xl mx-auto">
            Tu energía, tu pasión por la música, tu sonrisa cuando tocan tu canción favorita…
            todo eso hizo que quisiera crear algo especial solo para ti. 
            Así que esto es para ti, Aranxita: que cada vez que veas esta página
            recuerdes lo mucho que te quiero y lo orgulloso que estoy de tenerte a mi lado.
          </p>
          <div className="pt-4">
            <p className="font-bebas text-3xl text-magenta-burst tracking-[0.2em]"
              style={{ textShadow: '0 0 30px rgba(255,0,85,0.3), 0 0 60px rgba(139,92,246,0.2)' }}
            >
              ERES MI ROCKSTAR FAVORITA
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
