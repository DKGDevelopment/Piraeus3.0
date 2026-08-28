'use client';

/**
 * Shown once the gate opens, to say the descent is driven by scrolling.
 *
 * Rendered from the start and revealed by a class rather than mounted on entry:
 * the stage beside it is pinned, and inserting a sibling next to a pinned
 * element after mount breaks React's reconciliation.
 *
 * It leaves on the first scroll rather than after a timer: the moment it has
 * been understood is the moment it stops being useful, and a cue that lingers
 * over the shot reads as decoration.
 */
export default function ScrollCue({
  shown,
  leaving,
}: {
  shown: boolean;
  leaving: boolean;
}) {
  return (
    <div
      className={`cue${shown ? ' cue--shown' : ''}${leaving ? ' cue--gone' : ''}`}
      aria-hidden="true"
    >
      <p className="cue__title">
        Scroll
        <br />
        to descend
      </p>
      <span className="cue__rail">
        <span className="cue__dot" />
      </span>
      <p className="cue__note">Dive into the masterplan by scrolling</p>
    </div>
  );
}
