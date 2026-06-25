/**
 * DistillLearn Logo component.
 *
 * Usage:
 *   <Logo />
 *   <Logo className="h-10" />    — override size via className
 */
export default function Logo({ className = "", ...props }) {
  return (
    <img
      src="/logo.png"
      alt="DistillLearn Logo"
      className={`h-8 w-auto object-contain ${className}`}
      {...props}
    />
  );
}
