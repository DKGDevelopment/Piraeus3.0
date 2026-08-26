'use client';

export default function Loader({ progress, done }: { progress: number; done: boolean }) {
  return (
    <div className={`loader${done ? ' loader--done' : ''}`} aria-hidden={done}>
      <div className="loader__inner">
        <span className="loader__label">Piraeus Masterplan</span>
        <div className="loader__bar">
          <div className="loader__fill" style={{ transform: `scaleX(${progress})` }} />
        </div>
        <span className="loader__pct">{Math.round(progress * 100)}%</span>
      </div>
    </div>
  );
}
