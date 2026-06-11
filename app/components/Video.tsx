"use client";

import { useEffect, useRef, useState } from "react";
import { VIDEO_LABEL, VIDEO_TITLE, VIDEO_YOUTUBE_ID } from "../lib/constants";

export default function Video() {
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.getElementById("yt-iframe-api")) return;
    const script = document.createElement("script");
    script.id = "yt-iframe-api";
    script.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(script);
  }, []);

  function postCommand(func: string) {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args: [] }),
      "*"
    );
  }

  function togglePlay() {
    if (paused) {
      postCommand("playVideo");
    } else {
      postCommand("pauseVideo");
    }
    setPaused((p) => !p);
  }

  function toggleMute() {
    if (muted) {
      postCommand("unMute");
    } else {
      postCommand("mute");
    }
    setMuted((m) => !m);
  }

  return (
    <section className="bg-white py-24">
      <div className="max-w-4xl mx-auto px-6">
        <p className="font-poppins text-[11px] uppercase tracking-[0.2em] text-brand mb-3">
          {VIDEO_LABEL}
        </p>
        <h2 className="font-playfair text-[36px] italic text-ink mb-10">
          {VIDEO_TITLE}
        </h2>

        <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <iframe
            ref={iframeRef}
            id="valutin-yt-player"
            src={`https://www.youtube.com/embed/${VIDEO_YOUTUBE_ID}?controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1`}
            className="absolute -top-[60px] left-0 w-full h-[calc(100%+110px)]"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          <div
            className="absolute"
            style={{
              bottom: 24,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              gap: 16,
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 9999,
              padding: "10px 20px",
            }}
          >
            <button
              onClick={togglePlay}
              aria-label={paused ? "Play" : "Pause"}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 0 }}
            >
              {paused ? (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 2.5L14.5 9 4 15.5V2.5Z" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="2" width="4" height="14" rx="1" />
                  <rect x="11" y="2" width="4" height="14" rx="1" />
                </svg>
              )}
            </button>

            <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.3)" }} />

            <button
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 0 }}
            >
              {muted ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
