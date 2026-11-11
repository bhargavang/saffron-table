import { cacheLife } from "next/cache";
import { ImageResponse } from "next/og";

import { photos } from "@/lib/photos";
import { site } from "@/lib/site";

export const alt = `${site.name}: modern Indian restaurant in Indiranagar, Bengaluru`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Fraunces from Google Fonts, fetched once at build time. */
async function loadFont(text: string): Promise<ArrayBuffer | null> {
  "use cache";
  cacheLife("max");
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Fraunces:wght@600&text=${encodeURIComponent(text)}`,
      { signal: AbortSignal.timeout(15_000) },
    ).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await fetch(url, { signal: AbortSignal.timeout(15_000) }).then((r) => r.arrayBuffer());
  } catch {
    return null; // fall back to the built-in font
  }
}

async function loadPhoto(): Promise<string | null> {
  "use cache";
  cacheLife("max");
  try {
    const res = await fetch(`${photos.thali.src}?auto=format&fm=jpg&fit=crop&w=460&h=560&q=75`, {
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) return null;
    return `data:image/jpeg;base64,${Buffer.from(await res.arrayBuffer()).toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OpenGraphImage() {
  const heading = site.name;
  const line = "Slow-cooked flavours, served with warmth.";
  const [font, photo] = await Promise.all([loadFont(heading + line), loadPhoto()]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #2e2019 0%, #241a15 60%, #3a2417 100%)",
          color: "#fbf6ee",
          padding: "0 80px",
          fontFamily: font ? "Fraunces" : "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 600 }}>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 4,
              color: "#eaa53f",
              textTransform: "uppercase",
              fontFamily: "sans-serif",
            }}
          >
            Modern Indian kitchen · Bengaluru
          </div>
          <div style={{ display: "flex", fontSize: 96, marginTop: 24, lineHeight: 1 }}>{heading}</div>
          <div style={{ display: "flex", fontSize: 40, marginTop: 28, color: "#eaa53f", lineHeight: 1.2 }}>
            {line}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 48,
              fontSize: 26,
              fontFamily: "sans-serif",
              color: "#241a15",
              background: "#eaa53f",
              borderRadius: 999,
              padding: "14px 30px",
              alignSelf: "flex-start",
            }}
          >
            Book a table online
          </div>
        </div>
        {photo && (
          <img
            src={photo}
            alt=""
            width={380}
            height={462}
            style={{ borderRadius: "190px 190px 28px 28px", objectFit: "cover" }}
          />
        )}
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: "Fraunces", data: font, weight: 600, style: "normal" }] : undefined,
    },
  );
}
