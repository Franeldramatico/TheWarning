import '@fontsource/bebas-neue/400.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';

import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import CustomCursor from '@/components/CustomCursor';
import BackgroundParticles from '@/components/BackgroundParticles';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HeroSection from '@/sections/HeroSection';
import DedicationSection from '@/sections/DedicationSection';
import BandSection from '@/sections/BandSection';
import DiscographySection from '@/sections/DiscographySection';
import TourSection from '@/sections/TourSection';
import GallerySection from '@/sections/GallerySection';

function App() {
  useSmoothScroll();

  useEffect(() => {
    const timer = setTimeout(() => {
      Swal.fire({
        title: '💕 ¡Para ti, mi amor! 💕',
        html: `
          <div style="font-family: 'Inter', sans-serif; line-height: 1.8;">
            <p style="font-size: 1.15rem; color: #e2e8f0; margin-bottom: 1rem;">
              Este sitio está hecho especialmente para ti, Aranxita 💖
            </p>
            <p style="font-size: 1rem; color: #94a3b8; margin-bottom: 1rem;">
              Cada pixel, cada nota, cada destello de luz fue pensado para ti.
              Porque mereces un lugar tan único y especial como lo eres tú.
            </p>
            <p style="font-size: 1.05rem; color: #FF0055; font-weight: 500; margin-top: 1rem;">
              Eres mi rockstar favorita. 🌟
            </p>
            <p style="font-size: 0.9rem; color: #64748b; margin-top: 0.8rem;">
              — Con todo mi corazón ❤️
            </p>
          </div>
        `,
        background: '#0a0a0f',
        color: '#f8fafc',
        icon: undefined,
        showConfirmButton: true,
        confirmButtonText: '💫 Entrar',
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
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-vantablack text-pure-white overflow-x-hidden">
      {/* Global layers */}
      <BackgroundParticles />
      <CustomCursor />
      <Navigation />

      {/* Main content */}
      <main className="relative z-[1]">
        <HeroSection />
        <DedicationSection />
        <BandSection />
        <DiscographySection />
        <TourSection />
        <GallerySection />
        <Footer />
      </main>
    </div>
  );
}

export default App;
