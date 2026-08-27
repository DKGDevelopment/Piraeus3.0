'use client';

import Link from 'next/link';

type Props = {
  name: string;
  standfirst: string;
  /** Base name in /public/video: <src>.mp4 and <src>-sm.mp4. */
  src: string;
};

/**
 * An asset's approach, played at its own pace.
 *
 * A scrubbed frame sequence exists to let the reader drive the camera; here the
 * shot should simply run, so it is a video element — smaller than the frames it
 * replaces, smoother, and with none of the scrub machinery.
 *
 * Muted and inline because autoplay is only permitted on those terms, and the
 * renders carry no sound worth hearing anyway.
 */
export default function AssetVideo({ name, standfirst, src }: Props) {
  return (
    <div className="asset-film">
      <video
        className="asset-film__video"
        poster={`/video/${src}-poster.webp`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        {/* WebM first where it is supported; H.264 is the universal fallback.
            The small pair is served to phones, which do not need 1920 of it. */}
        <source src={`/video/${src}-sm.webm`} media="(max-width: 900px)" type="video/webm" />
        <source src={`/video/${src}-sm.mp4`} media="(max-width: 900px)" type="video/mp4" />
        <source src={`/video/${src}.webm`} type="video/webm" />
        <source src={`/video/${src}.mp4`} type="video/mp4" />
      </video>

      <div className="asset-hero">
        <Link className="asset-hero__back" href="/">
          <span aria-hidden="true">&larr;</span> Masterplan
        </Link>
        <div className="asset-hero__title-block">
          <h1 className="asset-hero__title">{name}</h1>
          <p className="asset-hero__standfirst">{standfirst}</p>
        </div>
      </div>
    </div>
  );
}
