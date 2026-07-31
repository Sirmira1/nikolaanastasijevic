"use client";

import { useState } from "react";

/**
 * An image slot that is honest about being empty. Until a file exists at
 * `src`, the frame names the file it is waiting for, so a page in progress
 * can never be mistaken for a finished one — and there is no hunting through
 * the code to find out what to upload.
 */
export default function Frame({
  src,
  alt,
  aspect = "4 / 3",
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  aspect?: string;
  className?: string;
  priority?: boolean;
}) {
  const [missing, setMissing] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-sm border border-ink/15 bg-void/40 ${className}`}
      style={{ aspectRatio: aspect }}
    >
      {!missing && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          onError={() => setMissing(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
        />
      )}

      {missing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
          <span
            aria-hidden="true"
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-ember"
          >
            Drop a photo here
          </span>
          <code className="max-w-full truncate font-mono text-[10px] text-ink/55">
            {src.replace(/^\//, "")}
          </code>
          <span className="sr-only">{alt} — image not uploaded yet</span>
        </div>
      )}
    </div>
  );
}
