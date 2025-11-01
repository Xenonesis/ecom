'use client';

import { useEffect, useRef } from 'react';
import './Prism.css';

const DotGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      console.log('DotGrid: No container found');
      return;
    }

    console.log('DotGrid: Setting up animated dot grid background');

    // Create dot grid
    const createDotGrid = () => {
      const dots = [];
      const numDots = 100; // Adjust for density

      for (let i = 0; i < numDots; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.style.left = `${Math.random() * 100}%`;
        dot.style.top = `${Math.random() * 100}%`;
        dot.style.animationDelay = `${Math.random() * 3}s`;
        dot.style.animationDuration = `${2 + Math.random() * 2}s`;
        dots.push(dot);
      }

      return dots;
    };

    const dots = createDotGrid();
    for (const dot of dots) {
      container.appendChild(dot);
    }

    console.log('DotGrid: Applied animated dot grid background');

    // Add keyframes for animation if not already present
    if (!document.getElementById('dot-keyframes')) {
      const style = document.createElement('style');
      style.id = 'dot-keyframes';
      style.textContent = `
        @keyframes dotPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.8;
          }
        }

        @keyframes dotFloat {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.1);
          }
        }

        .dot {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          pointer-events: none;
          animation: dotPulse 3s ease-in-out infinite;
        }

        .dot:nth-child(odd) {
          animation-name: dotFloat;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      // Cleanup
      for (const dot of dots) {
        if (dot.parentElement === container) {
          dot.remove();
        }
      }
    };
  }, []);

  return (
    <div className="dot-grid-container" ref={containerRef}>
      {/* Animated dot grid background */}
    </div>
  );
};

export default DotGrid;