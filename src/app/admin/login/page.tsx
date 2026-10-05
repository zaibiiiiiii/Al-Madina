"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@almadinah.pk");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      toast.success(`Welcome, ${data.admin.name}`);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#221610] px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-4 border border-[#3a271c] bg-[#2a1c14] p-8 text-[#f6ebe0]"
      >
        <div>
          <p className="text-xs tracking-[0.2em] text-[var(--brand-gold)] uppercase">Admin portal</p>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl">
            Al Madinah Pakwan and Sheermal House
          </h1>
          <p className="mt-2 text-sm text-[#f6ebe0]/65">
            Mock local login for store operations. Default credentials are prefilled.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-[#5c3d2e] bg-[#1c1410] text-white"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-[#5c3d2e] bg-[#1c1410] text-white"
            required
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--brand-gold)] text-[#221610] hover:bg-[#d4a55a]"
        >
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
