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
import { stripParagraphTags } from '@/utils/import/normalizers';
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

  const { language, getLocalizedPath } = useLanguage();
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
      navigate(getLocalizedPath(`/verse/${currentTrack.verseId}`));
      setIsExpanded(false);
    } else if (currentTrack?.bookSlug && currentTrack?.chapterNumber && currentTrack?.verseNumber) {
      const { bookSlug, cantoNumber, chapterNumber, verseNumber } = currentTrack;
      const path = cantoNumber
        ? `/lib/${bookSlug}/${cantoNumber}/${chapterNumber}/${verseNumber}`
        : `/lib/${bookSlug}/${chapterNumber}/${verseNumber}`;
      navigate(getLocalizedPath(path));
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
          .select('sanskrit, transliteration, transliteration_uk, transliteration_en, translation_uk, translation_en, synonyms_uk, synonyms_en')
          .eq('id', currentTrack.verseId)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setVerseData({
            sanskrit: data.sanskrit,
            transliteration: data.transliteration || data.transliteration_uk || data.transliteration_en,
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
        {/* Desktop Expanded View - Clean Vertical Layout */}
        {isExpanded && !isMobile && (
          <div className="absolute inset-0 bg-background flex flex-col">
            {/* Header with close button */}
            <div className="flex items-center justify-between px-8 py-4 border-b border-border/50">
              <div className="flex items-center gap-4">
                {/* Mini cover in header */}
                <div className="w-12 h-12 rounded-lg overflow-hidden shadow-md flex-shrink-0">
                  {currentTrack.coverImage ? (
                    <img
                      src={currentTrack.coverImage}
                      alt={currentTrack.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                      <Music className="w-6 h-6 text-primary" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground line-clamp-1">
                    {currentTrack.title_uk || currentTrack.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {currentTrack.artist || currentTrack.subtitle || 'VedaVoice'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-3 rounded-full hover:bg-muted transition"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
            </div>

            {/* Main Content Area - Scrollable Text */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto px-8 py-12">
                {/* Cover Art + Track Info Section */}
                <div className="flex flex-col items-center mb-12">
                  {/* Cover Art */}
                  <div className="w-48 h-48 xl:w-56 xl:h-56 rounded-2xl overflow-hidden shadow-2xl mb-6">
                    {currentTrack.coverImage ? (
                      <img
                        src={currentTrack.coverImage}
                        alt={currentTrack.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                        <Music className="w-20 h-20 text-primary/50" />
                      </div>
                    )}
                  </div>

                  {/* Track Title & Metadata */}
                  <h2 className="text-3xl xl:text-4xl font-bold text-foreground text-center mb-2">
                    {currentTrack.title_uk || currentTrack.title}
                  </h2>
                  {currentTrack.artist && (
                    <p className="text-xl text-muted-foreground text-center mb-1">
                      {currentTrack.artist}
                    </p>
                  )}
                  {(currentTrack.subtitle || currentTrack.title_en) && (
                    <p className="text-lg text-muted-foreground/70 text-center">
                      {currentTrack.subtitle || currentTrack.title_en}
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="w-32 h-px bg-border mx-auto mb-12" />

                {/* Verse Text Content - Large Readable Font */}
                {isLoadingVerse && (
                  <div className="flex justify-center py-12">
                    <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                  </div>
                )}

                {verseData && !isLoadingVerse && (
                  <div className="space-y-10">
                    {/* Sanskrit */}
                    {verseData.sanskrit && (
                      <div className="text-center">
                        <p
                          className="text-2xl xl:text-3xl 2xl:text-4xl text-foreground leading-relaxed"
                          style={{ fontFamily: '"Noto Sans Devanagari", "Siddhanta", serif' }}
                        >
                          {verseData.sanskrit}
                        </p>
                      </div>
                    )}

                    {/* Transliteration */}
                    {verseData.transliteration && (
                      <div className="text-center">
                        <p className="text-xl xl:text-2xl text-muted-foreground italic leading-relaxed">
                          {verseData.transliteration}
                        </p>
                      </div>
                    )}

                    {/* Divider between original and translation */}
                    <div className="w-24 h-px bg-border/60 mx-auto" />

                    {/* Translation - Large readable text */}
                    {(verseData.translation_uk || verseData.translation_en) && (
                      <div className="text-center max-w-3xl mx-auto">
                        <p className="text-xl xl:text-2xl text-foreground/90 leading-relaxed">
                          {stripParagraphTags(language === 'uk' ? verseData.translation_uk || '' : verseData.translation_en || '')}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* No verse data - show placeholder */}
                {!verseData && !isLoadingVerse && (
                  <div className="text-center py-12">
                    <Music className="w-24 h-24 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {language === 'uk' ? 'Текст недоступний' : 'Text not available'}
                    </p>
                  </div>
                )}

                {/* Bottom spacing for player */}
                <div className="h-8" />
              </div>
            </div>

            {/* Fixed Bottom Player Controls */}
            <div className="border-t border-border bg-card/95 backdrop-blur-sm px-8 py-6">
              <div className="max-w-4xl mx-auto">
                {/* Waveform Progress */}
                <div className="mb-6">
                  <WaveformProgressBar
                    audioUrl={currentTrack.src}
                    currentTime={currentTime}
                    duration={duration}
                    onSeek={seek}
                    variant="expanded"
                    height={64}
                    barCount={120}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Main Controls */}
                <div className="flex items-center justify-center gap-6 mb-4">
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
                    className="p-5 rounded-full bg-primary text-primary-foreground hover:scale-105 transition shadow-lg"
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
                <div className="flex items-center justify-between max-w-xl mx-auto">
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
                    <Heart className={`w-5 h-5 ${isCurrentFavorite ? 'fill-current' : ''}`} />
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
                      className="w-32 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
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
                      <MoreVertical className="w-5 h-5" />
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

        {/* Mobile Expanded View - Clean Minimal Design */}
        {isExpanded && isMobile && (
          <div className="absolute inset-0 bg-background flex flex-col safe-top safe-bottom">
            {/* Header - minimal with close button */}
            <div className="flex items-center justify-center px-4 py-3 relative">
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute left-4 p-2 rounded-full hover:bg-muted transition"
              >
                <ChevronDown className="w-6 h-6 text-muted-foreground" />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {language === 'uk' ? 'Зараз грає' : 'Now Playing'}
                </span>
              </div>
              <div className="relative absolute right-4" ref={settingsMenuRef}>
                <button
                  onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                  className="p-2 rounded-full hover:bg-muted transition text-muted-foreground"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                {showSettingsMenu && (
                  <div className="absolute top-full right-0 mt-2 w-52 bg-card rounded-xl shadow-xl border border-border overflow-hidden z-50">
                    <button
                      onClick={() => { setShowSleepTimer(true); setShowSettingsMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition text-left"
                    >
                      <Timer className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm">{language === 'uk' ? 'Таймер сну' : 'Sleep Timer'}</span>
                    </button>
                    <button
                      onClick={() => {
                        const nextIdx = (speedOptions.indexOf(playbackRate) + 1) % speedOptions.length;
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
                    {(currentTrack?.verseId || (currentTrack?.bookSlug && currentTrack?.chapterNumber)) && (
                      <button
                        onClick={() => { goToVersePage(); setShowSettingsMenu(false); }}
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

            {/* Main Content */}
            <div className="flex-1 flex flex-col px-6 pb-6 overflow-hidden">
              {/* Cover Art - Large, almost full width */}
              <div className="flex-shrink-0 flex justify-center py-4">
                <div className="w-full max-w-[280px] aspect-square rounded-2xl overflow-hidden shadow-2xl">
                  {currentTrack.coverImage ? (
                    <img
                      src={currentTrack.coverImage}
                      alt={currentTrack.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                      <Music className="w-20 h-20 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              </div>

              {/* Track Info */}
              <div className="text-center mt-4 mb-6">
                <h2 className="text-xl font-bold text-foreground line-clamp-2 mb-1">
                  {currentTrack.title_uk || currentTrack.title}
                </h2>
                <p className="text-muted-foreground">
                  {currentTrack.artist || currentTrack.subtitle || 'VedaVoice'}
                </p>
              </div>

              {/* Progress Bar - Simple slider */}
              <div className="mb-6">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => seek(Number(e.target.value))}
                  className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer accent-foreground [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:appearance-none"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>{formatTime(currentTime)}</span>
                  <span className="text-foreground/60">
                    {currentTrack.subtitle || currentTrack.title_en || ''}
                  </span>
                  <span>-{formatTime(Math.max(0, duration - currentTime))}</span>
                </div>
              </div>

              {/* Main Controls - Large */}
              <div className="flex items-center justify-center gap-8 mb-6">
                <button
                  onClick={prevTrack}
                  className="p-3 text-foreground active:scale-95 transition"
                >
                  <SkipBack className="w-8 h-8" fill="currentColor" />
                </button>

                <button
                  onClick={togglePlay}
                  className="p-5 rounded-full bg-foreground text-background active:scale-95 transition shadow-lg"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8" fill="currentColor" />
                  ) : (
                    <Play className="w-8 h-8 ml-1" fill="currentColor" />
                  )}
                </button>

                <button
                  onClick={nextTrack}
                  className="p-3 text-foreground active:scale-95 transition"
                >
                  <SkipForward className="w-8 h-8" fill="currentColor" />
                </button>
              </div>

              {/* Secondary Controls Row */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <button
                  onClick={toggleFavorite}
                  className={`p-2.5 rounded-full transition ${
                    isCurrentFavorite ? 'text-red-500' : 'text-muted-foreground'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isCurrentFavorite ? 'fill-current' : ''}`} />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="p-2.5 text-muted-foreground"
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
                    className="w-24 h-1 bg-muted rounded-full appearance-none cursor-pointer accent-foreground"
                  />
                </div>

                <button
                  onClick={toggleRepeat}
                  className={`p-2.5 rounded-full transition ${
                    repeatMode !== 'off' ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {repeatMode === 'one' ? <Repeat1 className="w-6 h-6" /> : <Repeat className="w-6 h-6" />}
                </button>
              </div>

              {/* Tags/Badges (optional) */}
              {(currentTrack.bookSlug || currentTrack.chapterNumber) && (
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {currentTrack.bookSlug && (
                    <span className="px-3 py-1.5 bg-muted rounded-full text-xs font-medium text-muted-foreground">
                      {currentTrack.bookSlug.toUpperCase()}
                    </span>
                  )}
                  {currentTrack.chapterNumber && (
                    <span className="px-3 py-1.5 bg-muted rounded-full text-xs font-medium text-muted-foreground">
                      {language === 'uk' ? 'Глава' : 'Chapter'} {currentTrack.chapterNumber}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mini Player (Compact) */}
        {!isExpanded && (
          <div className="mx-3 mb-3 px-4 py-3 rounded-full bg-background/60 backdrop-blur-xl border border-white/10 shadow-lg safe-bottom">
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

              <div className="flex items-center gap-2 md:gap-4">
                {/* Track Info + Cover - shrinks on mobile to give space for controls */}
                <div
                  className="flex items-center gap-2 md:gap-3 min-w-0 cursor-pointer flex-shrink md:flex-shrink-0 md:w-auto"
                  onClick={() => setIsExpanded(true)}
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                    {currentTrack.coverImage ? (
                      <img
                        src={currentTrack.coverImage}
                        alt={currentTrack.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
                        <Music className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground/50" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 hidden sm:block md:block">
                    <p className="font-medium text-card-foreground truncate text-sm max-w-[120px] md:max-w-none">
                      {currentTrack.title_uk || currentTrack.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate max-w-[120px] md:max-w-none">
                      {currentTrack.artist || currentTrack.subtitle || currentTrack.title_en || 'VedaVoice'}
                    </p>
                  </div>
                </div>

                {/* Central Controls - visible on all devices */}
                <div className="flex items-center justify-center gap-1 md:gap-2 flex-1">
                  <button
                    onClick={prevTrack}
                    className="p-1.5 md:p-2 rounded-full hover:bg-muted transition"
                  >
                    <SkipBack className="w-4 h-4 md:w-5 md:h-5 text-card-foreground" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="p-2 md:p-2.5 rounded-full bg-primary text-primary-foreground hover:scale-105 transition"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 md:w-5 md:h-5" />
                    ) : (
                      <Play className="w-5 h-5 md:w-5 md:h-5 ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={nextTrack}
                    className="p-1.5 md:p-2 rounded-full hover:bg-muted transition"
                  >
                    <SkipForward className="w-4 h-4 md:w-5 md:h-5 text-card-foreground" />
                  </button>
                </div>

                {/* Volume - visible on all devices but smaller on mobile */}
                <div className="flex items-center gap-1 md:gap-2">
                  <button
                    onClick={toggleMute}
                    className="text-muted-foreground hover:text-foreground transition p-1"
                  >
                    {isMuted || volume === 0 ?
                      <VolumeX className="w-4 h-4 md:w-5 md:h-5" /> :
                      <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
                    }
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => changeVolume(Number(e.target.value))}
                    className="w-12 md:w-20 h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* Sleep Timer - visible on all devices */}
                <div className="flex-shrink-0">
                  <SleepTimerIndicator onClick={() => setShowSleepTimer(true)} />
                </div>

                {/* Time - hidden on mobile, shown on tablet+ */}
                <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground flex-shrink-0">
                  <span>{formatTime(currentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(duration)}</span>
                </div>

                {/* Expand button - mobile only */}
                <button
                  onClick={() => setIsExpanded(true)}
                  className="md:hidden p-1.5 rounded-full hover:bg-muted transition text-muted-foreground"
                >
                  <ChevronUp className="w-5 h-5" />
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