import signatureImage from "@/img/signature-transparent.png";

/** The uploaded signature is thresholded into the opening particle formation. */

const INK_THRESHOLD = 32;

type RasterPoint = { x: number; y: number };

const gauss = () => Math.random() + Math.random() + Math.random() - 1.5;

export { signatureImage };

/**
 * How much the mark shrinks to fit the viewport at the intro
 * camera (z=12.5, fov 50°): 1 on desktop, ~0.45 on phones. Particle
 * sizes and dust spread scale with it so density stays constant.
 */
export function markScale(): number {
  if (typeof window === "undefined") return 1;
  const viewH = 2 * Math.tan((50 * Math.PI) / 360) * 12.5;
  const viewW = viewH * (window.innerWidth / Math.max(window.innerHeight, 1));
  return Math.min(12, viewW * 0.9) / 12;
}

function loadSignatureImage() {
  const image = new Image();
  image.decoding = "async";
  image.src = signatureImage.src;
  return image.decode().then(() => image);
}

/** Samples the uploaded ink into world-space points, ordered left-to-right. */
export async function sampleSignature(count: number): Promise<Float32Array> {
  const image = await loadSignatureImage();
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const positions = new Float32Array(count * 3);
  if (!ctx) return positions;

  ctx.drawImage(image, 0, 0);
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const points: RasterPoint[] = [];
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const offset = (y * canvas.width + x) * 4;
      if (pixels[offset + 3] < INK_THRESHOLD) continue;
      points.push({ x, y });
    }
  }
  points.sort((a, b) => a.x - b.x || a.y - b.y);

  const scale = (12 * markScale()) / canvas.width;
  for (let i = 0; i < count; i++) {
    const ratio = count > 1 ? i / (count - 1) : 0;
    const point = points[Math.min(points.length - 1, Math.floor(ratio * points.length))];
    if (!point) continue;
    const halo = Math.random() < 0.06 ? 0.16 : 0.012;
    positions[i * 3] = (point.x - canvas.width / 2) * scale + gauss() * halo;
    positions[i * 3 + 1] = -(point.y - canvas.height / 2) * scale + gauss() * halo;
    positions[i * 3 + 2] = gauss() * halo * 1.3;
  }
  return positions;
}
