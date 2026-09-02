'use client';

import './Sky34Viewer.css';
import { useEffect, useRef, useState } from 'react';
import { Maximize2, Mouse, RotateCcw, Ruler, SunMedium, ZoomIn } from 'lucide-react';

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
          src?: string;
          alt?: string;
          ar?: boolean;
          'camera-controls'?: boolean;
          'touch-action'?: string;
          'shadow-intensity'?: string;
          exposure?: string;
          'environment-image'?: string;
          'camera-orbit'?: string;
          'field-of-view'?: string;
          'interaction-prompt'?: string;
          loading?: string;
          poster?: string;
        };
      }
    }
  }
}

const MODEL_URL = '/sky34-viewer/assets/sky34-viewer.glb';
const DUSK_TEXTURE = '/sky34-viewer/assets/sky34-dusk-texture.jpg';
const POSTER_URL = '/sky34-viewer/assets/skyway-reference.webp';

/**
 * The Sky34 interactive 3D viewer, built by Manus and handed off as a
 * standalone Next.js-compatible client component (see
 * docs/CLAUDE_3D_VIEWER_HANDOFF.md and viewer/sky34/README.md for the
 * original spec). Ported in with minimal changes: the CSS is scoped to
 * .viewer-shell instead of :root/body so it can't leak onto the rest of
 * the site, and its two fonts are self-hosted through next/font instead
 * of relying on a global @import.
 */
export default function Sky34Viewer() {
  // Coastal Concrete Editorial reminder: asymmetrical rail + expansive stage, mineral surfaces,
  // instrument-like controls, and a calm, non-looping interaction language.
  const viewerRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState('Ground');
  const [selectedApartment, setSelectedApartment] = useState('Apartment 01');
  const [unitPanelOpen, setUnitPanelOpen] = useState(true);
  const [requestSent, setRequestSent] = useState(false);
  const materialsRef = useRef<any[]>([]);

  // The custom element touches browser globals as soon as its module
  // evaluates, which breaks static prerendering if imported at module scope
  // — load it only once mounted in the browser.
  useEffect(() => {
    import('@google/model-viewer');
  }, []);

  useEffect(() => {
    const viewer = viewerRef.current as any;
    if (!viewer) return;
    const onLoad = () => {
      setLoaded(true);
      const materials = viewer.model?.materials ?? [];
      materialsRef.current = materials;
      materials.forEach((material: any) => {
        const name = material.name.toUpperCase();
        const pbr = material.pbrMetallicRoughness;
        if (!pbr) return;
        const color: [number, number, number, number] = name.includes('GLASS')
          ? [0.035, 0.18, 0.42, 1]
          : name.includes('POOL')
            ? [0.01, 0.26, 0.5, 1]
            : name.includes('LIGHT')
              ? [0.92, 0.32, 0.06, 1]
              : name.includes('WARM WHITE FACADE')
                ? [0.23, 0.15, 0.085, 1]
                : [0.12, 0.09, 0.07, 1];
        pbr.setBaseColorFactor(color);
        pbr.setMetallicFactor(name.includes('GLASS') ? 0.28 : 0.02);
        pbr.setRoughnessFactor(name.includes('GLASS') ? 0.12 : 0.56);
      });
    };
    viewer.addEventListener('load', onLoad);
    return () => viewer.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    const floorIndex = selectedFloor === 'Ground' ? 0 : Number(selectedFloor);
    const apartmentIndex = Number(selectedApartment.slice(-2)) || 1;
    const elevation = Math.max(38, 74 - floorIndex * 3.2);
    const azimuth = 22 + apartmentIndex * 8;
    viewer.setAttribute('camera-orbit', `${azimuth}deg ${elevation}deg auto`);
  }, [selectedFloor, selectedApartment]);

  const resetView = () => {
    const viewer = viewerRef.current as
      | (HTMLElement & { resetTurntableRotation?: () => void; jumpCameraToGoal?: () => void })
      | null;
    viewer?.resetTurntableRotation?.();
    viewer?.setAttribute('camera-orbit', '35deg 68deg auto');
    viewer?.jumpCameraToGoal?.();
  };

  const enterFullscreen = async () => {
    if (!stageRef.current) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      setFullscreen(false);
    } else {
      await stageRef.current.requestFullscreen?.();
      setFullscreen(true);
    }
  };

  useEffect(() => {
    const onFullscreen = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFullscreen);
    return () => document.removeEventListener('fullscreenchange', onFullscreen);
  }, []);

  return (
    <main className="viewer-shell">
      <aside className="project-rail">
        <div className="rail-topline">
          <span className="eyebrow">Private viewing room</span>
          <span className="status-dot" />
        </div>
        <div className="brand-lockup">
          <span className="monogram-frame">
            <img src="/sky34-viewer/assets/sky34-logo.png" alt="Sky34 S34 monogram" className="brand-mark" />
          </span>
          <span className="brand-wordmark">SKY34</span>
        </div>
        <div className="vertical-stamp">SKY34 / ATHENS</div>
        <section className="project-intro">
          <p className="kicker">Residence 01 · 2026 · Skyway palette</p>
          <h1>
            Orbit the residence.
            <br />
            <em>Read the silhouette.</em>
          </h1>
          <p className="lede">An interactive study of the terraces, glazing, and planted edges that define Sky34.</p>
        </section>

        <div className="rail-rule" />
        <section className="selection-panel" aria-label="Choose floor and apartment">
          <div className="selection-heading">
            <span>Navigate model</span>
            <span className="selection-count">
              {selectedFloor} · {selectedApartment.replace('Apartment ', 'A-')}
            </span>
          </div>
          <label className="select-label" htmlFor="floor-select">
            Floor
          </label>
          <select
            id="floor-select"
            className="native-select"
            value={selectedFloor}
            onChange={(event) => {
              setSelectedFloor(event.target.value);
              setUnitPanelOpen(true);
            }}
          >
            {['Ground', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10'].map((floor) => (
              <option key={floor} value={floor}>
                {floor === 'Ground' ? 'Ground floor' : `Floor ${floor}`}
              </option>
            ))}
          </select>
          <label className="select-label" htmlFor="apartment-select">
            Apartment
          </label>
          <select
            id="apartment-select"
            className="native-select"
            value={selectedApartment}
            onChange={(event) => {
              setSelectedApartment(event.target.value);
              setRequestSent(false);
              setUnitPanelOpen(true);
            }}
          >
            {['Apartment 01', 'Apartment 02', 'Apartment 03', 'Apartment 04'].map((apartment) => (
              <option key={apartment} value={apartment}>
                {apartment}
              </option>
            ))}
          </select>
          <div className="reference-legend" aria-label="Building-wide material legend">
            <span>
              <i className="legend-swatch facade" />
              Walls / balconies
            </span>
            <span>
              <i className="legend-swatch glazing" />
              Blue glazing
            </span>
            <span>
              <i className="legend-swatch pool" />
              Pool / water
            </span>
          </div>
        </section>
        <section className="details-block" aria-label="Project details">
          <div className="detail-row">
            <span>Project</span>
            <strong>Sky34</strong>
          </div>
          <div className="detail-row">
            <span>Typology</span>
            <strong>Urban residence</strong>
          </div>
          <div className="detail-row">
            <span>View</span>
            <strong>Exterior / hero</strong>
          </div>
          <div className="detail-row">
            <span>Drawing set</span>
            <strong>A-01 / 04</strong>
          </div>
          <div className="detail-row">
            <span>Selected</span>
            <strong>
              {selectedFloor} · {selectedApartment.replace('Apartment ', 'A-')}
            </strong>
          </div>
        </section>

        <div className="rail-bottom">
          <p className="micro-note">
            Use your cursor to orbit.
            <br />
            Scroll to move through the volume.
          </p>
          <button className="help-button" onClick={() => setHelpOpen((value) => !value)} aria-expanded={helpOpen}>
            <span className="help-index">01</span>
            <span>How to explore</span>
            <span className="help-plus">{helpOpen ? '−' : '+'}</span>
          </button>
          {helpOpen && <div className="help-panel">Drag to orbit · Shift + drag to pan · Scroll or pinch to zoom.</div>}
        </div>
      </aside>

      <section className="viewer-stage" ref={stageRef} aria-label="Interactive 3D model viewer">
        <div className="stage-texture" style={{ backgroundImage: `url(${DUSK_TEXTURE})` }} />
        <div className="stage-grid" />
        <header className="stage-header">
          <div>
            <span className="stage-label">Live model</span>
            <span className="stage-divider" />
            <span className="stage-location">Athens · GR</span>
          </div>
          <div className="stage-top-right">
            <span className={loaded ? 'load-state loaded' : 'load-state'}>
              <span className="load-dot" />
              {loaded ? 'Model ready' : 'Loading model'}
            </span>
            <button className="icon-button" onClick={enterFullscreen} aria-label="Toggle fullscreen">
              <Maximize2 size={16} />
            </button>
          </div>
        </header>

        <div className="model-wrap">
          <model-viewer
            ref={viewerRef as React.RefObject<HTMLElement>}
            src={MODEL_URL}
            alt="Interactive 3D model of the Sky34 residence"
            camera-controls
            touch-action="pan-y"
            shadow-intensity="1.15"
            exposure="0.68"
            environment-image="neutral"
            camera-orbit="35deg 68deg auto"
            field-of-view="35deg"
            interaction-prompt="auto"
            loading="eager"
            poster={POSTER_URL}
          />
          {!loaded && (
            <div className="model-loading">
              <span className="loading-ring" />
              <span>Preparing the residence</span>
            </div>
          )}
        </div>

        <div className="selection-callout" aria-live="polite">
          <span className="callout-line" />
          <div>
            <span className="callout-label">Selected level</span>
            <strong>
              {selectedFloor === 'Ground' ? 'Ground floor' : `Floor ${selectedFloor}`} ·{' '}
              {selectedApartment.replace('Apartment ', 'A-')}
            </strong>
          </div>
          <i className="callout-color" />
        </div>

        {unitPanelOpen && (
          <aside className="unit-panel" aria-label="Selected apartment information">
            <div className="unit-panel-header">
              <div>
                <span className="callout-label">Unit dossier</span>
                <h2>{selectedApartment}</h2>
              </div>
              <button className="panel-close" onClick={() => setUnitPanelOpen(false)} aria-label="Close unit details">
                ×
              </button>
            </div>
            <div className="unit-plan" role="img" aria-label="Floor plan preview pending upload">
              <div className="plan-grid" />
              <div className="plan-outline">
                <span className="plan-room room-a">LIVING / DINING</span>
                <span className="plan-room room-b">BEDROOM</span>
                <span className="plan-room room-c">TERRACE</span>
                <span className="plan-door" />
              </div>
              <span className="plan-caption">Floor plan preview · pending upload</span>
            </div>
            <div className="unit-meta">
              <div>
                <span>Level</span>
                <strong>{selectedFloor === 'Ground' ? 'Ground floor' : `Floor ${selectedFloor}`}</strong>
              </div>
              <div>
                <span>Aspect</span>
                <strong>To be confirmed</strong>
              </div>
              <div>
                <span>Area</span>
                <strong>To be confirmed</strong>
              </div>
              <div>
                <span>Rooms</span>
                <strong>To be confirmed</strong>
              </div>
            </div>
            <p className="unit-note">
              Upload the approved plan and unit schedule to replace the pending fields with verified apartment
              information.
            </p>
            <button className="request-button" onClick={() => setRequestSent(true)}>
              {requestSent ? 'Request noted' : 'Request unit details'}
              <span>↗</span>
            </button>
          </aside>
        )}

        <div className="stage-controls">
          <div className="control-cluster">
            <button className="control-button" onClick={resetView}>
              <RotateCcw size={15} />
              <span>Reset view</span>
            </button>
            <button className="control-button" onClick={enterFullscreen}>
              <Maximize2 size={15} />
              <span>{fullscreen ? 'Exit full view' : 'Full view'}</span>
            </button>
          </div>
          <div className="interaction-legend">
            <span>
              <Mouse size={14} />
              Orbit
            </span>
            <span>
              <ZoomIn size={14} />
              Zoom
            </span>
            <span>
              <Ruler size={14} />
              Pan
            </span>
          </div>
        </div>

        <div className="material-strip" aria-label="Model palette">
          <span className="material-label">
            <SunMedium size={14} /> Building-wide material study
          </span>
          <span className="material-chip">
            <i className="swatch swatch-limestone" />
            Limestone
          </span>
          <span className="material-chip">
            <i className="swatch swatch-glass" />
            Sea-glass
          </span>
          <span className="material-chip">
            <i className="swatch swatch-concrete" />
            Concrete
          </span>
          <span className="material-chip">
            <i className="swatch swatch-terra" />
            Terracotta
          </span>
        </div>

        <div className="coordinate coordinate-tl">N 37° 58′ 12″</div>
        <div className="coordinate coordinate-br">A-01 / 04</div>
      </section>
    </main>
  );
}
