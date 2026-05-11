export default function PrimaryButton({
  children,
  onClick,
  disabled = false,
  fullWidth = true,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden rounded-2xl px-6 py-4
        font-medium tracking-tight
        transition-all duration-300
        ${
          disabled
            ? "cursor-not-allowed bg-slate-700 text-slate-400"
            : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.02] hover:shadow-cyan-400/30 active:scale-[0.99]"
        }
        ${fullWidth ? "w-full" : ""}
      `}
    >
      {children}
    </button>
  );
}