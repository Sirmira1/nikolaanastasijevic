import { NextResponse } from "next/server";
import { EMAIL } from "@/lib/data";
import { LIMITS, validate } from "@/lib/contact";

/**
 * Where the contact form's messages go.
 *
 * Two delivery paths, both plain HTTPS so nothing has to be installed:
 *
 *   RESEND_API_KEY   — sends the enquiry as an email through Resend.
 *   CONTACT_WEBHOOK  — posts the raw JSON somewhere (Formspree, Web3Forms,
 *                      Zapier, a Discord webhook, whatever).
 *
 * With neither set the route answers 503 and the form falls back to opening a
 * mail client, which is exactly where the site was before. That matters: an
 * unconfigured deploy should degrade to the old behaviour, not swallow
 * somebody's message and tell them it was sent.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";


/**
 * A small speed bump, not a security control.
 *
 * Serverless instances come and go and each keeps its own map, so this stops a
 * loop hammering one warm instance and nothing more. Real abuse protection
 * belongs at the edge.
 */
const seen = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_IN_WINDOW = 4;

function rateLimited(ip: string) {
  const now = Date.now();
  const hits = (seen.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  seen.set(ip, hits);
  if (seen.size > 500) seen.clear();
  return hits.length > MAX_IN_WINDOW;
}

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );

async function sendViaResend(payload: {
  name: string;
  email: string;
  company: string;
  budget: string;
  kinds: string[];
  message: string;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;

  // resend.dev is Resend's shared sender: it works with no DNS setup, but it
  // will only deliver to the address that owns the API key — which is the one
  // address this form ever writes to
  const from = process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>";
  const to = process.env.CONTACT_TO || EMAIL;

  const rows: [string, string][] = [
    ["From", `${payload.name} <${payload.email}>`],
    ["Company", payload.company || "—"],
    ["Looking for", payload.kinds.length ? payload.kinds.join(", ") : "—"],
    ["Budget", payload.budget || "—"],
  ];

  const html =
    `<div style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:14px;line-height:1.6;color:#111">` +
    `<h2 style="font-family:system-ui,sans-serif;margin:0 0 16px">New enquiry from the website</h2>` +
    `<table style="border-collapse:collapse;margin-bottom:20px">` +
    rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:4px 16px 4px 0;color:#666;white-space:nowrap">${k}</td>` +
          `<td style="padding:4px 0">${escape(v)}</td></tr>`
      )
      .join("") +
    `</table>` +
    `<div style="white-space:pre-wrap;padding:16px;background:#f6f6f6;border-radius:6px">${escape(payload.message)}</div>` +
    `</div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      // so hitting reply in the inbox writes back to the visitor
      reply_to: payload.email,
      subject: `Website enquiry — ${payload.name}`,
      html,
      text:
        rows.map(([k, v]) => `${k}: ${v}`).join("\n") + `\n\n${payload.message}`,
    }),
  });

  if (!res.ok) throw new Error(`resend ${res.status}: ${await res.text()}`);
  return true;
}

async function sendViaWebhook(payload: unknown) {
  const url = process.env.CONTACT_WEBHOOK;
  if (!url) return false;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`webhook ${res.status}`);
  return true;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  // a field no human sees; anything in it came from a bot filling every input.
  // Answer 200 so the bot has nothing to learn from the difference.
  if (String(body.website ?? "").trim()) return NextResponse.json({ ok: true });

  const errors = validate(body);
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 400 });

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip))
    return NextResponse.json(
      { error: "That's a few messages in a row — give it a minute." },
      { status: 429 }
    );

  const payload = {
    name: String(body.name).trim(),
    email: String(body.email).trim(),
    company: String(body.company ?? "").trim().slice(0, LIMITS.company),
    budget: String(body.budget ?? "").trim().slice(0, 80),
    kinds: Array.isArray(body.kinds) ? body.kinds.map(String).slice(0, 8) : [],
    message: String(body.message).trim(),
    sentAt: new Date().toISOString(),
  };

  try {
    const delivered = (await sendViaResend(payload)) || (await sendViaWebhook(payload));
    if (!delivered)
      return NextResponse.json({ error: "unconfigured" }, { status: 503 });
  } catch (err) {
    console.error("contact delivery failed", err);
    return NextResponse.json({ error: "delivery" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
