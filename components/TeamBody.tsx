'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const BODY = [
  `DKG Development is one of Greece's most active real estate development companies, with a growing portfolio of large-scale residential, commercial, and hospitality projects across the country.`,
  `Headquartered in Greece and operating across multiple asset classes, DKG offers a fully integrated development model — from initial concept and planning through to construction, delivery, and long-term asset management — serving both domestic clients and international investors seeking exposure to the Greek property market.`,
  `The company's flagship project, Piraeus Gate, stands as one of the largest mixed-use developments currently under construction in Greece, spanning 105,000 sqm of gross built area and comprising 631 private residences, 268 serviced apartments, and an extensive programme of office, retail, and hospitality spaces.`,
  `Across every project, DKG Development applies a consistent set of principles: energy-efficient construction, high-specification materials, cutting-edge building technologies, and a genuine focus on enhancing the urban environments in which it operates.`,
];

/**
 * Each paragraph sits pale gray and fills solid black from the top down as
 * it crosses the middle of the viewport — a reading progress cue rather than
 * a one-shot entrance animation, so it tracks scrubbing back and forth too.
 */
export default function TeamBody() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const paragraphs = gsap.utils.toArray<HTMLElement>('.team-body__p', root.current!);
      paragraphs.forEach((el) => {
        gsap.fromTo(
          el,
          { backgroundPositionY: '100%' },
          {
            backgroundPositionY: '0%',
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              end: 'top 30%',
              scrub: true,
            },
          }
        );
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="team-body">
      {BODY.map((paragraph) => (
        <p key={paragraph.slice(0, 24)} className="team-body__p">
          {paragraph}
        </p>
      ))}

      <a
        className="team-body__logo"
        href="https://dkg-development.com/about"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit the DKG Development website"
      >
        <img src="/brand/dkg-development-logo.svg" alt="DKG Development" />
      </a>
    </div>
  );
}
