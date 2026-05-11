export default function AppShell({ children }) {
  return (
    <main className="min-h-screen px-6 py-8 text-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-6xl flex-col">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/70">
              Neurovenus
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              Research Session Portal
            </h1>
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
            Secure participant access
          </div>
        </header>

        <section className="flex flex-1 items-center justify-center">
          {children}
        </section>
      </div>
    </main>
  );
}