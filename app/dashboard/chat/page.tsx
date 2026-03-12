import SubjectChatPanel from "@/components/subjects/workspace/chat-panel";

export default function ChatPage() {
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SubjectChatPanel subjectName="Calculus" />
        </div>
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:p-6">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Tips
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Use subject chat when you want focused help. Keep your question
            specific and paste a definition or example if you can.
          </p>
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-300">
            Mock page: later this will let you pick a subject chat from the
            sidebar or a selector.
          </div>
        </section>
      </div>
    </>
  );
}

