/**
 * Shared "Read" affordance for both the featured cards and the grid rows.
 * Outlined by default; on hover a fill sweeps up from the bottom and the
 * plus swaps for an arrow — built once here so both call sites stay in sync.
 */
export default function ReadButton() {
  return (
    <span className="read-btn">
      <span className="read-btn__fill" aria-hidden="true" />
      <span className="read-btn__label">Read</span>
      <span className="read-btn__icon" aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="none" className="read-btn__plus">
          <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <svg viewBox="0 0 16 16" fill="none" className="read-btn__arrow">
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </span>
  );
}
