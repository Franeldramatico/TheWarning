import { useCustomCursor } from '@/hooks/useCustomCursor';

export default function CustomCursor() {
  const { cursorRef, ringRef } = useCustomCursor();

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]" style={{ mixBlendMode: 'difference' }}>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-6 h-6 rounded-full border border-magenta-burst transition-all duration-200 ease-out"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-1 h-1 rounded-full bg-pure-white"
        style={{ willChange: 'transform' }}
      />
    </div>
  );
}
