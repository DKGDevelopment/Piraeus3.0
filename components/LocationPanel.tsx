type Place = { name: string; note: string };

type Props = {
  /** Path under /public. Absent until the map artwork is supplied. */
  map?: string;
  places: Place[];
};

/**
 * Where the asset sits. The map holds the panel; the column beside it names
 * what is within reach.
 *
 * Rendered as a still image for now. A live map would be the eventual upgrade,
 * but it costs a third-party script and a key, and buys nothing until the pins
 * carry real content.
 */
export default function LocationPanel({ map, places }: Props) {
  return (
    <div className="loc">
      <div className="loc__map">
        {map ? (
          <img className="loc__img" src={map} alt="Map of the surrounding area" />
        ) : (
          <div className="loc__img loc__img--empty">
            <span>Map</span>
          </div>
        )}
      </div>

      <aside className="loc__panel">
        <p className="panel__eyebrow">Location</p>
        <h2 className="res__name">The Neighbourhood</h2>
        <p className="res__copy">
          Set between the port and the coast road, within walking distance of the
          metro and the waterfront.
        </p>

        <dl className="loc__list">
          {places.map((p) => (
            <div className="loc__row" key={p.name}>
              <dt className="loc__place">{p.name}</dt>
              <dd className="loc__note">{p.note}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </div>
  );
}
