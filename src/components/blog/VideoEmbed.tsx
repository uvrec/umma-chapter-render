import { extractVideoId } from "@/utils/blogHelpers";

interface VideoEmbedProps {
  url: string;
  className?: string;
}

export const VideoEmbed = ({ url, className = "" }: VideoEmbedProps) => {
  const videoData = extractVideoId(url);

  if (!videoData) {
    return (
      <div className="p-4 border border-destructive rounded-md">
        <p className="text-destructive text-sm">Invalid video URL</p>
      </div>
    );
  }

  const { platform, id } = videoData;
  const embedUrl = platform === 'youtube' 
    ? `https://www.youtube.com/embed/${id}`
    : `https://player.vimeo.com/video/${id}`;

  return (
    <div className={`relative w-full pb-[56.25%] ${className}`}>
      <iframe
        src={embedUrl}
        className="absolute top-0 left-0 w-full h-full rounded-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
};
