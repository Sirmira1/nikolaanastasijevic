import { ImageResponse } from "next/og";
import { SILHOUETTES, svgFor } from "@/lib/silhouettes";

/**
 * The share card every page hands to Instagram, LinkedIn, Discord and the
 * rest. Most people meet this site through one of these before they ever see
 * the site, so each page gets its own rather than all four sharing the home
 * page's — and the artwork is the page's own silhouette, the same drawing the
 * particle field builds when you get there.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = "image/png";

const MARK = "#8a857c";
const INK = "#ece7df";
const VOID = "#08070b";

export function ogCard({
  eyebrow,
  title,
  accentWord,
  sub,
  accent,
  shape,
}: {
  /** the small label above the title */
  eyebrow: string;
  title: string;
  /** the tail of the title, set in the accent */
  accentWord?: string;
  sub: string;
  accent: string;
  /** key of the silhouette to use as artwork */
  shape?: string;
}) {
  const art = shape ? SILHOUETTES.find((s) => s.key === shape) : undefined;
  // the silhouette is drawn straight into the card as an SVG data URI, tinted
  // to the page's accent and scaled to fit the right-hand third
  let artSrc: string | null = null;
  let artW = 0;
  let artH = 0;
  if (art) {
    const [w, h] = art.box;
    const k = Math.min(360 / w, 280 / h);
    artW = Math.round(w * k);
    artH = Math.round(h * k);
    artSrc =
      "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgFor(art, accent));
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: VOID,
          backgroundImage: `radial-gradient(ellipse 75% 60% at 72% 50%, ${accent}1f, rgba(8,7,11,0) 70%)`,
          padding: "36px 44px",
        }}
      >
        {/* corner marks, the same ones the site wears */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: MARK,
            fontSize: 17,
            letterSpacing: "0.3em",
          }}
        >
          <div style={{ display: "flex" }}>N.A — PORTFOLIO ©2026</div>
          <div style={{ display: "flex" }}>HAMILTON, ON — CANADA</div>
        </div>

        {/*
          Explicit widths, not flex:1. Given the column a share to work out for
          itself, the longer headline came back four lines deep and overflowed
          the card at both ends — the eyebrow landing on top of the corner mark
          and the footer through the last line of copy.
        */}
        <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", width: 700 }}>
            <div
              style={{
                display: "flex",
                color: accent,
                fontSize: 21,
                fontWeight: 700,
                letterSpacing: "0.3em",
              }}
            >
              {eyebrow.toUpperCase()}
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                marginTop: 22,
                color: INK,
                fontSize: 78,
                fontWeight: 800,
                lineHeight: 1.06,
                letterSpacing: "-0.02em",
              }}
            >
              {title}
              {accentWord ? (
                <span style={{ color: accent, marginLeft: 20 }}>{accentWord}</span>
              ) : null}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 24,
                maxWidth: 660,
                color: MARK,
                fontSize: 23,
                lineHeight: 1.45,
              }}
            >
              {sub}
            </div>
          </div>

          {artSrc ? (
            <div
              style={{
                display: "flex",
                width: 380,
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={artSrc} alt="" width={artW} height={artH} style={{ opacity: 0.92 }} />
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: MARK,
            fontSize: 19,
            letterSpacing: "0.3em",
          }}
        >
          <div style={{ display: "flex", width: 64, height: 2, background: accent }} />
          <div style={{ display: "flex", marginLeft: 20 }}>
            NIKOLA ANASTASIJEVIĆ — SOFTWARE DEVELOPER
          </div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
