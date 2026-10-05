import Link from "next/link";
import { MapPin, Phone, Clock, Star } from "lucide-react";

type Settings = {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  googleMapsUrl: string;
  googleShareUrl: string;
  rating: number;
  reviewCount: number;
  hoursJson: string;
  cashOnly: boolean;
};

export function SiteFooter({ settings }: { settings: Settings }) {
  const hours = JSON.parse(settings.hoursJson) as Record<string, string>;

  return (
    <footer className="mt-auto border-t border-[#e0cdb4] bg-[#221610] text-[#f6ebe0]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--brand-gold)]">
            {settings.name}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#f6ebe0]/75">
            Pakistani restaurant & bakery in Gulistan-e-Johar. Fresh sheermal, tandoori breads, korma
            trays, and everyday biryani — listed on Google as Al Madina Pakwan And Sheermaal Center.
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-[var(--brand-gold)]">
            <Star className="size-4 fill-current" />
            {settings.rating.toFixed(1)} · {settings.reviewCount} Google reviews
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <h3 className="text-xs tracking-[0.18em] text-[var(--brand-gold)] uppercase">Visit</h3>
          <p className="flex gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--brand-gold)]" />
            <span>
              {settings.address}
              <br />
              {settings.city}, {settings.postalCode}, Pakistan
            </span>
          </p>
          <p className="flex items-center gap-2">
            <Phone className="size-4 text-[var(--brand-gold)]" />
            <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:underline">
              {settings.phone}
            </a>
          </p>
          <p className="flex gap-2">
            <Clock className="mt-0.5 size-4 shrink-0 text-[var(--brand-gold)]" />
            <span>Open daily {hours.monday}</span>
          </p>
          {settings.cashOnly && (
            <p className="text-[#f6ebe0]/70">Cash payments · Pickup & delivery</p>
          )}
        </div>

        <div className="space-y-3 text-sm">
          <h3 className="text-xs tracking-[0.18em] text-[var(--brand-gold)] uppercase">Links</h3>
          <div className="flex flex-col gap-2">
            <Link href="/menu" className="hover:text-[var(--brand-gold)]">
              Full menu
            </Link>
            <Link href="/track" className="hover:text-[var(--brand-gold)]">
              Track an order
            </Link>
            <a
              href={settings.googleShareUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--brand-gold)]"
            >
              Google Business listing
            </a>
            <a
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--brand-gold)]"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-[#f6ebe0]/55">
        Photos and listing details sourced from the public Google Business profile. Local demo store —
        mock cash checkout.
      </div>
    </footer>
  );
}
