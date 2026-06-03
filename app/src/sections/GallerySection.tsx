import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import SectionTitle from '@/components/SectionTitle';

gsap.registerPlugin(ScrollTrigger);

const galleryImages = [
  { src: '/images/gallery-01.jpg', aspect: '2/3' },
  { src: '/images/gallery-02.jpg', aspect: '3/2' },
  { src: '/images/gallery-03.jpg', aspect: '2/3' },
  { src: '/images/gallery-04.jpg', aspect: '1/1' },
  { src: '/images/gallery-05.jpg', aspect: '2/3' },
  { src: '/images/gallery-06.jpg', aspect: '1/1' },
  { src: '/images/gallery-07.jpg', aspect: '1/1' },
  { src: '/images/gallery-08.jpg', aspect: '2/3' },
  { src: '/images/gallery-09.jpg', aspect: '1/1' },
  { src: '/images/gallery-10.jpg', aspect: '2/3' },
];

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const lightboxImgRef = useRef<HTMLImageElement>(null);
  const thumbRef = useRef<DOMRect | null>(null);

  // Shatter entrance animation
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const images = section.querySelectorAll('.gallery-item');
    const indices = Array.from({ length: images.length }, (_, i) => i);
    // Random order
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    indices.forEach((idx, i) => {
      const img = images[idx];
      gsap.set(img, {
        opacity: 0,
        scale: 0.8,
        filter: 'brightness(2) blur(20px)',
      });

      tl.to(img, {
        opacity: 1,
        scale: 1,
        filter: 'brightness(1) blur(0px)',
        duration: 0.8,
        ease: 'power3.out',
      }, i * 0.1);
    });

    return () => { tl.kill(); };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    };

    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, lightboxIndex]);

  const openLightbox = useCallback((index: number, el: HTMLDivElement) => {
    thumbRef.current = el.getBoundingClientRect();
    setLightboxIndex(index);
    setLightboxOpen(true);

    // Animate from thumbnail to center
    requestAnimationFrame(() => {
      const img = lightboxImgRef.current;
      if (!img || !thumbRef.current) return;

      const thumb = thumbRef.current;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Calculate target size (fit within 90vw, 85vh)
      const maxW = vw * 0.9;
      const maxH = vh * 0.85;
      const imgAspect = galleryImages[index].aspect === '16/9' ? 16/9 :
        galleryImages[index].aspect === '3/2' ? 3/2 :
        galleryImages[index].aspect === '2/3' ? 2/3 :
        galleryImages[index].aspect === '1/1' ? 1 : 3/2;

      let targetW = maxW;
      let targetH = targetW / imgAspect;
      if (targetH > maxH) {
        targetH = maxH;
        targetW = targetH * imgAspect;
      }

      const targetX = (vw - targetW) / 2;
      const targetY = (vh - targetH) / 2;

      // Start from thumbnail position
      gsap.fromTo(img,
        {
          x: thumb.left - targetX,
          y: thumb.top - targetY,
          width: thumb.width,
          height: thumb.height,
          opacity: 0,
        },
        {
          x: 0,
          y: 0,
          width: targetW,
          height: targetH,
          opacity: 1,
          duration: 0.5,
          ease: 'power3.inOut',
        }
      );
    });
  }, []);

  const closeLightbox = useCallback(() => {
    const img = lightboxImgRef.current;
    if (img) {
      gsap.to(img, {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => setLightboxOpen(false),
      });
    } else {
      setLightboxOpen(false);
    }
  }, []);

  const navigate = useCallback((dir: number) => {
    setLightboxIndex((prev) => {
      const next = prev + dir;
      if (next < 0) return galleryImages.length - 1;
      if (next >= galleryImages.length) return 0;
      return next;
    });
  }, []);

  const formatIndex = (n: number) => String(n + 1).padStart(2, '0');

  return (
    <>
      <section
        ref={sectionRef}
        id="gallery"
        className="relative bg-vantablack pt-[120px] pb-20 overflow-hidden"
        style={{ contain: 'layout style paint' }}
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <SectionTitle label="// 05" title="GALERÍA" />

          {/* Masonry grid */}
          <div
            className="columns-1 md:columns-2 lg:columns-3 gap-4"
          >
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className="gallery-item break-inside-avoid mb-4 relative overflow-hidden rounded overflow-hidden cursor-pointer group"
                onClick={(e) => openLightbox(i, e.currentTarget)}
                data-cursor-hover
              >
                <img
                  src={img.src}
                  alt={`The Warning concert ${i + 1}`}
                  className="w-full object-cover transition-all duration-400 group-hover:scale-[1.03] group-hover:brightness-110"
                  style={{ aspectRatio: img.aspect }}
                  loading="lazy"
                />

                {/* Magenta overlay on hover */}
                <div className="absolute inset-0 bg-magenta-burst/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* View icon */}
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <div
                    className="w-12 h-12 rounded-full bg-vantablack/60 flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-300"
                    style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                  >
                    <ZoomIn size={20} className="text-pure-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: 'rgba(5,5,5,0.95)' }}
          onClick={closeLightbox}
        >
          {/* Counter */}
          <div className="absolute top-6 right-6 font-inter text-sm text-steel-gray z-10">
            {formatIndex(lightboxIndex)} / {formatIndex(galleryImages.length - 1)}
          </div>

          {/* Close button */}
          <button
            className="absolute top-6 left-6 text-pure-white hover:text-magenta-burst transition-colors duration-300 z-10"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <X size={32} />
          </button>

          {/* Navigation arrows */}
          <button
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-steel-gray hover:text-pure-white transition-colors duration-300 z-10"
            onClick={(e) => { e.stopPropagation(); navigate(-1); }}
            aria-label="Previous image"
          >
            <ChevronLeft size={48} />
          </button>
          <button
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-steel-gray hover:text-pure-white transition-colors duration-300 z-10"
            onClick={(e) => { e.stopPropagation(); navigate(1); }}
            aria-label="Next image"
          >
            <ChevronRight size={48} />
          </button>

          {/* Image */}
          <img
            ref={lightboxImgRef}
            src={galleryImages[lightboxIndex].src}
            alt={`The Warning concert ${lightboxIndex + 1}`}
            className="object-contain"
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
