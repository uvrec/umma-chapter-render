// Waveform generation utility using Web Audio API

// Cache for generated waveforms
const waveformCache = new Map<string, number[]>();

/**
 * Generate waveform data from audio URL
 * @param audioUrl - URL of the audio file
 * @param samples - Number of samples to generate (bars in waveform)
 * @returns Array of amplitude values (0-1)
 */
export async function generateWaveform(
  audioUrl: string,
  samples: number = 100
): Promise<number[]> {
  // Check cache first
  const cacheKey = `${audioUrl}-${samples}`;
  if (waveformCache.has(cacheKey)) {
    return waveformCache.get(cacheKey)!;
  }

  try {
    // Fetch audio data
    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();

    // Decode audio
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Get audio data from first channel
    const channelData = audioBuffer.getChannelData(0);
    const samplesPerBar = Math.floor(channelData.length / samples);

    const waveform: number[] = [];

    for (let i = 0; i < samples; i++) {
      const start = i * samplesPerBar;
      const end = start + samplesPerBar;

      // Calculate RMS (root mean square) for this segment
      let sum = 0;
      for (let j = start; j < end && j < channelData.length; j++) {
        sum += channelData[j] * channelData[j];
      }
      const rms = Math.sqrt(sum / samplesPerBar);

      // Normalize to 0-1 range with some boost for visibility
      const amplitude = Math.min(1, rms * 3);
      waveform.push(amplitude);
    }

    // Normalize waveform to use full range
    const maxAmplitude = Math.max(...waveform);
    const normalizedWaveform = waveform.map(v =>
      maxAmplitude > 0 ? (v / maxAmplitude) * 0.9 + 0.1 : 0.1
    );

    // Cache result
    waveformCache.set(cacheKey, normalizedWaveform);

    // Close audio context
    audioContext.close();

    return normalizedWaveform;
  } catch (error) {
    console.error('Failed to generate waveform:', error);
    // Return placeholder waveform
    return generatePlaceholderWaveform(samples);
  }
}

/**
 * Generate a random placeholder waveform for fallback
 */
export function generatePlaceholderWaveform(samples: number = 100): number[] {
  const waveform: number[] = [];

  for (let i = 0; i < samples; i++) {
    // Generate semi-random values that look like audio
    const baseValue = 0.3 + Math.random() * 0.4;
    const wave = Math.sin(i * 0.15) * 0.2;
    const noise = (Math.random() - 0.5) * 0.1;
    waveform.push(Math.min(1, Math.max(0.1, baseValue + wave + noise)));
  }

  return waveform;
}

/**
 * Clear waveform cache
 */
export function clearWaveformCache(): void {
  waveformCache.clear();
}

/**
 * Get cached waveform if available
 */
export function getCachedWaveform(audioUrl: string, samples: number = 100): number[] | null {
  const cacheKey = `${audioUrl}-${samples}`;
  return waveformCache.get(cacheKey) || null;
}
