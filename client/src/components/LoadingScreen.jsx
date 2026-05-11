import AppShell from "./AppShell";

export default function LoadingScreen({ message = "Loading..." }) {
  return (
    <AppShell>
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">
        <div className="flex flex-col items-center gap-6">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-cyan-400/20 border-t-cyan-400" />
          <p className="text-center text-slate-300">{message}</p>
        </div>
      </div>
    </AppShell>
  );
}