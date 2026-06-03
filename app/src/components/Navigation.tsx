import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { label: 'INICIO', href: '#home' },
  { label: 'DEDICATORIA', href: '#dedication' },
  { label: 'BANDA', href: '#band' },
  { label: 'MÚSICA', href: '#music' },
  { label: 'TOUR', href: '#tour' },
  { label: 'GALERÍA', href: '#gallery' },
];

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: '100vh top',
        end: '100vh top',
        onEnter: () => gsap.to(nav, { opacity: 1, duration: 0.4 }),
        onLeaveBack: () => gsap.to(nav, { opacity: 0, duration: 0.4 }),
      },
    });

    gsap.set(nav, { opacity: 0 });

    // Track active section
    const sections = ['home', 'band', 'music', 'tour', 'gallery'];
    sections.forEach((id) => {
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveSection(id),
        onEnterBack: () => setActiveSection(id),
      });
    });

    return () => {
      tl.kill();
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 md:px-12 lg:px-20"
        style={{
          background: 'rgba(5, 5, 5, 0.6)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 0, 85, 0.1)',
          opacity: 0,
        }}
      >
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
          className="font-bebas text-pure-white text-xl tracking-[0.15em] hover:text-magenta-burst transition-colors duration-300"
        >
          THE WARNING <span className="text-magenta-burst text-base">♥</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="group relative font-bebas text-sm tracking-[0.15em] text-steel-gray hover:text-magenta-burst transition-colors duration-300"
            >
              {link.label}
              <span
                className="absolute -bottom-1 left-0 h-[1px] bg-magenta-burst transition-transform duration-300 origin-center"
                style={{
                  width: '100%',
                  transform: activeSection === link.href.slice(1) ? 'scaleX(1)' : 'scaleX(0)',
                }}
              />
              <span className="absolute -bottom-1 left-0 h-[1px] w-full bg-magenta-burst transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-pure-white"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[100] bg-vantablack flex flex-col items-center justify-center transition-opacity duration-300 md:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          className="absolute top-5 right-6 text-pure-white"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X size={28} />
        </button>
        <div className="flex flex-col items-center gap-8">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="font-bebas text-4xl tracking-[0.15em] text-pure-white hover:text-magenta-burst transition-colors duration-300"
              style={{
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.3s ease ${i * 0.1}s, transform 0.3s ease ${i * 0.1}s`,
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
