import { ImageResponse } from "next/og";

export const alt = "Nikola Anastasijević — Software Developer in Hamilton, Ontario.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#08070b",
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(255,92,40,0.08), rgba(8,7,11,0) 70%)",
          position: "relative",
        }}
      >
        {/* corner marks */}
        <div
          style={{
            position: "absolute",
            top: 36,
            left: 44,
            display: "flex",
            color: "#8a857c",
            fontSize: 17,
            letterSpacing: "0.3em",
          }}
        >
          N.A — PORTFOLIO ©2026
        </div>
        <div
          style={{
            position: "absolute",
            top: 36,
            right: 44,
            display: "flex",
            color: "#8a857c",
            fontSize: 17,
            letterSpacing: "0.3em",
          }}
        >
          HAMILTON, ON — CANADA
        </div>

        <div
          style={{
            width: 900,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#ece7df",
              fontFamily: "serif",
              fontSize: 174,
              fontStyle: "italic",
              lineHeight: 0.86,
            }}
          >
            Nikola
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              marginTop: 18,
            }}
          >
            <div style={{ display: "flex", flex: 1, height: 2, background: "#ff5c28" }} />
            <div
              style={{
                display: "flex",
                margin: "0 24px",
                color: "#ece7df",
                fontSize: 47,
                fontWeight: 800,
                letterSpacing: "0.12em",
              }}
            >
              ANASTASIJEVIĆ
            </div>
            <div style={{ display: "flex", flex: 1, height: 2, background: "#ff5c28" }} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 34,
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#ece7df",
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: "0.22em",
            }}
          >
            NIKOLA ANASTASIJEVIĆ
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 14,
              color: "#8a857c",
              fontSize: 19,
              letterSpacing: "0.3em",
            }}
          >
            SOFTWARE DEVELOPER — HAMILTON, ONTARIO
          </div>
        </div>
      </div>
    ),
    size
  );
}
