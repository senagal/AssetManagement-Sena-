export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      className={`btn btn-${variant} w-100 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
