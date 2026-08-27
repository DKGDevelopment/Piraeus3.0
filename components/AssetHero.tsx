'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import Stage from './Stage';
import SequenceLayer from './SequenceLayer';
import { FRAMES_TO_START } from '@/lib/useImageSequence';
import type { SequenceConfig } from '@/lib/sequence';

type Props = {
  name: string;
  standfirst: string;
  config: SequenceConfig;
};

/**
 * An asset's own scroll-driven approach. Reuses the masterplan's sequence
 * canvas, so a new asset is a frame sequence and a config rather than new
 * animation code.
 *
 * Unlike the masterplan there is no entry gate here: the visitor arrived by
 * choosing this asset, so the sequence reveals itself as soon as it can run.
 */
export default function AssetHero({ name, standfirst, config }: Props) {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  const handleProgress = useCallback((p: number) => setProgress(p), []);
  const handleReady = useCallback(() => setReady(true), []);

  const gate = Math.min(1, (progress * config.frameCount) / FRAMES_TO_START);

  return (
    <>
      <div className={`veil${ready ? ' veil--gone' : ''}`} aria-hidden={ready}>
        <span className="veil__name">{name}</span>
        <span className="veil__track">
          <span className="veil__fill" style={{ transform: `scaleX(${gate})` }} />
        </span>
      </div>

      <Stage length={5}>
        <SequenceLayer
          config={config}
          offset={0}
          length={5}
          onProgress={handleProgress}
          onReady={handleReady}
        >
        <div className="asset-hero">
          <Link className="asset-hero__back" href="/">
            <span aria-hidden="true">&larr;</span> Masterplan
          </Link>
          <div className="asset-hero__title-block">
            <h1 className="asset-hero__title">{name}</h1>
            <p className="asset-hero__standfirst">{standfirst}</p>
          </div>
        </div>
        </SequenceLayer>
      </Stage>
    </>
  );
}
