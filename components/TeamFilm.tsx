'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';

// Served from Bunny's CDN pull zone rather than /public: it's a single
// higher-quality file the git repo shouldn't have to carry, and edge
// delivery beats Vercel's static hosting for a ~60MB video.
const SRC = 'https://piraeusgate.b-cdn.net/DKG%20FINAL%20VIDEO%20(1).mp4';

/**
 * The team page's full-screen video, with a mute toggle — unlike the asset
 * films, this one carries a real audio track worth letting the visitor hear.
 */
export default function TeamFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  return (
    <div className="team-film">
      <video
        ref={videoRef}
        className="team-film__video"
        poster="/video/team-poster.webp"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        src={SRC}
      />

      <button
        type="button"
        className="team-film__sound"
        aria-label={muted ? 'Unmute video' : 'Mute video'}
        aria-pressed={!muted}
        onClick={() => {
          const video = videoRef.current;
          if (!video) return;
          const next = !video.muted;
          video.muted = next;
          setMuted(next);
        }}
      >
        {muted ? (
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 9v6h4l5 5V4L8 9H4Z" fill="currentColor" />
            <path d="m16 9 5 6M21 9l-5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 9v6h4l5 5V4L8 9H4Z" fill="currentColor" />
            <path
              d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      <Link className="team-film__back" href="/">
        Back to the masterplan
      </Link>
    </div>
  );
}
