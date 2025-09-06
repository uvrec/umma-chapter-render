// Simple client-side playback statistics using localStorage
// Counts a play when a media item is listened to >=60%

const STORAGE_KEY = 'playCounts';

type PlayCounts = Record<string, number>;

function readStore(): PlayCounts {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PlayCounts) : {};
  } catch {
    return {};
  }
}

function writeStore(data: PlayCounts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota errors
  }
}

export function getPlayCount(id: string): number {
  const store = readStore();
  return store[id] ?? 0;
}

export function incrementPlayCount(id: string): number {
  const store = readStore();
  const next = (store[id] ?? 0) + 1;
  store[id] = next;
  writeStore(store);
  return next;
}

export function setPlayCount(id: string, value: number) {
  const store = readStore();
  store[id] = value;
  writeStore(store);
}
