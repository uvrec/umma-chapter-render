import { Header } from "@/components/Header";

export default function NewPagesHub() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">New Pages (quick access)</h1>
        <p className="text-muted-foreground mb-6">
          Use this hub to preview the latest pages and UI updates without hunting through the app.
        </p>

        <section className="rounded-xl border p-5 mb-6">
          <h2 className="text-lg font-medium mb-2">VerseView (new page)</h2>
          <p className="text-sm text-muted-foreground mb-3">
            Unified verse renderer route using the universal VersesDisplay.
          </p>
          <div className="flex flex-wrap gap-2">
            <a className="px-3 py-2 rounded-lg border hover:bg-accent" href="/verses/gita/1.1">/verses/gita/1.1</a>
            <a className="px-3 py-2 rounded-lg border hover:bg-accent" href="/verses/bhagavatam/1.1">/verses/bhagavatam/1.1</a>
            <a className="px-3 py-2 rounded-lg border hover:bg-accent" href="/verses/iso/1.1">/verses/iso/1.1</a>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Tip: change the numbers in the URL to navigate to other chapter.verse.</p>
        </section>

        <section className="rounded-xl border p-5 mb-6">
          <h2 className="text-lg font-medium mb-2">Blog (updated)</h2>
          <p className="text-sm text-muted-foreground mb-3">
            Blog posts now show a styled scripture quote block when verse fields are present.
          </p>
          <div className="flex flex-wrap gap-2">
            <a className="px-3 py-2 rounded-lg border hover:bg-accent" href="/blog">/blog</a>
            <a className="px-3 py-2 rounded-lg border hover:bg-accent" href="/blog?preview=1">/blog?preview=1 (show drafts)</a>
          </div>
          <ul className="list-disc pl-5 mt-3 text-sm text-muted-foreground">
            <li>Look for a circular quote icon and a gradient divider above the verse block.</li>
            <li>Admin users see inline toggles to show/hide verse blocks (Sanskrit, Transliteration, etc.).</li>
          </ul>
        </section>

        <section className="rounded-xl border p-5 mb-6">
          <h2 className="text-lg font-medium mb-2">DB Reader (reference)</h2>
          <p className="text-sm text-muted-foreground mb-3">Not new in this pass, but relevant to verse rendering; uses the same VersesDisplay styles.</p>
          <div className="flex flex-wrap gap-2">
            <a className="px-3 py-2 rounded-lg border hover:bg-accent" href="/veda-reader/gita">/veda-reader/gita</a>
            <a className="px-3 py-2 rounded-lg border hover:bg-accent" href="/veda-reader/bhagavatam">/veda-reader/bhagavatam</a>
          </div>
        </section>

        <section className="rounded-xl border p-5">
          <h2 className="text-lg font-medium mb-2">Notes</h2>
          <ul className="list-disc pl-5 text-sm text-muted-foreground">
            <li>If a link opens a page without the verse block, the target content may not exist yet in your DB.</li>
            <li>Admin-only inline editing tools appear only when logged in with admin rights.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
