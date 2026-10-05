import Image from "next/image";
import { prisma } from "@/lib/db";

export const metadata = { title: "About" };

export default async function AboutPage() {
  const settings = await prisma.storeSettings.findUniqueOrThrow({ where: { id: "store" } });
  const hours = JSON.parse(settings.hoursJson) as Record<string, string>;

  return (
    <div>
      <section className="relative h-[42vh] min-h-[280px] overflow-hidden">
        <Image
          src="/images/brand/photo-3.jpg"
          alt="Inside Al Madinah kitchen atmosphere"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#1c1410]/55" />
        <div className="relative mx-auto flex h-full max-w-6xl items-end px-4 pb-10 sm:px-6">
          <h1 className="font-[family-name:var(--font-display)] text-4xl text-[#fff7ef] sm:text-5xl">
            About Al Madinah
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="text-[var(--brand-ink)]/75 leading-relaxed">{settings.description}</p>
          <p className="mt-4 text-sm text-[var(--brand-ink)]/60">
            On Google Business this kitchen is listed as <strong>{settings.googleListingName}</strong>{" "}
            — a Pakistani restaurant in Gulistan-e-Johar with a {settings.rating.toFixed(1)} rating
            from {settings.reviewCount} reviews. Guests often mention biryani, korma, naan, and
            chapati.
          </p>
          <a
            href={settings.googleShareUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block text-sm font-medium text-[var(--brand-chili)] hover:underline"
          >
            View Google Business listing →
          </a>
        </div>
        <div className="space-y-4 border border-[#e0cdb4] bg-[#fffaf3]/80 p-6 text-sm">
          <div>
            <h2 className="text-xs tracking-[0.16em] text-[var(--brand-saffron)] uppercase">Address</h2>
            <p className="mt-1">
              {settings.address}
              <br />
              {settings.city}, {settings.postalCode}, {settings.country}
            </p>
            <p className="mt-1 text-[var(--brand-ink)]/55">Plus code: {settings.plusCode}</p>
          </div>
          <div>
            <h2 className="text-xs tracking-[0.16em] text-[var(--brand-saffron)] uppercase">Phone</h2>
            <p className="mt-1">
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a>
            </p>
          </div>
          <div>
            <h2 className="text-xs tracking-[0.16em] text-[var(--brand-saffron)] uppercase">Hours</h2>
            <ul className="mt-2 space-y-1">
              {Object.entries(hours).map(([day, value]) => (
                <li key={day} className="flex justify-between gap-4 capitalize">
                  <span>{day}</span>
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-16 sm:grid-cols-3 sm:px-6">
        {["/images/brand/photo-1.jpg", "/images/brand/photo-2.jpg", "/images/brand/photo-4.jpg"].map(
          (src) => (
            <div key={src} className="relative aspect-[4/3] overflow-hidden">
              <Image src={src} alt="Al Madinah business photo from Google listing" fill className="object-cover" />
            </div>
          ),
        )}
      </section>
    </div>
  );
}
