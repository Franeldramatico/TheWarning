import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Button from '@/components/Button';
import { asset } from '@/lib/assets';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLHeadingElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const content = contentRef.current;
    const logo = logoRef.current;
    const headline = headlineRef.current;
    const subtitle = subtitleRef.current;
    const cta = ctaRef.current;
    const scrollIndicator = scrollIndicatorRef.current;
    const overlay = overlayRef.current;
    if (!section || !video || !content || !logo || !headline || !subtitle || !cta || !scrollIndicator || !overlay) return;

    // Wait for video
    const startAnimation = () => {
      const tl = gsap.timeline();

      // Logo letter-by-letter reveal
      const logoText = logo.textContent || '';
      logo.innerHTML = '';
      logoText.split('').forEach((char) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.filter = 'blur(16px)';
        span.style.transform = 'translateY(20px)';
        logo.appendChild(span);
      });

      tl.to(logo.children, {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 1,
        stagger: 0.04,
        ease: 'power3.out',
      }, 0.2);

      // Headline letter reveal
      const headlineText = headline.textContent || '';
      headline.innerHTML = '';
      headlineText.split('').forEach((char) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.filter = 'blur(12px)';
        headline.appendChild(span);
      });

      tl.to(headline.children, {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.8,
        stagger: 0.03,
        ease: 'power2.out',
      }, 0.8);

      // Subtitle
      tl.fromTo(subtitle,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6 },
        1.4
      );

      // CTA button
      tl.fromTo(cta,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' },
        1.6
      );

      // Scroll indicator
      tl.fromTo(scrollIndicator,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        2.0
      );
    };

    if (video.readyState >= 3) {
      startAnimation();
    } else {
      video.addEventListener('canplaythrough', startAnimation, { once: true });
    }

    // Parallax scroll
    gsap.to(video, {
      scale: 1.15,
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    gsap.to(content, {
      y: '-30vh',
      opacity: 0,
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '80% top',
        scrub: true,
      },
    });

    gsap.to(overlay, {
      opacity: 0.5,
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    // Hide scroll indicator on scroll
    const hideIndicator = () => {
      gsap.to(scrollIndicator, { opacity: 0, duration: 0.3 });
      window.removeEventListener('scroll', hideIndicator);
    };
    window.addEventListener('scroll', hideIndicator);

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section || st.trigger === section) st.kill();
      });
    };
  }, []);

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector('#music')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Video background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={asset('/videos/hero-concert.mp4')}
        autoPlay
        muted
        loop
        playsInline
        poster={asset('/images/gallery-05.jpg')}
      />

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: 'linear-gradient(180deg, rgba(5,5,5,0.4) 0%, rgba(5,5,5,0.2) 40%, rgba(5,5,5,0.7) 100%)',
        }}
      />

      {/* Strobe overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none bg-white"
        style={{
          opacity: 0,
          animation: 'strobe 10s infinite',
        }}
      />

      {/* Secondary dark overlay for parallax */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-[1] bg-vantablack pointer-events-none"
        style={{ opacity: 0 }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-[2] flex flex-col items-center justify-center h-full text-center px-6"
      >
        <h1
          ref={logoRef}
          className="font-bebas text-pure-white neon-glow"
          style={{
            fontSize: 'clamp(5rem, 14vw, 14rem)',
            letterSpacing: '0.08em',
            lineHeight: 1,
          }}
        >
          THE WARNING
        </h1>

        <h2
          ref={headlineRef}
          className="font-bebas text-pure-white neon-text mt-6 max-w-[800px]"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            letterSpacing: '0.06em',
            lineHeight: 1.1,
          }}
        >
          PARA TI, MI AMOR: TU BANDA FAVORITA, TU PASIÓN.
        </h2>

        <p
          ref={subtitleRef}
          className="font-inter mt-4 opacity-0"
          style={{
            fontSize: '1.125rem',
            letterSpacing: '0.04em',
            color: 'rgba(245,245,245,0.7)',
          }}
        >
          Un tributo especial a la música que nos une, hecho con todo mi corazón para ti. 💕
        </p>

        <div ref={ctaRef} className="mt-10 opacity-0">
          <Button variant="primary" onClick={handleCtaClick}>
            ESCUCHAR AHORA
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-3 opacity-0"
      >
        <div className="relative w-[1px] h-10 bg-pure-white/30">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-magenta-burst"
            style={{ animation: 'scroll-bounce 2s ease-in-out infinite' }}
          />
        </div>
        <span className="font-inter text-steel-gray text-[0.625rem] tracking-[0.15em] uppercase">
          DESPLAZA PARA ENTRAR
        </span>
      </div>
    </section>
  );
}
