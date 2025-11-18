'use client';

import { useEffect, useState } from 'react';
import { useShouldReduceMotion } from '@/lib/animations';

export interface MediaItem {
  src: string;
  type: 'image' | 'video';
  alt?: string;
}

interface BackgroundGalleryProps {
  items: MediaItem[];
  interval?: number; // in milliseconds
}

export function BackgroundGallery({ items, interval = 8000 }: BackgroundGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const reduceMotion = useShouldReduceMotion();

  // If no items, don't render anything
  if (!items || items.length === 0) {
    return null;
  }

  // Handle rotation
  useEffect(() => {
    if (items.length <= 1 || reduceMotion) {
      return;
    }

    const rotationInterval = setInterval(() => {
      setIsTransitioning(true);
      
      // After fade transition completes, update to next index
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
        setIsTransitioning(false);
      }, 1000); // Match transition duration
    }, interval);

    return () => clearInterval(rotationInterval);
  }, [items.length, interval, reduceMotion]);

  const currentItem = items[currentIndex];
  const nextItem = items[(currentIndex + 1) % items.length];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Current item */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {currentItem.type === 'image' ? (
          <img
            src={currentItem.src}
            alt={currentItem.alt || 'Background image'}
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
        ) : (
          <video
            src={currentItem.src}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Next item (for crossfade) */}
      {items.length > 1 && !reduceMotion && (
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            isTransitioning ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {nextItem.type === 'image' ? (
            <img
              src={nextItem.src}
              alt={nextItem.alt || 'Background image'}
              className="w-full h-full object-cover"
              aria-hidden="true"
            />
          ) : (
            <video
              src={nextItem.src}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              aria-hidden="true"
            />
          )}
        </div>
      )}
    </div>
  );
}

