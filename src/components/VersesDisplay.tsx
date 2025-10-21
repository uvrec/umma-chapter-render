// src/components/VersesDisplay.tsx - ВИПРАВЛЕНА з двомовними назвами
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { getBlockLabel } from "@/utils/blockLabels";
import { useLanguage } from "@/contexts/LanguageContext";
import type { DisplayBlocks, VerseData } from "@/types/verse-display";

export type { DisplayBlocks, VerseData };

interface VersesDisplayProps {
  verse: VerseData;
  language?: 'ua' | 'en';
  editable?: boolean;
  onBlockToggle?: (block: keyof DisplayBlocks, visible: boolean) => void;
  className?: string;
}

export function VersesDisplay({
  verse,
  language: propLanguage, // приймаємо, але не обов’язково
  editable = false,
  onBlockToggle,
  className = ""
}: VersesDisplayProps) {

  // ✅ головна зміна: слухаємо глобальний контекст
  const { language: contextLanguage } = useLanguage();
  const language = propLanguage || contextLanguage; // проп має пріоритет, якщо явно передано
  
  const displayBlocks: DisplayBlocks = verse.display_blocks || {
    sanskrit: true,
    transliteration: true,
    synonyms: true,
    translation: true,
    commentary: true
  };

  // Вибираємо поля в залежності від мови
  const synonyms = language === 'ua' ? verse.synonyms_ua : verse.synonyms_en;
  const translation = language === 'ua' ? verse.translation_ua : verse.translation_en;
  const commentary = language === 'ua' ? verse.commentary_ua : verse.commentary_en;

  const hasContent = (content?: string | null): boolean => {
    return content !== null && content !== undefined && content.trim() !== '';
  };

  const shouldShow = (block: keyof DisplayBlocks, content?: string | null): boolean => {
    return displayBlocks[block] && hasContent(content);
  };

  const handleToggle = (block: keyof DisplayBlocks) => {
    if (onBlockToggle) {
      onBlockToggle(block, !displayBlocks[block]);
    }
  };

  return (
    <div className={`verse-display space-y-6 ${className}`}>
      
      {/* САНСКРИТ (спільний блок) */}
      {shouldShow('sanskrit', verse.sanskrit) && (
        <div className="sanskrit-block">
          <div className="text-center font-sanskrit text-2xl leading-relaxed text-primary">
            {verse.sanskrit}
          </div>
        </div>
      )}

      {/* ТРАНСЛІТЕРАЦІЯ */}
      {shouldShow('transliteration', verse.transliteration) && (
        <div className="transliteration-block">
          <div className="text-center italic text-lg text-muted-foreground leading-relaxed">
            {verse.transliteration}
          </div>
        </div>
      )}

      {/* ПОСЛІВНИЙ ПЕРЕКЛАД */}
      {shouldShow('synonyms', synonyms) && (
        <div className="synonyms-block border-l-4 border-primary/50 pl-4 py-2 bg-muted/30 rounded-r">
          <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide text-primary">
            {getBlockLabel('synonyms', language)}:
          </h4>
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {synonyms}
          </div>
        </div>
      )}

      {/* ПЕРЕКЛАД */}
      {shouldShow('translation', translation) && (
        <div className="translation-block bg-primary/5 dark:bg-primary/10 p-6 rounded-lg border border-primary/20">
          <p className="font-medium text-lg leading-relaxed">
            {translation}
          </p>
        </div>
      )}

      {/* ПОЯСНЕННЯ */}
      {shouldShow('commentary', commentary) && (
        <div className="commentary-block prose prose-lg dark:prose-invert max-w-none">
          <div 
            className="leading-relaxed"
            dangerouslySetInnerHTML={{ __html: commentary || '' }} 
          />
        </div>
      )}

      {/* КНОПКИ КЕРУВАННЯ */}
      {editable && (
        <div className="edit-controls mt-8 pt-6 border-t border-border">
          <h5 className="text-sm font-semibold mb-3 text-muted-foreground">
            Керування відображенням блоків:
          </h5>
          <div className="flex gap-2 flex-wrap">
            
            {hasContent(verse.sanskrit) && (
              <Button
                variant={displayBlocks.sanskrit ? "default" : "outline"}
                size="sm"
                onClick={() => handleToggle('sanskrit')}
              >
                {displayBlocks.sanskrit ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                {getBlockLabel('sanskrit', language)}
              </Button>
            )}

            {hasContent(verse.transliteration) && (
              <Button
                variant={displayBlocks.transliteration ? "default" : "outline"}
                size="sm"
                onClick={() => handleToggle('transliteration')}
              >
                {displayBlocks.transliteration ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                {getBlockLabel('transliteration', language)}
              </Button>
            )}

            {hasContent(synonyms) && (
              <Button
                variant={displayBlocks.synonyms ? "default" : "outline"}
                size="sm"
                onClick={() => handleToggle('synonyms')}
              >
                {displayBlocks.synonyms ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                {getBlockLabel('synonyms', language)}
              </Button>
            )}

            {hasContent(translation) && (
              <Button
                variant={displayBlocks.translation ? "default" : "outline"}
                size="sm"
                onClick={() => handleToggle('translation')}
              >
                {displayBlocks.translation ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                {getBlockLabel('translation', language)}
              </Button>
            )}

            {hasContent(commentary) && (
              <Button
                variant={displayBlocks.commentary ? "default" : "outline"}
                size="sm"
                onClick={() => handleToggle('commentary')}
              >
                {displayBlocks.commentary ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                {getBlockLabel('commentary', language)}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Повідомлення якщо всі блоки порожні */}
      {!shouldShow('sanskrit', verse.sanskrit) &&
       !shouldShow('transliteration', verse.transliteration) &&
       !shouldShow('synonyms', synonyms) &&
       !shouldShow('translation', translation) &&
       !shouldShow('commentary', commentary) && (
        <div className="empty-verse text-center py-8 text-muted-foreground">
          <p className="text-sm">Контент відсутній або прихований</p>
        </div>
      )}
    </div>
  );
}
