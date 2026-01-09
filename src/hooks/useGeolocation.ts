/**
 * useGeolocation - Hook for browser geolocation and nearest location detection
 */

import { useState, useCallback } from "react";
import type { CalendarLocation } from "@/types/calendar";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  isLoading: boolean;
}

interface UseGeolocationOptions {
  timeout?: number;
  maximumAge?: number;
  enableHighAccuracy?: boolean;
}

const defaultOptions: UseGeolocationOptions = {
  timeout: 10000,
  maximumAge: 60000,
  enableHighAccuracy: false,
};

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in kilometers
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Find the nearest location from a list of preset locations
 */
export function findNearestLocation(
  latitude: number,
  longitude: number,
  locations: CalendarLocation[]
): CalendarLocation | null {
  if (!locations || locations.length === 0) return null;

  let nearest: CalendarLocation | null = null;
  let minDistance = Infinity;

  for (const location of locations) {
    const distance = calculateDistance(
      latitude,
      longitude,
      Number(location.latitude),
      Number(location.longitude)
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearest = location;
    }
  }

  return nearest;
}

/**
 * Hook for getting user's geolocation
 */
export function useGeolocation(options: UseGeolocationOptions = {}) {
  const mergedOptions = { ...defaultOptions, ...options };

  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    isLoading: false,
  });

  const isSupported = typeof navigator !== "undefined" && "geolocation" in navigator;

  const getPosition = useCallback((): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!isSupported) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        {
          timeout: mergedOptions.timeout,
          maximumAge: mergedOptions.maximumAge,
          enableHighAccuracy: mergedOptions.enableHighAccuracy,
        }
      );
    });
  }, [isSupported, mergedOptions.timeout, mergedOptions.maximumAge, mergedOptions.enableHighAccuracy]);

  const requestGeolocation = useCallback(async () => {
    if (!isSupported) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported",
        isLoading: false,
      }));
      return null;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const position = await getPosition();
      const newState: GeolocationState = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        error: null,
        isLoading: false,
      };
      setState(newState);
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };
    } catch (error) {
      let errorMessage = "Failed to get location";

      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
      }

      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
      return null;
    }
  }, [isSupported, getPosition]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    isSupported,
    requestGeolocation,
    clearError,
  };
}

/**
 * Hook for detecting and setting nearest location automatically
 */
export function useAutoLocation(
  locations: CalendarLocation[],
  onLocationFound: (locationId: string) => void
) {
  const geolocation = useGeolocation();

  const detectLocation = useCallback(async () => {
    const coords = await geolocation.requestGeolocation();

    if (coords && coords.latitude && coords.longitude) {
      const nearest = findNearestLocation(
        coords.latitude,
        coords.longitude,
        locations
      );

      if (nearest) {
        onLocationFound(nearest.id);
        return nearest;
      }
    }

    return null;
  }, [geolocation, locations, onLocationFound]);

  return {
    ...geolocation,
    detectLocation,
  };
}
