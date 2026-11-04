# FLE TRIBE · Frontend Developer Program

The FLE TRIBE learning app: a 5-month (20-week) beginner course: HTML, CSS, Bootstrap, JavaScript (1 month), the developer
workflow (2 weeks), React (1 month), hosting with Vercel (1 week), a capstone and career launch. Four optional bonus courses
open after it: TypeScript, Tailwind CSS, Testing performance & shipping, and AI with Claude.
Built with **React + Vite + Tailwind CSS v4**, with **Supabase** for sign-in, the database and file storage.

- **Students** sign in (no public sign-up), work through lessons one at a time and submit answers. Each submitted day unlocks the next.
- **Admins** add students, attach YouTube links, videos and PDFs to lessons, review answers and issue certificates.

## Set up Supabase (once)

1. Create a project at [supabase.com](https://supabase.com).
2. **Turn off public sign-up:** Authentication → Sign In / Providers → Email → switch off **Allow new users to sign up**.
   Accounts are created only by admins.
3. **Create the database:** SQL Editor → paste all of `supabase/migrations/0001_fle_tribe.sql` → Run. Then do the same with
   `0002_profile_and_completion.sql` (course structure, profiles, links, certificate rules), then `0003_auto_certificates.sql`
   (automatic certificates once every day is reviewed). All are safe to run again.
4. **Deploy the admin function** (it creates student accounts, so it needs the service key, which never goes in the browser):
   ```bash
   npx supabase login
   npx supabase link --project-ref <your-project-ref>
   npx supabase functions deploy admin-users
   npx supabase secrets set APP_URL=https://your-live-site.com
   ```
5. **Create your admin account:** Authentication → Users → Add user → enter your email and a password, tick *Auto confirm*.
   Then in the SQL Editor run:
   ```sql
   update public.profiles set role = 'admin', must_change_password = false where email = 'you@example.com';
   ```
6. Copy `.env.example` to `.env` and fill in the Project URL and the **anon** key (Project Settings → API).

## Run it

Needs Node 20 or newer.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production files in dist/
```

## How it works

| Who | Where | What |
|---|---|---|
| Admin | Admin → Students | Add a student (name + email). A temporary password is created and emailed to them through Resend (needs the `RESEND_API_KEY`, `EMAIL_FROM` and `APP_URL` secrets on the Edge Function). If the email can't be sent, you get a ready-to-send message to copy instead. Remove students from the student's page. |
| Student | `/login` → `/change-password` | Signs in with the temporary password and must choose their own, then gets an email confirming the change. |
| Student | Lessons | Mon–Thu: answer the research questions. Fri: link to the assignment + notes. Sat: reflection questions. Submitting completes the day and unlocks the next. Answers can be edited until an admin gives feedback. |
| Admin | Admin → Lesson media | Per lesson: paste a YouTube link, or upload a video (MP4, WebM, MOV) or PDF to Supabase Storage. |
| Admin | Admin → Submissions | Read answers next to their questions and send feedback. |
| Admin | Admin → Certificates | Issue a certificate. Numbers are assigned by the database: `FTL<yy>FE-<nnn>`, e.g. `FTL26FE-001`. |
| Anyone | `/verify/<number>` | Public certificate page: verify it, save as PDF, share the link. `/verify/sample` shows the design. |

**Security is enforced in Supabase, not just the screens** (see the migration): students can only read their own data, can only
submit a day once every earlier day is submitted, and can only open videos/PDFs for lessons they've unlocked.

### Uploads and the free plan

Supabase's free plan limits each uploaded file to **50 MB**. That's fine for PDFs and short clips; for full lesson videos either
upgrade (Pro allows much larger files) or use unlisted YouTube links.

## Deploy

Any static host works (Netlify, Vercel, Cloudflare Pages). Build command `npm run build`, output folder `dist`, and add the two
`VITE_SUPABASE_*` variables. Add a rewrite of every path to `/index.html` so links like `/weeks/w3` work on refresh.

## Edit things

| What | Where |
|---|---|
| Lesson text, research questions, assignments, review questions | `src/data/curriculum.ts` |
| Course order (must match the curriculum) | `course_lessons` in `0002_profile_and_completion.sql` |
| Lesson guide and assignment PDFs | `content/guides.py`, then `python3 content/build_pdfs.py` |
| Videos per lesson (verified YouTube links) | `content/videos.json` |
| Certificate wording, signer, optional signature image / partner logo | `src/data/certificates.ts` (images in `public/brand/`) |
| Logos and login poster | `public/brand/` (official FLE TRIBE files) |
| Brand colors and fonts | `src/index.css` |
