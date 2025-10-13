'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

export function ScrollVine() {
  const { scrollYProgress } = useScroll();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Smooth spring animation for the vine growth
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });

  // Transform scroll progress to path length (0 to 1)
  const pathLength = useTransform(smoothProgress, [0, 1], [0, 1]);

  if (!mounted) return null;

  return (
    <div className="fixed left-8 top-0 bottom-0 w-16 pointer-events-none z-40 hidden lg:block">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 80 100"
        preserveAspectRatio="xMidYMin slice"
        className="overflow-visible"
      >
        <defs>
          {/* Gradiente verde natural para la enredadera */}
          <linearGradient id="vineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#86A789" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#739072" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#4F6F52" stopOpacity="1" />
          </linearGradient>

          {/* Filtro de sombra suave */}
          <filter id="vineShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="1" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Tallo principal - curva sinuosa */}
        <motion.path
          d="M 40 0 Q 30 15, 40 30 T 35 60 Q 30 75, 40 90 T 40 100"
          fill="none"
          stroke="url(#vineGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#vineShadow)"
          style={{
            pathLength: pathLength,
            opacity: useTransform(smoothProgress, [0, 0.1], [0, 1])
          }}
          initial={{ pathLength: 0 }}
        />

        {/* Hojas a lo largo del tallo */}
        {[
          { x: 35, y: 12, rotation: -30, scale: 0.8, delay: 0.1 },
          { x: 45, y: 18, rotation: 45, scale: 0.9, delay: 0.15 },
          { x: 32, y: 25, rotation: -45, scale: 0.85, delay: 0.2 },
          { x: 43, y: 35, rotation: 30, scale: 0.95, delay: 0.25 },
          { x: 30, y: 42, rotation: -35, scale: 0.9, delay: 0.3 },
          { x: 40, y: 50, rotation: 20, scale: 1, delay: 0.35 },
          { x: 33, y: 58, rotation: -40, scale: 0.85, delay: 0.4 },
          { x: 45, y: 65, rotation: 35, scale: 0.9, delay: 0.45 },
          { x: 35, y: 73, rotation: -25, scale: 0.95, delay: 0.5 },
          { x: 42, y: 82, rotation: 40, scale: 0.9, delay: 0.55 },
          { x: 36, y: 90, rotation: -30, scale: 0.85, delay: 0.6 },
        ].map((leaf, i) => (
          <motion.g
            key={i}
            style={{
              opacity: useTransform(
                smoothProgress,
                [leaf.delay, leaf.delay + 0.05],
                [0, 1]
              ),
              scale: useTransform(
                smoothProgress,
                [leaf.delay, leaf.delay + 0.1],
                [0, leaf.scale]
              )
            }}
          >
            {/* Hoja con forma natural */}
            <motion.path
              d={`M ${leaf.x} ${leaf.y} Q ${leaf.x - 3} ${leaf.y - 5}, ${leaf.x - 5} ${leaf.y - 3} Q ${leaf.x - 4} ${leaf.y + 2}, ${leaf.x} ${leaf.y} Q ${leaf.x + 4} ${leaf.y + 2}, ${leaf.x + 5} ${leaf.y - 3} Q ${leaf.x + 3} ${leaf.y - 5}, ${leaf.x} ${leaf.y}`}
              fill="#86A789"
              stroke="#739072"
              strokeWidth="0.5"
              filter="url(#vineShadow)"
              style={{
                transformOrigin: `${leaf.x}px ${leaf.y}px`,
                rotate: leaf.rotation
              }}
              animate={{
                rotate: [leaf.rotation, leaf.rotation + 5, leaf.rotation],
              }}
              transition={{
                duration: 3 + (i * 0.2),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.1
              }}
            />
            
            {/* Nervadura central de la hoja */}
            <motion.line
              x1={leaf.x}
              y1={leaf.y}
              x2={leaf.x}
              y2={leaf.y - 5}
              stroke="#4F6F52"
              strokeWidth="0.3"
              opacity="0.6"
              style={{
                transformOrigin: `${leaf.x}px ${leaf.y}px`,
                rotate: leaf.rotation
              }}
            />
          </motion.g>
        ))}

        {/* Pequeñas flores ocasionales */}
        {[
          { x: 38, y: 28, delay: 0.25 },
          { x: 36, y: 55, delay: 0.4 },
          { x: 41, y: 78, delay: 0.55 },
        ].map((flower, i) => (
          <motion.g
            key={`flower-${i}`}
            style={{
              opacity: useTransform(
                smoothProgress,
                [flower.delay, flower.delay + 0.05],
                [0, 1]
              ),
              scale: useTransform(
                smoothProgress,
                [flower.delay, flower.delay + 0.1],
                [0, 0.6]
              )
            }}
          >
            {/* Pétalos pequeños */}
            {[0, 72, 144, 216, 288].map((angle) => (
              <motion.circle
                key={angle}
                cx={flower.x + Math.cos((angle * Math.PI) / 180) * 2}
                cy={flower.y + Math.sin((angle * Math.PI) / 180) * 2}
                r="1.2"
                fill="#E8B4B8"
                opacity="0.9"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3 + (angle / 360)
                }}
              />
            ))}
            {/* Centro de la flor */}
            <circle cx={flower.x} cy={flower.y} r="0.8" fill="#D4AF97" />
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
