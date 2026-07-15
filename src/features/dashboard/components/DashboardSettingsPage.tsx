export function DashboardSettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h2 className="font-serif text-2xl font-medium text-[#2a1f16]">
          Settings
        </h2>
        <p className="mt-1 text-sm text-[#7a6b5d]">
          Store preferences for your admin account.
        </p>
      </div>

      <section className="rounded-2xl border border-[#e8ddd2] bg-white px-5 py-6">
        <h3 className="text-sm font-medium tracking-[0.12em] text-[#8a7a6c] uppercase">
          Store profile
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1.5 block text-[11px] tracking-[0.12em] text-[#8a7a6c] uppercase">
              Store name
            </span>
            <input
              disabled
              defaultValue="SOLV"
              className="w-full rounded-xl border border-[#e8ddd2] bg-[#FEF9F6] px-3 py-2.5 text-[#2a1f16] opacity-80"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-[11px] tracking-[0.12em] text-[#8a7a6c] uppercase">
              Currency
            </span>
            <input
              disabled
              defaultValue="QAR"
              className="w-full rounded-xl border border-[#e8ddd2] bg-[#FEF9F6] px-3 py-2.5 text-[#2a1f16] opacity-80"
            />
          </label>
        </div>
        <p className="mt-4 text-xs text-[#8a7a6c]">
          Store profile editing will be available in a later update.
        </p>
      </section>
    </div>
  );
}
