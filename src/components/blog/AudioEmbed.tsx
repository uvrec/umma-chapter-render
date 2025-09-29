interface AudioEmbedProps {
  url: string;
  className?: string;
}

export const AudioEmbed = ({ url, className = "" }: AudioEmbedProps) => {
  const isSpotify = url.includes('spotify.com');
  const isSoundCloud = url.includes('soundcloud.com');

  if (isSpotify) {
    // Extract Spotify track/playlist/album ID
    const spotifyMatch = url.match(/spotify\.com\/(track|playlist|album)\/([a-zA-Z0-9]+)/);
    if (spotifyMatch) {
      const [, type, id] = spotifyMatch;
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

  if (isSoundCloud) {
    return (
      <div className={className}>
        <iframe
          width="100%"
          height="166"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
          loading="lazy"
          className="rounded-lg"
        />
      </div>
    );
  }

  return (
    <div className="p-4 border border-destructive rounded-md">
      <p className="text-destructive text-sm">Unsupported audio platform. Please use Spotify or SoundCloud.</p>
    </div>
  );
};
