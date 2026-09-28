import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RefreshCw, ArrowDown, Check, Sparkles } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  disabled?: boolean;
  pullThreshold?: number;
  className?: string;
  id?: string;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  disabled = false,
  pullThreshold = 70,
  className = '',
  id = 'pull-to-refresh-container'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Tracking touch/mouse state
  const touchStartY = useRef(0);
  const isDragging = useRef(false);
  const canPull = useRef(false);
  const isRefreshingRef = useRef(false);
  isRefreshingRef.current = isRefreshing;

  // Handle pull release and trigger refresh
  const handleRelease = useCallback(async () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    if (pullDistance >= pullThreshold && !isRefreshingRef.current && !disabled) {
      // Trigger Haptic Feedback on supported mobile devices
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(25);
        } catch (e) {
          // ignore error
        }
      }

      setIsRefreshing(true);
      setPullDistance(56); // Hold at active loader position

      try {
        await Promise.resolve(onRefresh());
        setShowSuccess(true);
        // Show success badge briefly like social media feeds
        setTimeout(() => {
          setShowSuccess(false);
          setIsRefreshing(false);
          setPullDistance(0);
        }, 650);
      } catch (err) {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      // Rebound smoothly to zero
      setPullDistance(0);
    }
  }, [pullDistance, pullThreshold, disabled, onRefresh]);

  // Touch Event Handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (disabled || isRefreshing) return;
    const container = containerRef.current;
    if (!container) return;

    // Can only initiate pull when scrolled to absolute top
    if (container.scrollTop <= 2) {
      canPull.current = true;
      touchStartY.current = e.touches[0].clientY;
    } else {
      canPull.current = false;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!canPull.current || disabled || isRefreshing) return;
    const container = containerRef.current;
    if (!container || container.scrollTop > 2) {
      canPull.current = false;
      setPullDistance(0);
      return;
    }

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY.current;

    if (deltaY > 0) {
      // Prevent default pull down reload of the browser if we are handling it
      if (e.cancelable && deltaY > 15) {
        e.preventDefault();
      }
      isDragging.current = true;
      // Damped rubber-band physics formula
      const dampedDistance = Math.min(Math.pow(deltaY, 0.82) * 1.8, 100);
      setPullDistance(dampedDistance);
    } else {
      setPullDistance(0);
      isDragging.current = false;
    }
  };

  const handleTouchEnd = () => {
    handleRelease();
  };

  // Mouse Drag Handlers (for preview & desktop testing)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || isRefreshing) return;
    const container = containerRef.current;
    if (!container || container.scrollTop > 2) return;

    // Only left click
    if (e.button === 0) {
      canPull.current = true;
      touchStartY.current = e.clientY;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canPull.current || disabled || isRefreshing) return;
    const container = containerRef.current;
    if (!container || container.scrollTop > 2) {
      canPull.current = false;
      setPullDistance(0);
      return;
    }

    const currentY = e.clientY;
    const deltaY = currentY - touchStartY.current;

    if (deltaY > 5) {
      isDragging.current = true;
      const dampedDistance = Math.min(Math.pow(deltaY, 0.82) * 1.8, 100);
      setPullDistance(dampedDistance);
    }
  };

  const handleMouseUp = () => {
    handleRelease();
  };

  const handleMouseLeave = () => {
    if (isDragging.current) {
      handleRelease();
    }
    canPull.current = false;
  };

  // Calculate rotation and progress percentage for the indicator
  const progressRatio = Math.min(pullDistance / pullThreshold, 1);
  const rotationDegrees = Math.min(pullDistance * 3.5, 180);
  const isReady = pullDistance >= pullThreshold;

  return (
    <div
      id={id}
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-y-auto no-scrollbar select-none ${className}`}
      style={{
        overscrollBehaviorY: 'contain',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {/* Social Media Pull To Refresh Header Indicator */}
      <div
        id="pull-to-refresh-indicator"
        className="pointer-events-none w-full flex items-center justify-center transition-all duration-150 overflow-hidden"
        style={{
          height: isRefreshing ? 56 : pullDistance,
          opacity: pullDistance > 8 || isRefreshing ? 1 : 0
        }}
      >
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full shadow-md border transition-all transform duration-150 ${
            showSuccess
              ? 'bg-emerald-600 text-white border-emerald-400 scale-100'
              : isRefreshing
              ? 'bg-white dark:bg-gray-900 text-rose-600 border-rose-200 dark:border-rose-900/60 scale-100'
              : isReady
              ? 'bg-rose-600 text-white border-rose-500 scale-105 shadow-rose-500/20'
              : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-800 scale-95'
          }`}
        >
          {showSuccess ? (
            <>
              <Check className="w-4 h-4 text-white stroke-[3] animate-in zoom-in-50 duration-150" />
              <span className="text-xs font-bold font-sans">ফিড আপডেট সম্পন্ন!</span>
            </>
          ) : isRefreshing ? (
            <>
              <div className="relative w-4 h-4 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 animate-spin text-rose-600 dark:text-rose-400 stroke-[2.5]" />
              </div>
              <span className="text-xs font-bold text-gray-900 dark:text-white font-sans animate-pulse">
                ফিড আপডেট হচ্ছে...
              </span>
            </>
          ) : (
            <>
              <div
                className="w-4 h-4 flex items-center justify-center transition-transform duration-100"
                style={{
                  transform: `rotate(${rotationDegrees}deg)`
                }}
              >
                <ArrowDown className={`w-4 h-4 stroke-[2.5] ${isReady ? 'text-white' : 'text-rose-600'}`} />
              </div>
              <span className="text-[11px] font-bold font-sans tracking-wide">
                {isReady ? 'ছেড়ে দিন রিফ্রেশ করতে' : 'টেনে নিচে নামিয়ে রিফ্রেশ করুন'}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Actual Feed Content */}
      <div
        className="transition-transform duration-150"
        style={{
          transform: isRefreshing
            ? 'translateY(0px)'
            : pullDistance > 0
            ? `translateY(${Math.min(pullDistance * 0.25, 20)}px)`
            : 'none'
        }}
      >
        {children}
      </div>
    </div>
  );
};
