interface AudioEmbedProps {
  url: string;
  className?: string;
}

export const AudioEmbed = ({ url, className = "" }: AudioEmbedProps) => {
  const lowerUrl = url.toLowerCase();
  const isSpotify = lowerUrl.includes("spotify.com");
  const isSoundCloud = lowerUrl.includes("soundcloud.com");
  const isYouTube = lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be");
  const isBandcamp = lowerUrl.includes("bandcamp.com");
  const isDirectAudio = /\.(mp3|wav|ogg|m4a|flac)$/.test(lowerUrl);

  // Spotify embed
  if (isSpotify) {
    const match = url.match(/spotify\.com\/(track|playlist|album)\/([a-zA-Z0-9]+)/);
    if (match) {
      const [, type, id] = match;
      return (
        <div className={className}>
          <iframe
            src={`https://open.spotify.com/embed/${type}/${id}`}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-lg"
          />
        </div>
      );
    }
  }

  // SoundCloud embed
  if (isSoundCloud) {
    return (
      <div className={className}>
        <iframe
          width="100%"
          height="166"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
            url,
          )}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
          loading="lazy"
          className="rounded-lg"
        />
      </div>
    );
  }

  // YouTube Music / YouTube
  if (isYouTube) {
    const videoIdMatch = url.match(/(?:v=|youtu\.be\/)([\w-]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    if (videoId) {
      return (
        <div className={className}>
          <iframe
            width="100%"
            height="200"
            src={`https://www.youtube.com/embed/${videoId}?rel=0`}
            title="YouTube audio/video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          />
        </div>
      );
    }
  }

  // Bandcamp embed
  if (isBandcamp) {
    return (
      <div className={className}>
        <iframe
          style={{ border: 0, width: "100%", height: "120px" }}
          src={`https://bandcamp.com/EmbeddedPlayer/${url
            .split("bandcamp.com/")[1]
            .replace("/", "=")}=size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/transparent=true/`}
          seamless
          loading="lazy"
        />
      </div>
    );
  }

  // Direct MP3 / audio file
  if (isDirectAudio) {
    return (
      <div className={className}>
        <audio controls preload="none" className="w-full mt-2">
          <source src={url} />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }

  return (
    <div className="p-4 border border-destructive rounded-md text-center">
      <p className="text-destructive text-sm">
        Непідтримувана платформа. Підтримуються: Spotify, SoundCloud, YouTube, Bandcamp або пряме MP3-посилання.
      </p>
    </div>
  );
};
