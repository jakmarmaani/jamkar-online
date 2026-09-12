# JamKar Online — Master Requirements Status

Last reviewed: 12 September 2026

## Product model
- [x] Original child-friendly online game universe with no copied game assets.
- [x] Parent email/password account through Supabase.
- [x] Maximum two child profiles per parent account, enforced in the database.
- [x] Unique child usernames; parent email stays separate from child identity.
- [x] Exactly five starter worlds free through Level 3.
- [x] £4.99 one-time family unlock for both child profiles.
- [x] Paid entitlement is server-authoritative; browser storage cannot grant paid access.
- [x] 24 world entries across education, puzzles, maths, English, science, geography, history, coding/logic, memory, creativity and challenge.
- [x] 30-level progression rail per world.

## Frontend architecture
- [x] Main site now uses one child-facing stylesheet: `jamkar.css`.
- [x] Main site now uses one game runtime/controller: `app.js`.
- [x] Old overlapping presentation/game layers are no longer loaded by `index.html`.
- [x] Only one function owns level launch and world runtime creation.
- [x] Full-screen game view with a compact horizontal level rail.
- [x] Dedicated Back to Worlds control plus browser back support.
- [x] Keyboard and touch movement.
- [x] One mission drawer that can be hidden while exploring.
- [x] One canvas-based world renderer owns the game stage; old WebGL/navigation/ambience overlays are not mounted.
- [x] Mobile navigation dock.
- [x] Child-facing main page no longer shows the Safe Play policy block; it is in Parent Area.

## Game experience
- [x] Distinct themes for prehistoric, deep ocean, ancient, nature, space and other worlds.
- [x] Moving player, moving NPCs, collectibles, world goal and camera movement in the unified runtime.
- [x] Core mission banks for Dino Frontier, Deep Ocean, Ancient Worlds, Wild Planet and Deep Space.
- [x] Built-in optional background music control.
- [ ] The five free worlds still need deeper production-quality level design so Levels 1–30 are meaningfully different rather than mostly generated variations.
- [ ] The remaining 19 worlds need dedicated mechanics instead of relying mostly on category-level fallback missions.
- [ ] Character art, environment art, animation quality and interaction depth are not yet equivalent to a polished commercial child game platform.
- [ ] The prehistoric-to-future builder needs to be reintroduced inside the consolidated runtime rather than restoring the retired competing runtime.
- [ ] XP/stars/streaks/companion progression should be rebuilt into the consolidated runtime rather than restoring the old progression overlay.

## Parent, child safety and privacy
- [x] No public chat.
- [x] No stranger discovery or direct child-to-child messaging.
- [x] No third-party advertising in child play.
- [x] Parent account details hidden from child profiles.
- [x] Minimal child information.
- [x] Parent-managed child profiles.
- [x] Parent sign-in, sign-out and password recovery.
- [x] Last-used child profile persists through the parent account flow.
- [x] Separate protected admin page.

## Backend and payments
- [x] Supabase authentication and parent/child/progress schema.
- [x] RLS on exposed tables and ownership policies.
- [x] Revolut checkout order creation is server-side.
- [x] Revolut webhook verifies signature and independently verifies the order and £4.99 amount.
- [x] Lifetime entitlement changes only in trusted server context.
- [x] Production central webhook routing configured.
- [ ] A real completed £4.99 production payment has not been performed because the owner chose not to make a test charge.

## Quality assurance
- [x] Active JavaScript syntax checks.
- [x] Static smoke tests now test the consolidated architecture rather than retired files.
- [x] Chromium browser QA for the consolidated runtime.
- [ ] WebKit browser QA for the newest consolidated revision must be green before this revision is called fully browser-verified.
- [ ] Physical-device testing on real iPhone/iPad/Android hardware remains outstanding.
- [ ] Visual-regression screenshots and overlap/layout assertions should be added so ugly composition cannot pass only because controls exist.

## Hosting and security
- [x] Production site is hosted from the GitHub-connected Hostinger deployment.
- [x] Hostinger SSL certificate is active and Force HTTPS is enabled in the control panel.
- [ ] Chrome has still shown `Not secure` in some production screenshots, so HTTPS behaviour must be rechecked after DNS/CDN propagation and should not yet be marked fully resolved.

## Known platform limitation
Supabase leaked-password protection remains unavailable on the current Free plan. Minimum password length and secure password/email-change controls are enabled, but the paid leaked-password service remains a platform-plan limitation.

## Acceptance rule
A requirement is complete only when the user-facing behaviour meets the intended quality level, not merely because code for it exists. The retired layered game files may remain in repository history/source temporarily, but they are not part of the active production page and must not be reloaded into `index.html`.
