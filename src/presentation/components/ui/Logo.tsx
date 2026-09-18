interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Logo = ({ size = "md", className = "" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
  };

  const imageClass = `${sizeClasses[size]} w-auto`;

  return (
    <span
      className={`inline-flex items-center ${className}`}
      aria-hidden="true"
    >
      <img
        src="/brand/horacio-laphitz-mark.png"
        alt=""
        width="537"
        height="441"
        className={`${imageClass} dark:hidden`}
        decoding="async"
      />
      <img
        src="/brand/horacio-laphitz-mark-inverse.png"
        alt=""
        width="537"
        height="441"
        className={`${imageClass} hidden dark:block`}
        decoding="async"
      />
    </span>
  );
};

export default Logo;
