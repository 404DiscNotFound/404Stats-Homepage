const LOGO_URL = "https://media.base44.com/images/public/6a45bdde3d4c1a80f637ab4f/81c7bc5c8_logo-404.png";

export default function GlitchLogo({ size = "md", className = "" }) {
  const sizes = { sm: "h-7", md: "h-10", lg: "h-16", xl: "h-24", "2xl": "h-40" };
  return (
    <img
      src={LOGO_URL}
      alt="404Stats"
      className={`${sizes[size]} w-auto object-contain ${className}`}
    />
  );
}