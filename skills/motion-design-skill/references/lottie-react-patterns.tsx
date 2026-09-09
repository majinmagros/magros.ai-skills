// lottie-react-patterns.tsx — Componentes React prontos (Button, Card, Modal, Loading, Icon)
// Requer: npm i lottie-react lottie-web
import { useState } from 'react';
import Lottie from 'lottie-react';
import buttonAnim from './button.json';
import cardAnim from './card.json';
import modalAnim from './modal.json';
import loadingAnim from './loading.json';
import iconAnim from './icon.json';

// Button — hover/tap com animação
export function AnimatedButton({ onClick, label }: { onClick: () => void; label: string }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Lottie animationData={buttonAnim} loop={hover} autoplay={hover} renderer="svg" style={{ width: 48, height: 48 }} />
      {label}
    </button>
  );
}

// Card — fade-in na montagem
export function AnimatedCard({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Lottie animationData={cardAnim} loop={false} autoplay={true} renderer="svg" />
      {children}
    </div>
  );
}

// Modal — entrada com spring (via CSS + Lottie)
export function AnimatedModal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" onClick={onClose}>
      <Lottie animationData={modalAnim} loop={false} autoplay={true} renderer="svg" />
      {children}
    </div>
  );
}

// Loading — loop infinito com cleanup
export function Loading({ size = 64 }: { size?: number }) {
  return <Lottie animationData={loadingAnim} loop={true} autoplay={true} renderer="svg" style={{ width: size, height: size }} />;
}

// Icon — morph/bounce no hover
export function AnimatedIcon() {
  const [hover, setHover] = useState(false);
  return (
    <span onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Lottie animationData={iconAnim} loop={hover} autoplay={hover} renderer="svg" style={{ width: 24, height: 24 }} />
    </span>
  );
}
