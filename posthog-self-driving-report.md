# PostHog Self-driving Setup Report

_Generated 2026-08-15 — project `react-native-recurly`_

## Summary

PostHog Self-driving is now configured for this Expo/React Native subscription tracker app. Session Replay, Error Tracking, Support (Conversations), and Health Checks signal sources were already enabled; the scout troop is tuned to five scouts covering product analytics, feature flags, anomaly detection, and observability gaps. Two Replay Vision scanners are watching session recordings for broken experiences and user frustration. Findings will start appearing in your [Self-driving inbox](https://us.posthog.com/project/559218/inbox) within approximately 30 minutes.

---

## AI data processing

**Approved.** Organization-level AI data processing approval was granted before this run started (enforced by the wizard gate).

---

## GitHub

**Already connected** — GitHub App integration `pastaisfine` (id: 222503) was in place before this run. Self-driving can research and open fixes in your repositories.

---

## Products enabled

This is a **mobile app** (posthog-react-native). Server-side product toggles are on, but replay and exception capture require SDK configuration to produce data — see Follow-ups.

| Product | Status | Notes |
|---|---|---|
| Session Replay | Enabled, inert for mobile | Server flag is on; recordings found in probe (some sessions recording). Mobile replay requires `enableSessionRecording: true` in posthog-react-native init (or default is on). Already collecting recordings. |
| Error Tracking | Enabled, inert for mobile | `products-enable` tool unavailable on this deploy. Follow-up: add `errorTracking: { autocapture: true }` to PostHog init and turn on "Enable exception autocapture" in PostHog project settings. |
| Support (Conversations) | Enabled, inert | No inbound channel connected yet. Tickets reach the inbox only once a channel is configured. Follow-up below. |

---

## Signal sources

| source_product | source_type | Action |
|---|---|---|
| `health_checks` | `health_issue` | Already enabled |
| `error_tracking` | `issue_created` | Already enabled |
| `error_tracking` | `issue_reopened` | Already enabled |
| `error_tracking` | `issue_spiking` | Already enabled |
| `session_replay` | `session_analysis_cluster` | Already enabled |
| `conversations` | `ticket` | Already enabled |
| `signals_scout` | `cross_source_issue` | On by default (no row needed) |

All required native signal sources were already enabled when this run started.

---

## Connected tools

No connected-tool sources were selected. All external issue trackers, support desks, error trackers, and security scanners are **not used** — skipped.

---

## Scout troop

**Run budget:** 100 runs/day (early-access default; 5 used today, 95 remaining).  
**Banner:** _"Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more."_

### Enabled (5 scouts)

| Scout | Why kept |
|---|---|
| `signals-scout-general` | Always on — watches cross-product correlations and surfaces no specialist covers |
| `signals-scout-product-analytics` | App explicitly tracks `subscription_expanded`, `user_signed_up`/`user_signed_in`, `onboarding_completed`, screen events, and app lifecycle — product-analytics flows are actively used |
| `signals-scout-feature-flags` | PostHog init has `preloadFeatureFlags: true` and `sendFeatureFlagEvent: true` — flags are in active use |
| `signals-scout-observability-gaps` | Fresh project with no saved insights or dashboards yet — this scout will flag uncovered event volumes |
| `signals-scout-anomaly-detection` | Cross-product anomaly detection useful as insights are built up over time |

### Disabled (22 scouts)

| Scout | Reason |
|---|---|
| `signals-scout-error-tracking` | Partially covered — native `error_tracking` signal sources are enabled, but exception autocapture is not yet turned on in the SDK, so not fully watchable yet |
| `signals-scout-session-replay` | Covered by native `session_replay` signal source (intentional, not a gap) |
| `signals-scout-surveys` | No surveys in use |
| `signals-scout-revenue-analytics` | No payment SDK — app tracks subscriptions but does not process payments |
| `signals-scout-ai-observability` | No LLM/AI SDK or `$ai_*` events |
| `signals-scout-web-analytics` | Mobile-first app, no web analytics tracking |
| `signals-scout-csp-violations` | No CSP reporting configured |
| `signals-scout-experiments` | No active A/B experiments |
| `signals-scout-logs` | PostHog logs product not in use |
| `signals-scout-customer-analytics` | No group/accounts analytics |
| `signals-scout-data-pipelines` | No CDP destinations or batch exports |
| `signals-scout-data-warehouse` | No warehouse sources connected |
| `signals-scout-replay-vision` | No prior accumulated scanner observations to trend (scanners just created) |
| `signals-scout-conversations` | Support channel not yet connected |
| `signals-scout-apm` | No distributed tracing / OpenTelemetry |
| `signals-scout-mcp-tool-calls` | No MCP tool call telemetry |
| `signals-scout-health-checks` | Covered by native `health_checks` signal source |
| `signals-scout-inbox-validation` | No shipped fixes yet to validate |
| `signals-scout-insight-alerts` | No insight alerts configured |
| `signals-scout-tasks` | No PostHog Tasks in use |
| `signals-scout-skills-store` | No custom skills to audit yet |
| `signals-scout-web-vitals` | No Core Web Vitals (`$web_vitals`) captured |

To enable a disabled scout later: go to [Self-driving inbox](https://us.posthog.com/project/559218/inbox) → Settings → Scouts.

---

## Custom scouts

**None created.** The gap analysis found three candidate surfaces:

- **Subscription engagement** (`subscription_expanded` relative to `Application Opened`) — watchable, not covered by built-in troop (product-analytics needs saved funnels; anomaly-detection needs dashboards — neither exist yet). **Proposed and declined by user.** To add it later, ask Claude to create a `signals-scout-subscription-engagement` scout.
- **Auth funnel** — watchable: the app fires `user_signed_up`, `user_signed_in`, `sign_up_failed`, and `sign_in_failed` around Clerk auth. Not covered by the built-in troop (product-analytics needs saved funnels). To add it later, ask Claude to create a `signals-scout-auth-funnel` scout.
- **Onboarding completion** — watchable: the app fires `onboarding_completed` when a user finishes onboarding. Not covered by the built-in troop. To add it later, ask Claude to create a `signals-scout-onboarding-completion` scout.

Surfaces considered and ruled out:
- **Screen navigation patterns** — covered by `signals-scout-general` and `signals-scout-observability-gaps` → not a genuine gap

**Noise escape hatch:** if a scout turns out noisy, set `emit: false` on its config in PostHog to switch it to dry-run mode.

---

## Replay Vision scanners

Replay Vision scanners are LLMs that watch individual session recordings on a schedule and push what they find straight to the Self-driving inbox. Findings arrive at half weight — corroboration from a second scanner or a second recording is needed before a finding is promoted into a full inbox report. This is the only part of this setup that spends Replay Vision (observation) quota.

**Sizing note:** The `creating-replay-vision-scanners` skill was not available on this deploy, so credit spend was not formally verified. Both scanners are narrowly scoped (URL filter + low sampling rate / rage-click gate), and current estimated monthly observations = 0. No recordings currently match their queries.

### Scanner 1: Broken experiences

| Field | Value |
|---|---|
| **Status** | Created |
| **Type** | `monitor` |
| **What it watches** | Sessions visiting the onboarding or sign-up screens, looking for visible breakage: error messages, blank screens, failed loads, broken layouts, non-responsive buttons/forms |
| **Query scope** | Recordings where `$current_url` contains `"onboarding"` or `"sign-up"` — the app's critical new-user conversion flow (sign-up → onboarding → home dashboard) |
| **Why this flow** | The sign-up and onboarding screens are where new users convert; a silent defect here (no exception thrown, just a broken UI) is the highest-cost failure point in this app |
| **Sampling rate** | 0.5 (50% of matching sessions) |
| **Estimated monthly credits** | 0 (no matching recordings yet) |
| **emits_signals** | true |

### Scanner 2: User frustration

| Field | Value |
|---|---|
| **Status** | Created |
| **Type** | `monitor` |
| **What it watches** | Sessions containing a `$rageclick` event — repeated frantic tapping/clicking — looking for where users get stuck or frustrated |
| **Query scope** | Any recording containing a `$rageclick` event (narrow gate; no URL overlap with scanner 1) |
| **Sampling rate** | 1.0 (all matching sessions — the gate is already narrow) |
| **Estimated monthly credits** | 0 (no rage-click recordings yet) |
| **emits_signals** | true |

---

## Follow-ups

- [ ] **Enable error tracking in the mobile SDK** — add `errorTracking: { autocapture: true }` to the PostHog init in `src/config/posthog.ts`, and turn on "Enable exception autocapture" under PostHog project Settings → Error tracking. Once enabled, the `error_tracking` signal sources (already wired) will start producing inbox findings.
- [ ] **Connect a Support inbound channel** — go to PostHog → Support / Conversations → Connect a channel (email, inbox widget, or Slack). Once connected, the `conversations/ticket` signal source (already enabled) will start routing tickets to the inbox.
- [ ] **Create product analytics insights** — the `signals-scout-product-analytics` and `signals-scout-anomaly-detection` scouts read saved funnels and dashboards. Set up at least one funnel (e.g. screen `/onboarding` → screen `/(tabs)`) and a trends dashboard so they have data to watch.
- [ ] **Verify Replay Vision scanner quota** — use `vision-scanners-estimate-create` (or check PostHog → Replay Vision → Quota) once recordings start matching the scanners' queries. Both scanners are narrowly scoped so spend should be minimal.

---

## What happens next

- The scout coordinator picks up the tuned configs within ~30 minutes and fires the first run.
- Each scout run draws from the project's daily budget (100 runs/day during early access).
- Findings are grouped, weighted, and promoted into reports in your [Self-driving inbox](https://us.posthog.com/project/559218/inbox).
- Immediately-actionable reports can kick off coding tasks directly from the inbox.
- Replay Vision scanners start scanning the moment new recordings match their queries.
