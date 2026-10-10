# দক্ষ হাত (Dokkho Haat) — starter project

This is a full-stack-ready Next.js starter for a Bengali worker directory, using Supabase Auth + PostgreSQL + RLS and a PWA manifest. It is not a finished production deployment or a signed Android APK.

## 1. Create Supabase backend
1. Create a project at https://supabase.com.
2. Open SQL Editor and run all of `supabase/schema.sql`.
3. In Authentication > Providers, enable Email. For easiest testing, configure email confirmation intentionally; if confirmation is enabled, users must confirm before a session exists.
4. Copy Project URL and the publishable/anon key from Project Settings > API.

## 2. Configure environment
Create `.env.local` in the project root (copy `.env.example`) and fill:
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
```
Only the public/anon key belongs in this frontend. NEVER use `service_role` in browser code or commit secrets to GitHub.

## 3. Run locally (computer)
```
npm install
npm run dev
```
Open http://localhost:3000.

## 4. GitHub + Vercel from Android phone
1. Create a GitHub repository and upload all project files/folders while preserving their paths.
2. In Vercel, import that repository.
3. In Vercel Project Settings > Environment Variables, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy. Every later GitHub commit triggers a redeploy.
5. Open the deployed HTTPS URL in Chrome on Android > browser menu > Add to Home screen / Install app.

## 5. Make the first admin
1. Register an account through `/join` and confirm the email if required.
2. Open Supabase SQL Editor and run (replace with your own exact email):
```
update public.profiles set role = 'admin' where email = 'YOUR_EMAIL@example.com';
```
3. Reload `/admin`. Do not let untrusted people run this SQL. Never add a public UI to change roles.

## Important implementation notes
- Workers submitted through the join form are pending and are not publicly listed until admin approval.
- The homepage uses only approved records from the database. It does not publish fabricated demo workers as real listings.
- The dashboard currently displays the submitted profile and status. Profile editing, image upload to Supabase Storage, ratings/reviews, moderation history, and marketplace checkout are planned extensions.
- RLS policies are essential; test with a normal user and an admin before public launch.
- Current profile photo support is via a URL field. Add a private/admin-reviewed upload flow before collecting user images at scale.
- The included service worker is a minimal shell and does not promise full offline browsing.
- Google Fonts and the sample hero photo are external resources; replace with licensed/owned assets for production.
- `capacitor.config.ts` is an optional starting point. For a native Android APK/AAB, use a computer or a cloud Android build environment, install Capacitor CLI and Android platform, then build/sign with Android tooling. The Vercel website itself is not an APK.
