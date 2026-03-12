function Row({
  title,
  description,
  right,
}: {
  title: string;
  description: string;
  right: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </div>
        <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {description}
        </div>
      </div>
      <div className="sm:pt-1">{right}</div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <>
      <section className="space-y-3">
        <Row
          title="Account"
          description="Update your profile details and login settings (mock)."
          right={
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900">
              Edit
            </button>
          }
        />
        <Row
          title="Notifications"
          description="Choose how you want to be reminded about study sessions (mock)."
          right={
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900">
              Configure
            </button>
          }
        />
        <Row
          title="AI preferences"
          description="Control response style and verbosity for study help (mock)."
          right={
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
              Open
            </button>
          }
        />
      </section>
    </>
  );
}

