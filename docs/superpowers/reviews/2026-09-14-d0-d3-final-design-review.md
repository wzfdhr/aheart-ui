# D0–D3 final screenshot-first design review

Candidate: `619fbe6`.

## Verdict

Scoped design/accessibility P0/P1/P2=`0/0/0` after the default danger-token repair.

## Fresh observations

1. Desktop and mobile Form-engine server-error captures show the field border, error copy and recovery copy remain visually grouped; the error copy is now the dark red default rather than the previous low-contrast bright red.
2. The existing QG4 desktop/mobile snapshot suite passed `31/31` with `3` pre-existing documented skips. No unexplained screenshot, hydration, focus, zoom or reduced-motion regression appeared.
3. Five-browser Form-engine and R1 captures passed `50/50`; the mobile layouts retain containment and controls remain operable.

## Accessibility disposition

The default danger text contrast is `6.57:1` on white, above the 4.5:1 ordinary-text threshold. The correction is global and therefore removes the prior D0–D3 audit finding; it does not assert that arbitrary custom `dangerColor` values are automatically safe.

No full WCAG or physical-device claim is made. D9 device and publication gates remain separate.
