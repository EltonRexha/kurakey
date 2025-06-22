'use client';
import { createPortal } from 'react-dom';
import Modal from './ui/Modal';
import useMounted from '@/hooks/useMounted';
import Room3D from './ui/3DRoom';
import { rarityColors, categoryColors } from '@/utils/colors';
import GlowingButton from './ui/common/GlowingButton';
import { useEffect, useRef, useState } from 'react';
import { Room } from '@/generated/prisma';
import Link from 'next/link';

interface RoomUnlockedModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  playcanvasLink?: string;
  room: Room;
}

const RoomUnlockedModal: React.FC<RoomUnlockedModalProps> = ({
  isOpen,
  setIsOpen,
  room,
}) => {
  const confettiRef = useRef<HTMLCanvasElement>(null);
  const mounted = useMounted();
  const modalElement =
    typeof window !== 'undefined' ? document.getElementById('modal') : null;
  // Add a portal target for confetti overlay
  const [confettiOverlay, setConfettiOverlay] = useState<HTMLElement | null>(
    null
  );
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let overlay = document.getElementById('confetti-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'confetti-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '9999';
        document.body.appendChild(overlay);
      }
      setConfettiOverlay(overlay);
    }
  }, []);

  useEffect(() => {
    if (!mounted || !isOpen || !confettiOverlay) return;
    const canvas = confettiRef.current;
    import('canvas-confetti').then((module) => {
      const confetti = module.default;
      if (canvas) {
        // Create a confetti instance bound to the canvas
        const confettiInstance = confetti.create(canvas, {
          resize: true,
          useWorker: true,
        });
        confettiInstance({
          particleCount: 80,
          angle: 60,
          spread: 70,
          origin: { x: 0, y: 1 },
          colors: ['#fbbf24', '#008cff', '#fff', '#a78bfa'],
          scalar: 1.2,
          zIndex: 0,
          disableForReducedMotion: true,
          ticks: 200,
          shapes: ['circle'],
          startVelocity: 45,
          gravity: 0.7,
          drift: 0.5,
        });
        confettiInstance({
          particleCount: 80,
          angle: 120,
          spread: 70,
          origin: { x: 1, y: 1 },
          colors: ['#fbbf24', '#008cff', '#fff', '#a78bfa'],
          scalar: 1.2,
          zIndex: 0,
          disableForReducedMotion: true,
          ticks: 200,
          shapes: ['circle'],
          startVelocity: 45,
          gravity: 0.7,
          drift: -0.5,
        });
        // Top left corner
        confettiInstance({
          particleCount: 80,
          angle: 120,
          spread: 70,
          origin: { x: 0, y: 0 },
          colors: ['#fbbf24', '#008cff', '#fff', '#a78bfa'],
          scalar: 1.2,
          zIndex: 0,
          disableForReducedMotion: true,
          ticks: 200,
          shapes: ['circle'],
          startVelocity: 45,
          gravity: 0.7,
          drift: 0.5,
        });
        // Top right corner
        confettiInstance({
          particleCount: 80,
          angle: 60,
          spread: 70,
          origin: { x: 1, y: 0 },
          colors: ['#fbbf24', '#008cff', '#fff', '#a78bfa'],
          scalar: 1.2,
          zIndex: 0,
          disableForReducedMotion: true,
          ticks: 200,
          shapes: ['circle'],
          startVelocity: 45,
          gravity: 0.7,
          drift: -0.5,
        });
      }
    });
  }, [isOpen, mounted, confettiOverlay]);

  if (!mounted) return null;
  if (!modalElement) return null;

  return (
    <>
      {/* Confetti Canvas Overlay (full screen, outside modal) */}
      {confettiOverlay &&
        isOpen &&
        createPortal(
          <canvas
            ref={confettiRef}
            className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-[9999]"
            width={typeof window !== 'undefined' ? window.innerWidth : 1920}
            height={typeof window !== 'undefined' ? window.innerHeight : 1080}
          />,
          confettiOverlay
        )}
      {createPortal(
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          className="sm:w-max p-2"
        >
          <div className="flex flex-col items-center gap-4 w-[90vw] h-[90vh] lg:w-[900px] lg:h-[850px] py-4 pl-2 sm:px-4">
            <h2 className="text-3xl font-bold text-neutral-100 mb-2 text-center z-10">
              Room Unlocked!
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 mb-2 z-10">
              <div
                className="flex items-center gap-2 px-4 rounded-md border text-base font-semibold"
                style={{
                  color: rarityColors[room.rarity],
                  background: `${rarityColors[room.rarity]}22`,
                  borderColor: rarityColors[room.rarity],
                }}
              >
                Rarity: <span className="uppercase">{room.rarity}</span>
              </div>
              <div
                className="flex items-center gap-2 px-4 rounded-md border text-base font-semibold"
                style={{
                  color: categoryColors[room.category],
                  background: `${categoryColors[room.category]}22`,
                  borderColor: categoryColors[room.category],
                }}
              >
                Category: <span className="uppercase">{room.category}</span>
              </div>
            </div>
            <div className="w-full max-w-[950px] h-[600px] z-10">
              <Room3D playcanvasLink={room.assetUrl} />
            </div>
            <div
              className="text-xl font-bold text-center z-10"
              style={{
                color: rarityColors[room.rarity],
                borderColor: rarityColors[room.category],
              }}
            >
              {room.name}
            </div>
            <Link href={`/room?id=${room.id}`}>
              <GlowingButton
                className="mt-4 text-lg py-3 px-8 font-bold z-10 w-full sm:w-64 m-auto"
                onClick={() => setIsOpen(false)}
              >
                Go To Room
              </GlowingButton>
            </Link>
          </div>
        </Modal>,
        modalElement
      )}
    </>
  );
};

export default RoomUnlockedModal;
