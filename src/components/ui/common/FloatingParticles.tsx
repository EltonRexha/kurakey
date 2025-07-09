'use client';

import useMounted from '@/hooks/useMounted';
import React, { useMemo } from 'react';

interface FloatingParticlesProps {
    numParticles?: number;
    /**
     * Extra area (in pixels) to extend beyond the parent on all sides. Controls how wide the particle field is.
     * For example, a spread of 40 means the particles container will be 40px larger than the parent on each side.
     */
    spread?: number;
    className?: string;
}

const FloatingParticles: React.FC<FloatingParticlesProps> = ({
    numParticles = 25,
    spread = 40,
    className = '',
}) => {
    const mounted = useMounted();

    // Generate particle data only once per mount to avoid hydration mismatch
    const particles = useMemo(
        () =>
            Array.from({ length: numParticles }).map(() => ({
                left: Math.random() * 100,
                top: Math.random() * 100,
                delay: Math.random() * 5,
                duration: 4 + Math.random() * 6,
                size: 2 + Math.random() * 3,
            })),
        [numParticles]
    );

    if (!mounted) return null;

    return (
        <div
            className={`absolute pointer-events-none overflow-visible ${className}`}
            style={{
                top: `-${spread}px`,
                left: `-${spread}px`,
                right: `-${spread}px`,
                bottom: `-${spread}px`,
            }}
        >
            {particles.map((p, i) => (
                <span
                    key={i}
                    className="absolute rounded-full bg-sky-400/70 opacity-0 animate-particle-float"
                    style={{
                        left: `${p.left}%`,
                        top: `${p.top}%`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${p.duration}s`,
                    }}
                />
            ))}
        </div>
    );
};

export default FloatingParticles; 