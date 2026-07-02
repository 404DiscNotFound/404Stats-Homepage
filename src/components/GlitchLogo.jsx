const LOGO_URL = "https://media.base44.com/images/public/user_696f6c19e19dc7322bc90c15/b03fab626_2c50eedb-1b2b-4507-a7d2-83b96b5fed1a.png";

export default function GlitchLogo({ size = "md", className = "" }) {
  const sizes = { sm: "h-7", md: "h-10", lg: "h-16", xl: "h-24" };
  return (
    <img
      src={LOGO_URL}
      alt="404Stats"
      className={`${sizes[size]} w-auto object-contain ${className}`}
    />
  );
}