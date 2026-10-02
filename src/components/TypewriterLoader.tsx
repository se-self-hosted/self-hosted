type TypewriterLoaderProps = {
  className?: string;
  label?: string;
};

export function TypewriterLoader({
  className = "",
  label = "กำลังโหลด...",
}: TypewriterLoaderProps) {
  return (
    <div className={`typewriter-loader${className ? ` ${className}` : ""}`} role="status">
      <div className="typewriter-loader__animation" aria-hidden="true">
        <div className="typewriter-loader__paper">
          <span />
          <span />
          <span />
        </div>
        <div className="typewriter-loader__slide">
          <i />
        </div>
        <div className="typewriter-loader__body" />
        <div className="typewriter-loader__keyboard">
          {Array.from({ length: 10 }, (_, index) => <i key={index} />)}
        </div>
      </div>
      <span className="typewriter-loader__label">{label}</span>
    </div>
  );
}
