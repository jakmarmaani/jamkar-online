# JamKar Online

A child-safe educational game platform created for **jamkar.online**.

## Current playable release

- 16 themed game worlds
- 30 progressive levels per world
- Five starter worlds playable free through Level 3
- Adventure, English, maths, geography, science, history, coding, building, memory and environmental challenges
- Prehistoric, ancient, modern, deep-ocean, deep-space and futuristic settings
- Search and subject filters
- Responsive desktop/mobile interface
- Separate progress for each child profile on the current device
- Maximum two child profile slots in the production data model

## Family access model

- Parent registration by email and password
- One planned **£4.99 lifetime purchase per parent email**
- Maximum of two unique child usernames per parent account
- Separate progress for each child
- Parent recovery and account controls
- Child profiles never expose the parent's email

## Production architecture

The current browser build is a playable prototype. Real authentication and payment data must not be trusted from browser storage.

The repository now includes `supabase/schema.sql` as the production data-model scaffold for:

- parent accounts
- two child-profile slots per parent
- per-world progress
- verified purchases
- row-level security (RLS)

A trusted server or Supabase Edge Function should create Revolut orders and process verified Revolut webhooks. Only the verified backend should mark a purchase completed and enable lifetime access.

## World roadmap

Each world is designed for 30 progressive levels, including Prehistoric Earth, Deep Ocean, Ancient Civilisations, Nature, Deep Space, Future City, English, Mathematics, Science, Logic, Puzzles, Coding, Geography and Time Builder—from prehistory to the future.

## Security rules

- Never store raw passwords in this repository or localStorage.
- Never expose a Supabase secret/service-role key in client JavaScript.
- Never unlock paid access solely because the browser says a payment succeeded.
- Verify Revolut payment completion server-side before changing entitlement.
- Keep child profile data separate from parent contact details.
- No public child chat, advertising or child-to-child direct messaging in the default product.
