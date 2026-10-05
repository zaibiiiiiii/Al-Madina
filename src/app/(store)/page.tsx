import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { ProductCard } from "@/components/store/product-card";
import { LinkButton } from "@/components/ui/link-button";
import { prisma } from "@/lib/db";

export default async function HomePage() {
  const [settings, featured, categories] = await Promise.all([
    prisma.storeSettings.findUniqueOrThrow({ where: { id: "store" } }),
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { category: true },
      take: 6,
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div>
      <section className="relative min-h-[92vh] overflow-hidden">
        <Image
          src={settings.heroImage}
          alt="Al Madinah Pakwan and Sheermal House storefront"
          fill
          priority
          className="animate-hero-image object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1c1410]/90 via-[#1c1410]/55 to-[#1c1410]/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1410]/70 via-transparent to-[#1c1410]/30" />

        <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-end px-4 pb-16 sm:px-6 sm:pb-20">
          <p className="animate-rise text-sm tracking-[0.28em] text-[var(--brand-gold)] uppercase">
            Gulistan-e-Johar · Karachi
          </p>
          <h1 className="animate-rise-delay mt-3 max-w-3xl font-[family-name:var(--font-display)] text-5xl leading-[0.95] text-[#fff7ef] sm:text-6xl md:text-7xl">
            Al Madinah Pakwan and Sheermal House
          </h1>
          <div className="brand-underline mt-5 h-1 w-28 rounded-full" />
          <p className="animate-rise-delay mt-6 max-w-xl text-base leading-relaxed text-[#f6ebe0]/88 sm:text-lg">
            {settings.tagline}
          </p>
          <div className="animate-rise-delay mt-8 flex flex-wrap items-center gap-3">
            <LinkButton href="/menu" size="lg" className="bg-[var(--brand-chili)] px-6 hover:bg-[#6f1717]">
              Order from the menu <ArrowRight className="size-4" />
            </LinkButton>
            <LinkButton
              href="/track"
              size="lg"
              variant="outline"
              className="border-[#f6ebe0]/40 bg-transparent text-[#fff7ef] hover:bg-[#fff7ef]/10 hover:text-white"
            >
              Track an order
            </LinkButton>
          </div>
          <div className="mt-8 flex flex-wrap gap-5 text-sm text-[#f6ebe0]/8">
            <span className="inline-flex items-center gap-2">
              <Star className="size-4 fill-[var(--brand-gold)] text-[var(--brand-gold)]" />
              {settings.rating.toFixed(1)} · {settings.reviewCount} Google reviews
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4 text-[var(--brand-gold)]" />
              {settings.address}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--brand-ink)] sm:text-4xl">
            From the tandoor and the tray kitchen
          </h2>
          <p className="mt-3 text-[var(--brand-ink)]/70">
            Browse sheermal, pakwan trays, rice, and savory sides — prepared for daily orders and
            family gatherings.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/menu?category=${c.slug}`}
              className="border border-[#e0cdb4] bg-[#fffaf3]/70 px-4 py-2 text-sm transition hover:border-[var(--brand-chili)] hover:text-[var(--brand-chili)]"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--brand-ink)]">
            House favorites
          </h2>
          <Link href="/menu" className="text-sm font-medium text-[var(--brand-chili)] hover:underline">
            View full menu
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="rounded border border-dashed border-[#e0cdb4] p-8 text-center text-[var(--brand-ink)]/60">
            Menu items are being refreshed. Please check back shortly.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="relative overflow-hidden border-y border-[#e0cdb4]">
        <div className="absolute inset-0">
          <Image
            src="/images/brand/photo-2.jpg"
            alt="Sheermal and bakery atmosphere"
            fill
            className="object-cover opacity-30"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[#f7f1e8]/85" />
        </div>
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--brand-ink)] sm:text-4xl">
              A Gulistan-e-Johar kitchen guests return to
            </h2>
            <p className="mt-4 text-[var(--brand-ink)]/75 leading-relaxed">{settings.description}</p>
            <p className="mt-4 text-sm text-[var(--brand-ink)]/60">
              Open daily 11:00 AM – 12:00 AM · Cash-friendly · Pickup at A-35, Block 4 / Block 3
            </p>
            <LinkButton href="/about" className="mt-6 bg-[var(--brand-leaf)] hover:bg-[#244940]">
              Our story & location
            </LinkButton>
          </div>
          <blockquote className="border-l-4 border-[var(--brand-gold)] bg-[#fffaf3]/80 p-6 text-[var(--brand-ink)]/80">
            <p className="font-[family-name:var(--font-display)] text-xl leading-snug">
              “Tandoori roti offered by them is among the finest… You should definitely try their
              koorma.”
            </p>
            <footer className="mt-4 text-sm text-[var(--brand-ink)]/55">
              Google review · Ali Tayyab
            </footer>
          </blockquote>
        </div>
      </section>
    </div>
  );
}
