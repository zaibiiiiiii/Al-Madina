import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

const SESSION_COOKIE = "am_admin_session";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "local-development-session-secret";

export function hashPassword(password: string) {
  return createHash("sha256").update(`almadinah:${password}`).digest("hex");
}

function signSessionValue(value: string) {
  return createHmac("sha256", SESSION_SECRET).update(value).digest("hex");
}

function makeSessionToken(adminId: string, expires: number) {
  const payload = Buffer.from(JSON.stringify({ adminId, expires })).toString("base64url");
  return `${payload}.${signSessionValue(payload)}`;
}

function readSessionToken(token: string | undefined) {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = signSessionValue(payload);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (providedBuffer.length !== expectedBuffer.length || !timingSafeEqual(providedBuffer, expectedBuffer)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as { adminId: string; expires: number };
    if (!session.adminId || session.expires < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export async function loginAdmin(email: string, password: string) {
  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin || admin.passwordHash !== hashPassword(password)) return null;
  const token = makeSessionToken(admin.id, Date.now() + 1000 * 60 * 60 * 12);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return { id: admin.id, email: admin.email, name: admin.name, role: admin.role };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const session = readSessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const admin = await prisma.adminUser.findUnique({ where: { id: session.adminId } });
  if (!admin) return null;
  return { id: admin.id, email: admin.email, name: admin.name, role: admin.role };
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}