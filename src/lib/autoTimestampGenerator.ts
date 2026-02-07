/**
 * autoTimestampGenerator — Automatic LRC timestamp generation via audio analysis
 *
 * Uses Web Audio API to detect silence boundaries in audio,
 * then maps them to text lines for proportional timestamp distribution.
 *
 * Two strategies:
 * 1. Silence-based: detects pauses in audio to find natural boundaries
 * 2. Energy-proportional: weights time per line by text length (fallback)
 */

import type { AudioTimestamp } from '@/hooks/useAudioSync';

/** Configuration for auto-generation */
export interface AutoTimestampConfig {
  /** RMS threshold below which audio is considered silence (0-1). Default: 0.02 */
  silenceThreshold?: number;
  /** Minimum silence duration in seconds to count as a boundary. Default: 0.3 */
  minSilenceDuration?: number;
  /** Analysis window size in seconds. Default: 0.05 (50ms) */
  windowSize?: number;
  /** Minimum time per line in seconds. Default: 0.5 */
  minTimePerLine?: number;
}

const DEFAULT_CONFIG: Required<AutoTimestampConfig> = {
  silenceThreshold: 0.02,
  minSilenceDuration: 0.3,
  windowSize: 0.05,
  minTimePerLine: 0.5,
};

/** Result of silence detection */
interface SilenceBoundary {
  start: number;  // seconds
  end: number;    // seconds
  midpoint: number;
}

/**
 * Detect silence boundaries in an audio buffer.
 * Returns midpoints of silent regions as potential line break timestamps.
 */
function detectSilences(
  channelData: Float32Array,
  sampleRate: number,
  config: Required<AutoTimestampConfig>
): SilenceBoundary[] {
  const windowSamples = Math.floor(config.windowSize * sampleRate);
  const totalWindows = Math.floor(channelData.length / windowSamples);
  const silences: SilenceBoundary[] = [];

  let inSilence = false;
  let silenceStart = 0;

  for (let i = 0; i < totalWindows; i++) {
    const offset = i * windowSamples;
    let sum = 0;
    for (let j = 0; j < windowSamples && offset + j < channelData.length; j++) {
      const sample = channelData[offset + j];
      sum += sample * sample;
    }
    const rms = Math.sqrt(sum / windowSamples);
    const timePos = offset / sampleRate;

    if (rms < config.silenceThreshold) {
      if (!inSilence) {
        inSilence = true;
        silenceStart = timePos;
      }
    } else {
      if (inSilence) {
        const silenceEnd = timePos;
        const duration = silenceEnd - silenceStart;
        if (duration >= config.minSilenceDuration) {
          silences.push({
            start: silenceStart,
            end: silenceEnd,
            midpoint: (silenceStart + silenceEnd) / 2,
          });
        }
        inSilence = false;
      }
    }
  }

  // Handle trailing silence
  if (inSilence) {
    const silenceEnd = channelData.length / sampleRate;
    const duration = silenceEnd - silenceStart;
    if (duration >= config.minSilenceDuration) {
      silences.push({
        start: silenceStart,
        end: silenceEnd,
        midpoint: (silenceStart + silenceEnd) / 2,
      });
    }
  }

  return silences;
}

/**
 * Map N silences to N-1 text lines.
 * If we have more silences than needed, pick the strongest ones (longest pauses).
 * If we have fewer silences than needed, interpolate proportionally.
 */
function mapSilencesToLines(
  silences: SilenceBoundary[],
  lines: string[],
  totalDuration: number,
  config: Required<AutoTimestampConfig>
): AudioTimestamp[] {
  const numLines = lines.length;
  if (numLines === 0) return [];
  if (numLines === 1) {
    return [{
      start: 0,
      end: totalDuration,
      text: lines[0],
      type: 'line',
      lineIndex: 0,
    }];
  }

  // We need numLines-1 boundary points
  const neededBoundaries = numLines - 1;

  let boundaries: number[];

  if (silences.length >= neededBoundaries) {
    // More silences than needed — pick the longest (most prominent) ones
    const sorted = [...silences].sort((a, b) => (b.end - b.start) - (a.end - a.start));
    const selected = sorted.slice(0, neededBoundaries);
    // Re-sort by time order
    selected.sort((a, b) => a.midpoint - b.midpoint);
    boundaries = selected.map(s => s.midpoint);
  } else {
    // Fewer silences than needed — use silences as anchors, fill gaps proportionally
    boundaries = interpolateBoundaries(silences, lines, neededBoundaries, totalDuration);
  }

  // Build timestamps from boundaries
  const timestamps: AudioTimestamp[] = [];
  for (let i = 0; i < numLines; i++) {
    const start = i === 0 ? 0 : boundaries[i - 1];
    const end = i === numLines - 1 ? totalDuration : boundaries[i];

    // Enforce minimum time per line
    const adjustedEnd = Math.max(end, start + config.minTimePerLine);

    timestamps.push({
      start: Math.round(start * 100) / 100,
      end: Math.round(Math.min(adjustedEnd, totalDuration) * 100) / 100,
      text: lines[i],
      type: 'line',
      lineIndex: i,
    });
  }

  return timestamps;
}

/**
 * When we have fewer silence boundaries than text lines,
 * fill gaps with text-length-proportional interpolation.
 */
function interpolateBoundaries(
  silences: SilenceBoundary[],
  lines: string[],
  needed: number,
  totalDuration: number
): number[] {
  if (silences.length === 0) {
    // Pure text-proportional distribution
    return distributeByTextLength(lines, totalDuration);
  }

  // Use silence midpoints as anchor points, interpolate between them
  const anchors = silences.map(s => s.midpoint);
  const boundaries: number[] = [];

  // Calculate how many boundaries we need between each pair of anchors
  // Distribute proportionally based on text lengths
  const totalTextLength = lines.reduce((sum, l) => sum + Math.max(l.length, 1), 0);

  // Build a simple proportional timeline
  const proportional = distributeByTextLength(lines, totalDuration);

  // Merge: prefer silence anchors where they exist, use proportional elsewhere
  // Strategy: for each proportional boundary, snap to nearest silence if close enough
  const snapRadius = totalDuration * 0.05; // 5% of total duration
  for (const prop of proportional) {
    const nearest = anchors.reduce((best, anchor) => {
      return Math.abs(anchor - prop) < Math.abs(best - prop) ? anchor : best;
    }, Infinity);

    if (Math.abs(nearest - prop) < snapRadius) {
      boundaries.push(nearest);
      // Remove used anchor
      const idx = anchors.indexOf(nearest);
      if (idx !== -1) anchors.splice(idx, 1);
    } else {
      boundaries.push(prop);
    }
  }

  return boundaries.sort((a, b) => a - b);
}

/**
 * Distribute time boundaries proportionally by text length.
 * Returns N-1 boundary points for N lines.
 */
function distributeByTextLength(lines: string[], totalDuration: number): number[] {
  const lengths = lines.map(l => Math.max(l.length, 1));
  const totalLength = lengths.reduce((a, b) => a + b, 0);
  const boundaries: number[] = [];

  let accumulated = 0;
  for (let i = 0; i < lines.length - 1; i++) {
    accumulated += lengths[i];
    boundaries.push((accumulated / totalLength) * totalDuration);
  }

  return boundaries;
}

/**
 * Convert AudioTimestamp array to LRC string format
 */
export function timestampsToLRC(timestamps: AudioTimestamp[]): string {
  return timestamps
    .filter(t => t.text)
    .map(t => {
      const mins = Math.floor(t.start / 60);
      const secs = t.start % 60;
      const mm = String(mins).padStart(2, '0');
      const ss = secs.toFixed(2).padStart(5, '0');
      return `[${mm}:${ss}]${t.text}`;
    })
    .join('\n');
}

// Cache for decoded audio buffers
const audioBufferCache = new Map<string, AudioBuffer>();

/**
 * Fetch and decode audio from URL, with caching.
 */
async function getAudioBuffer(audioUrl: string): Promise<AudioBuffer> {
  if (audioBufferCache.has(audioUrl)) {
    return audioBufferCache.get(audioUrl)!;
  }

  const response = await fetch(audioUrl);
  const arrayBuffer = await response.arrayBuffer();
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  audioContext.close();

  audioBufferCache.set(audioUrl, audioBuffer);
  return audioBuffer;
}

/**
 * Generate auto-timestamps by analyzing audio waveform for silences
 * and mapping to text lines.
 *
 * @param audioUrl - URL of the audio file
 * @param text - Full text content (lines separated by \n)
 * @param section - Which section this text belongs to
 * @param config - Optional analysis configuration
 * @returns Array of AudioTimestamp with detected timing, and LRC string
 */
export async function generateSmartTimestamps(
  audioUrl: string,
  text: string,
  section?: AudioTimestamp['section'],
  config?: AutoTimestampConfig
): Promise<{ timestamps: AudioTimestamp[]; lrc: string }> {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const lines = text.split('\n').filter(l => l.trim());

  if (lines.length === 0) {
    return { timestamps: [], lrc: '' };
  }

  const audioBuffer = await getAudioBuffer(audioUrl);
  const channelData = audioBuffer.getChannelData(0);
  const sampleRate = audioBuffer.sampleRate;
  const totalDuration = audioBuffer.duration;

  // Detect silences
  const silences = detectSilences(channelData, sampleRate, cfg);

  // Map silences to text lines
  let timestamps = mapSilencesToLines(silences, lines, totalDuration, cfg);

  // Add section info
  if (section) {
    timestamps = timestamps.map(t => ({ ...t, section }));
  }

  const lrc = timestampsToLRC(timestamps);
  return { timestamps, lrc };
}

/**
 * Generate section-level timestamps by detecting major silence boundaries.
 * Divides audio into sections (sanskrit, transliteration, synonyms, translation, commentary).
 */
export async function generateSectionTimestamps(
  audioUrl: string,
  sections: { name: AudioTimestamp['section']; text: string }[],
  config?: AutoTimestampConfig
): Promise<AudioTimestamp[]> {
  const cfg = { ...DEFAULT_CONFIG, minSilenceDuration: 1.0, ...config };
  const validSections = sections.filter(s => s.text.trim());

  if (validSections.length === 0) return [];

  const audioBuffer = await getAudioBuffer(audioUrl);
  const channelData = audioBuffer.getChannelData(0);
  const sampleRate = audioBuffer.sampleRate;
  const totalDuration = audioBuffer.duration;

  // For section-level, use longer silence threshold to find major breaks
  const silences = detectSilences(channelData, sampleRate, cfg);

  const sectionTexts = validSections.map(s => s.text);
  const boundaries = silences.length >= validSections.length - 1
    ? [...silences]
        .sort((a, b) => (b.end - b.start) - (a.end - a.start))
        .slice(0, validSections.length - 1)
        .sort((a, b) => a.midpoint - b.midpoint)
        .map(s => s.midpoint)
    : distributeByTextLength(sectionTexts, totalDuration);

  const timestamps: AudioTimestamp[] = [];
  for (let i = 0; i < validSections.length; i++) {
    const start = i === 0 ? 0 : boundaries[i - 1];
    const end = i === validSections.length - 1 ? totalDuration : boundaries[i];

    timestamps.push({
      start: Math.round(start * 100) / 100,
      end: Math.round(Math.min(end, totalDuration) * 100) / 100,
      text: validSections[i].text.substring(0, 50),
      type: 'section',
      section: validSections[i].name,
    });
  }

  return timestamps;
}

/** Clear audio buffer cache */
export function clearAutoTimestampCache(): void {
  audioBufferCache.clear();
}
