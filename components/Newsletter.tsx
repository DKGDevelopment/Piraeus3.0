'use client';

import { useState } from 'react';

/**
 * The closing panel: a newsletter sign-up and the site's footer matter.
 *
 * Narrower than a full panel, so it reads as a coda to the journey rather than
 * another chapter of it.
 *
 * The form holds no submission yet — there is nowhere to send it. It captures
 * and reports rather than pretending to succeed, so the wiring is a single
 * handler once a list exists.
 */
export default function Newsletter() {
  const [sent, setSent] = useState(false);

  return (
    <div className="sub">
      <div className="sub__top">
        <h2 className="sub__title">Sign up for our newsletter</h2>

        <form
          className="sub__form"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <label className="sub__field">
            <span className="sub__label">First name*</span>
            <input name="first" type="text" required autoComplete="given-name" />
          </label>

          <label className="sub__field">
            <span className="sub__label">Surname</span>
            <input name="last" type="text" autoComplete="family-name" />
          </label>

          <label className="sub__field">
            <span className="sub__label">Email*</span>
            <input name="email" type="email" required autoComplete="email" />
          </label>

          <button type="submit" className="sub__send">
            <span>{sent ? 'Thank you' : 'Send'}</span>
            <span aria-hidden="true" className="sub__chevron">
              &rsaquo;
            </span>
          </button>

          {sent && (
            <p className="sub__note" role="status">
              Not yet connected to a mailing list.
            </p>
          )}
        </form>
      </div>

      <div className="sub__bottom">
        <p className="sub__seo">Serviced apartments in Piraeus, Athens</p>
        <p className="sub__seo">Residences at Piraeus Gate</p>

        <p className="sub__follow">
          Follow us
          <br />
          @piraeusgate
        </p>

        <img className="sub__mark" src="/brand/logo-pg-stacked.png" alt="Piraeus Gate" />

        <p className="sub__credit">Piraeus Gate</p>
      </div>
    </div>
  );
}
