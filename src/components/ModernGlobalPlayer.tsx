// ModernGlobalPlayer.tsx - Інтегрована версія для VedaVoice
import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Repeat, Repeat1, Shuffle, ChevronUp, ChevronDown, X,
  Heart, MoreVertical, Music, Timer, Gauge, ExternalLink, Share2
} from 'lucide-react';
import { useAudio } from '@/contexts/ModernAudioContext';
import { WaveformProgressBar } from './WaveformProgressBar';
import { useIsMobile } from '@/hooks/use-mobile';
import { SleepTimerDialog, SleepTimerIndicator } from '@/components/SleepTimerDialog';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Тип для даних вірша
interface VerseData {
  sanskrit: string | null;
  transliteration: string | null;
  translation_uk: string | null;
  translation_en: string | null;
  synonyms_uk: string | null;
  synonyms_en: string | null;
}

interface ModernGlobalPlayerProps {
  className?: string;
}

export const ModernGlobalPlayer: React.FC<ModernGlobalPlayerProps> = ({ className = '' }) => {
  const [showSleepTimer, setShowSleepTimer] = useState(false);
  const [verseData, setVerseData] = useState<VerseData | null>(null);
  const [isLoadingVerse, setIsLoadingVerse] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const settingsMenuRef = useRef<HTMLDivElement>(null);

  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    repeatMode,
    isShuffled,
    isExpanded,
    playbackRate,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
    setIsExpanded,
    setPlaybackRate,
    addFavorite,
    removeFavorite,
    isFavorite
  } = useAudio();

  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Check if current track is favorited
  const isCurrentFavorite = currentTrack ? isFavorite(currentTrack.id) : false;

  // Toggle favorite for current track
  const toggleFavorite = () => {
    if (!currentTrack) return;
    if (isCurrentFavorite) {
      removeFavorite(currentTrack.id);
      toast.success(language === 'uk' ? 'Видалено з улюблених' : 'Removed from favorites');
    } else {
      addFavorite(currentTrack);
      toast.success(language === 'uk' ? 'Додано до улюблених' : 'Added to favorites');
    }
  };

  // Close settings menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
        setShowSettingsMenu(false);
        setShowSpeedMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Playback speed options
  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // Navigate to verse page
  const goToVersePage = () => {
    if (currentTrack?.verseId) {
      navigate(`/verse/${currentTrack.verseId}`);
      setIsExpanded(false);
    } else if (currentTrack?.bookSlug && currentTrack?.chapterNumber && currentTrack?.verseNumber) {
      const { bookSlug, cantoNumber, chapterNumber, verseNumber } = currentTrack;
      const path = cantoNumber
        ? `/veda-reader/${bookSlug}/canto/${cantoNumber}/chapter/${chapterNumber}/${verseNumber}`
        : `/veda-reader/${bookSlug}/chapter/${chapterNumber}/${verseNumber}`;
      navigate(path);
      setIsExpanded(false);
    }
  };

  // Завантажуємо дані вірша коли змінюється currentTrack
  useEffect(() => {
    const fetchVerseData = async () => {
      if (!currentTrack?.verseId) {
        setVerseData(null);
        return;
      }

      setIsLoadingVerse(true);
      try {
        const { data, error } = await supabase
          .from('verses')
          .select('sanskrit, transliteration, translation_uk, translation_en, synonyms_uk, synonyms_en')
          .eq('id', currentTrack.verseId)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setVerseData({
            sanskrit: data.sanskrit,
            transliteration: data.transliteration,
            translation_uk: data.translation_uk,
            translation_en: data.translation_en,
            synonyms_uk: data.synonyms_uk,
            synonyms_en: data.synonyms_en,
          });
        }
      } catch (err) {
        console.error('Error fetching verse data:', err);
        setVerseData(null);
      } finally {
        setIsLoadingVerse(false);
      }
    };

    fetchVerseData();
  }, [currentTrack?.verseId]);

  // Format time helper
  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Volume change handler
  const changeVolume = (newVolume: number) => {
    setVolume(newVolume);
  };

  // Don't render if no track
  if (!currentTrack) return null;

  return (
    <>
      {/* Backdrop overlay коли розгорнуто */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-xl z-40 transition-opacity"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Main Player Container */}
      <div
        className={`
          fixed bottom-0 left-0 right-0 z-50
          ${isExpanded ? 'inset-0' : 'h-auto'}
          transition-all duration-300 ease-in-out
          ${className}
        `}
      >
        {/* Desktop Expanded View - Fullscreen 16:9 Layout */}
        {isExpanded && !isMobile && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10">
            {/* Close button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-foreground/10 hover:bg-foreground/20 transition z-10"
            >
              <X className="w-6 h-6 text-foreground" />
            </button>

            <div className="h-full flex">
              {/* Left side - Cover Art + Verse Text */}
              <div className="w-1/2 h-full relative">
                {/* Background cover image with gradient overlay */}
                {currentTrack.coverImage ? (
                  <img
                    src={currentTrack.coverImage}
                    alt={currentTrack.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary-hover" />
                )}

                {/* Dark gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-background" />

                {/* Verse Text Overlay */}
                {verseData && (
                  <div className="absolute inset-0 flex flex-col justify-center px-12 py-16 overflow-y-auto">
                    {/* Sanskrit */}
                    {verseData.sanskrit && (
                      <div className="mb-6">
                        <p
                          className="text-2xl xl:text-3xl font-sanskrit text-white/95 leading-relaxed text-center"
                          style={{ fontFamily: '"Noto Sans Devanagari", "Siddhanta", serif' }}
                        >
                          {verseData.sanskrit}
                        </p>
                      </div>
                    )}

                    {/* Transliteration */}
                    {verseData.transliteration && (
                      <div className="mb-6">
                        <p className="text-lg xl:text-xl text-white/80 italic leading-relaxed text-center">
                          {verseData.transliteration}
                        </p>
                      </div>
                    )}

                    {/* Divider */}
                    <div className="w-24 h-px bg-white/30 mx-auto my-4" />

                    {/* Translation */}
                    {(verseData.translation_uk || verseData.translation_en) && (
                      <div className="mt-4">
                        <p className="text-base xl:text-lg text-white/90 leading-relaxed text-center max-w-lg mx-auto">
                          {language === 'uk' ? verseData.translation_uk : verseData.translation_en}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* If no verse data, show music icon */}
                {!verseData && !isLoadingVerse && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Music className="w-32 h-32 text-white/30" />
                  </div>
                )}

                {/* Loading state */}
                {isLoadingVerse && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-white/30 border-t-white/80 rounded-full animate-spin" />
                  </div>
                )}

                {/* Gradient overlay for smooth transition to right side */}
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-background" />
              </div>

              {/* Right side - Controls */}
              <div className="flex-1 flex flex-col justify-center px-16 py-12">
                {/* Track Info */}
                <div className="mb-10">
                  <h2 className="text-4xl font-bold text-foreground mb-3 line-clamp-2">
                    {currentTrack.title_uk || currentTrack.title}
                  </h2>
                  {currentTrack.artist && (
                    <p className="text-muted-foreground text-xl mb-2">
                      {currentTrack.artist}
                    </p>
                  )}
                  {(currentTrack.subtitle || currentTrack.title_en) && (
                    <p className="text-muted-foreground text-lg">
                      {currentTrack.subtitle || currentTrack.title_en}
                    </p>
                  )}
                </div>

                {/* Waveform Progress */}
                <div className="mb-10">
                  <WaveformProgressBar
                    audioUrl={currentTrack.src}
                    currentTime={currentTime}
                    duration={duration}
                    onSeek={seek}
                    variant="expanded"
                    height={80}
                    barCount={100}
                  />
                  <div className="flex justify-between text-base text-muted-foreground mt-3">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Main Controls */}
                <div className="flex items-center justify-center gap-6 mb-10">
                  <button
                    onClick={toggleShuffle}
                    className={`p-3 rounded-full transition ${
                      isShuffled
                        ? 'text-primary bg-primary/20'
                        : 'text-muted-foreground hover:text-foreground hover:bg-foreground/10'
                    }`}
                  >
                    <Shuffle className="w-6 h-6" />
                  </button>

                  <button
                    onClick={prevTrack}
                    className="p-3 rounded-full hover:bg-foreground/10 transition text-foreground"
                  >
                    <SkipBack className="w-8 h-8" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="p-6 rounded-full bg-primary text-primary-foreground hover:scale-105 transition shadow-xl"
                  >
                    {isPlaying ? (
                      <Pause className="w-10 h-10" />
                    ) : (
                      <Play className="w-10 h-10 ml-1" />
                    )}
                  </button>

                  <button
                    onClick={nextTrack}
                    className="p-3 rounded-full hover:bg-foreground/10 transition text-foreground"
                  >
                    <SkipForward className="w-8 h-8" />
                  </button>

                  <button
                    onClick={toggleRepeat}
                    className={`p-3 rounded-full transition ${
                      repeatMode !== 'off'
                        ? 'text-primary bg-primary/20'
                        : 'text-muted-foreground hover:text-foreground hover:bg-foreground/10'
                    }`}
                  >
                    {repeatMode === 'one' ?
                      <Repeat1 className="w-6 h-6" /> :
                      <Repeat className="w-6 h-6" />
                    }
                  </button>
                </div>

                {/* Secondary Controls */}
                <div className="flex items-center justify-between max-w-lg mx-auto w-full">
                  {/* Favorite Button */}
                  <button
                    onClick={toggleFavorite}
                    className={`p-2 rounded-full transition ${
                      isCurrentFavorite
                        ? 'text-red-500 bg-red-500/20'
                        : 'text-muted-foreground hover:text-foreground hover:bg-foreground/10'
                    }`}
                    title={isCurrentFavorite
                      ? (language === 'uk' ? 'Видалити з улюблених' : 'Remove from favorites')
                      : (language === 'uk' ? 'Додати до улюблених' : 'Add to favorites')
                    }
                  >
                    <Heart className={`w-6 h-6 ${isCurrentFavorite ? 'fill-current' : ''}`} />
                  </button>

                  {/* Volume */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={toggleMute}
                      className="text-muted-foreground hover:text-foreground transition"
                    >
                      {isMuted || volume === 0 ?
                        <VolumeX className="w-6 h-6" /> :
                        <Volume2 className="w-6 h-6" />
                      }
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-40 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  {/* Settings Menu */}
                  <div className="relative" ref={settingsMenuRef}>
                    <button
                      onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                      className={`p-2 rounded-full transition ${
                        showSettingsMenu
                          ? 'text-primary bg-primary/20'
                          : 'text-muted-foreground hover:text-foreground hover:bg-foreground/10'
                      }`}
                    >
                      <MoreVertical className="w-6 h-6" />
                    </button>

                    {/* Settings Dropdown */}
                    {showSettingsMenu && (
                      <div className="absolute bottom-full right-0 mb-2 w-56 bg-card rounded-lg shadow-xl border border-border overflow-hidden z-50">
                        {/* Sleep Timer */}
                        <button
                          onClick={() => {
                            setShowSleepTimer(true);
                            setShowSettingsMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition text-left"
                        >
                          <Timer className="w-5 h-5 text-muted-foreground" />
                          <span>{language === 'uk' ? 'Таймер сну' : 'Sleep Timer'}</span>
                        </button>

                        {/* Playback Speed */}
                        <div className="relative">
                          <button
                            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition"
                          >
                            <div className="flex items-center gap-3">
                              <Gauge className="w-5 h-5 text-muted-foreground" />
                              <span>{language === 'uk' ? 'Швидкість' : 'Speed'}</span>
                            </div>
                            <span className="text-primary font-medium">{playbackRate}x</span>
                          </button>

                          {/* Speed submenu */}
                          {showSpeedMenu && (
                            <div className="absolute left-full bottom-0 ml-1 w-24 bg-card rounded-lg shadow-xl border border-border overflow-hidden">
                              {speedOptions.map(speed => (
                                <button
                                  key={speed}
                                  onClick={() => {
                                    setPlaybackRate(speed);
                                    setShowSpeedMenu(false);
                                  }}
                                  className={`w-full px-4 py-2 text-center hover:bg-muted/50 transition ${
                                    playbackRate === speed ? 'text-primary font-medium bg-primary/10' : ''
                                  }`}
                                >
                                  {speed}x
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Go to Verse (if verse data available) */}
                        {(currentTrack?.verseId || (currentTrack?.bookSlug && currentTrack?.chapterNumber)) && (
                          <button
                            onClick={() => {
                              goToVersePage();
                              setShowSettingsMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition text-left"
                          >
                            <ExternalLink className="w-5 h-5 text-muted-foreground" />
                            <span>{language === 'uk' ? 'Перейти до вірша' : 'Go to verse'}</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Expanded View - Fullscreen */}
        {isExpanded && isMobile && (
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-accent/30 to-background p-6 overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-foreground/10 hover:bg-foreground/20 transition z-10 text-foreground"
            >
              <ChevronDown className="w-6 h-6 text-white" />
            </button>

            {/* Verse Text for Mobile (if available) */}
            {verseData ? (
              <div className="max-w-md mx-auto mt-12 mb-6 px-4">
                {/* Sanskrit */}
                {verseData.sanskrit && (
                  <div className="mb-4">
                    <p
                      className="text-xl font-sanskrit text-foreground leading-relaxed text-center"
                      style={{ fontFamily: '"Noto Sans Devanagari", "Siddhanta", serif' }}
                    >
                      {verseData.sanskrit}
                    </p>
                  </div>
                )}

                {/* Transliteration */}
                {verseData.transliteration && (
                  <div className="mb-4">
                    <p className="text-base text-muted-foreground italic leading-relaxed text-center">
                      {verseData.transliteration}
                    </p>
                  </div>
                )}

                {/* Divider */}
                <div className="w-16 h-px bg-border mx-auto my-4" />

                {/* Translation */}
                {(verseData.translation_uk || verseData.translation_en) && (
                  <div className="mb-4">
                    <p className="text-sm text-foreground/90 leading-relaxed text-center">
                      {language === 'uk' ? verseData.translation_uk : verseData.translation_en}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Cover Art (Large) - fallback if no verse data */
              <div className="max-w-md mx-auto mt-16 mb-8">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                  {currentTrack.coverImage ? (
                    <img
                      src={currentTrack.coverImage}
                      alt={currentTrack.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary via-accent to-primary-hover flex items-center justify-center">
                      <Music className="w-20 h-20 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Track Info */}
            <div className="max-w-md mx-auto text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2 line-clamp-2">
                {currentTrack.title_uk || currentTrack.title}
              </h2>
              {currentTrack.artist && (
                <p className="text-muted-foreground text-lg mb-1">
                  {currentTrack.artist}
                </p>
              )}
              {(currentTrack.subtitle || currentTrack.title_en) && (
                <p className="text-muted-foreground text-sm">
                  {currentTrack.subtitle || currentTrack.title_en}
                </p>
              )}
            </div>

            {/* Progress Bar (Large) - Waveform */}
            <div className="max-w-md mx-auto mb-4">
              <WaveformProgressBar
                audioUrl={currentTrack.src}
                currentTime={currentTime}
                duration={duration}
                onSeek={seek}
                variant="expanded"
                height={48}
                barCount={60}
              />

              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Main Controls (Large) */}
            <div className="max-w-md mx-auto flex items-center justify-center gap-6 mb-8">
              <button
                onClick={toggleShuffle}
                className={`p-3 rounded-full transition ${
                  isShuffled
                    ? 'text-primary bg-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-foreground/10'
                }`}
              >
                <Shuffle className="w-5 h-5" />
              </button>

              <button
                onClick={prevTrack}
                className="p-3 rounded-full hover:bg-foreground/10 transition text-foreground"
              >
                <SkipBack className="w-7 h-7" />
              </button>

              <button
                onClick={togglePlay}
                className="p-5 rounded-full bg-primary text-primary-foreground hover:scale-105 transition shadow-xl"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </button>

              <button
                onClick={nextTrack}
                className="p-3 rounded-full hover:bg-foreground/10 transition text-foreground"
              >
                <SkipForward className="w-7 h-7" />
              </button>

              <button
                onClick={toggleRepeat}
                className={`p-3 rounded-full transition ${
                  repeatMode !== 'off'
                    ? 'text-primary bg-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-foreground/10'
                }`}
              >
                {repeatMode === 'one' ?
                  <Repeat1 className="w-5 h-5" /> :
                  <Repeat className="w-5 h-5" />
                }
              </button>
            </div>

            {/* Secondary Controls */}
            <div className="max-w-md mx-auto flex items-center justify-between px-4">
              {/* Favorite Button */}
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-full transition ${
                  isCurrentFavorite
                    ? 'text-red-500 bg-red-500/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-foreground/10'
                }`}
              >
                <Heart className={`w-6 h-6 ${isCurrentFavorite ? 'fill-current' : ''}`} />
              </button>

              {/* Volume */}
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleMute}
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  {isMuted || volume === 0 ?
                    <VolumeX className="w-5 h-5" /> :
                    <Volume2 className="w-5 h-5" />
                  }
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-24 h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Settings Menu (Mobile) */}
              <div className="relative" ref={settingsMenuRef}>
                <button
                  onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                  className={`p-2 rounded-full transition ${
                    showSettingsMenu
                      ? 'text-primary bg-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-foreground/10'
                  }`}
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {/* Settings Dropdown (Mobile) */}
                {showSettingsMenu && (
                  <div className="absolute bottom-full right-0 mb-2 w-52 bg-card rounded-lg shadow-xl border border-border overflow-hidden z-50">
                    {/* Sleep Timer */}
                    <button
                      onClick={() => {
                        setShowSleepTimer(true);
                        setShowSettingsMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition text-left"
                    >
                      <Timer className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm">{language === 'uk' ? 'Таймер сну' : 'Sleep Timer'}</span>
                    </button>

                    {/* Playback Speed */}
                    <button
                      onClick={() => {
                        const currentIdx = speedOptions.indexOf(playbackRate);
                        const nextIdx = (currentIdx + 1) % speedOptions.length;
                        setPlaybackRate(speedOptions[nextIdx]);
                      }}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <Gauge className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm">{language === 'uk' ? 'Швидкість' : 'Speed'}</span>
                      </div>
                      <span className="text-primary font-medium text-sm">{playbackRate}x</span>
                    </button>

                    {/* Go to Verse (if verse data available) */}
                    {(currentTrack?.verseId || (currentTrack?.bookSlug && currentTrack?.chapterNumber)) && (
                      <button
                        onClick={() => {
                          goToVersePage();
                          setShowSettingsMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition text-left"
                      >
                        <ExternalLink className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm">{language === 'uk' ? 'Перейти до вірша' : 'Go to verse'}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mini Player (Compact) */}
        {!isExpanded && (
          <div className="bg-card/95 backdrop-blur border-t border-border px-4 py-3 safe-bottom">
            <div className="max-w-6xl mx-auto">
              {/* Progress bar (thin waveform) */}
              <WaveformProgressBar
                audioUrl={currentTrack.src}
                currentTime={currentTime}
                duration={duration}
                onSeek={seek}
                variant="mini"
                className="mb-3"
              />

              <div className="flex items-center justify-between gap-4">
                {/* Track Info + Cover */}
                <div 
                  className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                  onClick={() => setIsExpanded(true)}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                    {currentTrack.coverImage ? (
                      <img 
                        src={currentTrack.coverImage} 
                        alt={currentTrack.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
                        <Music className="w-6 h-6 text-primary-foreground/50" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-card-foreground truncate text-sm">
                      {currentTrack.title_uk || currentTrack.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {currentTrack.artist || currentTrack.subtitle || currentTrack.title_en || 'VedaVoice'}
                    </p>
                  </div>

                  <button className="md:hidden text-muted-foreground">
                    <ChevronUp className="w-5 h-5" />
                  </button>
                </div>

                {/* Desktop Controls */}
                <div className="hidden md:flex items-center gap-2">
                  <button 
                    onClick={prevTrack}
                    className="p-2 rounded-full hover:bg-muted transition"
                  >
                    <SkipBack className="w-5 h-5 text-card-foreground" />
                  </button>

                  <button 
                    onClick={togglePlay}
                    className="p-2.5 rounded-full bg-primary text-primary-foreground hover:scale-105 transition"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" />
                    )}
                  </button>

                  <button 
                    onClick={nextTrack}
                    className="p-2 rounded-full hover:bg-muted transition"
                  >
                    <SkipForward className="w-5 h-5 text-card-foreground" />
                  </button>
                </div>

                {/* Volume (Desktop only) */}
                <div className="hidden lg:flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="text-muted-foreground hover:text-foreground transition"
                  >
                    {isMuted || volume === 0 ?
                      <VolumeX className="w-5 h-5" /> :
                      <Volume2 className="w-5 h-5" />
                    }
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => changeVolume(Number(e.target.value))}
                    className="w-20 h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* Sleep Timer (Desktop) */}
                <div className="hidden md:block">
                  <SleepTimerIndicator onClick={() => setShowSleepTimer(true)} />
                </div>

                {/* Time */}
                <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(duration)}</span>
                </div>

                {/* Mobile Play Button */}
                <button
                  onClick={togglePlay}
                  className="md:hidden p-2 rounded-full bg-primary text-primary-foreground"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-0.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sleep Timer Dialog */}
      <SleepTimerDialog
        isOpen={showSleepTimer}
        onClose={() => setShowSleepTimer(false)}
      />
    </>
  );
};

export default ModernGlobalPlayer;