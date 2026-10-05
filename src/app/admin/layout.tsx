// Admin pages read database-backed operational data at request time.
// This keeps Vercel builds independent of a local SQLite database.
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
