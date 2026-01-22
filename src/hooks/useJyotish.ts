/**
 * React хуки для Ведичного Джйотіш
 */

import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  calculatePanchanga,
  getJyotishReading,
  getVedicPortrait,
  getNakshatraByDegree,
  getRashiByDegree,
} from '@/services/jyotishCalculator';
import { NAKSHATRAS, RASHIS, GRAHAS } from '@/data/jyotish';
import type {
  BirthData,
  JyotishReading,
  Panchanga,
  VedicPortrait,
  Nakshatra,
  Rashi,
} from '@/types/jyotish';

// ============================================
// Хук для панчанги
// ============================================

interface UsePanchangaOptions {
  date: Date;
  latitude: number;
  longitude: number;
  timezone: string;
  enabled?: boolean;
}

export function usePanchanga(options: UsePanchangaOptions) {
  const { date, latitude, longitude, timezone, enabled = true } = options;

  return useQuery({
    queryKey: ['panchanga', date.toISOString(), latitude, longitude, timezone],
    queryFn: () => calculatePanchanga(date, latitude, longitude, timezone),
    enabled,
    staleTime: 1000 * 60 * 60, // 1 година
    gcTime: 1000 * 60 * 60 * 24, // 24 години
  });
}

// ============================================
// Хук для джйотіш читання
// ============================================

export function useJyotishReading(birthData: BirthData | null) {
  return useQuery({
    queryKey: ['jyotish-reading', birthData?.date?.toISOString(), birthData?.location],
    queryFn: () => (birthData ? getJyotishReading(birthData) : null),
    enabled: !!birthData,
    staleTime: Infinity, // Дані народження не змінюються
  });
}

// ============================================
// Хук для ведичного портрету
// ============================================

export function useVedicPortrait(birthData: BirthData | null) {
  return useQuery({
    queryKey: ['vedic-portrait', birthData?.date?.toISOString(), birthData?.location],
    queryFn: () => (birthData ? getVedicPortrait(birthData) : null),
    enabled: !!birthData,
    staleTime: Infinity,
  });
}

// ============================================
// Хук для форми введення дати народження
// ============================================

interface BirthDataInput {
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
  latitude: string;
  longitude: string;
  timezone: string;
  locationName: string;
}

const defaultBirthDataInput: BirthDataInput = {
  day: '',
  month: '',
  year: '',
  hour: '12',
  minute: '00',
  latitude: '50.4501',
  longitude: '30.5234',
  timezone: 'Europe/Kyiv',
  locationName: 'Київ, Україна',
};

export function useBirthDataForm(initialData?: Partial<BirthDataInput>) {
  const [formData, setFormData] = useState<BirthDataInput>({
    ...defaultBirthDataInput,
    ...initialData,
  });

  const updateField = useCallback((field: keyof BirthDataInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({ ...defaultBirthDataInput, ...initialData });
  }, [initialData]);

  const isValid = useMemo(() => {
    const day = parseInt(formData.day);
    const month = parseInt(formData.month);
    const year = parseInt(formData.year);
    const hour = parseInt(formData.hour);
    const minute = parseInt(formData.minute);
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);

    return (
      day >= 1 && day <= 31 &&
      month >= 1 && month <= 12 &&
      year >= 1900 && year <= 2100 &&
      hour >= 0 && hour <= 23 &&
      minute >= 0 && minute <= 59 &&
      !isNaN(lat) && lat >= -90 && lat <= 90 &&
      !isNaN(lng) && lng >= -180 && lng <= 180 &&
      formData.timezone.length > 0
    );
  }, [formData]);

  const toBirthData = useCallback((): BirthData | null => {
    if (!isValid) return null;

    const date = new Date(
      parseInt(formData.year),
      parseInt(formData.month) - 1,
      parseInt(formData.day),
      parseInt(formData.hour),
      parseInt(formData.minute)
    );

    return {
      date,
      time: `${formData.hour.padStart(2, '0')}:${formData.minute.padStart(2, '0')}`,
      location: {
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        timezone: formData.timezone,
        name: formData.locationName,
      },
    };
  }, [formData, isValid]);

  return {
    formData,
    updateField,
    resetForm,
    isValid,
    toBirthData,
  };
}

// ============================================
// Хук для сьогоднішньої панчанги
// ============================================

export function useTodayPanchanga(location?: {
  latitude: number;
  longitude: number;
  timezone: string;
}) {
  const defaultLocation = {
    latitude: 50.4501, // Київ
    longitude: 30.5234,
    timezone: 'Europe/Kyiv',
  };

  const { latitude, longitude, timezone } = location || defaultLocation;

  return usePanchanga({
    date: new Date(),
    latitude,
    longitude,
    timezone,
  });
}

// ============================================
// Хук для накшатри за градусом
// ============================================

export function useNakshatra(moonDegree: number): Nakshatra {
  return useMemo(() => getNakshatraByDegree(moonDegree), [moonDegree]);
}

// ============================================
// Хук для раші за градусом
// ============================================

export function useRashi(degree: number): Rashi {
  return useMemo(() => getRashiByDegree(degree), [degree]);
}

// ============================================
// Хук для списку накшатр
// ============================================

export function useNakshatras() {
  return useMemo(() => NAKSHATRAS, []);
}

// ============================================
// Хук для списку раші
// ============================================

export function useRashis() {
  return useMemo(() => RASHIS, []);
}

// ============================================
// Хук для списку планет
// ============================================

export function useGrahas() {
  return useMemo(() => GRAHAS, []);
}

// ============================================
// Хук для пошуку накшатри за іменем
// ============================================

export function useNakshatraSearch(query: string) {
  return useMemo(() => {
    if (!query || query.length < 2) return [];
    const lowerQuery = query.toLowerCase();
    return NAKSHATRAS.filter(
      n =>
        n.name_uk.toLowerCase().includes(lowerQuery) ||
        n.name_en.toLowerCase().includes(lowerQuery) ||
        n.name_iast.toLowerCase().includes(lowerQuery)
    );
  }, [query]);
}

// ============================================
// Хук для сумісності накшатр
// ============================================

export function useNakshatraCompatibility(nakshatra1Id: number, nakshatra2Id: number) {
  return useMemo(() => {
    const n1 = NAKSHATRAS.find(n => n.id === nakshatra1Id);
    const n2 = NAKSHATRAS.find(n => n.id === nakshatra2Id);

    if (!n1 || !n2) return null;

    // Спрощений розрахунок сумісності
    // У повній версії це буде враховувати Кута систему
    const sameRuler = n1.ruler_planet === n2.ruler_planet;
    const sameGuna = n1.guna === n2.guna;
    const sameElement = n1.element === n2.element;

    let score = 0;
    if (sameRuler) score += 30;
    if (sameGuna) score += 20;
    if (sameElement) score += 20;

    // Бонус за сумісність тварин-символів
    const compatibleAnimals: Record<string, string[]> = {
      'Кінь (жеребець)': ['Кінь (кобила)'],
      'Кінь (кобила)': ['Кінь (жеребець)'],
      'Слон (самець)': ['Слон (самка)'],
      'Слон (самка)': ['Слон (самець)'],
    };

    if (compatibleAnimals[n1.animal_ua]?.includes(n2.animal_ua)) {
      score += 30;
    }

    return {
      nakshatra1: n1,
      nakshatra2: n2,
      score,
      level: score >= 70 ? 'excellent' : score >= 50 ? 'good' : score >= 30 ? 'moderate' : 'challenging',
      details: {
        sameRuler,
        sameGuna,
        sameElement,
      },
    };
  }, [nakshatra1Id, nakshatra2Id]);
}

export default {
  usePanchanga,
  useJyotishReading,
  useVedicPortrait,
  useBirthDataForm,
  useTodayPanchanga,
  useNakshatra,
  useRashi,
  useNakshatras,
  useRashis,
  useGrahas,
  useNakshatraSearch,
  useNakshatraCompatibility,
};
