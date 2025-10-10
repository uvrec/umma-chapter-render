import { extractVideoId } from "@/utils/blogHelpers";

interface VideoEmbedProps {
  url: string;
  className?: string;
}

export const VideoEmbed = ({ url, className = "" }: VideoEmbedProps) => {
  const videoData = extractVideoId(url);

  if (!videoData) {
    return (
      <div className="p-4 border border-destructive rounded-md bg-destructive/10">
        <p className="text-destructive text-sm">Невірне або непідтримуване посилання на відео</p>
      </div>
    );
  }

  const { platform, id } = videoData;

  const embedUrl =
    platform === "youtube"
      ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&color=white`
      : platform === "vimeo"
        ? `https://player.vimeo.com/video/${id}?portrait=0&title=0&byline=0`
        : null;

  if (!embedUrl) {
    return (
      <div className="p-4 border border-destructive rounded-md bg-destructive/10">
        <p className="text-destructive text-sm">Цей тип відео наразі не підтримується</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden rounded-lg bg-black ${className}`}>
      <div className="relative w-full pb-[56.25%]">
        {" "}
        {/* 16:9 aspect ratio */}
        <iframe
          src={embedUrl}
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
          title="Embedded video"
        />
      </div>
    </div>
  );
};
