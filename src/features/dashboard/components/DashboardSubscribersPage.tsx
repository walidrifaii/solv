import { dashboardMock } from "@/features/dashboard/data";

export function DashboardSubscribersPage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif text-2xl font-medium text-[#2a1f16]">
          Subscribers
        </h2>
        <p className="mt-1 text-sm text-[#7a6b5d]">
          Newsletter signups from the site footer and home section.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e8ddd2] bg-white">
        <ul className="divide-y divide-[#f0e7de]">
          {dashboardMock.subscribersPreview.map((row) => (
            <li
              key={row.email}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
            >
              <div>
                <p className="font-medium text-[#2a1f16]">{row.email}</p>
                <p className="text-xs text-[#8a7a6c]">Joined {row.joined}</p>
              </div>
              <span className="rounded-full bg-[#e8f0e4] px-2.5 py-1 text-[11px] font-medium text-[#4f6b45]">
                {row.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
