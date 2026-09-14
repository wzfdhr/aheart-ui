# D0–D3 final optimization architecture review

Candidate: `619fbe6` on top of merge commit `05f6b904195ca2a654bd76b2d06b69afb3fb7a4c`.
Scope: final D0–D3 review after D4–D8 and Form.List delivery. D9 publication, physical-device gates and v2 remain outside this phase.

## Decision

Architecture P0/P1/P2=`0/0/0` for the reviewed D0–D3 scope. The only new implementation is a default theme-token correction; it does not add a public prop, dependency, package, or state protocol.

## Finding and contract

The inherited default `--aheart-color-danger: #ff4d4f` measured `3.27:1` against white when used as ordinary text. That was a genuine D0–D3 P2 and was recorded in `/tmp/d0-d3-danger-token-red.log` before any change. The approved repair changes the default token to `#b42318`, which measures `6.57:1` against white. Consumer-supplied `ConfigProvider` danger colors remain explicit consumer choices and are not silently rewritten.

The durable regression test is `scripts/d0-d3-danger-token.test.mjs`; generated ESM/CJS CSS is rebuilt with the source. No component API or package boundary changes were introduced.

## Boundaries

- This review does not claim arbitrary custom theme colors meet WCAG; the default token is the owned contract.
- D9 root-entry tree shaking, coverage, CI decomposition, physical iOS evidence and npm publication remain open.
- Form.List was already delivered in PR #26; this candidate only closes the D0–D3 final review and the global danger-token finding.
