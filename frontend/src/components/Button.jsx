export default function Button({
  children,
  type = "button",
  onClick,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition ${className}`}
    >
      {children}
    </button>
  );
}
