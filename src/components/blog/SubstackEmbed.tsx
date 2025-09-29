interface SubstackEmbedProps {
  url: string;
  className?: string;
}

export const SubstackEmbed = ({ url, className = "" }: SubstackEmbedProps) => {
  return (
    <div className={`w-full ${className}`}>
      <iframe
        src={url}
        width="100%"
        height="320"
        style={{ border: '1px solid #EEE', background: 'white' }}
        frameBorder="0"
        scrolling="no"
        loading="lazy"
        className="rounded-lg"
      />
    </div>
  );
};
