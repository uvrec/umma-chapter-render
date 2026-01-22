/**
 * Хуки для роботи з рагами
 * Hooks for working with ragas
 */

import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import ragasData from '@/data/ragas.json';
import {
  Raga,
  RagaDatabase,
  RagaFilters,
  THAATS,
  isRagaTimeNow,
} from '@/types/raga';

/**
 * Завантажує всі раги з JSON
 */
export function useRagas() {
  return useQuery({
    queryKey: ['ragas'],
    queryFn: async (): Promise<RagaDatabase> => {
      // Дані вже імпортовані статично
      return ragasData as RagaDatabase;
    },
    staleTime: Infinity, // Статичні дані не змінюються
  });
}

/**
 * Отримує список раг з можливістю фільтрації
 */
export function useFilteredRagas(filters: RagaFilters = {}) {
  const { data: ragas, isLoading, error } = useRagas();

  const filteredRagas = useMemo(() => {
    if (!ragas) return [];

    let entries = Object.entries(ragas);

    // Фільтр по тхаату
    if (filters.thaat) {
      entries = entries.filter(([_, raga]) =>
        raga.thaat?.toLowerCase() === filters.thaat?.toLowerCase()
      );
    }

    // Фільтр по часу
    if (filters.time) {
      entries = entries.filter(([_, raga]) =>
        raga.time?.toLowerCase().includes(filters.time?.toLowerCase() || '')
      );
    }

    // Фільтр по джаті
    if (filters.jati) {
      entries = entries.filter(([_, raga]) =>
        raga.jati?.toLowerCase().includes(filters.jati?.toLowerCase() || '')
      );
    }

    // Фільтр по ваді
    if (filters.vadi) {
      entries = entries.filter(([_, raga]) =>
        raga.vadi?.toLowerCase() === filters.vadi?.toLowerCase()
      );
    }

    // Пошук по назві
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      entries = entries.filter(([name]) =>
        name.toLowerCase().includes(searchLower)
      );
    }

    // Сортуємо за назвою
    entries.sort((a, b) => a[0].localeCompare(b[0]));

    return entries.map(([name, raga]) => ({ name, ...raga }));
  }, [ragas, filters]);

  return {
    ragas: filteredRagas,
    isLoading,
    error,
    total: ragas ? Object.keys(ragas).length : 0,
  };
}

/**
 * Отримує раги для поточного часу дня
 */
export function useCurrentTimeRagas() {
  const { data: ragas } = useRagas();

  const currentRagas = useMemo(() => {
    if (!ragas) return [];

    return Object.entries(ragas)
      .filter(([_, raga]) => isRagaTimeNow(raga.time))
      .map(([name, raga]) => ({ name, ...raga }))
      .slice(0, 10); // Обмежуємо до 10
  }, [ragas]);

  return currentRagas;
}

/**
 * Отримує одну рагу за назвою
 */
export function useRaga(name: string | null) {
  const { data: ragas, isLoading } = useRagas();

  const raga = useMemo(() => {
    if (!ragas || !name) return null;
    return ragas[name] ? { name, ...ragas[name] } : null;
  }, [ragas, name]);

  return { raga, isLoading };
}

/**
 * Отримує унікальні значення для фільтрів
 */
export function useRagaFilterOptions() {
  const { data: ragas } = useRagas();

  return useMemo(() => {
    if (!ragas) return { thaats: [], times: [], jatis: [], vadis: [] };

    const thaats = new Set<string>();
    const times = new Set<string>();
    const jatis = new Set<string>();
    const vadis = new Set<string>();

    Object.values(ragas).forEach(raga => {
      if (raga.thaat) thaats.add(raga.thaat);
      if (raga.time) times.add(raga.time);
      if (raga.jati) jatis.add(raga.jati);
      if (raga.vadi) vadis.add(raga.vadi);
    });

    return {
      thaats: Array.from(thaats).sort(),
      times: Array.from(times).sort(),
      jatis: Array.from(jatis).sort(),
      vadis: Array.from(vadis).sort(),
    };
  }, [ragas]);
}

/**
 * Стан фільтрів раг
 */
export function useRagaFiltersState() {
  const [filters, setFilters] = useState<RagaFilters>({});

  const updateFilter = useCallback(<K extends keyof RagaFilters>(
    key: K,
    value: RagaFilters[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined, // undefined видаляє фільтр
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  const hasActiveFilters = Object.values(filters).some(v => v);

  return {
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
  };
}

/**
 * Отримує тхаати з описом
 */
export function useThaats() {
  return THAATS;
}

/**
 * Пошук схожих раг (за тхаатом або ваді)
 */
export function useSimilarRagas(ragaName: string | null, limit = 5) {
  const { raga } = useRaga(ragaName);
  const { data: allRagas } = useRagas();

  return useMemo(() => {
    if (!raga || !allRagas) return [];

    return Object.entries(allRagas)
      .filter(([name, r]) =>
        name !== ragaName &&
        (r.thaat === raga.thaat || r.vadi === raga.vadi)
      )
      .slice(0, limit)
      .map(([name, r]) => ({ name, ...r }));
  }, [raga, allRagas, ragaName, limit]);
}
