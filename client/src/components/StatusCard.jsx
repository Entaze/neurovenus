export default function StatusCard({
  title,
  subtitle,
  children,
  className = "",
}) {
  return (
    <div
      className={`w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0f172a] p-10 shadow-2xl shadow-black/30 ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-8">
          {title && (
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="mt-3 text-base leading-7 text-slate-300">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {children}
    </div>
  );
}