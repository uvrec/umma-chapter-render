import React, { useEffect, useState, useRef, useCallback } from 'react';
import { generateWaveform, generatePlaceholderWaveform, getCachedWaveform } from '@/lib/waveformGenerator';

interface WaveformProgressBarProps {
  audioUrl: string;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  className?: string;
  barCount?: number;
  height?: number;
  variant?: 'mini' | 'expanded';
}

export const WaveformProgressBar: React.FC<WaveformProgressBarProps> = ({
  audioUrl,
  currentTime,
  duration,
  onSeek,
  className = '',
  barCount = 60,
  height = 32,
  variant = 'expanded'
}) => {
  const [waveform, setWaveform] = useState<number[]>(() =>
    getCachedWaveform(audioUrl, barCount) || generatePlaceholderWaveform(barCount)
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverPosition, setHoverPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load waveform data
  useEffect(() => {
    let isMounted = true;

    const loadWaveform = async () => {
      if (!audioUrl) return;

      setIsLoading(true);

      // Check cache first
      const cached = getCachedWaveform(audioUrl, barCount);
      if (cached) {
        if (isMounted) {
          setWaveform(cached);
          setIsLoading(false);
        }
        return;
      }

      // Generate new waveform
      try {
        const data = await generateWaveform(audioUrl, barCount);
        if (isMounted) {
          setWaveform(data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to load waveform:', error);
        if (isMounted) {
          setWaveform(generatePlaceholderWaveform(barCount));
          setIsLoading(false);
        }
      }
    };

    loadWaveform();

    return () => {
      isMounted = false;
    };
  }, [audioUrl, barCount]);

  // Calculate progress percentage
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Handle click to seek
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || duration <= 0) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const newTime = percent * duration;

    onSeek(Math.max(0, Math.min(duration, newTime)));
  }, [duration, onSeek]);

  // Handle mouse move for hover effect
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = (x / rect.width) * 100;

    setHoverPosition(Math.max(0, Math.min(100, percent)));
  }, []);

  // Mini variant (for mini player)
  if (variant === 'mini') {
    return (
      <div
        ref={containerRef}
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
        className={`relative h-1 cursor-pointer group ${className}`}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-muted rounded-full overflow-hidden">
          {/* Progress fill */}
          <div
            className="absolute h-full bg-primary rounded-full transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
          {/* Hover indicator */}
          {isHovering && (
            <div
              className="absolute h-full bg-primary/30 rounded-full"
              style={{ width: `${hoverPosition}%` }}
            />
          )}
        </div>
      </div>
    );
  }

  // Expanded variant (waveform visualization)
  const barWidth = 100 / barCount;
  const gap = 0.3; // gap between bars as percentage

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
      className={`relative cursor-pointer select-none ${className}`}
      style={{ height: `${height}px` }}
    >
      {/* Waveform bars */}
      <div className="absolute inset-0 flex items-center justify-between">
        {waveform.map((amplitude, index) => {
          const barPosition = (index / barCount) * 100;
          const isPlayed = barPosition < progressPercent;
          const isHovered = isHovering && barPosition < hoverPosition;
          const barHeight = Math.max(4, amplitude * height * 0.9);

          return (
            <div
              key={index}
              className={`
                rounded-full transition-all duration-150
                ${isPlayed
                  ? 'bg-primary'
                  : isHovered
                    ? 'bg-primary/40'
                    : 'bg-foreground/20'
                }
                ${isLoading ? 'animate-pulse' : ''}
              `}
              style={{
                width: `${barWidth - gap}%`,
                height: `${barHeight}px`,
                minHeight: '4px'
              }}
            />
          );
        })}
      </div>

      {/* Hover time indicator */}
      {isHovering && duration > 0 && (
        <div
          className="absolute -top-6 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-0.5 rounded shadow-md pointer-events-none z-10"
          style={{ left: `${hoverPosition}%` }}
        >
          {formatTime((hoverPosition / 100) * duration)}
        </div>
      )}
    </div>
  );
};

// Helper function to format time
function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default WaveformProgressBar;
