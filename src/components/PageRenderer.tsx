import { TiptapRenderer } from "./blog/TiptapRenderer";
import type { PageBlock } from "./admin/PageBuilder";

interface PageContent {
  content_uk?: string;
  content_en?: string;
  hero_image_url?: string;
  banner_image_url?: string;
  sections?: PageBlock[];
}

interface PageRendererProps {
  page: PageContent;
  language: string;
}

const BlockRenderer = ({ block, language }: { block: PageBlock; language: string }) => {
  switch (block.type) {
    case "text":
      const textContent = language === "uk" ? block.content.text_ua : block.content.text_en;
      return textContent ? <TiptapRenderer content={textContent} /> : null;

    case "heading": {
      const HeadingTag = `h${block.content.level || 2}` as keyof JSX.IntrinsicElements;
      const headingText = language === "uk" ? block.content.text_ua : block.content.text_en;
      return headingText ? <HeadingTag className="font-bold mb-4">{headingText}</HeadingTag> : null;
    }

    case "verse": {
      const display_blocks = block.content.display_blocks || {
        sanskrit: true,
        transliteration: true,
        synonyms: true,
        translation: true,
        commentary: true,
      };
      return (
        <div className="verse-block space-y-4 my-6 p-6 bg-muted/30 rounded-lg">
          {display_blocks.sanskrit && block.content.sanskrit && (
            <div className="sanskrit text-lg">{block.content.sanskrit}</div>
          )}
          {display_blocks.transliteration && block.content.transliteration && (
            <div className="transliteration text-muted-foreground italic">{block.content.transliteration}</div>
          )}
          {display_blocks.synonyms && block.content.synonyms && (
            <div className="synonyms text-sm"><strong>Послівний переклад:</strong> {block.content.synonyms}</div>
          )}
          {display_blocks.translation && (
            <div className="translation font-bold">
              {language === "uk" && block.content.translation_ua && <TiptapRenderer content={block.content.translation_ua} />}
              {language === "en" && block.content.translation_en && <TiptapRenderer content={block.content.translation_en} />}
            </div>
          )}
          {display_blocks.commentary && (
            <div className="commentary">
              {language === "uk" && block.content.commentary_ua && <TiptapRenderer content={block.content.commentary_ua} />}
              {language === "en" && block.content.commentary_en && <TiptapRenderer content={block.content.commentary_en} />}
            </div>
          )}
        </div>
      );
    }

    case "image":
      const imageCaption = language === "uk" ? block.content.caption_ua : block.content.caption_en;
      return block.content.url ? (
        <figure className="my-6">
          <img src={block.content.url} alt={imageCaption || ""} className="w-full rounded-lg" loading="lazy" />
          {imageCaption && <figcaption className="text-sm text-muted-foreground text-center mt-2">{imageCaption}</figcaption>}
        </figure>
      ) : null;

    case "audio":
      const audioCaption = language === "uk" ? block.content.caption_ua : block.content.caption_en;
      return block.content.url ? (
        <div className="my-6">
          <audio controls className="w-full">
            <source src={block.content.url} />
          </audio>
          {audioCaption && <p className="text-sm text-muted-foreground mt-2">{audioCaption}</p>}
        </div>
      ) : null;

    case "video":
      const videoCaption = language === "uk" ? block.content.caption_ua : block.content.caption_en;
      return block.content.url ? (
        <div className="my-6">
          <video controls className="w-full rounded-lg">
            <source src={block.content.url} />
          </video>
          {videoCaption && <p className="text-sm text-muted-foreground mt-2">{videoCaption}</p>}
        </div>
      ) : null;

    case "divider":
      return <hr className="my-8 border-t" />;

    default:
      return null;
  }
};

export const PageRenderer = ({ page, language }: PageRendererProps) => {
  // Нова блокова структура
  if (page.sections && page.sections.length > 0) {
    return (
      <div className="space-y-8">
        {page.sections.map((block) => (
          <BlockRenderer key={block.id} block={block} language={language} />
        ))}
      </div>
    );
  }

  // Старий формат (fallback)
  const content = language === "uk" ? page.content_uk : page.content_en;

  return (
    <div className="space-y-8">
      {page.hero_image_url && (
        <div className="w-full h-[400px] relative overflow-hidden rounded-lg">
          <img
            src={page.hero_image_url}
            alt="Hero"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {page.banner_image_url && !page.hero_image_url && (
        <div className="w-full h-[200px] relative overflow-hidden rounded-lg">
          <img
            src={page.banner_image_url}
            alt="Banner"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {content && <TiptapRenderer content={content} />}
    </div>
  );
};
