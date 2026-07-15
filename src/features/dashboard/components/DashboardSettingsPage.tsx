export function DashboardSettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h2 className="font-serif text-2xl font-medium text-[#2a1f16]">
          Settings
        </h2>
        <p className="mt-1 text-sm text-[#7a6b5d]">
          Admin security preferences — UI only for this release.
        </p>
      </div>

      <section className="space-y-4 rounded-2xl border border-[#e8ddd2] bg-white px-5 py-6">
        <h3 className="text-sm font-medium tracking-[0.12em] text-[#8a7a6c] uppercase">
          Session security
        </h3>
        <ul className="space-y-3 text-sm text-[#5c4f43]">
          <li className="flex items-start gap-3 rounded-xl bg-[#FEF9F6] px-4 py-3">
            <span className="mt-0.5 size-2 shrink-0 rounded-full bg-[#c4a574]" />
            Access token stored in httpOnly cookie (not localStorage).
          </li>
          <li className="flex items-start gap-3 rounded-xl bg-[#FEF9F6] px-4 py-3">
            <span className="mt-0.5 size-2 shrink-0 rounded-full bg-[#c4a574]" />
            Refresh token hashed in database and rotated on refresh.
          </li>
          <li className="flex items-start gap-3 rounded-xl bg-[#FEF9F6] px-4 py-3">
            <span className="mt-0.5 size-2 shrink-0 rounded-full bg-[#c4a574]" />
            Dashboard route redirects guests to login (client gate).
          </li>
          <li className="flex items-start gap-3 rounded-xl bg-[#FEF9F6] px-4 py-3">
            <span className="mt-0.5 size-2 shrink-0 rounded-full bg-[#c4a574]" />
            Next: `ADMIN` role + server middleware for write APIs.
          </li>
        </ul>
      </section>

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
          Editing is disabled until admin settings API is available.
        </p>
      </section>
    </div>
  );
}
