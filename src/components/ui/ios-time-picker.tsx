/**
 * iOS-Style Time Picker with 3D Drum Effect
 *
 * Features:
 * - 3D perspective rotation like native iOS
 * - Smooth scroll with snap
 * - Visual depth with opacity and scale
 * - Touch and wheel support
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface IOSTimePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string; // HH:MM format
  onChange: (value: string) => void;
  title?: string;
}

const ITEM_HEIGHT = 44; // iOS standard row height
const VISIBLE_ITEMS = 5;
const PERSPECTIVE = 200;

// Generate arrays for hours (00-23) and minutes (00-59)
const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

interface DrumColumnProps {
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  label?: string;
}

function DrumColumn({ items, selectedIndex, onSelect, label }: DrumColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const lastY = useRef(0);
  const lastTime = useRef(0);
  const animationRef = useRef<number>();

  // Calculate offset for selected index
  const getOffsetForIndex = (index: number) => -index * ITEM_HEIGHT;

  // Initialize scroll position
  useEffect(() => {
    setScrollOffset(getOffsetForIndex(selectedIndex));
  }, [selectedIndex]);

  // Get 3D transform for item based on its position
  const getItemStyle = (index: number) => {
    const itemOffset = index * ITEM_HEIGHT + scrollOffset;
    const centerOffset = itemOffset / ITEM_HEIGHT;

    // Rotation angle based on distance from center
    const rotateX = centerOffset * 18; // 18 degrees per item
    const translateZ = Math.cos(Math.abs(centerOffset) * 0.5) * 20 - 20;
    const scale = 1 - Math.abs(centerOffset) * 0.08;
    const opacity = 1 - Math.abs(centerOffset) * 0.25;

    // Hide items too far from center
    if (Math.abs(centerOffset) > 2.5) {
      return { display: 'none' };
    }

    return {
      transform: `rotateX(${-rotateX}deg) translateZ(${translateZ}px) scale(${Math.max(0.7, scale)})`,
      opacity: Math.max(0.2, opacity),
      transition: isDragging ? 'none' : 'all 0.15s ease-out',
    };
  };

  // Snap to nearest item
  const snapToNearest = useCallback((offset: number, vel: number = 0) => {
    // Calculate target with velocity consideration
    const projectedOffset = offset + vel * 0.15;
    const targetIndex = Math.round(-projectedOffset / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(items.length - 1, targetIndex));

    setScrollOffset(getOffsetForIndex(clampedIndex));
    onSelect(clampedIndex);
  }, [items.length, onSelect]);

  // Momentum animation
  const animateMomentum = useCallback((currentVelocity: number) => {
    if (Math.abs(currentVelocity) < 0.5) {
      snapToNearest(scrollOffset, 0);
      return;
    }

    const friction = 0.92;
    const newVelocity = currentVelocity * friction;
    const newOffset = scrollOffset + newVelocity;

    // Clamp to bounds
    const minOffset = getOffsetForIndex(items.length - 1);
    const maxOffset = 0;
    const clampedOffset = Math.max(minOffset, Math.min(maxOffset, newOffset));

    if (clampedOffset !== newOffset) {
      snapToNearest(clampedOffset, 0);
      return;
    }

    setScrollOffset(clampedOffset);
    setVelocity(newVelocity);

    animationRef.current = requestAnimationFrame(() => animateMomentum(newVelocity));
  }, [scrollOffset, items.length, snapToNearest]);

  // Touch/Mouse handlers
  const handleStart = (clientY: number) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsDragging(true);
    setStartY(clientY - scrollOffset);
    lastY.current = clientY;
    lastTime.current = Date.now();
    setVelocity(0);
  };

  const handleMove = (clientY: number) => {
    if (!isDragging) return;

    const now = Date.now();
    const dt = now - lastTime.current;
    const dy = clientY - lastY.current;

    if (dt > 0) {
      setVelocity(dy / dt * 16); // Normalize to ~60fps
    }

    lastY.current = clientY;
    lastTime.current = now;

    const newOffset = clientY - startY;

    // Add resistance at bounds
    const minOffset = getOffsetForIndex(items.length - 1);
    const maxOffset = 0;

    let clampedOffset = newOffset;
    if (newOffset > maxOffset) {
      clampedOffset = maxOffset + (newOffset - maxOffset) * 0.3;
    } else if (newOffset < minOffset) {
      clampedOffset = minOffset + (newOffset - minOffset) * 0.3;
    }

    setScrollOffset(clampedOffset);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(velocity) > 2) {
      animateMomentum(velocity);
    } else {
      snapToNearest(scrollOffset, velocity);
    }
  };

  // Wheel handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY;
    const newOffset = scrollOffset - delta * 0.5;

    const minOffset = getOffsetForIndex(items.length - 1);
    const maxOffset = 0;
    const clampedOffset = Math.max(minOffset, Math.min(maxOffset, newOffset));

    setScrollOffset(clampedOffset);

    // Debounced snap
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(() => {
      setTimeout(() => snapToNearest(clampedOffset, 0), 100);
    });
  };

  // Click on item to select
  const handleItemClick = (index: number) => {
    setScrollOffset(getOffsetForIndex(index));
    onSelect(index);
  };

  return (
    <div className="flex flex-col items-center">
      {label && (
        <span className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
          {label}
        </span>
      )}
      <div
        ref={containerRef}
        className="relative overflow-hidden select-none cursor-grab active:cursor-grabbing"
        style={{
          height: ITEM_HEIGHT * VISIBLE_ITEMS,
          width: 80,
          perspective: `${PERSPECTIVE}px`,
          perspectiveOrigin: 'center center',
        }}
        onMouseDown={(e) => handleStart(e.clientY)}
        onMouseMove={(e) => handleMove(e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientY)}
        onTouchMove={(e) => handleMove(e.touches[0].clientY)}
        onTouchEnd={handleEnd}
        onWheel={handleWheel}
      >
        {/* 3D Container */}
        <div
          className="absolute inset-0 flex flex-col items-center"
          style={{
            transformStyle: 'preserve-3d',
            paddingTop: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
          }}
        >
          {items.map((item, index) => (
            <div
              key={item}
              className={cn(
                "absolute flex items-center justify-center font-medium transition-colors",
                "text-2xl tabular-nums",
                index === selectedIndex
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
              style={{
                height: ITEM_HEIGHT,
                width: '100%',
                top: 0,
                ...getItemStyle(index),
              }}
              onClick={() => handleItemClick(index)}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Selection highlight */}
        <div
          className="absolute left-0 right-0 pointer-events-none border-y border-primary/30"
          style={{
            top: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
            height: ITEM_HEIGHT,
            background: 'linear-gradient(to bottom, hsl(var(--primary) / 0.05), hsl(var(--primary) / 0.1), hsl(var(--primary) / 0.05))',
          }}
        />

        {/* Top/bottom fade gradients */}
        <div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{
            height: ITEM_HEIGHT * 1.5,
            background: 'linear-gradient(to bottom, hsl(var(--background)), transparent)',
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: ITEM_HEIGHT * 1.5,
            background: 'linear-gradient(to top, hsl(var(--background)), transparent)',
          }}
        />
      </div>
    </div>
  );
}

export function IOSTimePicker({
  open,
  onOpenChange,
  value,
  onChange,
  title,
}: IOSTimePickerProps) {
  // Parse initial value
  const [hours, minutes] = value ? value.split(':').map(Number) : [0, 0];
  const [selectedHour, setSelectedHour] = useState(hours);
  const [selectedMinute, setSelectedMinute] = useState(minutes);

  // Update when value prop changes
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':').map(Number);
      setSelectedHour(h);
      setSelectedMinute(m);
    }
  }, [value]);

  const handleConfirm = () => {
    const newValue = `${HOURS[selectedHour]}:${MINUTES[selectedMinute]}`;
    onChange(newValue);
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Reset to original value
    if (value) {
      const [h, m] = value.split(':').map(Number);
      setSelectedHour(h);
      setSelectedMinute(m);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[320px] p-0 gap-0 overflow-hidden">
        {/* Header */}
        {title && (
          <div className="text-center py-4 border-b border-border/50">
            <h3 className="text-lg font-medium">{title}</h3>
          </div>
        )}

        {/* Picker */}
        <div className="flex items-center justify-center gap-2 py-6 px-4">
          <DrumColumn
            items={HOURS}
            selectedIndex={selectedHour}
            onSelect={setSelectedHour}
          />

          <span className="text-3xl font-light text-muted-foreground">:</span>

          <DrumColumn
            items={MINUTES}
            selectedIndex={selectedMinute}
            onSelect={setSelectedMinute}
          />
        </div>

        {/* Preview */}
        <div className="text-center pb-4 text-sm text-muted-foreground">
          {HOURS[selectedHour]}:{MINUTES[selectedMinute]}
        </div>

        {/* Actions */}
        <div className="flex border-t border-border/50">
          <Button
            variant="ghost"
            className="flex-1 rounded-none h-12 text-muted-foreground hover:text-foreground"
            onClick={handleCancel}
          >
            Скасувати
          </Button>
          <div className="w-px bg-border/50" />
          <Button
            variant="ghost"
            className="flex-1 rounded-none h-12 text-primary font-semibold hover:text-primary"
            onClick={handleConfirm}
          >
            Готово
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Simplified time display button that opens the picker
interface TimePickerButtonProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  title?: string;
  className?: string;
}

export function TimePickerButton({
  value,
  onChange,
  placeholder = '--:--',
  title,
  className,
}: TimePickerButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center justify-center",
          "text-2xl font-medium tabular-nums",
          "px-4 py-2 rounded-lg",
          "bg-secondary/50 hover:bg-secondary",
          "transition-colors",
          !value && "text-muted-foreground",
          className
        )}
      >
        {value || placeholder}
      </button>

      <IOSTimePicker
        open={open}
        onOpenChange={setOpen}
        value={value || '00:00'}
        onChange={onChange}
        title={title}
      />
    </>
  );
}
