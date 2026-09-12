# JamKar Online — Master Requirements Status

Last reviewed: 12 September 2026

## Product model
- [x] Original child-friendly online game universe; no third-party game engine or copied game assets.
- [x] Parent email/password account.
- [x] Maximum two child profiles per parent account, also enforced by the database schema.
- [x] Unique child usernames and separate child-facing identity from parent email.
- [x] Exactly five starter worlds free through Level 3.
- [x] £4.99 one-time family unlock for both child profiles.
- [x] Paid entitlement is server authoritative; browser storage cannot grant paid access.
- [x] 24 game worlds across education, puzzles, maths, English, science, geography, history, coding/logic, memory, creativity and challenge.
- [x] 30 levels per world.

## Game experience
- [x] Prehistoric, ancient, nature, deep-ocean, space and future themes.
- [x] Persistent civilisation builder from prehistoric camp to future colony.
- [x] Six builder eras with era-specific structures, resources, civilisation meters and objectives.
- [x] Native WebGL procedural 3D hero, characters and game environments without an external engine.
- [x] World-specific 3D characters including explorer, diver, astronaut, robot and builder.
- [x] Keyboard/touch 3D exploration in supported worlds.
- [x] Three educational landmark missions in each supported 3D world.
- [x] 3D mission completion persists per child profile, syncs through the signed-in family account and visibly changes the 3D scene.
- [x] Achievements sync through the signed-in child profile.
- [x] Achievements, level milestones, XP, stars, streaks, badges and evolving companion progression.
- [x] Base quizzes, advanced games and persistent builder use the shared completion/mastery flow so Level 30 completion and milestones are consistent.
- [x] Reduced-motion support and keyboard-accessible game controls where applicable.

## Parent, child safety and privacy
- [x] No public chat.
- [x] No stranger discovery or direct child-to-child messaging by default.
- [x] No third-party advertising in child play.
- [x] Parent account details hidden from child profiles.
- [x] Minimal child information: no DOB, school, address, phone number or full legal name required.
- [x] Parent-managed child profiles.
- [x] Parent sign-in, sign-out and password recovery.
- [x] Duplicate child usernames within the same family are blocked with a clear error, while global username uniqueness remains database-enforced.
- [x] Privacy, child-safety, terms and help notices.

## Backend and payments
- [x] Supabase authentication and parent/child/progress schema.
- [x] RLS on exposed tables and ownership policies.
- [x] Persistent world build storage with RLS.
- [x] Revolut checkout order creation is server-side.
- [x] Revolut webhook verifies signature and independently verifies the order and £4.99 amount.
- [x] Lifetime entitlement changes only in trusted server context.
- [x] Production central webhook routing is configured.
- [ ] A real completed £4.99 production payment has not been performed because the owner chose not to make a test charge. Checkout creation has been verified; the final paid webhook/entitlement transition therefore remains unproven by an actual charge.

## Quality assurance
- [x] JavaScript syntax checks.
- [x] Static product/security invariant smoke tests.
- [x] Headless Chromium desktop and mobile runtime smoke tests.
- [x] Headless WebKit desktop and mobile runtime smoke tests as a Safari-engine compatibility check.
- [x] Browser QA verifies Level 4 is locked, paid worlds cannot open without verified entitlement, and a forged legacy browser paid flag does not unlock access.
- [x] Current Chromium and WebKit browser smoke jobs pass.
- [x] GitHub Pages deployment automation.
- [ ] Physical-device testing on real iPhone/iPad/Android hardware still requires access to those devices; it cannot be proven by repository automation alone.

## Hosting
- [x] `jamkar.online` custom domain configured for the GitHub Pages deployment.
- [ ] HTTPS certificate status must be confirmed externally in GitHub Pages/domain settings; certificate provisioning cannot be established from repository source code alone in the current tool environment.

## Known platform limitation
Supabase leaked-password protection remains unavailable on the current Free plan. Minimum password length and secure password/email-change controls are enabled, but the paid leaked-password service remains a platform-plan limitation.

## External-only items remaining
The codebase and automated master requirements are implemented. The remaining unchecked items are not unfinished code: (1) a real paid production transaction, which the owner has chosen not to perform, (2) physical-device checks requiring actual devices, and (3) confirming the custom-domain HTTPS certificate from the hosting/domain control plane. These should not be marked complete without real evidence.
