import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Swal from 'sweetalert2';

gsap.registerPlugin(ScrollTrigger);

const quickLinks = [
  { label: 'SITIO OFICIAL', href: 'https://www.thewarningband.com' },
  { label: 'INSTAGRAM', href: 'https://www.instagram.com/thewarningrockband/' },
  { label: 'YOUTUBE', href: 'https://www.youtube.com/@TheWarning' },
  { label: 'FACEBOOK', href: 'https://www.facebook.com/TheWarningRockBand' },
  { label: 'TIENDA', href: 'https://shop.thewarningband.com' },
];

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://instagram.com/thewarningband',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@thewarningband',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: 'Twitter/X',
    href: 'https://x.com/thewarningband',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'Spotify',
    href: 'https://open.spotify.com/artist/2eO8z3KUyZoYsNivoOruEw',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: 'https://tiktok.com/@thewarningband',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  function handleOpenLetter() {
    Swal.fire({
      title: 'Para Aranxita',
      html: `
        <div style="font-family: 'Inter', sans-serif; line-height: 1.8; text-align: left; max-width: 560px; margin: 0 auto;">
          <p style="font-size: 1rem; color: #e2e8f0; margin-bottom: 1rem;">
            Aranxita:
          </p>
          <p style="font-size: 1rem; color: #cbd5e1; margin-bottom: 1rem;">
            Hay canciones que no necesitan ser interpretadas para llegar al alma, y tu presencia es una de ellas. Cada dia que pasa me doy cuenta de que la musica que mas resuena no es la que suena en los escenarios, sino la que ocurre en los silencios compartidos contigo. En las risas espontaneas, en las miradas que lo dicen todo, en los momentos donde las palabras sobran porque el corazon ya entendio.
          </p>
          <p style="font-size: 1rem; color: #cbd5e1; margin-bottom: 1rem;">
            Construir este rincon digital para ti fue mi manera de decirte que no hay distancia que no pueda recorrer por verte sonreir. Cada linea de codigo, cada animacion, cada detalle visual lleva un pedazo de lo que siento por ti. Porque mereces un lugar tan extraordinario como lo que significas en mi vida.
          </p>
          <p style="font-size: 1rem; color: #cbd5e1; margin-bottom: 1rem;">
            No importa cuantas veces el mundo intente apagar la luz, yo voy a estar aqui para recordarte que brillas mas fuerte que cualquier estrella en el firmamento. Eres mi inspiracion, mi motivos, mi todo.
          </p>
          <p style="font-size: 1rem; color: #e2e8f0; margin-bottom: 0.5rem;">
            Te amo.
          </p>
          <p style="font-size: 0.9rem; color: #FF0055; font-weight: 500; margin-top: 1.5rem; text-align: right;">
            Siempre tuyo.
          </p>
        </div>
      `,
      background: '#0a0a0f',
      color: '#f8fafc',
      icon: undefined,
      showConfirmButton: true,
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#FF0055',
      buttonsStyling: false,
      customClass: {
        popup: 'swal-popup-custom',
        title: 'swal-title-custom',
        confirmButton: 'swal-confirm-custom',
      },
      backdrop: 'rgba(5,5,5,0.9)',
      allowOutsideClick: true,
      allowEscapeKey: true,
      showClass: {
        popup: 'swal-popup-visible',
      },
      hideClass: {
        popup: 'swal-popup-hidden',
      },
    });
  }

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footer,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    tl.from(footer.querySelectorAll('.footer-col'), {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
    });

    tl.from(
      footer.querySelectorAll('.social-icon'),
      {
        opacity: 0,
        scale: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'back.out(1.7)',
      },
      '-=0.3'
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <footer ref={footerRef} className="bg-vantablack border-t border-white/5 py-20 pb-10">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Logo & Tagline */}
          <div className="footer-col">
            <h3 className="font-bebas text-2xl text-pure-white tracking-[0.2em] mb-3">
              THE WARNING
            </h3>
            <p className="font-inter text-sm text-steel-gray italic">
              Tres hermanas. Un sonido imparable. Para Aranxita, con amor.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <nav className="grid grid-cols-2 gap-x-8 gap-y-3">
              {quickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bebas text-base text-steel-gray hover:text-magenta-burst transition-colors duration-300 tracking-wide"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Social icons */}
        <div className="flex justify-center gap-6 mb-12">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon text-steel-gray hover:text-magenta-burst hover:scale-110 transition-all duration-300"
              aria-label={social.name}
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Separator */}
        <div className="border-t border-white/5 pt-6">
          <p className="font-inter text-xs text-steel-gray text-center">
            &copy; 2026 THE WARNING. TODOS LOS DERECHOS RESERVADOS.
          </p>
          <p className="font-inter text-xs text-steel-gray/60 text-center mt-1">
            HECHO CON AMOR PARA ARANXITA EN XALAPA, MÉXICO.
          </p>
          <div className="flex justify-center mt-6">
            <button
              onClick={handleOpenLetter}
              className="font-bebas text-sm tracking-[0.15em] text-magenta-burst border border-magenta-burst/40 px-6 py-2 hover:bg-magenta-burst/10 hover:border-magenta-burst transition-all duration-300"
            >
              VER CARTA
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
